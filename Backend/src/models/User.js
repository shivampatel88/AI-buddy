import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  notes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note"
    }],
  quizzes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz"
    }]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
