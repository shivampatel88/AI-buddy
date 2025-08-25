import { Router } from 'express';
import { summarize, flashcards, quiz } from '../controllers/AiController.js';


const router = Router();
router.post('/summarize', summarize);
router.post('/flashcards', flashcards);
router.post('/quiz', quiz);
export default router;