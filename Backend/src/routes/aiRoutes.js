import { Router } from 'express';
import { summarize, flashcards, quiz } from '../controllers/AiController.js';
import {body} from 'express-validator';
import { authMiddleware } from '../middlewares/auth.js';

// We apply the authMiddleware to every AI route in order to protect them all.
// In order to make sure the request body contains non-empty text, we also validate it.

const router = Router();
router.post('/summarize', authMiddleware,[body('text', 'Text content is required and cannot be empty').notEmpty()],summarize);
router.post('/flashcards', authMiddleware,[body('text', 'Text content is required and cannot be empty').notEmpty()],flashcards);
router.post('/quiz', authMiddleware,[body('text', 'Text content is required and cannot be empty').notEmpty()],quiz);

export default router;