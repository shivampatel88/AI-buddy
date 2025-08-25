import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
textContent: { type: String, required: true },
createdAt: { type: Date, default: Date.now }
});


export default mongoose.model('Note', NoteSchema)