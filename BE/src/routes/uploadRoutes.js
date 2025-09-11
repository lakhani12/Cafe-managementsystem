import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { uploadImage } from '../middlewares/upload.js';

const router = Router();

// Admin-only image upload
router.post(
  '/image',
  requireAuth,
  requireRole('admin'),
  uploadImage.single('image'),
  (req, res, next) => {
    try {
      if (!req.file) return res.status(400).json({ success: false, message: 'No image uploaded' });
      const filename = req.file.filename;
      const url = `/uploads/${filename}`;
      return res.status(201).json({ success: true, url, filename });
    } catch (err) {
      // Handle Multer file size limit error gracefully
      if (err && err.code === 'LIMIT_FILE_SIZE') {
        return res
          .status(413)
          .json({
            success: false,
            message: `File too large. Max ${process.env.UPLOAD_MAX_MB || 5}MB`,
          });
      }
      next(err);
    }
  }
);

export default router;
