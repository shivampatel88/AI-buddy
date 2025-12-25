# AI Study Buddy

AI Study Buddy is a web application designed to help students study more effectively by leveraging Artificial Intelligence. Users can upload their study notes (PDFs), and the application uses the Gemini API to automatically generate concise summaries, interactive flashcards, and practice quizzes. It also tracks quiz history, allowing users to revisit and revise past topics.

## Tech Stack

This project is built using the MERN stack:

*   **Frontend**: React.js, Tailwind CSS, Framer Motion, Lucide React
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB (Mongoose)
*   **AI Integration**: Google Gemini API (@google/generative-ai)
*   **Authentication**: JWT (JSON Web Tokens)
*   **File Handling**: Multer, PDF Parse

## Key Features

*   **Note Management**: Upload and store PDF study notes.
*   **AI Summarization**: Automatically generates structured summaries of uploaded notes.
*   **Flashcards**: Creates interactive study flashcards from note content.
*   **Quiz Generation**: Generates multiple-choice quizzes with customizable question counts.
*   **Instant Feedback**: Provides immediate feedback on quiz answers (Correct/Incorrect) with explanations.
*   **Quiz History**: Tracks all generated quizzes.
*   **Revision Mode**: Allows users to retake past quizzes to reinforce learning.
*   **Dashboard**: Centralized hub for managing notes and accessing study tools.

## Installation & Setup

### Prerequisites

*   Node.js (v14 or higher)
*   MongoDB (Local or Atlas connection string)
*   Google Gemini API Key

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd Backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `Backend` directory with the following variables:
    ```env
    PORT=3000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    GEMINI_API_KEY=your_gemini_api_key
    ```
4.  Start the server:
    ```bash
    npm run dev
    ```

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd Frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

The application should now be running at `http://localhost:5173` (or the port specified by Vite), and the backend API at `http://localhost:3000`.

## API Overview

*   `POST /api/auth/register`: Create a new user account.
*   `POST /api/auth/login`: Authenticate user and receive token.
*   `POST /api/notes/upload`: Upload a PDF note.
*   `GET /api/notes`: Retrieve all user notes.
*   `GET /api/quizzes`: Retrieve user's quiz history.
*   `POST /api/quizzes/generate`: Generate a new quiz from a note.
*   `POST /api/ai/summarize`: Generate a summary for a note.
*   `POST /api/ai/flashcards`: Generate flashcards for a note.


