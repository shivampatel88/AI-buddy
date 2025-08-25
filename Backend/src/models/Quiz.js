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
      answer: { type: String, required: true }
    }
  ],
  generatedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Note"
  }
}, { timestamps: true });

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
