import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { CheckSquare } from 'lucide-react';
import { handleApiError } from '../utils/errorHandler.js';

export default function QuizView({ textContent, noteId, initialQuiz = null }) {
  const [quiz, setQuiz] = useState(initialQuiz);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [count, setCount] = useState(10);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (initialQuiz) {
      setQuiz(initialQuiz);
      setScore(0);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setQuizFinished(false);
    }
  }, [initialQuiz]);

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
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (option) => {
    if (selectedAnswers[currentQuestionIndex]) return;

    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: option,
    });
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    } else {
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

  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const isAnswered = !!selectedAnswers[currentQuestionIndex];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Quiz</h3>
        {!quiz && (
          <div className="flex items-center gap-2">
            <input type="number" value={count} onChange={handleCountChange} min="1" className="w-20 p-2 border border-slate-300 rounded-md" />
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
          <h4 className="text-xl font-semibold mb-4">{currentQuestion.question}</h4>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === option;
              const isCorrect = option === currentQuestion.answer;


              let buttonStyle = "bg-slate-50 border-slate-200 hover:bg-slate-100";

              if (isAnswered) {
                if (isSelected) {
                  buttonStyle = isCorrect ? "bg-green-100 border-green-500 text-green-700" : "bg-red-100 border-red-500 text-red-700";
                } else if (isCorrect) {
                  buttonStyle = "bg-green-50 border-green-200 text-green-600 opacity-70";
                } else {
                  buttonStyle = "opacity-50 cursor-not-allowed";
                }
              } else if (isSelected) {
                buttonStyle = "bg-indigo-100 border-indigo-500";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={isAnswered}
                  className={`w-full text-left p-3 rounded-lg border-2 transition ${buttonStyle}`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-6">
            {isAnswered && (
              <button
                onClick={() => setShowExplanation(true)}
                className="text-indigo-600 font-semibold hover:underline"
              >
                💡 Explain Why!!
              </button>
            )}

            <button
              onClick={handleNextQuestion}
              disabled={!isAnswered}
              className="ml-auto px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg disabled:bg-slate-400"
            >
              {currentQuestionIndex < quiz.questions.length - 1 ? 'Next' : 'Finish'}
            </button>
          </div>
        </div>
      )}

      {showExplanation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowExplanation(false)}>
          <div
            className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full transform transition-all scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-slate-800 mb-2">Explanation 🤓</h3>
            <p className="text-slate-600 leading-relaxed">
              {currentQuestion.explanation || "No explanation provided for this question."}
            </p>
            <button
              onClick={() => setShowExplanation(false)}
              className="mt-6 w-full py-2 bg-indigo-100 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-200"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}