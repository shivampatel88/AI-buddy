import { Router } from 'express';
import { uploadPDF, uploadMiddleware } from '../controllers/notesController.js';
import { authMiddleware } from '../middlewares/auth.js'; // <-- Import auth middleware

const router = Router();
router.post('/upload', authMiddleware,uploadMiddleware, uploadPDF);
export default router;

// 'authMiddleware' is added before the controller to check if the token is valid, uploadPDF will be called after req.user has been filled in. Otherwise, a 401 Unauthorized error will be sent by the middleware.