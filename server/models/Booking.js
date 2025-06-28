const moment = require('moment');

class Booking {
  constructor() {
    this.bookings = [];
  }

  // Create a new booking
  createBooking(bookingData) {
    const {
      clientName,
      clientEmail,
      clientPhone,
      serviceId,
      serviceName,
      date,
      time,
      duration,
      totalAmount,
      notes,
      businessId
    } = bookingData;

    // Validate booking data
    this.validateBookingData(bookingData);

    // Check if time slot is available
    if (!this.isTimeSlotAvailable(businessId, date, time, duration)) {
      throw new Error('Selected time slot is not available');
    }

    const booking = {
      id: this.generateId(),
      clientName,
      clientEmail,
      clientPhone,
      serviceId,
      serviceName,
      date,
      time,
      duration,
      totalAmount,
      notes: notes || '',
      businessId,
      status: 'pending_payment', // pending_payment, confirmed, completed, cancelled
      paymentProof: null,
      paymentVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reminderSent: false,
      confirmationSent: false
    };

    this.bookings.push(booking);
    return booking;
  }

  // Get all bookings for a business
  getBookingsByBusiness(businessId, filters = {}) {
    let filteredBookings = this.bookings.filter(booking => booking.businessId === businessId);

    // Apply filters
    if (filters.status) {
      filteredBookings = filteredBookings.filter(booking => booking.status === filters.status);
    }

    if (filters.date) {
      filteredBookings = filteredBookings.filter(booking => 
        moment(booking.date).format('YYYY-MM-DD') === filters.date
      );
    }

    if (filters.dateRange) {
      const { startDate, endDate } = filters.dateRange;
      filteredBookings = filteredBookings.filter(booking => 
        moment(booking.date).isBetween(startDate, endDate, 'day', '[]')
      );
    }

    if (filters.serviceId) {
      filteredBookings = filteredBookings.filter(booking => booking.serviceId === filters.serviceId);
    }

    // Sort by date and time
    return filteredBookings.sort((a, b) => {
      const dateA = moment(`${a.date} ${a.time}`);
      const dateB = moment(`${b.date} ${b.time}`);
      return dateA.isBefore(dateB) ? -1 : 1;
    });
  }

  // Get booking by ID
  getBookingById(id) {
    return this.bookings.find(booking => booking.id === id);
  }

  // Update booking status
  updateBookingStatus(id, status, businessId) {
    const booking = this.bookings.find(b => b.id === id && b.businessId === businessId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    const validStatuses = ['pending_payment', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    booking.status = status;
    booking.updatedAt = new Date().toISOString();

    return booking;
  }

  // Upload payment proof
  uploadPaymentProof(id, proofFile) {
    const booking = this.bookings.find(b => b.id === id);
    if (!booking) {
      throw new Error('Booking not found');
    }

    booking.paymentProof = proofFile;
    booking.status = 'pending_verification';
    booking.updatedAt = new Date().toISOString();

    return booking;
  }

  // Verify payment
  verifyPayment(id, businessId, isVerified) {
    const booking = this.bookings.find(b => b.id === id && b.businessId === businessId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    booking.paymentVerified = isVerified;
    booking.status = isVerified ? 'confirmed' : 'pending_payment';
    booking.updatedAt = new Date().toISOString();

    return booking;
  }

  // Cancel booking
  cancelBooking(id, reason = '') {
    const booking = this.bookings.find(b => b.id === id);
    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.status === 'completed') {
      throw new Error('Cannot cancel completed booking');
    }

    booking.status = 'cancelled';
    booking.cancellationReason = reason;
    booking.updatedAt = new Date().toISOString();

    return booking;
  }

  // Reschedule booking
  rescheduleBooking(id, newDate, newTime) {
    const booking = this.bookings.find(b => b.id === id);
    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.status === 'completed' || booking.status === 'cancelled') {
      throw new Error('Cannot reschedule completed or cancelled booking');
    }

    // Check if new time slot is available
    if (!this.isTimeSlotAvailable(booking.businessId, newDate, newTime, booking.duration, id)) {
      throw new Error('Selected time slot is not available');
    }

    booking.date = newDate;
    booking.time = newTime;
    booking.updatedAt = new Date().toISOString();

    return booking;
  }

  // Get bookings that need reminders
  getBookingsForReminders() {
    const now = moment();
    const oneHourFromNow = moment().add(1, 'hour');
    
    return this.bookings.filter(booking => {
      const bookingDateTime = moment(`${booking.date} ${booking.time}`);
      return booking.status === 'confirmed' && 
             !booking.reminderSent &&
             bookingDateTime.isBetween(now, oneHourFromNow);
    });
  }

  // Mark reminder as sent
  markReminderSent(id) {
    const booking = this.bookings.find(b => b.id === id);
    if (booking) {
      booking.reminderSent = true;
      booking.updatedAt = new Date().toISOString();
    }
  }

  // Mark confirmation as sent
  markConfirmationSent(id) {
    const booking = this.bookings.find(b => b.id === id);
    if (booking) {
      booking.confirmationSent = true;
      booking.updatedAt = new Date().toISOString();
    }
  }

  // Get booking statistics
  getBookingStats(businessId, dateRange = null) {
    let filteredBookings = this.bookings.filter(booking => booking.businessId === businessId);

    if (dateRange) {
      const { startDate, endDate } = dateRange;
      filteredBookings = filteredBookings.filter(booking => 
        moment(booking.date).isBetween(startDate, endDate, 'day', '[]')
      );
    }

    const stats = {
      total: filteredBookings.length,
      confirmed: filteredBookings.filter(b => b.status === 'confirmed').length,
      completed: filteredBookings.filter(b => b.status === 'completed').length,
      cancelled: filteredBookings.filter(b => b.status === 'cancelled').length,
      pendingPayment: filteredBookings.filter(b => b.status === 'pending_payment').length,
      pendingVerification: filteredBookings.filter(b => b.status === 'pending_verification').length,
      totalRevenue: filteredBookings
        .filter(b => b.status === 'confirmed' || b.status === 'completed')
        .reduce((sum, b) => sum + b.totalAmount, 0)
    };

    return stats;
  }

  // Check if time slot is available
  isTimeSlotAvailable(businessId, date, time, duration, excludeBookingId = null) {
    const requestedStart = moment(`${date} ${time}`);
    const requestedEnd = requestedStart.clone().add(duration, 'minutes');

    const conflictingBookings = this.bookings.filter(booking => {
      if (booking.businessId !== businessId || booking.status === 'cancelled') {
        return false;
      }

      if (excludeBookingId && booking.id === excludeBookingId) {
        return false;
      }

      if (booking.date !== date) {
        return false;
      }

      const bookingStart = moment(`${booking.date} ${booking.time}`);
      const bookingEnd = bookingStart.clone().add(booking.duration, 'minutes');

      return requestedStart.isBefore(bookingEnd) && requestedEnd.isAfter(bookingStart);
    });

    return conflictingBookings.length === 0;
  }

  // Validate booking data
  validateBookingData(bookingData) {
    const { clientName, clientEmail, clientPhone, serviceId, date, time, duration, totalAmount } = bookingData;

    if (!clientName || !clientEmail || !clientPhone || !serviceId || !date || !time || !duration || !totalAmount) {
      throw new Error('All required fields must be provided');
    }

    if (duration <= 0) {
      throw new Error('Duration must be greater than 0');
    }

    if (totalAmount <= 0) {
      throw new Error('Total amount must be greater than 0');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
      throw new Error('Invalid email format');
    }

    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(clientPhone.replace(/\s/g, ''))) {
      throw new Error('Invalid phone number format');
    }

    // Check if booking date is in the future
    const bookingDate = moment(`${date} ${time}`);
    if (bookingDate.isBefore(moment())) {
      throw new Error('Cannot book appointments in the past');
    }

    return true;
  }

  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

module.exports = new Booking(); 