import { Router } from 'express';
import { generateQuiz, getUserQuizzes, submitQuiz } from '../controllers/quizController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.use(authMiddleware);

router.post('/generate', generateQuiz);
router.get('/', getUserQuizzes);
router.post('/submit', submitQuiz); s

export default router;