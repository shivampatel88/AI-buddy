import Quiz from "../models/Quiz.js";
import Quizresults from "../models/Quizresults.js";
import { callLLM } from "../utils/llmProvider.js";

export const generateQuiz = async (req, res) => {
  try {
    const { noteId, notesText, count } = req.body;
    if (!notesText) return res.status(400).json({ message: "Notes text is required" });

    const prompt = `Generate ${count} multiple-choice questions. 
    Return a JSON array of objects: 
    [{"question": "...", "options": ["A", "B", "C", "D"], "answer": "The correct option string", "explanation": "Why it's correct"}]
    
    TEXT:
    ${notesText}`;
    const raw = await callLLM(prompt, { responseMimeType: "application/json" });
    const quizData = JSON.parse(raw);

    const quiz = new Quiz({
      user: req.user,
      noteId,
      questions: quizData,
    });
    await quiz.save();

    res.status(201).json({ message: "Quiz generated successfully", quiz });
  } catch (error) {
    console.error("Error generating quiz:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ user: req.user }).populate("noteId");
    res.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { quizId, userAnswers } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found.' });

    let score = 0;

    for (const question of quiz.questions) {
      const userAnswer = userAnswers.find(ua => ua.questionId === question._id.toString());

      if (userAnswer && userAnswer.answer === question.answer) {
        score++;
      }
    }

    const result = new Quizresults({
      user: req.user,
      quiz: quizId,
      score: score,
      totalQuestions: quiz.questions.length,
    });
    await result.save();

    res.status(200).json({
      message: 'Quiz submitted successfully!',
      score: result.score,
      totalQuestions: result.totalQuestions,
    });

  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'Server error' });
  }
};