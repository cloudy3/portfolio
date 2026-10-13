# Deployment

The site is hosted on Vercel, which builds it with `npm run build`
(`vercel.json`). GitHub Actions runs typecheck, lint, a dead-code check (knip),
tests and the build on the same pushes (`.github/workflows/ci.yml`), so a red
check in the pull request usually means the Vercel build will fail too.

## Automatic deployments

- **Production:** every push to `main`
- **Preview:** every pull request gets its own URL
- **Rollback:** promote any earlier deployment from the Vercel dashboard

## Environment variables

Set these in Vercel under Project Settings → Environment Variables. For local
development, copy `.env.example` to `.env.local` and fill in the same names.

| Variable | Needed for | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | Contact form | From the EmailJS dashboard |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | Contact form | From the EmailJS dashboard |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | Contact form | EmailJS dashboard → Account |
| `NEXT_PUBLIC_SITE_URL` | Canonical, Open Graph, robots and sitemap URLs | Optional; see below |

`NEXT_PUBLIC_` variables are inlined at build time, so redeploy after changing
any of them.

`NEXT_PUBLIC_SITE_URL` falls back to `https://www.jingfeng-cheah.me` on every
Vercel build, previews included, so previews never declare themselves
canonical. Off Vercel it falls back to `http://localhost:3000`. Set it only if
the production domain changes (`src/lib/site.ts`).

## Custom domain

The production domain is configured under Project Settings → Domains. The apex
redirects to `www`, which is the host the canonical URLs use.

## Checking a build locally

```bash
npm run build
npm start                # http://localhost:3000
npm run lighthouse       # mobile + desktop scores against the build
```

## Deploying from the CLI

Not needed for the normal flow, but useful for a one-off preview of
uncommitted work:

```bash
npx vercel               # preview deployment
npx vercel --prod        # production deployment
```

## Troubleshooting

**Build fails on Vercel.** Check the GitHub Actions run for the same commit
first; it shows typecheck, lint, knip and test failures separately. Reproduce
locally with `npm run build`.

**Contact form says EmailJS is not configured.** One of the three EmailJS
variables is missing from the environment the deployment was built in
(Production and Preview are set separately). Add it and redeploy.

**Canonical or sitemap URLs point at the wrong host.** Check
`NEXT_PUBLIC_SITE_URL` in Vercel; unset, it uses the production domain.
