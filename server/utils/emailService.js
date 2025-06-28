const nodemailer = require('nodemailer');
const moment = require('moment');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  // Initialize email transporter
  initializeTransporter() {
    // For development, use a test account or configure your email service
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // Send booking confirmation email
  async sendBookingConfirmation(booking) {
    try {
      const subject = 'Booking Confirmation - Payment Required';
      const html = this.generateBookingConfirmationEmail(booking);

      await this.sendEmail(booking.clientEmail, subject, html);

      console.log(`Booking confirmation email sent to ${booking.clientEmail}`);
      return true;
    } catch (error) {
      console.error('Failed to send booking confirmation email:', error);
      return false;
    }
  }

  // Send payment confirmation email
  async sendPaymentConfirmation(booking) {
    try {
      const subject = 'Payment Confirmed - Your Appointment is Confirmed';
      const html = this.generatePaymentConfirmationEmail(booking);

      await this.sendEmail(booking.clientEmail, subject, html);

      console.log(`Payment confirmation email sent to ${booking.clientEmail}`);
      return true;
    } catch (error) {
      console.error('Failed to send payment confirmation email:', error);
      return false;
    }
  }

  // Send appointment reminder email
  async sendAppointmentReminder(booking) {
    try {
      const subject = 'Appointment Reminder - Tomorrow';
      const html = this.generateAppointmentReminderEmail(booking);

      await this.sendEmail(booking.clientEmail, subject, html);

      console.log(`Appointment reminder email sent to ${booking.clientEmail}`);
      return true;
    } catch (error) {
      console.error('Failed to send appointment reminder email:', error);
      return false;
    }
  }

  // Send cancellation email
  async sendCancellationEmail(booking) {
    try {
      const subject = 'Appointment Cancelled';
      const html = this.generateCancellationEmail(booking);

      await this.sendEmail(booking.clientEmail, subject, html);

      console.log(`Cancellation email sent to ${booking.clientEmail}`);
      return true;
    } catch (error) {
      console.error('Failed to send cancellation email:', error);
      return false;
    }
  }

  // Send reschedule confirmation email
  async sendRescheduleConfirmation(booking) {
    try {
      const subject = 'Appointment Rescheduled';
      const html = this.generateRescheduleConfirmationEmail(booking);

      await this.sendEmail(booking.clientEmail, subject, html);

      console.log(`Reschedule confirmation email sent to ${booking.clientEmail}`);
      return true;
    } catch (error) {
      console.error('Failed to send reschedule confirmation email:', error);
      return false;
    }
  }

  // Send new booking notification to business owner
  async sendNewBookingNotification(booking, businessEmail) {
    try {
      const subject = 'New Booking Received';
      const html = this.generateNewBookingNotificationEmail(booking);

      await this.sendEmail(businessEmail, subject, html);

      console.log(`New booking notification sent to ${businessEmail}`);
      return true;
    } catch (error) {
      console.error('Failed to send new booking notification:', error);
      return false;
    }
  }

  // Generic email sending function
  async sendEmail(to, subject, html) {
    if (!this.transporter) {
      throw new Error('Email transporter not initialized');
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: html
    };

    const info = await this.transporter.sendMail(mailOptions);
    return info;
  }

  // Generate booking confirmation email HTML
  generateBookingConfirmationEmail(booking) {
    const appointmentDate = moment(booking.date).format('dddd, MMMM DD, YYYY');
    const appointmentTime = moment(booking.time, 'HH:mm').format('h:mm A');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Booking Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3B82F6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .booking-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .payment-info { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Confirmation</h1>
          </div>
          <div class="content">
            <p>Dear ${booking.clientName},</p>
            <p>Thank you for your booking! We have received your appointment request.</p>
            
            <div class="booking-details">
              <h3>Appointment Details:</h3>
              <p><strong>Service:</strong> ${booking.serviceName}</p>
              <p><strong>Date:</strong> ${appointmentDate}</p>
              <p><strong>Time:</strong> ${appointmentTime}</p>
              <p><strong>Duration:</strong> ${booking.duration} minutes</p>
              <p><strong>Total Amount:</strong> $${booking.totalAmount}</p>
              ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ''}
            </div>

            <div class="payment-info">
              <h4>⚠️ Payment Required</h4>
              <p>To confirm your appointment, please complete the payment and upload proof of payment.</p>
              <p><strong>Payment Method:</strong> EFT/Bank Transfer</p>
              <p><strong>Amount Due:</strong> $${booking.totalAmount}</p>
            </div>

            <p>Once payment is received and verified, you will receive a confirmation email.</p>
            
            <p>If you have any questions, please don't hesitate to contact us.</p>
            
            <p>Best regards,<br>Your Business Team</p>
          </div>
          <div class="footer">
            <p>Coded by Ntombifuthi Mashinini © 2025</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate payment confirmation email HTML
  generatePaymentConfirmationEmail(booking) {
    const appointmentDate = moment(booking.date).format('dddd, MMMM DD, YYYY');
    const appointmentTime = moment(booking.time, 'HH:mm').format('h:mm A');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Payment Confirmed</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10B981; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .booking-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .success-info { background: #d1fae5; border: 1px solid #a7f3d0; padding: 15px; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Payment Confirmed</h1>
          </div>
          <div class="content">
            <p>Dear ${booking.clientName},</p>
            <p>Great news! Your payment has been received and verified. Your appointment is now confirmed.</p>
            
            <div class="success-info">
              <h4>🎉 Appointment Confirmed!</h4>
              <p>Your appointment has been successfully confirmed and is now in our schedule.</p>
            </div>

            <div class="booking-details">
              <h3>Appointment Details:</h3>
              <p><strong>Service:</strong> ${booking.serviceName}</p>
              <p><strong>Date:</strong> ${appointmentDate}</p>
              <p><strong>Time:</strong> ${appointmentTime}</p>
              <p><strong>Duration:</strong> ${booking.duration} minutes</p>
              <p><strong>Amount Paid:</strong> $${booking.totalAmount}</p>
            </div>

            <p>We look forward to seeing you!</p>
            
            <p>Best regards,<br>Your Business Team</p>
          </div>
          <div class="footer">
            <p>Coded by Ntombifuthi Mashinini © 2025</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate appointment reminder email HTML
  generateAppointmentReminderEmail(booking) {
    const appointmentDate = moment(booking.date).format('dddd, MMMM DD, YYYY');
    const appointmentTime = moment(booking.time, 'HH:mm').format('h:mm A');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Appointment Reminder</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #F59E0B; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .booking-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .reminder-info { background: #fef3c7; border: 1px solid #fde68a; padding: 15px; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Appointment Reminder</h1>
          </div>
          <div class="content">
            <p>Dear ${booking.clientName},</p>
            <p>This is a friendly reminder about your upcoming appointment tomorrow.</p>
            
            <div class="reminder-info">
              <h4>📅 Tomorrow's Appointment</h4>
              <p>Please arrive 10 minutes before your scheduled time.</p>
            </div>

            <div class="booking-details">
              <h3>Appointment Details:</h3>
              <p><strong>Service:</strong> ${booking.serviceName}</p>
              <p><strong>Date:</strong> ${appointmentDate}</p>
              <p><strong>Time:</strong> ${appointmentTime}</p>
              <p><strong>Duration:</strong> ${booking.duration} minutes</p>
            </div>

            <p>If you need to reschedule or cancel, please contact us as soon as possible.</p>
            
            <p>We look forward to seeing you!</p>
            
            <p>Best regards,<br>Your Business Team</p>
          </div>
          <div class="footer">
            <p>Coded by Ntombifuthi Mashinini © 2025</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate cancellation email HTML
  generateCancellationEmail(booking) {
    const appointmentDate = moment(booking.date).format('dddd, MMMM DD, YYYY');
    const appointmentTime = moment(booking.time, 'HH:mm').format('h:mm A');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Appointment Cancelled</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #EF4444; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .booking-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .cancellation-info { background: #fee2e2; border: 1px solid #fecaca; padding: 15px; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Appointment Cancelled</h1>
          </div>
          <div class="content">
            <p>Dear ${booking.clientName},</p>
            <p>Your appointment has been cancelled as requested.</p>
            
            <div class="cancellation-info">
              <h4>Cancelled Appointment</h4>
              <p>We have processed your cancellation request.</p>
            </div>

            <div class="booking-details">
              <h3>Cancelled Appointment Details:</h3>
              <p><strong>Service:</strong> ${booking.serviceName}</p>
              <p><strong>Date:</strong> ${appointmentDate}</p>
              <p><strong>Time:</strong> ${appointmentTime}</p>
              <p><strong>Duration:</strong> ${booking.duration} minutes</p>
              ${booking.cancellationReason ? `<p><strong>Reason:</strong> ${booking.cancellationReason}</p>` : ''}
            </div>

            <p>If you would like to book a new appointment, please visit our booking system.</p>
            
            <p>Thank you for your understanding.</p>
            
            <p>Best regards,<br>Your Business Team</p>
          </div>
          <div class="footer">
            <p>Coded by Ntombifuthi Mashinini © 2025</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate reschedule confirmation email HTML
  generateRescheduleConfirmationEmail(booking) {
    const appointmentDate = moment(booking.date).format('dddd, MMMM DD, YYYY');
    const appointmentTime = moment(booking.time, 'HH:mm').format('h:mm A');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Appointment Rescheduled</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #8B5CF6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .booking-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .reschedule-info { background: #ede9fe; border: 1px solid #c4b5fd; padding: 15px; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔄 Appointment Rescheduled</h1>
          </div>
          <div class="content">
            <p>Dear ${booking.clientName},</p>
            <p>Your appointment has been successfully rescheduled.</p>
            
            <div class="reschedule-info">
              <h4>✅ Reschedule Confirmed</h4>
              <p>Your appointment has been updated with the new date and time.</p>
            </div>

            <div class="booking-details">
              <h3>Updated Appointment Details:</h3>
              <p><strong>Service:</strong> ${booking.serviceName}</p>
              <p><strong>Date:</strong> ${appointmentDate}</p>
              <p><strong>Time:</strong> ${appointmentTime}</p>
              <p><strong>Duration:</strong> ${booking.duration} minutes</p>
            </div>

            <p>We look forward to seeing you at the new time!</p>
            
            <p>Best regards,<br>Your Business Team</p>
          </div>
          <div class="footer">
            <p>Coded by Ntombifuthi Mashinini © 2025</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate new booking notification email HTML
  generateNewBookingNotificationEmail(booking) {
    const appointmentDate = moment(booking.date).format('dddd, MMMM DD, YYYY');
    const appointmentTime = moment(booking.time, 'HH:mm').format('h:mm A');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Booking Notification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3B82F6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .booking-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .notification-info { background: #dbeafe; border: 1px solid #93c5fd; padding: 15px; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📅 New Booking Received</h1>
          </div>
          <div class="content">
            <p>Hello Business Owner,</p>
            <p>You have received a new booking request.</p>
            
            <div class="notification-info">
              <h4>🆕 New Appointment Request</h4>
              <p>A client has requested an appointment and is waiting for payment verification.</p>
            </div>

            <div class="booking-details">
              <h3>Booking Details:</h3>
              <p><strong>Client Name:</strong> ${booking.clientName}</p>
              <p><strong>Client Email:</strong> ${booking.clientEmail}</p>
              <p><strong>Client Phone:</strong> ${booking.clientPhone}</p>
              <p><strong>Service:</strong> ${booking.serviceName}</p>
              <p><strong>Date:</strong> ${appointmentDate}</p>
              <p><strong>Time:</strong> ${appointmentTime}</p>
              <p><strong>Duration:</strong> ${booking.duration} minutes</p>
              <p><strong>Total Amount:</strong> $${booking.totalAmount}</p>
              <p><strong>Status:</strong> ${booking.status}</p>
              ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ''}
            </div>

            <p>Please review the booking and verify payment when received.</p>
            
            <p>Best regards,<br>Booking System</p>
          </div>
          <div class="footer">
            <p>Coded by Ntombifuthi Mashinini © 2025</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService(); 