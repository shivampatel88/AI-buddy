import React, { useState } from 'react';
import apiClient from '../services/api';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Layers } from 'lucide-react';

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
    } catch {
      setError('Failed to generate flashcards.');
    } finally {
      setLoading(false);
    }
  };

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
            onChange={(e) => setCount(parseInt(e.target.value, 10))}
            className="w-20 p-2 border border-slate-300 rounded-md"/>
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
          <div className="flashcard-container h-[300px]" onClick={() => setIsFlipped(!isFlipped)}>
            <motion.div
              className="flashcard relative w-full h-full"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.5 }}>
              <div className="flashcard-face absolute w-full h-full flex items-center justify-center p-8 text-center rounded-xl border border-slate-200 shadow-md bg-slate-50 text-slate-800 text-xl font-semibold">
                {cards[currentIndex]?.q}
              </div>
              
              <div className="flashcard-back flashcard-face absolute w-full h-full flex items-center justify-center p-8 text-center rounded-xl border border-slate-200 shadow-md bg-slate-100 text-slate-600">
                {cards[currentIndex]?.a}
              </div>
            </motion.div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <button onClick={handlePrev} className="p-2 rounded-full hover:bg-slate-100"><ArrowLeft /></button>
            <p className="font-semibold">{currentIndex + 1} / {cards.length}</p>
            <button onClick={handleNext} className="p-2 rounded-full hover:bg-slate-100"><ArrowRight /></button>
          </div>
        </>
      )}
    </div>
  );
}
