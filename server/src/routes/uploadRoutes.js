import { Router } from 'express';
import upload from '../middleware/upload.js';
import { protect, hostOnly } from '../middleware/auth.js';

const router = Router();

router.post(
  '/',
  protect,
  hostOnly,
  upload.single('image'),
  (req, res) => {
    if (!req.file) {
      res.status(400);
      throw new Error('Please select an image');
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    res.status(201).json({
      url: `${baseUrl}/uploads/${req.file.filename}`,
    });
  }
);

export default router;
