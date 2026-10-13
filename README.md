# Jing Feng Portfolio

An engineering portfolio built around a continuous geometric motion field,
quiet editorial typography, and accessible interaction.

Live at [www.jingfeng-cheah.me](https://www.jingfeng-cheah.me). The canonical
visual direction is documented in [DESIGN.md](./DESIGN.md).

## Visual direction

The site uses a custom 2D canvas system inspired by the title sequence for
*Glass Heart*. A single fixed field recomposes itself for each section while
leaving protected regions around the content. Japanese influence comes through
Zen Kaku Gothic New, traditional pigments, measured empty space, and restrained
cadence rather than literal game-interface elements.

Key characteristics:

- One shared canvas rather than a separate animation mounted in every section
- Art-directed keep-out regions that preserve text clarity without scrims
- Seven related geometric treatments with one consistent material language
- Automatic light and dark palettes
- Static composed frames for visitors who prefer reduced motion
- Quiet UI motion that supports rather than competes with the field

## Tech stack

- Next.js 16 App Router, built with Turbopack
- React 19
- TypeScript in strict mode
- Tailwind CSS v4
- Canvas 2D for the shared geometric field and the keyboard frame sequence
- Motion (`motion/react`) for interface transitions
- Self-hosted Zen Kaku Gothic New and JetBrains Mono subsets
- EmailJS for the contact form
- Vitest, React Testing Library and jsdom for tests
- ESLint and the TypeScript compiler for static checks
- GitHub Actions for CI, Vercel for hosting

## Getting started

Requires Node 22.19 or later (CI uses the latest 22.x). Vitest 5 needs 22.12 and
Lighthouse 13 declares 22.19.

```bash
git clone https://github.com/cloudy3/portfolio.git
cd portfolio
npm install
cp .env.example .env.local   # then fill in the EmailJS values
npm run dev
```

The site runs without `.env.local`; only the contact form needs it, and it
shows an error on send until the three EmailJS variables are set.

## Commands

```bash
# Development
npm run dev                  # Dev server on :3000
npm run build                # Production build
npm run start                # Serve the production build

# Quality (CI runs typecheck, lint, audit:deps, test and build on each push)
npm run typecheck            # tsc --noEmit
npm run lint                 # ESLint
npm test                     # Vitest, single run
npm run test:watch           # Vitest, watch mode
npm run test:coverage        # Coverage report

# Performance
npm run analyze              # Bundle analysis (Turbopack, opens on :4000)
npm run lighthouse           # Lighthouse mobile + desktop against the last build
npm run lighthouse:mobile    # Mobile only
npm run lighthouse:desktop   # Desktop only
npm run perf:audit           # Build, then Lighthouse mobile + desktop

# Dependencies
npm run audit:security       # npm audit
npm run audit:deps           # Unused files, exports and dependencies (knip)
npm run audit:all            # Both
```

`npm run lighthouse` starts the production server on :3100 itself, prints the
category scores and writes full reports to `.lighthouse/`. Run `npm run build`
first, or use `npm run perf:audit`.

## Current numbers

Measured locally in October 2026:

- **Lighthouse, mobile:** performance 91, accessibility 100, best practices
  100, SEO 100
- **Lighthouse, desktop:** 100 in all four categories
- **Tests:** 143 passing, about 57% line coverage

## Architecture

### Shared field system

- One fixed canvas is mounted in the root layout.
- Sections register a treatment, pigment, and protected content region.
- The canvas crossfades between compositions as the active section changes,
  using the same reading band as the navigation's active item.
- The animation loop pauses when the document is hidden.
- Reduced-motion mode renders a deliberate still frame.

### Rendering strategy

- Server Components render the primary layouts and content.
- Interactive and animated behavior is isolated in client leaves.
- Below-the-fold home sections are dynamically imported.
- Hero copy enters with CSS so its first paint does not wait for hydration.

### Layout

```text
src/
├── app/                  # App Router routes, metadata, robots and sitemap
│   ├── _components/      # Components, grouped by role
│   │   ├── motion/       # Small motion primitives
│   │   ├── projects/     # Project catalogue cards
│   │   ├── sections/     # Home page sections
│   │   ├── shared/       # Navigation, theme toggle, field mounting
│   │   └── ui/           # Layout primitives
│   ├── projects/         # Project catalogue and case studies
│   ├── keyboard-story/   # Keyboard build scroll story
│   └── globals.css       # Design tokens and global styles
├── fonts/                # Self-hosted font subsets
├── lib/                  # Field engine, data, hooks and helpers
└── types/                # Shared TypeScript types
```

### Headers and images

- Static Content Security Policy, plus `X-Frame-Options: DENY`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy` and
  `Permissions-Policy`, all set in `next.config.ts`
- `next/image` with AVIF and WebP output and a 30-day optimizer cache
- In development, a console accessibility check runs once after the app loads
  (alt text, form labels, heading order, landmarks, token contrast)

## Deployment

Vercel deploys `main` to production and every pull request to a preview URL.
See [DEPLOYMENT.md](./DEPLOYMENT.md) for the environment variables and setup.
