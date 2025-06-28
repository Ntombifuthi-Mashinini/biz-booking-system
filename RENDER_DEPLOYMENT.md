# Render Backend Deployment Guide

## 🚀 Deploy Your Backend to Render

### Step 1: Sign Up for Render
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Click "New +" → "Web Service"

### Step 2: Connect Your Repository
1. Choose "Connect a repository"
2. Select your repository: `Ntombifuthi-Mashinini/biz-booking-system`
3. Render will auto-detect it's a Node.js project

### Step 3: Configure Your Service
- **Name**: `biz-booking-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Build Command**: `npm install`
- **Start Command**: `node server/index.js`

### Step 4: Set Environment Variables
Click "Environment" tab and add:
```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here
MONGODB_URI=your-mongodb-connection-string
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
```

### Step 5: Deploy
1. Click "Create Web Service"
2. Render will automatically deploy
3. Wait for build to complete (2-3 minutes)

### Step 6: Get Your Backend URL
Your backend will be available at:
`https://biz-booking-backend.onrender.com`

## 🔧 Render vs Railway Comparison

| Feature | Render | Railway |
|---------|--------|---------|
| Free Tier | ✅ Yes | ✅ Yes ($5 credit) |
| Auto Deploy | ✅ Yes | ✅ Yes |
| Cold Starts | ⚠️ Yes (free) | ✅ No |
| Custom Domains | ✅ Yes | ✅ Yes |
| SSL | ✅ Yes | ✅ Yes |
| Database | ✅ Yes | ✅ Yes |
| Ease of Use | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

## 📊 Render Free Tier Limits

- **750 hours/month** (enough for 24/7 usage)
- **Cold starts** after 15 minutes of inactivity
- **512MB RAM**
- **Shared CPU**
- **Perfect for development and small projects**

## 🎯 Why Render is Great

✅ **Easy setup** - Just connect GitHub repo  
✅ **Free tier** - No credit card required  
✅ **Auto-deploy** - Updates on every push  
✅ **Custom domains** - Use your own domain  
✅ **SSL included** - HTTPS by default  
✅ **Good documentation** - Easy to follow  

## 🔗 Connect Frontend to Backend

Once deployed, update your frontend:

1. **Netlify Dashboard** → Site Settings → Environment Variables
2. Add: `REACT_APP_API_URL=https://biz-booking-backend.onrender.com`
3. Redeploy your frontend

## 🆘 Troubleshooting

- **Build fails**: Check logs in Render dashboard
- **Cold starts**: First request might be slow (free tier)
- **Environment variables**: Make sure all are set correctly
- **CORS errors**: Verify your Netlify URL is allowed

## 💰 Render Pricing

- **Free**: $0/month (perfect for your project)
- **Starter**: $7/month (no cold starts)
- **Standard**: $25/month (dedicated resources)

## 🎉 Expected Result

Your backend will be live at: `https://biz-booking-backend.onrender.com`

Test it: `https://biz-booking-backend.onrender.com/api/health`

**Render is perfect for your booking system!** 🚀 