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
const note = await Note.create({ textContent: text , user: req.user.id});

res.json({ noteId: note._id, text });
} catch (e) { res.status(500).json({ error: e.message }); }
}

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

export const getNoteById = async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};