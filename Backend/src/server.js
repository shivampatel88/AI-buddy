import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { globalErrorHandler } from './middlewares/errorHandler.js';
import mongoose from 'mongoose';
import winston from 'winston';

import authRoutes from './routes/authRoutes.js';
import notesRoutes from './routes/notesRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import quizRoutes from './routes/quizRoutes.js';

const app = express();

app.use(express.json({ limit: '30mb' }))
const allowedOrigins = ['http://localhost:5173', 'https://ai-buddy-smoky.vercel.app/'];

app.use(cors({
    origin: function (origin, callback) {

        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/quizzes', quizRoutes);

app.use(globalErrorHandler);  // Global Error Handler

const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI)
    .then(() => {
        winston.info("Connected to MongoDB");
    })
    .catch((err) => winston.error("Mongoose error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
    console.log(`server running on port: ${PORT}`)
);