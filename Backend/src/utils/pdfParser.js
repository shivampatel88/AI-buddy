import pdf from 'pdf-parse';

export async function extractTextFromPDF(buffer) {
const data = await pdf(buffer);
return (data.text || '').replace(/\s+$/g, '').trim();
}