import React, { useState } from 'react';
import apiClient from '../services/api';
import { CheckSquare } from 'lucide-react';

export default function QuizView({ textContent, noteId }) {
  const [quiz, setQuiz] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [count, setCount] = useState(5);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setQuiz(null);
    setQuizFinished(false);
    setSelectedAnswers({});
    try {
      // Use the dedicated quiz generation endpoint, passing the noteId
      const response = await apiClient.post('/quizzes/generate', {
        notesText: textContent,
        noteId: noteId,
        count: count,
      });
      setQuiz(response.data.quiz); // Save the entire quiz object
      setCurrentQuestionIndex(0);
    } catch {
      setError('Failed to generate quiz.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: option,
    });
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // --- Finish and Submit the quiz ---
      let finalScore = 0;
      const userAnswers = quiz.questions.map((q, index) => {
        if (selectedAnswers[index] === q.answer) {
          finalScore++;
        }
        return { questionId: q._id, answer: selectedAnswers[index] };
      });
      
      setScore(finalScore);
      setQuizFinished(true);

      // --- Use noteId to submit the score to the backend ---
      try {
        await apiClient.post('/quizzes/submit', {
          quizId: quiz._id, // Use the ID from the generated quiz
          userAnswers: userAnswers,
        });
      } catch (err) {
        // Optionally, show an error if submission fails
        console.error("Failed to submit quiz results.", err);
      }
    }
  };
  
  if (quizFinished) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 text-center">
            <h3 className="text-2xl font-bold">Quiz Complete!</h3>
            <p className="text-4xl font-bold my-4">{score} / {quiz.questions.length}</p>
            <button onClick={handleGenerate} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg">
                Take Again
            </button>
        </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Quiz</h3>
        {!quiz && (
            <div className="flex items-center gap-2">
                <input type="number" value={count} onChange={(e) => setCount(parseInt(e.target.value, 10))} className="w-20 p-2 border border-slate-300 rounded-md"/>
                <button onClick={handleGenerate} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-sm hover:bg-green-700 disabled:bg-green-400 transition">
                    <CheckSquare size={16} />
                    {loading ? 'Generating...' : 'Start Quiz'}
                </button>
            </div>
        )}
      </div>

      {loading && <p>Generating your quiz...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {quiz && !quizFinished && (
        <div>
          <p className="text-slate-500 mb-2">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
          <h4 className="text-xl font-semibold mb-4">{quiz.questions[currentQuestionIndex].question}</h4>
          <div className="space-y-3">
            {quiz.questions[currentQuestionIndex].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full text-left p-3 rounded-lg border-2 transition ${
                  selectedAnswers[currentQuestionIndex] === option
                    ? 'bg-indigo-100 border-indigo-500'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            onClick={handleNextQuestion}
            disabled={!selectedAnswers[currentQuestionIndex]}
            className="mt-6 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg disabled:bg-slate-400"
          >
            {currentQuestionIndex < quiz.questions.length - 1 ? 'Next' : 'Finish'}
          </button>
        </div>
      )}
    </div>
  );
}