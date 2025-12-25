import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

export async function extractTextFromPDF(buffer) {
    try {
        const data = await pdf(buffer); //Load PDF, Read pages, Extract text, Merge it,Return result: All automatically.
        return data.text?.trim() || '';
    } catch (error) {
        console.error('PDF parse error:', error);
        throw new Error('Failed to extract text from PDF');
    }
}
