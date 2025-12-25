import { Router } from 'express';
import { uploadPDF, getNotes, getNoteById } from '../controllers/notesController.js';
import { authMiddleware } from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';

const router = Router();

router.get('/', authMiddleware, getNotes);
router.post('/upload', authMiddleware, upload.single('file'), uploadPDF);
router.get('/:id', authMiddleware, getNoteById);

export default router;

// 'authMiddleware' is added before the controller to check if the token is valid, uploadPDF will be called after req.user has been filled in. Otherwise, a 401 Unauthorized error will be sent by the middleware.