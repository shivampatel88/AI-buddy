import mongoose from "mongoose";

const flashcardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  repetition: {
    type: Number,
    default: 0
  },
  interval: {
    type: Number,
    default: 1
  },
  easeFactor: {
    type: Number,
    default: 2.5
  },
  nextReviewDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model("Flashcard", flashcardSchema);
