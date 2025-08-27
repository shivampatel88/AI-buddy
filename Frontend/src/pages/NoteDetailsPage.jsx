import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BrainCircuit, Layers, CheckSquare, ArrowLeft } from 'lucide-react';
import apiClient from '../services/api';
import SummaryView from '../components/SummaryView';
import FlashcardView from '../components/FlashcardView';
import QuizView from '../components/QuizView';

export default function NoteDetailPage() {
  const { noteId } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await apiClient.get(`/notes/${noteId}`);
        setNote(response.data);
      } catch {
        setError('Failed to fetch note details.');
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [noteId]);

  if (loading) return <div className="p-8">Loading note...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  const renderContent = () => {
    switch (activeTab) {
      case 'summary':
        return <SummaryView textContent={note.textContent} />;
      case 'flashcards':
        return <FlashcardView textContent={note.textContent} />;
      case 'quiz':
        return <QuizView textContent={note.textContent} noteId={noteId} />;
      default:
        return null;
    }
  };

  const TabButton = ({ tabName, icon, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition ${
        activeTab === tabName
          ? 'bg-indigo-600 text-white'
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6">
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Note Details</h1>
            <p className="text-slate-600 mt-2 line-clamp-3">{note.textContent}</p>
        </div>

        <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-lg mb-6">
            <TabButton tabName="summary" icon={<BrainCircuit size={16} />} label="Summary" />
            <TabButton tabName="flashcards" icon={<Layers size={16} />} label="Flashcards" />
            <TabButton tabName="quiz" icon={<CheckSquare size={16} />} label="Quiz" />
        </div>

        <div>{renderContent()}</div>
      </div>
    </div>
  );
}