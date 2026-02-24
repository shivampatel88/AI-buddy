import { callLLM,callStream } from "../utils/llmProvider.js";

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
    const prompt = `Create ${count} flashcards. Return a JSON array of objects with keys "q" (question) and "a" (answer). Content:\n${text}`;

    const raw = await callLLM(prompt, { responseMimeType: "application/json" });
    const cards = JSON.parse(raw);
    res.json({ cards });
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

