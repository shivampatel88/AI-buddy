import axios from 'axios';

const PROVIDERS = {
    GEMINI : async({prompt}) => {
        const API_KEY = process.env.GEMINI_API_KEY;
        const MODEL = process.env.GEMINI_MODEL;
        const res = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
{ contents: [{ parts: [{ text: prompt }] }] }
);
return res.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    }
}

export async function callLLM(prompt) {
const provider = process.env.LLM_PROVIDER ;
const fn = PROVIDERS[provider];
if (!fn) throw new Error(`Unknown LLM provider: ${provider}`);
return fn({ prompt });
}
