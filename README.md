# Jing Feng Portfolio

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO)

An engineering portfolio built around a continuous geometric motion field,
quiet editorial typography, and accessible interaction.

The canonical visual direction is documented in [DESIGN.md](./DESIGN.md).

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

**Frontend**

- Next.js 16 App Router
- React 19
- TypeScript in strict mode
- Tailwind CSS v4 (utility-first styling)
- Canvas 2D for the shared geometric field
- Framer Motion for interface transitions
- Self-hosted Zen Kaku Gothic New

**Performance & Quality**

- Custom webpack optimization
- Bundle analyzer integration
- Lighthouse CI/CD
- Vitest + React Testing Library
- ESLint + TypeScript compiler
- Automated accessibility auditing

**Infrastructure**

- Vercel deployment
- EmailJS contact integration
- Image optimization (WebP/AVIF)
- Security headers & CSP

## Quick start

```bash
# Clone and install
git clone <your-repo>
cd portfolio-website
npm install

# Start development (with Turbopack for speed)
npm run dev

# Build for production
npm run build
```

## Development commands

```bash
# Development
npm run dev              # Start with Turbopack
npm run build           # Production build
npm run start           # Production server

# Testing & Quality
npm test                # Run test suite
npm run test:coverage   # Coverage report
npm run lint            # ESLint check

# Performance Auditing
npm run audit:all       # Complete audit suite
npm run perf:audit      # Performance check
npm run audit:a11y      # Accessibility audit
npm run build:analyze   # Bundle analysis
```

## Performance standards

This project maintains strict performance standards:

- **Bundle Size**: < 500KB first load JS
- **Core Web Vitals**: LCP < 2.5s, CLS < 0.1, FCP < 1.8s
- **Accessibility**: WCAG AA compliance
- **Test Coverage**: > 80% (because 100% is for show-offs)

## Architecture highlights

**Shared field system**

- One fixed canvas is mounted in the root layout.
- Sections register a treatment, pigment, and protected content region.
- The canvas crossfades between compositions as the active section changes.
- The animation loop pauses when the document is hidden.
- Reduced-motion mode renders a deliberate still frame.

**Performance Monitoring**

- Real-time Core Web Vitals logging in development
- Automated bundle size warnings
- Accessibility issue detection
- Lighthouse integration for CI/CD

**Component Architecture**

```
src/
├── app/                 # Next.js App Router
│   ├── _components/     # Page-specific components
│   └── globals.css      # Global styles
├── components/          # Shared components
├── lib/                 # Utilities & helpers
└── types/              # TypeScript definitions
```

## 🛠 Custom Optimizations

**Rendering strategy**

- Server Components render the primary layouts and content.
- Interactive and animated behavior is isolated in client leaves.
- Below-the-fold home sections are dynamically imported.
- Hero copy enters with CSS so its first paint does not wait for hydration.

**Image Optimization**

- Next.js Image component with WebP/AVIF
- Responsive image sizing
- 30-day cache headers

**Security Headers**

- X-Frame-Options: DENY
- Content Security Policy
- X-Content-Type-Options: nosniff

## 🧪 Testing Strategy

- **Unit Tests**: Jest + React Testing Library
- **Accessibility**: Automated axe-core testing
- **Performance**: Lighthouse CI integration
- **Visual Regression**: Manual Lighthouse audits
- **Integration**: Custom test scripts

## 📈 Monitoring & Auditing

The project includes a comprehensive audit system:

```bash
# Weekly maintenance routine
npm run audit:all

# Pre-deployment checklist
npm run perf:audit
npm run audit:security
npm run audit:bundle
```

**What Gets Monitored**

- Bundle size growth
- Performance regressions
- Accessibility violations
- Security vulnerabilities
- Dependency bloat

## 🎯 Key Features Demonstrated

**Frontend Engineering**

- Advanced React patterns (dynamic imports, custom hooks)
- TypeScript mastery (strict mode, custom types)
- CSS architecture (Tailwind + custom animations)
- 3D web graphics integration

**Performance Engineering**

- Bundle optimization strategies
- Lazy loading implementation
- Image optimization techniques
- Core Web Vitals monitoring

**DevOps & Quality**

- Automated testing pipelines
- Performance budgets
- Accessibility compliance
- Security best practices

**Modern Web Standards**

- Progressive enhancement
- Responsive design
- SEO optimization
- Web accessibility (WCAG AA)

## 🚀 Deployment

**One-Click Deploy to Vercel:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO)

Or follow the [detailed deployment guide](./DEPLOYMENT.md).

**Features:**

- Automatic deployments from main branch
- Preview deployments for PRs
- Edge function optimization
- Global CDN distribution
- Built-in image optimization
- Zero configuration required

## What this demonstrates

This portfolio showcases skills in:

- **Modern React Development** (hooks, context, performance optimization)
- **TypeScript Proficiency** (advanced types, strict configuration)
- **Performance Engineering** (bundle optimization, monitoring, Core Web Vitals)
- **Creative Canvas Engineering** (deterministic compositions, lifecycle-aware rendering, reduced-motion stills)
- **Accessibility Engineering** (WCAG compliance, automated testing)
- **DevOps Practices** (CI/CD, automated auditing, deployment optimization)
- **Modern CSS** (Tailwind, responsive design, animations)
- **Testing Strategies** (unit, integration, accessibility, performance)

---

_Built with attention to detail, optimized for performance, and designed to impress both users and hiring managers._
