# Project Audit — Findings

**Date:** 2026-07-19
**Scope:** Full codebase — design, UI/UX, responsiveness, code quality, and bugs.
**Method:** Manual review of all ~60 source files, plus automated verification.

**Baseline verification results:**

| Check | Result |
| --- | --- |
| `npm run typecheck` (tsc) | ✅ Clean |
| `npm run lint` (ESLint) | ✅ Clean |
| Test suite (9 suites, 81 tests) | ✅ All pass |

> Note: the `AUDIT-REPORT.md` / `audit-report.json` at the repo root are stale artifacts from Aug 2025 and predate the current design system. This document supersedes them.

---

## Severity legend

- **🔴 High** — user-visible bug, broken behavior, or shipped incorrect data
- **🟠 Medium** — degrades quality/perf/a11y or creates real maintenance risk
- **🟡 Low** — polish, dead weight, hygiene

---

## 1. Bugs & correctness

### 🔴 B1. Broken favicon / manifest references (404s in production)
`src/app/layout.tsx:38-47` declares icons at `/favicon.svg`, `/favicon-96x96.png`, `/apple-touch-icon.png` and `manifest: "/site.webmanifest"`. But `favicon.svg` and `favicon-96x96.png` live in `src/app/` — Next.js only auto-serves `app/favicon.ico`; the rest are never served. `apple-touch-icon.png` and `site.webmanifest` don't exist anywhere. All four references 404. Meanwhile `public/web-app-manifest-192x192.png` / `-512x512.png` are orphaned (referenced by the nonexistent manifest).
**Fix direction:** adopt Next metadata file conventions (`app/icon.svg`, `app/apple-icon.png`) or move assets to `public/` and create a real `site.webmanifest`.

### 🔴 B2. Duplicate "Skip to content" links
`src/app/_components/shared/Navigation.tsx:138` renders a skip link in JSX, **and** `AccessibilityProvider.tsx:20` injects a second one at runtime via `createSkipLink()` (`src/lib/accessibility.ts:149`) with conflicting inline styles (black box, different offsets). Keyboard users tab through two skip links back-to-back.
**Fix direction:** keep the JSX one; delete the runtime injection.

### 🔴 B3. Two scroll-spy systems fight over the active nav item
`Navigation.tsx` sets `activeSection` from a scroll handler (lines 21-48, geometry math at y=140) **and** an IntersectionObserver (lines 50-85, ratio-based). Both run on the home page and can disagree every frame → active-link flicker.
**Fix direction:** keep one (the scroll handler is simpler and already handles the top-of-page case); delete the other.

### 🔴 B4. Wrong personal URLs shipped in project data
`src/lib/projectData.ts:160-161` — `githubUrl: "https://github.com/jingfeng/portfolio-website"` (your GitHub is `cloudy3`) and `liveUrl: "https://portfolio.jingfeng.dev"` look like placeholder values. Visitors clicking "Source"/"Live" on the portfolio case study land on someone else's 404.

### 🔴 B5. Contact form: network errors render as validation errors
`src/app/_components/sections/ContactSection.tsx:185-189` — when EmailJS fails, the error string is written into `errors.message`, so "Network error…" appears as if the *message field* is invalid. Also:
- the 5s success-reset `setTimeout` (line 166) is never cleared on unmount;
- the recipient address is hardcoded client-side (line 152) — fine for EmailJS but duplicated with `SOCIAL_LINKS`;
- `formRef` (line 48) is unused.
**Fix direction:** add a dedicated `submitError` state rendered above the button; clear the timeout in a cleanup.

### 🟠 B6. Experience duration math is off-by-one
`ExperienceSection.tsx:58-79` `getDuration()` uses `Math.ceil(diffDays / 30)` — a role of exactly 24 months can display "2 years 1 month". It also duplicates (with different rounding) `getTotalExperienceYears()` in `src/lib/data/experience.ts:156`, so the card and the stats row can disagree.
**Fix direction:** one shared month-diff helper based on calendar months, used by both.

### 🟠 B7. Fake polyfills that would crash if ever used
`src/app/_components/ui/BrowserCompatibility.tsx:34-104` installs an `IntersectionObserver` "polyfill" whose entries lack `takeRecords`, real thresholds, and correct semantics, and a `ResizeObserver` stub that calls back with an empty array. Any consumer relying on real behavior would break — and the target browsers (no-IO era) can't run Next 16/React 19 anyway.
**Fix direction:** delete the polyfills (and probably the whole component — see D4).

### 🟠 B8. Hero "Scroll" indicator skips the Projects section
`HeroSection.tsx:127` — the scroll-down indicator targets `#about`, but the next section on the page is `#work` (Projects). Users pressing it jump past your strongest content.

### 🟡 B9. `error.tsx` leaks raw error messages
`src/app/error.tsx:22` renders `error.message` directly to users (can contain stack-ish internals) and uses off-theme `bg-blue-600` styling (see D2).

---

## 2. Design & UI/UX

### 🔴 D1. Hero WebGL visuals predate the current design system
`src/app/_components/shared/WaveLineVisualization.tsx`:
- Default palette (lines 527-540) is 12 vibrant pink/purple/yellow "Japanese-inspired" colors — visually foreign to the current calm cream (`#faf8f5`) + sparse-cyan token system.
- Backdrop gradients (line 552, 347) use `slate-50/white`, not `--bg-page`.
- `StaticGradientFallback` (lines 324-335) is pink/purple blobs — this is what **reduced-motion and no-WebGL users see as the hero**, and it clashes hard with the rest of the site.
**Fix direction:** re-palette from `--accent-*` tokens (cyan/blue/violet/lime at low opacity), re-base backgrounds on `--bg-page`, redesign the static fallback to match `bg-grid-faint`.

### 🟠 D2. Error/edge pages are off-theme
`src/app/error.tsx` uses raw `bg-blue-600`, default typography, no theme tokens. Audit `not-found.tsx`, `global-error.tsx`, `loading.tsx` for the same drift so error states feel like the same site.

### 🟠 D3. Three competing animation systems
- framer-motion `FadeIn` wrapper (`_components/motion/FadeIn.tsx`) — the good one;
- hand-rolled IntersectionObserver + transition classes (`ContactSection.tsx:50-65`, all three card components in `ExperienceSection.tsx`);
- inline framer variants (`HeroSection.tsx`).
The IO-based ones don't respect `useReducedMotion` (they rely on the global CSS kill-switch) and re-implement what `FadeIn` already does.
**Fix direction:** consolidate on `FadeIn` (add `direction`/`x` offset props if needed).

### 🟠 D4. Missing Open Graph / Twitter image
`layout.tsx:60-65` declares `twitter.card: "summary_large_image"` but no `openGraph.images` / `twitter.images` exist. Link shares render bare.
**Fix direction:** add a static `opengraph-image.png` (or generated `opengraph-image.tsx`) in `app/`.

### 🟠 D5. Accessibility polish
- Mobile menu (`Navigation.tsx`): no Escape-to-close, no focus management when opened.
- Skills filter (`SkillsSection.tsx:128-132`): `role="toolbar"` without arrow-key navigation — either implement roving tabindex or drop the role (buttons already have `aria-pressed`).
- `AccessibilityAuditor.tsx:82` contrast check tests hardcoded old-theme colors (`#1a1a2e` on white) — it audits colors the site no longer uses.

### 🟡 D6. Hero markup duplicated for reduced-motion
`HeroSection.tsx` contains the full hero copy/CTAs twice (animated branch lines 61-120 vs `HeroCopy` lines 138-186). Copy edits must be made in two places, and they've already drifted (hover styles missing in the static branch).

---

## 3. Responsiveness

**Overall: good.** Strengths worth keeping:
- Fluid type via `clamp()` (`globals.css:180-201`), CSS-var driven section padding with a mobile tier, `container-custom` system.
- Per-section `next/dynamic` code-splitting with variant-aware loaders (`app/page.tsx`).
- `prefers-reduced-motion` handled at three levels (CSS kill-switch, `useReducedMotion`, `.reduce-motion` class) and a `prefers-contrast: more` override.
- Mobile-tuned WebGL (fewer lines/points, lower DPR) and DPR-capped canvas in the keyboard story.

Minor notes:
- 🟡 R1. `overflow-x-hidden` on `<body>` (`layout.tsx:95`) creates a scroll container that can interfere with `position: sticky` descendants in some browsers — the keyboard story relies on sticky. Verify or scope the overflow guard.
- 🟡 R2. Mobile detection via userAgent sniffing + resize listener (`WaveLineVisualization.tsx:434-441`) — crossing 768px remounts the scene. Prefer `matchMedia("(max-width: 768px)")`.
- 🟡 R3. Reduced-motion users on `/keyboard-story` get a frozen frame inside a 400vh scroll region (`KeyboardScrollytellingSection.tsx:183-193` ignores scroll but the container stays 400vh) — a long empty scroll for them.

---

## 4. Performance

### 🟠 P1. WaveLineVisualization recreates Three.js objects on every React render
`WaveLineVisualization.tsx:277-307` — `new BufferGeometry()`, `new LineBasicMaterial()`, `new Line()` are constructed inside the render `map()`. Any parent re-render leaks GPU-backed objects (never `dispose()`d). Also `linewidth` (line 288) is a no-op in WebGL (always 1px) — the "thickness optimized for visibility" comment is aspirational.
**Fix direction:** `useMemo` the line objects, dispose on unmount.

### 🟠 P2. Keyboard story eagerly loads all 40 JPGs on mount
`KeyboardScrollytellingSection.tsx:137-168` fires 40 image requests as soon as the page mounts, before any scroll intent. Combined with R3, reduced-motion users pay the full download for a static frame.
**Fix direction:** load frame 0 first + progressively fetch the rest (or start on first scroll/intersection); short-circuit to a single static frame under reduced motion.

### 🟠 P3. PerformanceMonitor is a production no-op that still costs work
All output from `src/lib/performance.ts` / `PerformanceMonitor.tsx` is `console.*`, and `next.config.ts:32` (`removeConsole`) strips consoles in production — so in prod it registers observers, mutates images, and preloads resources with zero observable output. `preloadCriticalResources` also preloads fonts/images that may not exist.
**Fix direction:** dev-gate or delete; if real monitoring is wanted, use the already-installed `web-vitals` package with an actual reporting endpoint.

### 🟠 P4. `next.config.ts` webpack block is risky and mostly dead
- `config.optimization.sideEffects = false` (line 84) globally can strip side-effectful imports (notably CSS) in webpack builds — a known foot-gun.
- The whole `webpack()` block (lines 47-95) is ignored under Turbopack (the build in use since `fix: migrate turbopack`), so it's dead config that will surprise anyone who reads it.
**Fix direction:** delete the webpack block (Turbopack handles splitting) or at minimum remove `sideEffects: false`.

---

## 5. Code quality

### 🟠 Q1. ~1,500+ lines of dead code
Zero non-test imports for:
| File | Notes |
| --- | --- |
| `src/app/_components/shared/ThreeScene.tsx` (~430 lines) | Superseded by WaveLineVisualization; only its own test imports it |
| `src/components/ui/Button.tsx`, `Card.tsx`, `Modal.tsx` | Entire `src/components/` tree unused |
| `src/hooks/useProjects.ts` | Unused |
| `src/lib/animations.ts` | Unused |
| `ScrollProvider.tsx` | No-op `<div>` wrapper still mounted in `layout.tsx:102` |
| Most of `src/lib/performance.ts` | See P3 |
| Large parts of `src/lib/accessibility.ts`, `browserDetection.ts` | Only 2-3 exports each are used |

### 🟠 Q2. Three sources of truth for design tokens
`globals.css` CSS vars, `tailwind.config.ts` (maps to the vars — good), and `src/lib/constants.ts` `COLORS`/`TYPOGRAPHY`/`SPACING`/`BREAKPOINTS`/`DURATIONS` (hardcoded copies, mostly unused). `Z_INDEX.fixed` (1030) is applied as an inline style in `Navigation.tsx:135`, silently overriding the `z-50` class on the same element.
**Fix direction:** delete the unused constant groups; pick class or inline z-index, not both.

### 🟡 Q3. Stale artifacts committed at repo root
`AUDIT-REPORT.md`, `audit-report.json` (Aug 2025, pre-redesign), `coverage/`, `tsconfig.tsbuildinfo`. The `scripts/*.mjs` audit/deploy scripts and their many `package.json` entries should be re-validated or pruned.

### 🟡 Q4. Test coverage gaps
No tests for: `ExperienceSection` (tabs, expand/collapse, duration math), `ContactSection` failure path (submit error display), `ProjectsCatalog` filtering, project detail page (`generateStaticParams`/`notFound`), `KeyboardScrollytellingSection`. `ThreeScene.test.tsx` tests dead code.

### 🟡 Q5. Testing stack: Jest → Vitest
Jest (via `next/jest`) works, but Vitest is the modern standard for Next.js projects (officially documented by Next), is faster, and is ESM/TS-native. All Jest API usage in the 9 suites is mechanical (`jest.mock/fn/spyOn/clearAllMocks`) with 1:1 `vi.*` equivalents; no async Server Component tests block migration. **Migration performed as part of this audit — see EXECUTION-PLAN.md Phase 0.**

---

## Summary counts

| Severity | Count |
| --- | --- |
| 🔴 High | 6 (B1-B5, D1) |
| 🟠 Medium | 13 |
| 🟡 Low | 9 |

> ⚠️ See "New findings" below — N1 partially invalidates the "tokens are solid" conclusion.

The site's foundation (type system, tokens, layout, responsiveness, code-splitting) is solid. The bulk of the risk is: broken metadata assets (B1), legacy pre-redesign code still mounted (D1, Q1, P3), and small correctness bugs in interactive components (B2-B8).

---

## New findings (logged during remediation)

### 🔴 N1. `tailwind.config.ts` is never loaded — the entire semantic token layer compiles to nothing

Found while executing Phase 2.1.

This project runs **Tailwind v4** (`tailwindcss@^4` via `@tailwindcss/postcss`), where
configuration is CSS-first. A `tailwind.config.ts` at the repo root is **not** picked up
automatically — it requires an explicit `@config` directive in the stylesheet, and
`src/app/globals.css` has none (it only has `@import "tailwindcss"`).

Consequence: every utility defined by that config's `theme.extend.colors` /
`maxWidth.content` block is a no-op. Verified against the production CSS chunk
(`.next/static/chunks/*.css`) after `npm run build`:

| Class | In compiled CSS |
| --- | --- |
| `bg-surface-page`, `bg-surface-elevated` | ❌ missing |
| `text-content-primary`, `text-content-secondary` | ❌ missing |
| `text-accent-cyan`, `bg-accent-cyan` | ❌ missing |
| `border-border-subtle`, `border-border-strong` | ❌ missing |
| `max-w-content` | ❌ missing |
| `bg-grid-faint`, `container-custom`, `skip-link` | ✅ present (hand-written in globals.css) |

Only 38 distinct color utilities are generated in total, and they are all stock-palette
ones (`bg-blue-600`, `bg-pink-200`, `bg-cyan-400`, `bg-white`, …) — i.e. exactly the
off-theme classes flagged in D1/D2. The site's "calm cream" appearance comes solely from
the element-level rules in `globals.css` (`body`, `h1-h6`, `p`), not from the token system.

There are **106+ occurrences** of these dead classes across `src/**/*.tsx`.

**Impact on the plan:** Phase 2 (theme coherence) is unverifiable until this is fixed —
re-theming components with token classes that compile to nothing changes nothing on screen.
This also means the audit's D1/D2 severity is understated: those raw-palette classes are
currently the *only* color utilities that actually render.

**Fix directions:**
- **(a) Minimal:** add `@config "../../tailwind.config.ts";` after the `@import` in
  `globals.css`. One line; keeps the existing config file.
- **(b) v4-native (recommended):** move the token definitions into an `@theme` block in
  `globals.css` (they already exist there as `:root` CSS vars — `@theme` makes Tailwind
  generate utilities from them) and delete `tailwind.config.ts`. Single source of truth,
  no legacy config file, matches the current Tailwind standard.

### 🟠 N2. Unlayered CSS in `globals.css` defeated Tailwind utilities (WCAG AA failures)

Found by the Phase 5 Lighthouse pass (mobile accessibility 96).

Unlayered CSS outranks every cascade layer, so the plain element rules in
`globals.css` beat Tailwind utilities on the same element:

| Element | Intended | Actually rendered | Ratio |
| --- | --- | --- | --- |
| `<h3 class="font-mono-label text-accent-lime">` | `#84cc16` | `#1a1a1c` on `#161618` | 1.03:1 |
| `<h3 class="font-mono-label text-content-inverse-muted">` | `#a1a1aa` | `#1a1a1c` on `#161618` | 1.03:1 |

Both fail WCAG AA. Pre-existing — invisible while the token utilities compiled to
nothing (N1). **Fixed:** base element rules moved to `@layer base`, shared classes to
`@layer components`; the reduced-motion kill-switch stays unlayered on purpose.
Mobile accessibility 96 → 100, zero contrast failures.

### 🟠 N3. `useReducedMotion()` from framer-motion latches a stale value

Found by the Phase 5 browser verification.

framer reads the media query into a `useState` **initializer**, so the returned value
never updates for the component's lifetime. With `prefers-reduced-motion: reduce`
active, `matchMedia` reported `true` while the hook still returned `false`. The
keyboard story kept its 400vh container even though its loader had taken the
reduced-motion branch — i.e. **Phase 4's R3 fix silently did not work**, and would have
been reported as done on a source read alone.

**Fixed:** added `src/lib/usePrefersReducedMotion.ts` (matchMedia subscription, starts
`false` so SSR/hydration agree) and used it in `KeyboardScrollytellingSection`,
`FadeIn`, and `HeroSection`. `FadeIn` is the important one — it gates entrance
animations site-wide.

Verified in-browser with the preference emulated: keyboard story `scrollHeight`
4163px → 1463px and 40 frame requests → 1; hero identical in both modes with no
element stuck below 0.9 opacity.
