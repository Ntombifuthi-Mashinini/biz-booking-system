# Render Environment Variables Setup

## Required Environment Variables

Set these environment variables in your Render dashboard:

### 1. JWT Configuration
```
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
```
**Generate a secure secret**: Use a strong random string (at least 32 characters)

### 2. Email Configuration (Optional - for notifications)
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here
```
**Note**: For Gmail, you'll need to use an App Password, not your regular password

### 3. File Upload Configuration
```
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

### 4. Security Configuration
```
CORS_ORIGIN=https://business-webs4.netlify.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 5. Business Configuration
```
DEFAULT_BUSINESS_NAME=Your Business Name
DEFAULT_BUSINESS_TYPE=General
```

### 6. Notification Configuration
```
REMINDER_TIME_MINUTES=60
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_SMS_NOTIFICATIONS=false
```

## How to Set Environment Variables in Render

1. **Go to your Render dashboard**
2. **Select your service** (biz-booking-system-3)
3. **Click on "Environment"** in the left sidebar
4. **Add each variable** by clicking "Add Environment Variable"
5. **Enter the key and value** for each variable above
6. **Click "Save Changes"**
7. **Redeploy your service** if needed

## Important Notes

- **JWT_SECRET**: This is critical for security. Generate a strong random string
- **Email setup**: Only needed if you want email notifications
- **CORS_ORIGIN**: Should match your Netlify frontend URL
- **File uploads**: Files will be stored in the Render filesystem (temporary)

## Testing Your Setup

After setting environment variables:

1. **Test the health endpoint**: https://biz-booking-system-3.onrender.com/api/health
2. **Test registration**: Try creating a new business account
3. **Test login**: Verify authentication works
4. **Test file uploads**: Try uploading payment proof

## Security Best Practices

- Use strong, unique JWT secrets
- Never commit environment variables to git
- Use HTTPS in production
- Regularly rotate secrets
- Monitor your application logs 