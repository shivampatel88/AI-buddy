import { callLLM } from '../utils/llmProvider.js';

export async function summarize(req, res) {
try {
const { text } = req.body;
const prompt = `You are an expert study assistant. Summarize the following text into precise bullet points, max 12, keep terminology intact.\n\nTEXT:\n${text}`;
const summary = await callLLM(prompt);
res.json({ summary });
} catch (e) { res.status(500).json({ error: e.message }); }
}

export async function flashcards(req, res) {
try {
const { text, count = 10 } = req.body;
const prompt = `Create ${count} concise flashcards (Q/A). Return JSON array of objects like {"q":"...","a":"..."}.\n\nTEXT:\n${text}`;
const raw = await callLLM(prompt);
const match = raw.match(/\[([\s\S]*)\]/);
const safe = match ? match[0] : '[]';
const cards = JSON.parse(safe);
res.json({ cards });
} catch (e) { res.status(500).json({ error: e.message }); }
}

export async function quiz(req, res) {
try {
const { text, count = 8 } = req.body;
const prompt = `Generate ${count} MCQs from the TEXT. Each item: {"question":"...","options":["A","B","C","D"],"answer":"B","explanation":"..."}. Only JSON array, no prose.\n\nTEXT:\n${text}`;
const raw = await callLLM(prompt);
const match = raw.match(/\[([\s\S]*)\]/);
const safe = match ? match[0] : '[]';
const questions = JSON.parse(safe);
res.json({ questions });
} catch (e) { res.status(500).json({ error: e.message }); }
}