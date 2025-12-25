import React, { useState } from 'react';
import apiClient from '../services/api';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Layers } from 'lucide-react';
import { handleApiError } from '../utils/errorHandler';

export default function FlashcardView({ textContent }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [count, setCount] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setCards([]);
    try {
      const response = await apiClient.post('/ai/flashcards', { text: textContent, count });
      setCards(response.data.cards);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (err) {
      handleApiError(err, setError, 'Failed to generate flashcards.');
    } finally {
      setLoading(false);
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

  const handleNext = () => {
    if (isFlipped) {
      setIsFlipped(false);
    }
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const handlePrev = () => {
    if (isFlipped) {
      setIsFlipped(false);
    }
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
      <style>{`
        .flashcard-container {
          perspective: 1000px;
        }
        .flashcard {
          transform-style: preserve-3d; 
        }
        .flashcard-face {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .flashcard-back {
          transform: rotateY(180deg);
        }`}</style>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Flashcards</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={count}
            onChange={handleCountChange}
            className="w-20 p-2 border border-slate-300 rounded-md" />
          <button onClick={handleGenerate} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-sm hover:bg-purple-700 disabled:bg-purple-400 transition">
            <Layers size={16} />
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>

      {loading && <p className="mt-4 text-slate-500">AI is creating your flashcards...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {cards.length > 0 && (
        <>
          <div className="flashcard-container h-[400px] cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
            <motion.div
              className="flashcard relative w-full h-full"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 15 }}>

              <div className="flashcard-face absolute w-full h-full flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-indigo-100 shadow-lg bg-gradient-to-br from-indigo-50/80 to-white text-indigo-900">
                <span className="absolute top-4 left-4 text-xs font-bold tracking-wider text-indigo-400 uppercase">Question</span>
                <p className="text-2xl font-bold leading-relaxed">{cards[currentIndex]?.q}</p>
                <p className="absolute bottom-4 text-sm text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">👆 Click to Reveal Answer</p>
              </div>

              <div className="flashcard-back flashcard-face absolute w-full h-full flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-emerald-100 shadow-lg bg-gradient-to-br from-emerald-50/80 to-white text-emerald-900">
                <span className="absolute top-4 left-4 text-xs font-bold tracking-wider text-emerald-500 uppercase">Answer</span>
                <p className="text-xl font-medium leading-relaxed">{cards[currentIndex]?.a}</p>
              </div>
            </motion.div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all duration-300 ease-out"
                style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="p-3 rounded-full hover:bg-slate-100 text-slate-600 transition hover:text-indigo-600 hover:scale-110 active:scale-95"
              >
                <ArrowLeft size={20} />
              </button>
              <p className="font-semibold text-slate-500 text-sm">
                Card <span className="text-indigo-600">{currentIndex + 1}</span> of {cards.length}
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="p-3 rounded-full hover:bg-slate-100 text-slate-600 transition hover:text-indigo-600 hover:scale-110 active:scale-95"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
