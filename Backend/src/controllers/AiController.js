import { callLLM,callStream } from "../utils/llmProvider.js";
import Flashcard from "../models/Flashcard.js";
import User from "../models/User.js";

export async function summarize(req, res) {
  try {
    const { text } = req.body;
    const prompt = `You are an expert study assistant. Create a well-structured, easy-to-read summary of the following text.
    
    Rules:
    1. Use H2 (##) for main sections.
    2. Use bullet points for details.
    3. Use **Bold** for key terms.
    4. Keep paragraphs short and add spacing between sections.
    
    TEXT:
    ${text}`;
    const summary = await callLLM(prompt);
    res.json({ summary });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function flashcards(req, res) {
  try {
    const { text, count = 10 } = req.body;
    const userId = req.user; // from authMiddleware
    
    // Prompt Gemini for flashcards
    const prompt = `Create ${count} flashcards. Return a JSON array of objects with keys "q" (question) and "a" (answer). Content:\n${text}`;

    const raw = await callLLM(prompt, { responseMimeType: "application/json" });
    const cards = JSON.parse(raw);
    
    // Prepare documents to be saved
    const flashcardDocs = cards.map(c => ({
      user: userId,
      question: c.q,
      answer: c.a
    }));

    // Bulk insert the flashcards
    const savedCards = await Flashcard.insertMany(flashcardDocs);
    const cardIds = savedCards.map(c => c._id);

    // Link flashcards to the user
    await User.findByIdAndUpdate(userId, {
      $push: { flashcards: { $each: cardIds } }
    });

    res.json({ cards: savedCards });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}

export async function summarizeStream(req, res) {
   try {
        const { text } = req.body;
        const prompt = `You are an expert study assistant. Create a well-structured, easy-to-read summary of the following text.
        
        Rules:
        1. Use H2 (##) for main sections.
        2. Use bullet points for details.
        3. Use **Bold** for key terms.
        4. Keep paragraphs short and add spacing between sections.
        
        TEXT:
        ${text}`;
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        const stream = await callStream(prompt);
        for await (const chunk of stream) {
            res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        }
        res.write("data: [DONE]\n\n");
        res.end();
    } catch (e) {
        console.error("Streaming error:", e);
        // If headers are already sent, we can't send a 500 status easily, 
        // so we send an error event via SSE
        res.write(`data: ${JSON.stringify({ error: e.message })}\n\n`);
        res.end();
    }
}

