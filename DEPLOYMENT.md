# Vercel Deployment Guide

## Quick Setup (5 minutes)

### 1. Install Vercel CLI (Optional)

```bash
npm i -g vercel
```

### 2. Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel auto-detects Next.js - no configuration needed
5. Click "Deploy"

That's it! Your site will be live at `your-project.vercel.app`

### 3. Configure Environment Variables

If using EmailJS or other services:

1. Go to Project Settings → Environment Variables
2. Add your variables from `.env.example`
3. Redeploy (automatic on next push)

### 4. Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Automatic Deployments

- **Production**: Every push to `main` branch
- **Preview**: Every pull request gets a unique URL
- **Instant Rollbacks**: One-click rollback to any previous deployment

## Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production (test locally)
npm run build
npm start
```

## Vercel CLI Deployment

```bash
# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Performance Features (Automatic)

✅ Image optimization (WebP/AVIF)
✅ Edge caching
✅ Automatic HTTPS
✅ Brotli compression
✅ Smart CDN routing
✅ Zero-config

## Monitoring

View analytics in Vercel Dashboard:

- Real-time traffic
- Core Web Vitals
- Function logs
- Build logs

## Troubleshooting

### Build fails

- Check build logs in Vercel dashboard
- Test locally: `npm run build`
- Verify all dependencies in `package.json`

### Environment variables not working

- Ensure variables start with `NEXT_PUBLIC_` for client-side
- Redeploy after adding variables

### Images not loading

- Ensure images are in `public` folder
- Check image paths (use `/image.png` not `./image.png`)
