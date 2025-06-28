const express = require('express');
const { body, validationResult } = require('express-validator');
const Service = require('../models/Service');
const { authMiddleware, requireBusinessOwner } = require('../middleware/auth');

const router = express.Router();

// Get all services for a business
router.get('/', (req, res) => {
  try {
    const { businessId } = req.query;
    
    if (!businessId) {
      return res.status(400).json({
        error: 'Business ID is required'
      });
    }

    const services = Service.getServicesByBusiness(businessId);
    
    res.json({
      services,
      count: services.length
    });

  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      error: 'Failed to get services'
    });
  }
});

// Get service by ID
router.get('/:id', (req, res) => {
  try {
    const service = Service.getServiceById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        error: 'Service not found'
      });
    }

    res.json({ service });

  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      error: 'Failed to get service'
    });
  }
});

// Create new service (business owner only)
router.post('/', [
  authMiddleware,
  requireBusinessOwner,
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Service name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('duration')
    .isInt({ min: 15, max: 480 })
    .withMessage('Duration must be between 15 and 480 minutes'),
  body('price')
    .isFloat({ min: 0, max: 10000 })
    .withMessage('Price must be between 0 and 10,000'),
  body('category')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters')
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

    const serviceData = {
      ...req.body,
      businessId: req.user.userId
    };

    const service = Service.createService(serviceData);

    res.status(201).json({
      message: 'Service created successfully',
      service
    });

  } catch (error) {
    console.error('Create service error:', error);
    res.status(400).json({
      error: error.message
    });
  }
});

// Update service (business owner only)
router.put('/:id', [
  authMiddleware,
  requireBusinessOwner,
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Service name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('duration')
    .optional()
    .isInt({ min: 15, max: 480 })
    .withMessage('Duration must be between 15 and 480 minutes'),
  body('price')
    .optional()
    .isFloat({ min: 0, max: 10000 })
    .withMessage('Price must be between 0 and 10,000'),
  body('category')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
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

    const service = Service.updateService(req.params.id, req.user.userId, req.body);

    res.json({
      message: 'Service updated successfully',
      service
    });

  } catch (error) {
    console.error('Update service error:', error);
    res.status(400).json({
      error: error.message
    });
  }
});

// Delete service (business owner only)
router.delete('/:id', authMiddleware, requireBusinessOwner, (req, res) => {
  try {
    const result = Service.deleteService(req.params.id, req.user.userId);

    res.json(result);

  } catch (error) {
    console.error('Delete service error:', error);
    res.status(400).json({
      error: error.message
    });
  }
});

// Get services by category
router.get('/category/:category', (req, res) => {
  try {
    const { businessId } = req.query;
    const { category } = req.params;

    if (!businessId) {
      return res.status(400).json({
        error: 'Business ID is required'
      });
    }

    const services = Service.getServicesByCategory(businessId, category);

    res.json({
      services,
      count: services.length,
      category
    });

  } catch (error) {
    console.error('Get services by category error:', error);
    res.status(500).json({
      error: 'Failed to get services by category'
    });
  }
});

// Get all categories for a business
router.get('/categories/all', (req, res) => {
  try {
    const { businessId } = req.query;

    if (!businessId) {
      return res.status(400).json({
        error: 'Business ID is required'
      });
    }

    const categories = Service.getCategoriesByBusiness(businessId);

    res.json({
      categories,
      count: categories.length
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      error: 'Failed to get categories'
    });
  }
});

// Search services
router.get('/search/query', (req, res) => {
  try {
    const { businessId, q } = req.query;

    if (!businessId || !q) {
      return res.status(400).json({
        error: 'Business ID and search query are required'
      });
    }

    const services = Service.searchServices(businessId, q);

    res.json({
      services,
      count: services.length,
      query: q
    });

  } catch (error) {
    console.error('Search services error:', error);
    res.status(500).json({
      error: 'Failed to search services'
    });
  }
});

// Get service statistics (business owner only)
router.get('/stats/overview', authMiddleware, requireBusinessOwner, (req, res) => {
  try {
    const stats = Service.getServiceStats(req.user.userId);

    res.json({ stats });

  } catch (error) {
    console.error('Get service stats error:', error);
    res.status(500).json({
      error: 'Failed to get service statistics'
    });
  }
});

// Get popular services (business owner only)
router.get('/popular/list', authMiddleware, requireBusinessOwner, (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const services = Service.getPopularServices(req.user.userId, parseInt(limit));

    res.json({
      services,
      count: services.length
    });

  } catch (error) {
    console.error('Get popular services error:', error);
    res.status(500).json({
      error: 'Failed to get popular services'
    });
  }
});

// Bulk update services (business owner only)
router.put('/bulk/update', [
  authMiddleware,
  requireBusinessOwner,
  body('updates')
    .isArray()
    .withMessage('Updates must be an array')
    .custom((updates) => {
      if (updates.length === 0) {
        throw new Error('Updates array cannot be empty');
      }
      return true;
    })
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

    const { updates } = req.body;
    const results = Service.bulkUpdateServices(req.user.userId, updates);

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    res.json({
      message: `Bulk update completed. ${successCount} successful, ${failureCount} failed.`,
      results,
      summary: {
        total: results.length,
        successful: successCount,
        failed: failureCount
      }
    });

  } catch (error) {
    console.error('Bulk update services error:', error);
    res.status(400).json({
      error: error.message
    });
  }
});

// Get service availability
router.get('/:id/availability', (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        error: 'Date parameter is required'
      });
    }

    const availability = Service.getServiceAvailability(null, id, date);

    res.json({ availability });

  } catch (error) {
    console.error('Get service availability error:', error);
    res.status(400).json({
      error: error.message
    });
  }
});

module.exports = router; 