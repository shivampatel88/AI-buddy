import { callLLM } from "../utils/llmProvider.js";

function extractJson(str) {
  const match = str.match(/\[[\s\S]*\]|{[\s\S]*}/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch (e) {
      console.error("Failed to parse extracted JSON:", e);
      return null;
    }
  }
  return null;
}

export async function summarize(req, res) {
  try {
    const { text } = req.body;
    const prompt = `You are an expert study assistant. Summarize the following text into precise bullet points but keeping the depth of content intact.\n\nTEXT:\n${text}`;
    const summary = await callLLM(prompt);
    res.json({ summary });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function flashcards(req, res) {
  try {
    const { text, count = 10 } = req.body;
    const prompt = `Create ${count} concise flashcards (Q/A). Return ONLY a valid JSON array of objects like {"q":"...","a":"..."}.\n\nTEXT:\n${text}`;
    const raw = await callLLM(prompt);
    const cards = extractJson(raw) || [];
    res.json({ cards });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function quiz(req, res) {
  try {
    const { text, count = 8 } = req.body;
    const prompt = `Generate ${count} MCQs from the TEXT. Each item: {"question":"...","options":["A","B","C","D"],"answer":"B","explanation":"..."}. Only JSON array, no prose.\n\nTEXT:\n${text}`;
    const raw = await callLLM(prompt);
    const questions = extractJson(raw) || [];
    res.json({ questions });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
