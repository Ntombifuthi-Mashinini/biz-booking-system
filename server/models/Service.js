class Service {
  constructor() {
    this.services = [];
  }

  // Create a new service
  createService(serviceData) {
    const {
      businessId,
      name,
      description,
      duration,
      price,
      category,
      isActive = true
    } = serviceData;

    // Validate service data
    this.validateServiceData(serviceData);

    // Check if service name already exists for this business
    const existingService = this.services.find(
      service => service.businessId === businessId && 
                 service.name.toLowerCase() === name.toLowerCase() &&
                 service.isActive
    );

    if (existingService) {
      throw new Error('Service with this name already exists');
    }

    const service = {
      id: this.generateId(),
      businessId,
      name,
      description: description || '',
      duration, // in minutes
      price,
      category: category || 'General',
      isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.services.push(service);
    return service;
  }

  // Get all services for a business
  getServicesByBusiness(businessId, includeInactive = false) {
    let services = this.services.filter(service => service.businessId === businessId);
    
    if (!includeInactive) {
      services = services.filter(service => service.isActive);
    }

    return services.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Get service by ID
  getServiceById(id) {
    return this.services.find(service => service.id === id);
  }

  // Update service
  updateService(id, businessId, updateData) {
    const serviceIndex = this.services.findIndex(
      service => service.id === id && service.businessId === businessId
    );

    if (serviceIndex === -1) {
      throw new Error('Service not found');
    }

    // Check if new name conflicts with existing service
    if (updateData.name) {
      const existingService = this.services.find(
        service => service.businessId === businessId && 
                   service.name.toLowerCase() === updateData.name.toLowerCase() &&
                   service.id !== id &&
                   service.isActive
      );

      if (existingService) {
        throw new Error('Service with this name already exists');
      }
    }

    // Update allowed fields
    const allowedFields = ['name', 'description', 'duration', 'price', 'category', 'isActive'];
    const updatedService = { ...this.services[serviceIndex] };

    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        updatedService[field] = updateData[field];
      }
    });

    updatedService.updatedAt = new Date().toISOString();
    this.services[serviceIndex] = updatedService;

    return updatedService;
  }

  // Delete service (soft delete)
  deleteService(id, businessId) {
    const service = this.services.find(
      service => service.id === id && service.businessId === businessId
    );

    if (!service) {
      throw new Error('Service not found');
    }

    service.isActive = false;
    service.updatedAt = new Date().toISOString();

    return { message: 'Service deleted successfully' };
  }

  // Get services by category
  getServicesByCategory(businessId, category) {
    return this.services.filter(
      service => service.businessId === businessId && 
                 service.category === category && 
                 service.isActive
    );
  }

  // Get all categories for a business
  getCategoriesByBusiness(businessId) {
    const categories = new Set();
    this.services
      .filter(service => service.businessId === businessId && service.isActive)
      .forEach(service => categories.add(service.category));
    
    return Array.from(categories).sort();
  }

  // Search services
  searchServices(businessId, searchTerm) {
    const term = searchTerm.toLowerCase();
    return this.services.filter(
      service => service.businessId === businessId && 
                 service.isActive &&
                 (service.name.toLowerCase().includes(term) ||
                  service.description.toLowerCase().includes(term) ||
                  service.category.toLowerCase().includes(term))
    );
  }

  // Get service statistics
  getServiceStats(businessId) {
    const businessServices = this.services.filter(service => service.businessId === businessId);
    
    const stats = {
      total: businessServices.length,
      active: businessServices.filter(service => service.isActive).length,
      inactive: businessServices.filter(service => !service.isActive).length,
      categories: this.getCategoriesByBusiness(businessId).length,
      averagePrice: businessServices.length > 0 
        ? businessServices.reduce((sum, service) => sum + service.price, 0) / businessServices.length 
        : 0,
      averageDuration: businessServices.length > 0 
        ? businessServices.reduce((sum, service) => sum + service.duration, 0) / businessServices.length 
        : 0
    };

    return stats;
  }

  // Get popular services (by booking count - would need booking data)
  getPopularServices(businessId, limit = 5) {
    // This would typically query booking data to determine popularity
    // For now, return services sorted by creation date
    return this.services
      .filter(service => service.businessId === businessId && service.isActive)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }

  // Bulk update services
  bulkUpdateServices(businessId, updates) {
    const results = [];
    
    updates.forEach(update => {
      try {
        const updatedService = this.updateService(update.id, businessId, update.data);
        results.push({ id: update.id, success: true, data: updatedService });
      } catch (error) {
        results.push({ id: update.id, success: false, error: error.message });
      }
    });

    return results;
  }

  // Validate service data
  validateServiceData(serviceData) {
    const { businessId, name, duration, price } = serviceData;

    if (!businessId || !name || !duration || !price) {
      throw new Error('Business ID, name, duration, and price are required');
    }

    if (name.trim().length < 2) {
      throw new Error('Service name must be at least 2 characters long');
    }

    if (duration <= 0) {
      throw new Error('Duration must be greater than 0');
    }

    if (duration > 480) { // 8 hours max
      throw new Error('Duration cannot exceed 8 hours');
    }

    if (price < 0) {
      throw new Error('Price cannot be negative');
    }

    if (price > 10000) { // $10,000 max
      throw new Error('Price cannot exceed $10,000');
    }

    return true;
  }

  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Get service availability for a specific date
  getServiceAvailability(businessId, serviceId, date) {
    const service = this.getServiceById(serviceId);
    if (!service || service.businessId !== businessId || !service.isActive) {
      throw new Error('Service not found or inactive');
    }

    // This would typically integrate with working hours and existing bookings
    // For now, return a basic availability structure
    return {
      serviceId,
      date,
      duration: service.duration,
      availableSlots: this.generateTimeSlots(date, service.duration)
    };
  }

  // Generate time slots for a service
  generateTimeSlots(date, duration) {
    const slots = [];
    const startTime = moment(date).hour(9).minute(0); // 9 AM start
    const endTime = moment(date).hour(17).minute(0); // 5 PM end

    let currentTime = startTime.clone();
    while (currentTime.isBefore(endTime)) {
      slots.push({
        time: currentTime.format('HH:mm'),
        available: true
      });
      currentTime.add(duration, 'minutes');
    }

    return slots;
  }
}

module.exports = new Service(); 