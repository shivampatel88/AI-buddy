import { Router } from 'express';
import { generateQuiz, getUserQuizzes, submitQuiz } from '../controllers/quizController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();
router.post('/generate', authMiddleware, generateQuiz);
router.get('/', authMiddleware, getUserQuizzes);
router.post('/submit', authMiddleware, submitQuiz);

export default router;