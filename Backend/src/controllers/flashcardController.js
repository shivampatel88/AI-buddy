import Flashcard from "../models/Flashcard.js";

// GET /api/flashcards/due
export const getDueFlashcards = async (req, res) => {
  try {
    const userId = req.user;
    const now = new Date();
    
    // Fetch cards where nextReviewDate <= now
    const dueCards = await Flashcard.find({
      user: userId,
      nextReviewDate: { $lte: now }
    }).sort({ nextReviewDate: 1 });
    
    res.json({ cards: dueCards });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/flashcards/review
export const reviewFlashcard = async (req, res) => {
  try {
    const { cardId, rating } = req.body; // rating is 0 (Hard), 1 (Good), or 2 (Easy)
    const userId = req.user;

    const card = await Flashcard.findOne({ _id: cardId, user: userId });
    if (!card) {
      return res.status(404).json({ error: "Flashcard not found" });
    }

    // Apply SM-2 Math
    let { repetition, interval, easeFactor } = card;

    if (rating === 0) { // Hard
      repetition = 0;
      interval = 1;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
    } else if (rating === 1) { // Good
      repetition += 1;
      interval = (repetition === 1) ? 1 : (repetition === 2) ? 6 : Math.round(interval * easeFactor);
      // easeFactor unchanged
    } else if (rating === 2) { // Easy
      repetition += 1;
      interval = (repetition === 1) ? 1 : (repetition === 2) ? 6 : Math.round(interval * easeFactor);
      easeFactor += 0.15;
    } else {
      return res.status(400).json({ error: "Invalid rating" });
    }

    // Calculate new nextReviewDate
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);

    // Update document
    card.repetition = repetition;
    card.interval = interval;
    card.easeFactor = easeFactor;
    card.nextReviewDate = nextReviewDate;

    await card.save();

    res.json({ card, message: "Review processed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
