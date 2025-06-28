# Netlify Deployment Guide

## Option 1: Deploy via Netlify UI (Recommended)

1. **Go to [netlify.com](https://netlify.com)** and sign up/login
2. **Click "Add new site"** → "Import an existing project"
3. **Connect your GitHub account** and select your repository: `Ntombifuthi-Mashinini/biz-booking-system`
4. **Configure build settings:**
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `build`
5. **Click "Deploy site"**

## Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Deploy from your project root:**
   ```bash
   netlify deploy --prod --dir=client/build
   ```

## Environment Variables (Optional)

If you need to set environment variables:
1. Go to Site settings → Environment variables
2. Add `REACT_APP_API_URL` with your backend URL

## Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Add your custom domain
3. Configure DNS settings as instructed

## Benefits of Netlify

- ✅ **Free tier** with generous limits
- ✅ **Automatic deployments** from Git
- ✅ **Global CDN** for fast loading
- ✅ **Easy SSL certificates**
- ✅ **Form handling** (if needed later)
- ✅ **Better error messages** than Vercel
- ✅ **More reliable builds**

## Troubleshooting

If you encounter build issues:
1. Check the build logs in Netlify dashboard
2. Ensure all dependencies are in `package.json`
3. Verify the `netlify.toml` configuration
4. Check that Node.js version is compatible (18+)

## Backend Deployment

For your backend, consider:
- **Railway** (recommended)
- **Render**
- **Heroku**
- **DigitalOcean App Platform**

Remember to update your frontend's API URL to point to your deployed backend! 