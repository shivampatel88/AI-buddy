import { Router } from 'express';
import { uploadPDF, uploadMiddleware } from '../controllers/notesController.js';


const router = Router();
router.post('/upload', uploadMiddleware, uploadPDF);
export default router;