import User from '../models/User.js';
import zod from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const signupSchema = zod.object({
  firstname: zod.string().min(2, "First name must be at least 2 characters").max(30, "First name is too long"),
  lastname: zod.string().min(2, "Last name must be at least 2 characters").max(50, "Last name is too long"),
  email: zod.email("Invalid email address"),
  password: zod.string().min(8, "Password must be at least 8 characters long")
});

export const signup = async (req, res) => {

  const result = signupSchema.safeParse(req.body);
  if (!result.success) {
    const errorMsg = result.error.errors.map(e => e.message).join(". ");
    return res.status(400).json({ message: errorMsg });
  }

  const parsed = result.data;

  try {
    let existinguser = await User.findOne({ email: parsed.email });
    if (existinguser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const user = new User(parsed);
    user.password = await bcrypt.hash(parsed.password, 10);
    await user.save();

    jwt.sign({ id: user._id }, process.env.JWT_SECRET, (err, token) => {
      if (err) throw err;
      res.status(201).json({ token, message: "Signup successful" });
    }
    );

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).send('Server error');
  }
};

const LoginSchema = zod.object({
  email: zod.email(),
  password: zod.string().min(8, "Password must be at least 8 characters long")
})

export const login = async (req, res) => {
  const result = LoginSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ message: "Invalid credentials." });
  }

  const { email, password } = result.data;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'user not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    jwt.sign({ id: user._id }, process.env.JWT_SECRET, (err, token) => {
      if (err) {
        return res.status(500).json({ message: "Token generation failed" });
      }
      return res.json({ token, message: "Login successful" });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};