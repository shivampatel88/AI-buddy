import { Router } from 'express';
import { body } from 'express-validator';
import { summarize, flashcards, summarizeStream } from '../controllers/AiController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();
const validateText = [
    body('text', 'Text content is required and cannot be empty').notEmpty()
];

router.post('/summarize', authMiddleware, validateText, summarize);
router.post('/flashcards', authMiddleware, validateText, flashcards);

router.post('/summarizeStream', authMiddleware, validateText, summarizeStream);

export default router;