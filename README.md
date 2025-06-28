# BizBooking System

A comprehensive, secure, and responsive online booking system designed for all types of small businesses.

## 🚀 Features

### For Clients
- 📅 View available appointment slots
- 🕒 Choose date, time, and service type
- 💳 Manual EFT payment with proof upload
- 📧 Automated booking confirmations
- ⏰ Appointment reminders (1 hour before)
- 🔄 Cancel/reschedule functionality
- 📱 Mobile-responsive design

### For Business Owners
- 📊 Real-time booking dashboard
- 🔔 New appointment notifications
- 📁 Access to payment proof uploads
- ⚙️ Service and hours management
- 📈 Booking reports and analytics
- 👥 User role management
- 🎨 Customizable branding

### Security Features
- 🔐 Encrypted data storage
- 🛡️ Secure authentication (JWT)
- 🔒 Protected file uploads
- 🚫 Rate limiting
- 🔒 HTTPS enforcement

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js
- **Authentication**: JWT, bcrypt
- **File Upload**: Multer
- **Email**: Nodemailer
- **PDF Generation**: PDFKit
- **Security**: Helmet, CORS, Rate Limiting

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bizSystem
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```
   PORT=5000
   JWT_SECRET=your_jwt_secret_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   UPLOAD_PATH=./uploads
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 📁 Project Structure

```
bizSystem/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       ├── pages/         # Page components
│       ├── hooks/         # Custom hooks
│       ├── utils/         # Utility functions
│       └── styles/        # CSS styles
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Data models
│   ├── routes/           # API routes
│   └── utils/            # Utility functions
├── uploads/              # File uploads
└── docs/                 # Documentation
```

## 🔧 Configuration

### Email Setup
Configure your email service in `.env`:
- Gmail: Use App Password for 2FA accounts
- Other providers: Check their SMTP settings

### File Upload
- Default upload path: `./uploads`
- Supported formats: JPG, PNG, PDF
- Max file size: 5MB

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Configure proper database connection
- Set up SSL certificates for HTTPS

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new business
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verify token

### Booking Endpoints
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Service Endpoints
- `GET /api/services` - Get all services
- `POST /api/services` - Create service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Ntombifuthi Mashinini** © 2025

---

*Built with ❤️ for small businesses worldwide* 