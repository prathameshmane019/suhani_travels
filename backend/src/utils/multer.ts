import multer from 'multer';
import express from 'express';
// Multer configuration for memory storage (no local file storage needed)
const storage = multer.memoryStorage();
export const  upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit (Cloudinary will compress)
  },
  fileFilter: (_req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Check file type
    const allowedMimeTypes = [
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'image/webp', 
      'image/gif',
      'image/bmp',
      'image/tiff'
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  }
});

// Middleware to handle multer errors
export const handleMulterError = (
  err: any, 
  req: express.Request, 
  res: express.Response, 
  next: express.NextFunction
) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};