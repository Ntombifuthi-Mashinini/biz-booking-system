const express = require('express');
const { authMiddleware, requireBusinessOwner } = require('../middleware/auth');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');
const moment = require('moment');

const router = express.Router();

// Get dashboard overview
router.get('/overview', authMiddleware, requireBusinessOwner, (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateRange = startDate && endDate ? { startDate, endDate } : null;

    // Get booking statistics
    const bookingStats = Booking.getBookingStats(req.user.userId, dateRange);
    
    // Get service statistics
    const serviceStats = Service.getServiceStats(req.user.userId);
    
    // Get user profile
    const user = User.getUserById(req.user.userId);

    // Get recent bookings
    const recentBookings = Booking.getBookingsByBusiness(req.user.userId)
      .slice(0, 5); // Get last 5 bookings

    // Get popular services
    const popularServices = Service.getPopularServices(req.user.userId, 5);

    const overview = {
      bookingStats,
      serviceStats,
      user,
      recentBookings,
      popularServices,
      dateRange
    };

    res.json({ overview });

  } catch (error) {
    console.error('Get dashboard overview error:', error);
    res.status(500).json({
      error: 'Failed to get dashboard overview'
    });
  }
});

// Get booking analytics
router.get('/analytics/bookings', authMiddleware, requireBusinessOwner, (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const endDate = moment().format('YYYY-MM-DD');
    const startDate = moment().subtract(parseInt(period), 'days').format('YYYY-MM-DD');

    const dateRange = { startDate, endDate };
    const bookingStats = Booking.getBookingStats(req.user.userId, dateRange);

    // Get daily booking trends
    const dailyBookings = [];
    const currentDate = moment(startDate);
    const endMoment = moment(endDate);

    while (currentDate.isSameOrBefore(endMoment)) {
      const dateStr = currentDate.format('YYYY-MM-DD');
      const dayBookings = Booking.getBookingsByBusiness(req.user.userId, { date: dateStr });
      
      dailyBookings.push({
        date: dateStr,
        count: dayBookings.length,
        revenue: dayBookings
          .filter(b => b.status === 'confirmed' || b.status === 'completed')
          .reduce((sum, b) => sum + b.totalAmount, 0)
      });

      currentDate.add(1, 'day');
    }

    // Get service performance
    const services = Service.getServicesByBusiness(req.user.userId);
    const servicePerformance = services.map(service => {
      const serviceBookings = Booking.getBookingsByBusiness(req.user.userId, { serviceId: service.id });
      const confirmedBookings = serviceBookings.filter(b => b.status === 'confirmed' || b.status === 'completed');
      
      return {
        serviceId: service.id,
        serviceName: service.name,
        totalBookings: serviceBookings.length,
        confirmedBookings: confirmedBookings.length,
        revenue: confirmedBookings.reduce((sum, b) => sum + b.totalAmount, 0),
        averageRating: 0 // Would need rating system implementation
      };
    });

    const analytics = {
      period,
      dateRange,
      bookingStats,
      dailyBookings,
      servicePerformance
    };

    res.json({ analytics });

  } catch (error) {
    console.error('Get booking analytics error:', error);
    res.status(500).json({
      error: 'Failed to get booking analytics'
    });
  }
});

// Get revenue analytics
router.get('/analytics/revenue', authMiddleware, requireBusinessOwner, (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const endDate = moment().format('YYYY-MM-DD');
    const startDate = moment().subtract(parseInt(period), 'days').format('YYYY-MM-DD');

    const dateRange = { startDate, endDate };
    const bookingStats = Booking.getBookingStats(req.user.userId, dateRange);

    // Get monthly revenue trends
    const monthlyRevenue = [];
    const currentMonth = moment().subtract(11, 'months'); // Last 12 months

    for (let i = 0; i < 12; i++) {
      const monthStart = currentMonth.clone().startOf('month');
      const monthEnd = currentMonth.clone().endOf('month');
      
      const monthRange = {
        startDate: monthStart.format('YYYY-MM-DD'),
        endDate: monthEnd.format('YYYY-MM-DD')
      };

      const monthStats = Booking.getBookingStats(req.user.userId, monthRange);
      
      monthlyRevenue.push({
        month: currentMonth.format('YYYY-MM'),
        monthName: currentMonth.format('MMMM YYYY'),
        revenue: monthStats.totalRevenue,
        bookings: monthStats.confirmed + monthStats.completed
      });

      currentMonth.add(1, 'month');
    }

    // Get revenue by service category
    const services = Service.getServicesByBusiness(req.user.userId);
    const categories = Service.getCategoriesByBusiness(req.user.userId);
    
    const revenueByCategory = categories.map(category => {
      const categoryServices = services.filter(s => s.category === category);
      const categoryServiceIds = categoryServices.map(s => s.id);
      
      let categoryRevenue = 0;
      let categoryBookings = 0;

      categoryServiceIds.forEach(serviceId => {
        const serviceBookings = Booking.getBookingsByBusiness(req.user.userId, { serviceId });
        const confirmedBookings = serviceBookings.filter(b => b.status === 'confirmed' || b.status === 'completed');
        
        categoryRevenue += confirmedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
        categoryBookings += confirmedBookings.length;
      });

      return {
        category,
        revenue: categoryRevenue,
        bookings: categoryBookings
      };
    });

    const revenueAnalytics = {
      period,
      dateRange,
      totalRevenue: bookingStats.totalRevenue,
      monthlyRevenue,
      revenueByCategory
    };

    res.json({ revenueAnalytics });

  } catch (error) {
    console.error('Get revenue analytics error:', error);
    res.status(500).json({
      error: 'Failed to get revenue analytics'
    });
  }
});

// Get notifications
router.get('/notifications', authMiddleware, requireBusinessOwner, (req, res) => {
  try {
    const notifications = [];

    // Get new bookings (pending payment or verification)
    const newBookings = Booking.getBookingsByBusiness(req.user.userId, { 
      status: ['pending_payment', 'pending_verification'] 
    });

    newBookings.forEach(booking => {
      notifications.push({
        id: `booking-${booking.id}`,
        type: 'new_booking',
        title: 'New Booking',
        message: `${booking.clientName} booked ${booking.serviceName} for ${moment(booking.date).format('MMM DD, YYYY')} at ${booking.time}`,
        data: booking,
        timestamp: booking.createdAt,
        read: false
      });
    });

    // Get upcoming appointments (next 24 hours)
    const tomorrow = moment().add(1, 'day').format('YYYY-MM-DD');
    const upcomingBookings = Booking.getBookingsByBusiness(req.user.userId, { date: tomorrow });

    upcomingBookings.forEach(booking => {
      notifications.push({
        id: `upcoming-${booking.id}`,
        type: 'upcoming_appointment',
        title: 'Upcoming Appointment',
        message: `${booking.clientName} has an appointment tomorrow at ${booking.time}`,
        data: booking,
        timestamp: new Date().toISOString(),
        read: false
      });
    });

    // Sort by timestamp (newest first)
    notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      notifications,
      count: notifications.length,
      unreadCount: notifications.filter(n => !n.read).length
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      error: 'Failed to get notifications'
    });
  }
});

// Mark notification as read
router.put('/notifications/:id/read', authMiddleware, requireBusinessOwner, (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real application, you would update the notification status in the database
    // For now, we'll just return a success message
    
    res.json({
      message: 'Notification marked as read'
    });

  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({
      error: 'Failed to mark notification as read'
    });
  }
});

// Get business settings
router.get('/settings', authMiddleware, requireBusinessOwner, (req, res) => {
  try {
    const user = User.getUserById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      settings: user.settings
    });

  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      error: 'Failed to get settings'
    });
  }
});

// Update business settings
router.put('/settings', authMiddleware, requireBusinessOwner, (req, res) => {
  try {
    const { workingHours, notificationSettings, branding } = req.body;
    
    const updateData = {};
    if (workingHours) updateData.workingHours = workingHours;
    if (notificationSettings) updateData.notificationSettings = notificationSettings;
    if (branding) updateData.branding = branding;

    const user = User.updateUser(req.user.userId, { settings: updateData });

    res.json({
      message: 'Settings updated successfully',
      settings: user.settings
    });

  } catch (error) {
    console.error('Update settings error:', error);
    res.status(400).json({
      error: error.message
    });
  }
});

// Get business profile
router.get('/profile', authMiddleware, requireBusinessOwner, (req, res) => {
  try {
    const user = User.getUserById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      profile: user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to get profile'
    });
  }
});

// Export booking data
router.get('/export/bookings', authMiddleware, requireBusinessOwner, (req, res) => {
  try {
    const { format = 'json', startDate, endDate } = req.query;
    const dateRange = startDate && endDate ? { startDate, endDate } : null;

    const bookings = Booking.getBookingsByBusiness(req.user.userId, dateRange);

    if (format === 'csv') {
      // Convert to CSV format
      const csvData = convertToCSV(bookings);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="bookings.csv"');
      res.send(csvData);
    } else {
      // Return JSON format
      res.json({
        bookings,
        count: bookings.length,
        exportDate: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('Export bookings error:', error);
    res.status(500).json({
      error: 'Failed to export bookings'
    });
  }
});

// Helper function to convert data to CSV
function convertToCSV(data) {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];
  
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

module.exports = router; 