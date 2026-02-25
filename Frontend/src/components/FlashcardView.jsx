import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Layers, RefreshCw } from 'lucide-react';
import { handleApiError } from '../utils/errorHandler';

export default function FlashcardView({ textContent }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [count, setCount] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Fetch due cards when component mounts
  useEffect(() => {
    fetchDueCards();
  }, []);

  const fetchDueCards = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.get('/flashcards/due');
      setCards(response.data.cards);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (err) {
      handleApiError(err, setError, 'Failed to fetch due flashcards.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    // Notice we do NOT clear existing cards immediately, we just show loading
    try {
      const response = await apiClient.post('/ai/flashcards', { text: textContent, count });
      // Replace or append generated cards to due cards
      setCards(response.data.cards);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (err) {
      handleApiError(err, setError, 'Failed to generate flashcards.');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (e, rating) => {
    e.stopPropagation(); // prevent flipping the card
    const currentCard = cards[currentIndex];
    
    if (!currentCard || !currentCard._id) return;

    try {
      await apiClient.post('/flashcards/review', { cardId: currentCard._id, rating });
      
      // Remove reviewed card from deck
      const newCards = [...cards];
      newCards.splice(currentIndex, 1);
      setCards(newCards);
      setIsFlipped(false);
      
      // Adjust offset
      if (newCards.length > 0) {
        if (currentIndex >= newCards.length) {
          setCurrentIndex(0);
        }
      } else {
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save review");
    }
  };

  const handleCountChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) {
      setCount(1);
    } else {
      setCount(value);
    }
  };

  const handleNext = () => {
    if (cards.length === 0) return;
    if (isFlipped) setIsFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const handlePrev = () => {
    if (cards.length === 0) return;
    if (isFlipped) setIsFlipped(false);
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
        }
      `}</style>

      <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold">Flashcards</h3>
            <button
                onClick={fetchDueCards}
                className="p-2 text-slate-500 hover:text-indigo-600 transition hover:bg-slate-100 rounded-full"
                title="Refresh Due Cards"
            >
                <RefreshCw size={18} className={loading && !textContent ? "animate-spin" : ""} />
            </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            value={count}
            onChange={handleCountChange}
            disabled={!textContent}
            className="w-20 p-2 border border-slate-300 rounded-md" 
            title="Number of cards to generate"
          />
          <button 
            onClick={handleGenerate} 
            disabled={loading || !textContent} 
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-sm hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition"
          >
            <Layers size={16} />
            {loading ? 'Processing...' : 'Generate New'}
          </button>
        </div>
      </div>

      {loading && <p className="mt-4 text-slate-500">Working...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {!loading && cards.length === 0 && !error && (
        <div className="mt-4 p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500 font-medium">No due flashcards right now! You're all caught up. 🎉</p>
          {textContent && <p className="text-slate-400 text-sm mt-2">Generate some new ones from the text above.</p>}
        </div>
      )}

      {cards.length > 0 && (
        <>
          <div className="flashcard-container h-[400px] cursor-pointer group mt-4" onClick={() => setIsFlipped(!isFlipped)}>
            <motion.div
              className="flashcard relative w-full h-full"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 15 }}>

              {/* Front Face - Question */}
              <div className="flashcard-face absolute w-full h-full flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-indigo-100 shadow-lg bg-gradient-to-br from-indigo-50/80 to-white text-indigo-900">
                <span className="absolute top-4 left-4 text-xs font-bold tracking-wider text-indigo-400 uppercase">Question</span>
                <p className="text-2xl font-bold leading-relaxed">{cards[currentIndex]?.question}</p>
                <p className="absolute bottom-4 text-sm text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">👆 Click to Reveal Answer</p>
              </div>

              {/* Back Face - Answer & Review Buttons */}
              <div className="flashcard-back flashcard-face absolute w-full h-full flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-emerald-100 shadow-lg bg-gradient-to-br from-emerald-50/80 to-white text-emerald-900">
                <span className="absolute top-4 left-4 text-xs font-bold tracking-wider text-emerald-500 uppercase">Answer</span>
                
                <div className="flex-1 flex flex-col justify-center overflow-y-auto w-full px-4 pt-12 pb-20">
                    <p className="text-xl font-medium leading-relaxed">{cards[currentIndex]?.answer}</p>
                </div>
                
                <div className="absolute bottom-6 flex gap-3 w-full justify-center px-4">
                  <button 
                    onClick={(e) => handleReview(e, 0)} 
                    className="flex-1 max-w-[120px] py-2.5 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg shadow-sm transition active:scale-95"
                  >
                    Hard
                  </button>
                  <button 
                    onClick={(e) => handleReview(e, 1)} 
                    className="flex-1 max-w-[120px] py-2.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-semibold rounded-lg shadow-sm transition active:scale-95"
                  >
                    Good
                  </button>
                  <button 
                    onClick={(e) => handleReview(e, 2)} 
                    className="flex-1 max-w-[120px] py-2.5 bg-green-100 hover:bg-green-200 text-green-700 font-semibold rounded-lg shadow-sm transition active:scale-95"
                  >
                    Easy
                  </button>
                </div>
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
