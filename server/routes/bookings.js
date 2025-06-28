const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const { authMiddleware, requireBusinessOwner } = require('../middleware/auth');
const emailService = require('../utils/emailService');

const router = express.Router();

// Get all bookings for a business (business owner only)
router.get('/', authMiddleware, requireBusinessOwner, (req, res) => {
  try {
    const { status, date, dateRange, serviceId } = req.query;
    const filters = { status, date, dateRange, serviceId };

    const bookings = Booking.getBookingsByBusiness(req.user.userId, filters);

    res.json({
      bookings,
      count: bookings.length
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      error: 'Failed to get bookings'
    });
  }
});

// Get booking by ID
router.get('/:id', authMiddleware, requireBusinessOwner, (req, res) => {
  try {
    const booking = Booking.getBookingById(req.params.id);
    
    if (!booking || booking.businessId !== req.user.userId) {
      return res.status(404).json({
        error: 'Booking not found'
      });
    }

    res.json({ booking });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      error: 'Failed to get booking'
    });
  }
});

// Create new booking (public endpoint)
router.post('/', [
  body('clientName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Client name must be between 2 and 100 characters'),
  body('clientEmail')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('clientPhone')
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage('Phone number must be between 10 and 15 characters'),
  body('serviceId')
    .notEmpty()
    .withMessage('Service ID is required'),
  body('date')
    .isISO8601()
    .withMessage('Please provide a valid date'),
  body('time')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please provide a valid time in HH:MM format'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      clientName,
      clientEmail,
      clientPhone,
      serviceId,
      date,
      time,
      notes
    } = req.body;

    // Get service details
    const service = Service.getServiceById(serviceId);
    if (!service || !service.isActive) {
      return res.status(400).json({
        error: 'Service not found or inactive'
      });
    }

    // Create booking data
    const bookingData = {
      clientName,
      clientEmail,
      clientPhone,
      serviceId,
      serviceName: service.name,
      date,
      time,
      duration: service.duration,
      totalAmount: service.price,
      notes,
      businessId: service.businessId
    };

    // Create booking
    const booking = Booking.createBooking(bookingData);

    // Send confirmation email
    try {
      await emailService.sendBookingConfirmation(booking);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(400).json({
      error: error.message
    });
  }
});

// Update booking status (business owner only)
router.put('/:id/status', [
  authMiddleware,
  requireBusinessOwner,
  body('status')
    .isIn(['pending_payment', 'confirmed', 'completed', 'cancelled'])
    .withMessage('Invalid status')
], (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { status } = req.body;
    const booking = Booking.updateBookingStatus(req.params.id, status, req.user.userId);

    res.json({
      message: 'Booking status updated successfully',
      booking
    });

  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(400).json({
      error: error.message
    });
  }
});

// Upload payment proof
router.post('/:id/payment-proof', (req, res) => {
  try {
    const { proofFile } = req.body;
    
    if (!proofFile) {
      return res.status(400).json({
        error: 'Payment proof file is required'
      });
    }

    const booking = Booking.uploadPaymentProof(req.params.id, proofFile);

    res.json({
      message: 'Payment proof uploaded successfully',
      booking
    });

  } catch (error) {
    console.error('Upload payment proof error:', error);
    res.status(400).json({
      error: error.message
    });
  }
});

// Verify payment (business owner only)
router.put('/:id/verify-payment', [
  authMiddleware,
  requireBusinessOwner,
  body('isVerified')
    .isBoolean()
    .withMessage('isVerified must be a boolean')
], (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { isVerified } = req.body;
    const booking = Booking.verifyPayment(req.params.id, req.user.userId, isVerified);

    // Send confirmation email if payment is verified
    if (isVerified) {
      try {
        emailService.sendPaymentConfirmation(booking);
      } catch (emailError) {
        console.error('Failed to send payment confirmation email:', emailError);
      }
    }

    res.json({
      message: `Payment ${isVerified ? 'verified' : 'rejected'} successfully`,
      booking
    });

  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(400).json({
      error: error.message
    });
  }
});

// Cancel booking
router.delete('/:id', (req, res) => {
  try {
    const { reason } = req.body;
    const booking = Booking.cancelBooking(req.params.id, reason);

    // Send cancellation email
    try {
      emailService.sendCancellationEmail(booking);
    } catch (emailError) {
      console.error('Failed to send cancellation email:', emailError);
    }

    res.json({
      message: 'Booking cancelled successfully',
      booking
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(400).json({
      error: error.message
    });
  }
});

// Reschedule booking
router.put('/:id/reschedule', [
  body('newDate')
    .isISO8601()
    .withMessage('Please provide a valid date'),
  body('newTime')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please provide a valid time in HH:MM format')
], (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { newDate, newTime } = req.body;
    const booking = Booking.rescheduleBooking(req.params.id, newDate, newTime);

    // Send reschedule confirmation email
    try {
      emailService.sendRescheduleConfirmation(booking);
    } catch (emailError) {
      console.error('Failed to send reschedule confirmation email:', emailError);
    }

    res.json({
      message: 'Booking rescheduled successfully',
      booking
    });

  } catch (error) {
    console.error('Reschedule booking error:', error);
    res.status(400).json({
      error: error.message
    });
  }
});

// Get booking statistics (business owner only)
router.get('/stats/overview', authMiddleware, requireBusinessOwner, (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateRange = startDate && endDate ? { startDate, endDate } : null;

    const stats = Booking.getBookingStats(req.user.userId, dateRange);

    res.json({ stats });

  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({
      error: 'Failed to get booking statistics'
    });
  }
});

// Get available time slots for a service
router.get('/availability/:serviceId', (req, res) => {
  try {
    const { serviceId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        error: 'Date parameter is required'
      });
    }

    const availability = Service.getServiceAvailability(null, serviceId, date);

    res.json({ availability });

  } catch (error) {
    console.error('Get availability error:', error);
    res.status(400).json({
      error: error.message
    });
  }
});

// Get bookings for reminders (internal endpoint)
router.get('/reminders/pending', (req, res) => {
  try {
    const bookings = Booking.getBookingsForReminders();

    res.json({
      bookings,
      count: bookings.length
    });

  } catch (error) {
    console.error('Get reminders error:', error);
    res.status(500).json({
      error: 'Failed to get pending reminders'
    });
  }
});

// Mark reminder as sent (internal endpoint)
router.put('/:id/mark-reminder-sent', (req, res) => {
  try {
    Booking.markReminderSent(req.params.id);

    res.json({
      message: 'Reminder marked as sent'
    });

  } catch (error) {
    console.error('Mark reminder sent error:', error);
    res.status(500).json({
      error: 'Failed to mark reminder as sent'
    });
  }
});

module.exports = router; 