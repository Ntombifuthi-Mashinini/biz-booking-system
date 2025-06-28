# Railway Backend Deployment Guide

## 🚀 Deploy Your Backend to Railway

### Step 1: Sign Up for Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Create a new project

### Step 2: Connect Your Repository
1. Click "Deploy from GitHub repo"
2. Select your repository: `Ntombifuthi-Mashinini/biz-booking-system`
3. Railway will automatically detect it's a Node.js project

### Step 3: Configure Environment Variables
In your Railway project dashboard, add these environment variables:

```
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-here
MONGODB_URI=your-mongodb-connection-string
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
```

### Step 4: Set Up MongoDB (Optional)
1. In Railway, click "New" → "Database" → "MongoDB"
2. Copy the connection string
3. Add it to your environment variables as `MONGODB_URI`

### Step 5: Deploy
1. Railway will automatically deploy when you push to GitHub
2. Or click "Deploy" in the Railway dashboard
3. Wait for the build to complete

### Step 6: Get Your Backend URL
1. Once deployed, Railway will give you a URL like: `https://your-app-name.railway.app`
2. Copy this URL - you'll need it for the frontend

### Step 7: Update Frontend API URL
1. Go to your Netlify dashboard
2. Add environment variable: `REACT_APP_API_URL=https://your-app-name.railway.app`
3. Redeploy your frontend

## 🔧 Environment Variables Explained

- **NODE_ENV**: Set to `production` for production deployment
- **PORT**: Railway will set this automatically
- **JWT_SECRET**: A secret key for JWT token signing (generate a random string)
- **MONGODB_URI**: Your MongoDB connection string
- **EMAIL_USER**: Gmail address for sending emails
- **EMAIL_PASS**: Gmail app password (not your regular password)

## 📊 Monitoring Your Backend

Railway provides:
- ✅ Real-time logs
- ✅ Performance metrics
- ✅ Automatic scaling
- ✅ Health checks
- ✅ Custom domains

## 🔗 Connect Frontend to Backend

Once deployed, update your frontend's API URL:

1. **Netlify Dashboard** → Site Settings → Environment Variables
2. Add: `REACT_APP_API_URL=https://your-railway-app-url.railway.app`
3. Redeploy your frontend

## 🎯 Expected Result

Your backend will be available at: `https://your-app-name.railway.app`

Test the health check: `https://your-app-name.railway.app/api/health`

## 🆘 Troubleshooting

- **Build fails**: Check the logs in Railway dashboard
- **CORS errors**: Ensure your Netlify URL is in the allowed origins
- **Database connection**: Verify your MongoDB URI is correct
- **Environment variables**: Make sure all required variables are set

## 💰 Railway Pricing

- **Free tier**: $5 credit monthly
- **Pro**: Pay-as-you-go
- **Perfect for small projects** and testing

Your backend should be live and ready to handle requests from your frontend! 