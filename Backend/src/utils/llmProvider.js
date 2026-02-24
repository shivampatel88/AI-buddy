import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());

export async function callLLM(prompt, config = {}) {
    try {
        const model = genAI.getGenerativeModel({
            model: process.env.GEMINI_MODEL.trim(),
            generationConfig: config
        });

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Gemini SDK Error:", error);
        throw new Error("Failed to generate content");
    }
}

export async function callStream(prompt, config = {}){
    try{
        const model = genAI.getGenerativeModel({
            model: process.env.GEMINI_MODEL.trim(),
            generationConfig: config
        });

        const result = await model.generateContentStream(prompt);
        return result.stream;
    }catch(error){
        console.error("Gemini SDK Error:", error);
        throw new Error("Failed to generate content");
    }
}
