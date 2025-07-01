const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class User {
  constructor() {
    this.users = [];
  }

  // Create a new business owner account
  async createUser(userData) {
    const { email, password, businessName, ownerName, phone, businessType } = userData;

    // Check if user already exists
    const existingUser = this.users.find(user => user.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user object
    const user = {
      id: this.generateId(),
      email,
      password: hashedPassword,
      businessName,
      ownerName,
      phone,
      businessType,
      role: 'business_owner',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settings: {
        workingHours: {
          monday: { start: '09:00', end: '17:00', isOpen: true },
          tuesday: { start: '09:00', end: '17:00', isOpen: true },
          wednesday: { start: '09:00', end: '17:00', isOpen: true },
          thursday: { start: '09:00', end: '17:00', isOpen: true },
          friday: { start: '09:00', end: '17:00', isOpen: true },
          saturday: { start: '09:00', end: '15:00', isOpen: true },
          sunday: { start: '09:00', end: '15:00', isOpen: false }
        },
        notificationSettings: {
          emailNotifications: true,
          smsNotifications: false,
          reminderTime: 60 // minutes before appointment
        },
        branding: {
          logo: null,
          primaryColor: '#3B82F6',
          secondaryColor: '#1E40AF'
        }
      }
    };

    this.users.push(user);
    return this.sanitizeUser(user);
  }

  // Authenticate user login
  async authenticateUser(email, password) {
    const user = this.users.find(u => u.email === email && u.isActive);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    return this.sanitizeUser(user);
  }

  // Generate JWT token
  generateToken(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      businessName: user.businessName
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Get user by ID
  getUserById(id) {
    const user = this.users.find(u => u.id === id && u.isActive);
    return user ? this.sanitizeUser(user) : null;
  }

  // Update user profile
  updateUser(id, updateData) {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Update allowed fields
    const allowedFields = ['businessName', 'ownerName', 'phone', 'businessType', 'settings'];
    const updatedUser = { ...this.users[userIndex] };

    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        updatedUser[field] = updateData[field];
      }
    });

    updatedUser.updatedAt = new Date().toISOString();
    this.users[userIndex] = updatedUser;

    return this.sanitizeUser(updatedUser);
  }

  // Change password
  async changePassword(id, currentPassword, newPassword) {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    
    user.password = hashedNewPassword;
    user.updatedAt = new Date().toISOString();

    return { message: 'Password updated successfully' };
  }

  // Delete user account
  deleteUser(id) {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    this.users[userIndex].isActive = false;
    this.users[userIndex].updatedAt = new Date().toISOString();

    return { message: 'Account deleted successfully' };
  }

  // Get all users (for admin purposes)
  getAllUsers() {
    return this.users.filter(u => u.isActive).map(user => this.sanitizeUser(user));
  }

  // Sanitize user data (remove sensitive information)
  sanitizeUser(user) {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Validate user data
  validateUserData(userData) {
    const { email, password, businessName, ownerName, phone } = userData;

    if (!email || !password || !businessName || !ownerName || !phone) {
      throw new Error('All required fields must be provided');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    return true;
  }

  // Get user by email
  static getUserByEmail(email) {
    // If using an instance-based array, we need to search all instances
    // But for now, let's assume a singleton pattern or static storage is used
    // For this in-memory model, we'll use a static array
    if (!this._users) this._users = [];
    const user = this._users.find(u => u.email === email && u.isActive);
    return user ? { ...user, password: undefined } : null;
  }
}

module.exports = User; 