import express from express;
import cors from cors;
import dotenv from dotenv;
import mongoose from mongoose;

import authRoutes from './routes/authRoutes.js';
import notesRoutes from './routes/notesRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import quizRoutes from './routes/quizRoutes.js'; 
dotenv.config();

const app = express();

app.use(express.json({limit : '30mb'}))
app.use(cors({origin : process.env.CLIENT_ORIGIN}));

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/quizzes', quizRoutes);

const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI)
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => console.log("Mongoose error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
    console.log(`server running on port: ${PORT}`)
);