# Netlify Deployment Guide

This Angular application is configured for deployment on Netlify. Follow the steps below to deploy your app.

## Prerequisites

1. A Netlify account
2. Your Angular app repository on GitHub/GitLab/Bitbucket
3. Node.js 18+ installed locally

## Deployment Options

### Option 1: Automatic Deployment via Git (Recommended)

1. **Connect Repository to Netlify:**
   - Log into your Netlify dashboard
   - Click "New site from Git"
   - Connect your Git provider and select this repository
   - Choose the `development` or `main` branch

2. **Configure Build Settings:**
   - **Build command:** `npm run build:prod`
   - **Publish directory:** `dist/myaceroyal-admin`
   - **Branch to deploy:** `development` or `main`

3. **Environment Variables (if needed):**
   - Go to Site settings > Environment variables
   - Add any required environment variables for your API endpoints

### Option 2: Manual Deployment via CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Deploy to preview:**
   ```bash
   npm run netlify:preview
   ```

4. **Deploy to production:**
   ```bash
   npm run netlify:deploy
   ```

### Option 3: Drag and Drop

1. **Build the application:**
   ```bash
   npm run build:prod
   ```

2. **Upload the dist folder:**
   - Go to your Netlify dashboard
   - Drag and drop the `dist/myaceroyal-admin` folder to deploy

## Configuration Files

The following files have been configured for Netlify:

- **`netlify.toml`** - Main Netlify configuration
- **`public/_redirects`** - SPA routing redirects
- **`.nvmrc`** - Node.js version specification
- **`src/environments/environment.netlify.ts`** - Netlify-specific environment

## Build Configurations

- **Production:** `npm run build:prod`
- **UAT:** `npm run build:uat`
- **Netlify:** `npm run build:netlify`

## Custom Domain Setup

1. Go to Site settings > Domain management
2. Add your custom domain
3. Configure DNS settings as instructed by Netlify
4. Enable HTTPS (automatic with Let's Encrypt)

## Environment Variables

Update the following in your Netlify dashboard if needed:

- `NODE_VERSION=18`
- `NG_CLI_ANALYTICS=false`
- Any API endpoints or keys specific to production

## Troubleshooting

### Common Issues:

1. **Build fails:** Check Node.js version matches `.nvmrc`
2. **Routes not working:** Ensure `_redirects` file is in place
3. **Assets not loading:** Verify paths in `angular.json`

### Build Logs:
- Check Netlify dashboard > Deploys > Build logs for detailed error information

## Performance Optimizations

The Netlify configuration includes:

- Gzip compression
- Browser caching for static assets
- Security headers
- CDN distribution

## Support

For deployment issues:
- Check Netlify documentation
- Review build logs in Netlify dashboard
- Verify all dependencies are in `package.json`
