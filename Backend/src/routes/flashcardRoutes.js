import { Router } from 'express';
import { getDueFlashcards, reviewFlashcard } from '../controllers/flashcardController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.get('/due', authMiddleware, getDueFlashcards);
router.post('/review', authMiddleware, reviewFlashcard);

export default router;
