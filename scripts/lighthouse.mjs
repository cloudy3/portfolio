/**
 * Lighthouse against the production build, mobile and desktop.
 *
 * Starts `next start` itself, so the scores always come from the server Vercel
 * runs rather than from `next dev`, whose unminified bundles score far lower,
 * and so the script works without a second terminal. Run `npm run build`
 * first (`npm run perf:audit` does both).
 *
 *   node scripts/lighthouse.mjs [mobile] [desktop]
 *
 * Replaces lighthouse.config.js, which listed audit IDs Lighthouse 12 no longer
 * has and so failed every run. Plain CLI flags carry no such list to go stale.
 * Reports land in .lighthouse/, which is gitignored.
 */
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const PORT = process.env.PORT ?? "3100";
const SITE = `http://localhost:${PORT}`;
const OUT_DIR = ".lighthouse";

const NEXT_BIN = join("node_modules", "next", "dist", "bin", "next");
const LIGHTHOUSE_BIN = join("node_modules", "lighthouse", "cli", "index.js");

/** Mobile is Lighthouse's default; desktop needs its own preset. */
const FORM_FACTORS = {
  mobile: [],
  desktop: ["--preset=desktop"],
};

function run(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`exited with code ${code}`))
    );
  });
}

async function waitForServer(server, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    // Usually a missing build: next start exits at once without .next/.
    if (server.exitCode !== null) {
      throw new Error("next start exited. Run `npm run build` first.");
    }
    try {
      const response = await fetch(SITE);
      if (response.ok) return;
    } catch {
      // Not listening yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`next start did not answer on ${SITE} within ${timeoutMs}ms`);
}

function printScores(formFactor, reportPath) {
  const { categories } = JSON.parse(readFileSync(reportPath, "utf8"));
  const scores = Object.values(categories)
    .map(({ title, score }) => `${title} ${Math.round(score * 100)}`)
    .join(" · ");
  console.log(`\n${formFactor}: ${scores}`);
}

const requested = process.argv.slice(2);
const unknown = requested.filter((name) => !(name in FORM_FACTORS));
if (unknown.length > 0) {
  console.error(`Unknown form factor: ${unknown.join(", ")}. Use mobile or desktop.`);
  process.exit(1);
}
const formFactors = requested.length > 0 ? requested : Object.keys(FORM_FACTORS);

mkdirSync(OUT_DIR, { recursive: true });

const server = spawn(process.execPath, [NEXT_BIN, "start", "-p", PORT], {
  stdio: ["ignore", "ignore", "inherit"],
});

try {
  await waitForServer(server);

  for (const formFactor of formFactors) {
    const base = join(OUT_DIR, formFactor);
    await run([
      LIGHTHOUSE_BIN,
      SITE,
      ...FORM_FACTORS[formFactor],
      "--output=html",
      "--output=json",
      `--output-path=${base}`,
      "--chrome-flags=--headless=new",
      "--quiet",
    ]);
    printScores(formFactor, `${base}.report.json`);
  }

  console.log(`\nReports: ${OUT_DIR}/<form factor>.report.html`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  server.kill();
}
