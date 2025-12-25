import { extractTextFromPDF } from '../utils/pdfParser.js';
import Note from '../models/Note.js';

export async function uploadPDF(req, res) {
  try {
    const buffer = req.file?.buffer;
    if (!buffer) return res.status(400).json({ error: 'No file received' });
    const text = await extractTextFromPDF(buffer);
    const note = await Note.create({ textContent: text, user: req.user });
    res.json({ noteId: note._id, text });
  } catch (e) { res.status(500).json({ error: e.message }); }
}

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};