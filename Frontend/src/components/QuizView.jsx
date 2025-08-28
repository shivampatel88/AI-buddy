import React, { useState } from 'react';
import apiClient from '../services/api';
import { CheckSquare } from 'lucide-react';

export default function QuizView({ textContent, noteId }) {
  const [quiz, setQuiz] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [count, setCount] = useState(10);
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
      const response = await apiClient.post('/quizzes/generate', {
        notesText: textContent,
        noteId: noteId,
        count: count,
      });
      setQuiz(response.data.quiz); 
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

      try {
        await apiClient.post('/quizzes/submit', {
          quizId: quiz._id, 
          userAnswers: userAnswers,
        });
      } catch (err) {
        console.error("Failed to submit quiz results.", err);
      }
    }
  };
  const handleCountChange = (e) => {
    const value = parseInt(e.target.value, 10);

    // --- THIS IS THE FIX ---
    // If the value is not a number or is less than 1, set it to 1.
    // Otherwise, use the entered value.
    if (isNaN(value) || value < 1) {
      setCount(1);
    } else {
      setCount(value);
    }
  }
  
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
              <input type="number" value={count} min="1" className="w-20 p-2 border border-slate-300 rounded-md"/>
                <button onClick={handleGenerate} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-sm hover:bg-green-700 disabled:bg-green-400 transition">
                    <CheckSquare size={16} />
                    {loading ? 'Generating...' : 'Start Quizz'}
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