# 🎯 Portfolio Website

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO)

> A modern portfolio website that doesn't just look good—it performs like a Formula 1 car and is more accessible than a public library.

Built with Next.js 15, Three.js, and an unhealthy obsession with performance metrics.

## ✨ What Makes This Special

This isn't your typical "throw React at everything" portfolio. It's a carefully engineered showcase that demonstrates:

- **Performance Engineering**: Sub-500KB bundle sizes with intelligent code splitting
- **3D Web Graphics**: Three.js integration that doesn't tank your frame rate
- **Accessibility First**: WCAG compliant with automated testing
- **Modern Architecture**: Next.js 15 App Router with TypeScript throughout
- **Animation Mastery**: GSAP + Locomotive Scroll for buttery smooth interactions
- **DevOps Mindset**: Comprehensive audit system with automated performance monitoring

## 🚀 Tech Stack

**Frontend Powerhouse**

- Next.js 15 (App Router)
- TypeScript (strict mode, because we're not animals)
- Tailwind CSS v4 (utility-first styling)
- Three.js + React Three Fiber (3D graphics)
- GSAP (scroll animations)
- Locomotive Scroll (smooth scrolling)

**Performance & Quality**

- Custom webpack optimization
- Bundle analyzer integration
- Lighthouse CI/CD
- Jest + React Testing Library
- ESLint + TypeScript compiler
- Automated accessibility auditing

**Infrastructure**

- Vercel deployment
- EmailJS contact integration
- Image optimization (WebP/AVIF)
- Security headers & CSP

## 🏃‍♂️ Quick Start

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

## 🔧 Development Commands

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

## 📊 Performance Standards

This project maintains strict performance standards:

- **Bundle Size**: < 500KB first load JS
- **Core Web Vitals**: LCP < 2.5s, CLS < 0.1, FCP < 1.8s
- **Accessibility**: WCAG AA compliance
- **Test Coverage**: > 80% (because 100% is for show-offs)

## 🎨 Architecture Highlights

**Smart Loading Strategy**

- Hero section loads immediately (first impressions matter)
- Below-the-fold sections are dynamically imported
- Three.js chunks are split separately to avoid blocking

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

**Webpack Magic**

- Custom chunk splitting for Three.js and GSAP
- Tree shaking optimization
- Development vs production configurations

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

## 📝 What This Demonstrates

This portfolio showcases skills in:

- **Modern React Development** (hooks, context, performance optimization)
- **TypeScript Proficiency** (advanced types, strict configuration)
- **Performance Engineering** (bundle optimization, monitoring, Core Web Vitals)
- **3D Web Development** (Three.js, WebGL, animations)
- **Accessibility Engineering** (WCAG compliance, automated testing)
- **DevOps Practices** (CI/CD, automated auditing, deployment optimization)
- **Modern CSS** (Tailwind, responsive design, animations)
- **Testing Strategies** (unit, integration, accessibility, performance)

---

_Built with attention to detail, optimized for performance, and designed to impress both users and hiring managers._
