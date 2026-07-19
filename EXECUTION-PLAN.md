# Execution Plan — Portfolio Remediation

Companion to **AUDIT-FINDINGS.md** (finding IDs like B1/D1/P1/Q1 refer to that document).
Phases are ordered by user impact vs. effort. Each phase is independently shippable — verify and commit at the end of each one.

**Global verification loop (run after every phase):**

```bash
npm run typecheck && npm run lint && npm test
npm run dev   # spot-check the affected pages
```

---

## Phase 0 — Test runner migration: Jest → Vitest ✅ (done with this audit)

**Why:** Vitest is the current Next.js-documented standard; faster, ESM/TS-native, near-drop-in API compatibility.

Steps performed:
1. `npm i -D vitest @vitejs/plugin-react vite-tsconfig-paths jsdom @vitest/coverage-v8`
2. Added `vitest.config.mts` — react plugin, `vite-tsconfig-paths` (resolves `@/`), `environment: "jsdom"`, `globals: true`, `setupFiles: ["./vitest.setup.ts"]`.
3. Added `vitest.setup.ts` — port of `jest.setup.js`: `@testing-library/jest-dom/vitest`, IntersectionObserver / matchMedia / scrollTo mocks via `vi.fn`.
4. Mechanical `jest.*` → `vi.*` swap across the 9 suites (+ `import { vi } from "vitest"`).
5. `package.json`: `test` → `vitest run`, `test:watch` → `vitest`, `test:coverage` → `vitest run --coverage`; removed `jest`, `jest-environment-jsdom`, `@types/jest`; deleted `jest.config.js`, `jest.setup.js`.

**Verify:** `npm test` → 9 suites / 81 tests pass.

---

## Phase 1 — Correctness & broken references (B1-B8) 🔴

Highest user impact, small diffs.

### 1.1 Icons & manifest (B1) — `src/app/layout.tsx`, `src/app/`, `public/`
1. Rename `src/app/favicon.svg` → `src/app/icon.svg` (Next serves + injects it automatically).
2. Delete `src/app/favicon-96x96.png` or move to `public/` if you want that exact size.
3. Add an `apple-icon.png` (180×180) to `src/app/` — derive from the existing 192×192 manifest PNG.
4. Create `public/site.webmanifest` referencing the two existing `web-app-manifest-*.png` files (name, theme `#faf8f5`, display standalone).
5. Simplify `metadata.icons` in `layout.tsx` — with file conventions, most of the block can be deleted.
6. **Verify:** `npm run dev`, then curl each of `/icon.svg` (hashed URL in HTML), `/apple-icon.png`, `/site.webmanifest` → 200; check `<head>` in devtools has no 404s.

### 1.2 Skip link dedup (B2) — `AccessibilityProvider.tsx`, `src/lib/accessibility.ts`
1. Remove the `createSkipLink(...)` call from `AccessibilityProvider.tsx:20`; keep the JSX skip link in `Navigation.tsx:138`.
2. Delete `createSkipLink` from `accessibility.ts` (unused after this).
3. **Verify:** load home page, press Tab once — exactly one "Skip to content" appears; Enter jumps to `#main-content`.

### 1.3 Single scroll-spy (B3) — `Navigation.tsx`
1. Delete the IntersectionObserver effect (lines 50-85) and `observerRef`; keep the scroll-handler effect (already covers top-of-page and non-home paths). Move the `/projects → work` active mapping into the scroll effect or `navLinkClass`.
2. **Verify:** scroll the home page slowly — the active nav underline moves once per section with no flicker; `/projects` highlights "Work".

### 1.4 Contact form error handling (B5) — `ContactSection.tsx`
1. Add `submitError: string | null` to `FormState`; on catch, set it instead of `errors.message`. Render it in an alert box above the submit button (mirror the success box, red/amber tokens).
2. Store the success `setTimeout` id in a ref; clear it in a `useEffect` cleanup.
3. Remove unused `formRef`; import the email address from `SOCIAL_LINKS`/a constant instead of the inline literal.
4. **Verify:** temporarily unset EmailJS env vars, submit → error appears in its own alert, message field shows no false validation error; new test in Phase 5 covers this.

### 1.5 Correct project URLs (B4) — `src/lib/projectData.ts:160-161`
1. Set `githubUrl` to the real repo (`https://github.com/cloudy3/...`) and `liveUrl` to the deployed URL — **confirm both with the owner before changing**; if unknown, remove the fields (UI already renders conditionally).
2. **Verify:** `/projects/portfolio-website` — Live/Source buttons point to real destinations.

### 1.6 Duration math (B6) — `ExperienceSection.tsx`, `src/lib/data/experience.ts`
1. Add `monthsBetween(start, end)` (calendar-month diff) in `experience.ts`; rewrite `getDuration` and `getTotalExperienceYears` on top of it.
2. **Verify:** unit test: 2023-07-01 → 2025-07-01 = "2 years" exactly.

### 1.7 Hero scroll target (B8) — `HeroSection.tsx:127`
1. Change the "Scroll" indicator target from `"about"` to `"work"`.

### 1.8 error.tsx message leak (B9) — see Phase 2.2 (combined with restyle).

**Phase risk:** low — isolated diffs. Watch 1.3: keep the `pathname.startsWith("/projects")` behavior intact.

---

## Phase 2 — Design & theme coherence (D1-D6) 🔴🟠

### 2.1 Re-theme WaveLineVisualization (D1, P1 partially) — `WaveLineVisualization.tsx`
1. Replace the 12-color default palette with theme accents at graded opacity: cyan `#06b6d4`, blue `#2563eb`, violet `#7c3aed`, lime `#84cc16` (cycle 4 colors; opacity already 0.88 — consider 0.5-0.7 on the light bg).
2. Replace `from-slate-50 via-white to-slate-100` gradients (lines 347, 516, 552) with `bg-surface-page` / token gradients.
3. Rebuild `StaticGradientFallback` on `bg-surface-page` + `bg-grid-faint` + one soft cyan radial glow — must look native next to the hero copy (this is the reduced-motion hero).
4. Remove the render-time `console.info` (line 507).
5. **Verify:** view hero normally, with OS reduced-motion on, and with WebGL disabled (`about:config` / devtools) — all three states look like the same site.

### 2.2 Theme the error/edge pages (D2, B9) — `error.tsx`, `global-error.tsx`, `not-found.tsx`, `loading.tsx`
1. Restyle with tokens (`bg-surface-page`, `text-content-*`, the standard button styles from HeroSection).
2. `error.tsx`: replace `{error.message}` with a generic message; keep `console.error(error)` for the digest.
3. **Verify:** visit a nonexistent route (`/nope`) and throw a test error in dev — both pages match the site's look.

### 2.3 Consolidate animation systems (D3) — `ContactSection.tsx`, `ExperienceSection.tsx`, `FadeIn.tsx`
1. Extend `FadeIn` with an optional `x`/`y` offset (or `direction` prop) so it can express the slide-in variants used today.
2. Replace the hand-rolled IntersectionObserver + class-toggle pattern in `ContactSection` (lines 46-65, 214-218, 287-291) and in all three `ExperienceSection` cards with `FadeIn`.
3. Delete the now-unused observer boilerplate (~120 lines).
4. **Verify:** scroll through Contact and Experience — entrance animations still fire once; with reduced-motion on, content renders immediately (no opacity-0 stuck states).

### 2.4 OG image (D4) — `src/app/`
1. Add `src/app/opengraph-image.png` (1200×630, name + title on the cream theme) — or a generated `opengraph-image.tsx` using `next/og`. Add `twitter-image` alias if desired.
2. **Verify:** view page source → `og:image` / `twitter:image` tags present and resolve 200.

### 2.5 A11y polish (D5) — `Navigation.tsx`, `SkillsSection.tsx`
1. Mobile menu: add `keydown` Escape handler to close + return focus to the menu button; optionally focus the first item on open.
2. Skills filter: drop `role="toolbar"` (simplest correct fix — buttons already expose `aria-pressed`).
3. **Verify:** keyboard-only pass: open mobile menu (Tab/Enter), Escape closes and refocuses the trigger; filter chips reachable and announceable.

### 2.6 Deduplicate hero markup (D6) — `HeroSection.tsx`
1. Make `HeroCopy` the single source of markup; wrap pieces in `motion.*` only when `!reduce` (pass a `Wrapper` component or use `MotionConfig reducedMotion="user"` and delete the branch entirely — preferred: `<MotionConfig reducedMotion="user">` lets framer no-op automatically).
2. **Verify:** hero identical in both motion modes; copy exists once in the file.

---

## Phase 3 — Dead code removal & consolidation (Q1-Q3, B7, P3, P4) 🟠

Do this after Phase 2 (some files are touched by both).

### 3.1 Delete unused modules (Q1)
Remove, in one commit:
- `src/app/_components/shared/ThreeScene.tsx` + `src/app/_components/__tests__/ThreeScene.test.tsx`
- `src/components/` (Button, Card, Modal — whole tree)
- `src/hooks/useProjects.ts`
- `src/lib/animations.ts`
- `ScrollProvider.tsx` + its usage in `layout.tsx:102-106` (unwrap children)

### 3.2 Remove BrowserCompatibility polyfills (B7)
Delete `BrowserCompatibility.tsx` and its `layout.tsx` mount; prune `browserDetection.ts` down to whatever is still imported (likely nothing → delete file).

### 3.3 Slim PerformanceMonitor (P3)
Either delete `PerformanceMonitor.tsx` + `src/lib/performance.ts` entirely, or reduce to a dev-only web-vitals logger using the installed `web-vitals` package. Remove the prod-side work (image mutation, speculative preloads).

### 3.4 AccessibilityAuditor (D5)
Keep as dev tooling if valued, but fix the hardcoded contrast pair to current tokens; prune `accessibility.ts` to used exports (`LiveRegionManager`, `prefersReducedMotion`, `checkColorContrast`).

### 3.5 Constants dedup (Q2) — `src/lib/constants.ts`, `Navigation.tsx`
1. Delete `COLORS`, `TYPOGRAPHY`, `SPACING`, `BREAKPOINTS`, `DURATIONS`, `PERFORMANCE` (grep first; they appear unused outside dead code).
2. `Navigation.tsx:135`: drop the inline `style={{ zIndex: Z_INDEX.fixed }}` and rely on the `z-50` class (or keep `Z_INDEX` and drop the class — one source).
3. Keep `NAVIGATION_ITEMS`, `SOCIAL_LINKS`, `PROJECT_CATEGORIES`, `VALIDATION`, `Z_INDEX` (if still referenced).

### 3.6 `next.config.ts` cleanup (P4)
1. Delete the entire `webpack()` block (dead under Turbopack; `sideEffects: false` is dangerous if webpack ever runs).
2. Re-check `experimental.optimizePackageImports: ["@/lib"]` — it targets npm packages, not path aliases; remove.

### 3.7 Root hygiene (Q3)
1. Delete `AUDIT-REPORT.md`, `audit-report.json`; add `coverage/` and `tsconfig.tsbuildinfo` to `.gitignore` and untrack them.
2. Review `scripts/*.mjs` + the ~10 `audit:*`/`perf:*` package scripts — keep only ones that run successfully today; delete the rest.

**Verify (whole phase):** `npm run build` succeeds (Turbopack), `npm run typecheck && npm run lint && npm test` green, site works in `npm run start`. Grep for imports of every deleted file before removing.

---

## Phase 4 — Performance & remaining polish (P1, P2, R1-R3) 🟠

### 4.1 Three.js object lifecycle (P1) — `WaveLineVisualization.tsx`
1. Build lines/geometries/materials in a `useMemo` keyed on `(lineCount, palette, isMobile)`; render `<primitive>` from the memoized array.
2. Add `useEffect` cleanup that calls `geometry.dispose()` / `material.dispose()` on unmount.
3. Remove the ineffective `linewidth` option; if thicker lines are wanted, note `Line2`/`MeshLine` as the real solution (don't add now).
4. Switch mobile detection to `matchMedia("(max-width: 768px)")` change listener (R2).

### 4.2 Keyboard story loading (P2, R3) — `KeyboardScrollytellingSection.tsx`
1. Load frame 0 immediately, draw it, then fetch remaining frames in the background (keep the progress %, gate `isReady` on all frames or on a "enough buffered" threshold).
2. Reduced-motion path: skip the 400vh container — render a single static frame section (`h-screen`) with the same aria-label.
3. **Verify:** network tab — first paint needs 1 image; scroll works once loaded; reduced-motion shows a static section with no dead scroll.

### 4.3 Sticky/overflow check (R1) — `layout.tsx`
1. Test `/keyboard-story` sticky behavior in Chromium + Firefox + Safari with `overflow-x-hidden` on body; if it breaks anywhere, replace with `overflow-x: clip` on `html` (doesn't create a scroll container).

---

## Phase 5 — Tests & final verification (Q4) 🟡

### 5.1 New tests (Vitest)
| Target | Cases |
| --- | --- |
| `experience.ts` duration helper | exact-year boundary, ongoing role, cross-month |
| `ContactSection` | submit failure → `submitError` alert shown, fields keep values; success resets |
| `ProjectsCatalog` | category filter, empty state |
| `projects/[slug]` helpers | `getProjectBySlug` miss → notFound path, `generateStaticParams` covers all slugs |
| `Navigation` | Escape closes mobile menu, single skip link |

### 5.2 Full pass
```bash
npm run typecheck && npm run lint && npm test
npm run build && npm run start
```
- Lighthouse (desktop + mobile) against `http://localhost:3000` — expect no regressions; record scores.
- Manual responsive checklist: 360px, 768px, 1024px, 1440px on `/`, `/projects`, one project detail, `/keyboard-story`; reduced-motion on/off; keyboard-only navigation pass.
- Check `<head>` for zero 404s (icons, manifest, og-image).

---

## Suggested commit sequence

1. `test: migrate Jest to Vitest` *(done with this audit)*
2. `fix: broken icon/manifest refs, skip link dup, scroll-spy, contact errors, data URLs` (Phase 1)
3. `style: re-theme WebGL hero, error pages, consolidate animations, add OG image` (Phase 2)
4. `refactor: remove dead code and duplicated constants` (Phase 3)
5. `perf: three.js lifecycle, keyboard story lazy load` (Phase 4)
6. `test: cover contact failures, experience math, catalog filtering` (Phase 5)
