const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authMiddleware, requireBusinessOwner } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, and PDF files are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only one file per request
  }
});

// Upload payment proof
router.post('/payment-proof', upload.single('proofFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded'
      });
    }

    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      uploadedAt: new Date().toISOString()
    };

    res.json({
      message: 'File uploaded successfully',
      file: fileInfo
    });

  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({
      error: 'Failed to upload file'
    });
  }
});

// Upload business logo
router.post('/logo', [
  authMiddleware,
  requireBusinessOwner,
  upload.single('logoFile')
], (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded'
      });
    }

    // Validate file type for logo
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedImageTypes.includes(req.file.mimetype)) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: 'Invalid file type. Only JPG and PNG files are allowed for logos.'
      });
    }

    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      uploadedAt: new Date().toISOString()
    };

    res.json({
      message: 'Logo uploaded successfully',
      file: fileInfo
    });

  } catch (error) {
    console.error('Logo upload error:', error);
    res.status(500).json({
      error: 'Failed to upload logo'
    });
  }
});

// Get uploaded file
router.get('/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    const filePath = path.join(uploadPath, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: 'File not found'
      });
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    const fileSize = stats.size;
    const ext = path.extname(filename).toLowerCase();

    // Set appropriate headers
    res.setHeader('Content-Length', fileSize);
    res.setHeader('Content-Type', getContentType(ext));
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('File download error:', error);
    res.status(500).json({
      error: 'Failed to download file'
    });
  }
});

// Delete uploaded file
router.delete('/:filename', authMiddleware, requireBusinessOwner, (req, res) => {
  try {
    const { filename } = req.params;
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    const filePath = path.join(uploadPath, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: 'File not found'
      });
    }

    // Delete file
    fs.unlinkSync(filePath);

    res.json({
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({
      error: 'Failed to delete file'
    });
  }
});

// Get file info
router.get('/info/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    const filePath = path.join(uploadPath, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: 'File not found'
      });
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    const ext = path.extname(filename).toLowerCase();

    const fileInfo = {
      filename,
      originalName: filename,
      mimetype: getContentType(ext),
      size: stats.size,
      uploadedAt: stats.birthtime.toISOString(),
      lastModified: stats.mtime.toISOString()
    };

    res.json({
      file: fileInfo
    });

  } catch (error) {
    console.error('Get file info error:', error);
    res.status(500).json({
      error: 'Failed to get file info'
    });
  }
});

// Helper function to get content type
function getContentType(ext) {
  const contentTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.pdf': 'application/pdf'
  };
  
  return contentTypes[ext] || 'application/octet-stream';
}

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large. Maximum size is 5MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Too many files. Only one file allowed per request.'
      });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      error: error.message
    });
  }
  
  console.error('Upload error:', error);
  res.status(500).json({
    error: 'File upload failed'
  });
});

module.exports = router; 