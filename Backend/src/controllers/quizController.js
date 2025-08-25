import Quiz from "../models/Quiz.js";
import { callLLM } from "../utils/llmProvider.js";

export const generateQuiz = async (req, res) => {
  try {
    const { noteId, notesText } = req.body;
    if (!notesText) {
      return res.status(400).json({ message: "Notes text is required" });
    }

    const prompt = `Create 10 multiple-choice quiz questions (with 4 options each, and one correct answer)
      from the following notes:
      ${notesText}

      Format strictly in JSON as:
      [{
          "question": "string",
          "options": ["string1","string2","string3","string4"],
          "answer": "string"
        }]`;

    const llmResponse = await callLLM(prompt);

    let quizData;
    try {
      quizData = JSON.parse(llmResponse);
    } catch (error) {
      return res.status(500).json({
        message: "Failed to parse quiz data from LLM",
        rawResponse: llmResponse,
      });
    }

    const quiz = new Quiz({
      userId: req.user.id,
      noteId,
      questions: quizData,
    });
    await quiz.save();

    res.status(201).json({ message: "Quiz generated successfully", quiz });
  } catch (error) {
    console.error("Error generating quiz:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ userId: req.user.id }).populate("noteId");
    res.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
