import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  questions: [
    {
      question: { type: String, required: true },
      options: [{ type: String, required: true }],
      answer: { type: String, required: true },
      explanation: { type: String, required: true }
    }
  ],
  noteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Note",
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Quiz", quizSchema);
