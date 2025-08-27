import { Router } from 'express';
import { uploadPDF, uploadMiddleware, getNotes } from '../controllers/notesController.js';
import { authMiddleware } from '../middlewares/auth.js'; 

const router = Router();

router.get('/', authMiddleware, getNotes);
router.post('/upload', authMiddleware,uploadMiddleware, uploadPDF);
export default router;

// 'authMiddleware' is added before the controller to check if the token is valid, uploadPDF will be called after req.user has been filled in. Otherwise, a 401 Unauthorized error will be sent by the middleware.