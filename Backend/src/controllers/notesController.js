import multer from 'multer';
import { extractTextFromPDF } from '../utils/pdfParser.js';
import Note from '../models/Note.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

export const uploadMiddleware = upload.single('file');

export async function uploadPDF(req, res) {
try {
const buffer = req.file?.buffer;
if (!buffer) return res.status(400).json({ error: 'No file received' });
const text = await extractTextFromPDF(buffer);
const note = await Note.create({ textContent: text });
res.json({ noteId: note._id, text });
} catch (e) { res.status(500).json({ error: e.message }); }
}