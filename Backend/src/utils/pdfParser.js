import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

export async function extractTextFromPDF(buffer) {
  const uint8Array = new Uint8Array(buffer);

  const pdf = await getDocument(uint8Array).promise;
  let allText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    const pageText = textContent.items.map(item => item.str).join(' ');
    allText += pageText + ' ';
  }

  return allText.trim();
}