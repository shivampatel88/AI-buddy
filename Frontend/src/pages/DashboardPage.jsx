import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Book, Settings, LogOut, Upload, Plus, FileText, BrainCircuit, Layers, History, X } from 'lucide-react';
import apiClient from '../services/api';
import UploadModal from '../components/UploadModal';
import { handleApiError } from '../utils/errorHandler';
import GenQuizzes from '../components/GenQuizzes';
import QuizView from '../components/QuizView';
import logo from '../assets/logo1.jpg';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const fetchNotes = async () => {
    try {
      const notesResponse = await apiClient.get('/notes');
      setNotes(notesResponse.data);
    } catch (err) {
      handleApiError(err, null, 'Failed to fetch notes.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userResponse = await apiClient.get('/auth/me');
        setUser(userResponse.data);
        await fetchNotes();
      } catch (err) {
        handleApiError(err, navigate, 'Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };


  const handleQuizSelect = (quiz) => {
    setIsHistoryOpen(false);
    setSelectedQuiz(quiz);
  };

  return (<>
    <UploadModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onUploadSuccess={fetchNotes} />

    {isHistoryOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white w-full max-w-5xl h-[80vh] rounded-xl shadow-2xl relative flex flex-col">
          <button
            onClick={() => setIsHistoryOpen(false)}
            className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition z-10"
          >
            <X size={24} />
          </button>
          <div className="overflow-y-auto flex-1 p-8">
            <GenQuizzes onQuizSelect={handleQuizSelect} />
          </div>
        </div>
      </div>
    )}

    {selectedQuiz && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white w-full max-w-4xl h-[90vh] rounded-xl shadow-2xl relative flex flex-col">
          <button
            onClick={() => setSelectedQuiz(null)}
            className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition z-10"
          >
            <X size={24} />
          </button>
          <div className="overflow-y-auto flex-1 p-8">
            <QuizView initialQuiz={selectedQuiz} />
          </div>
        </div>
      </div>
    )}

    <div className="flex min-h-screen bg-slate-50">

      <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
        <div className="flex items-center gap-3 p-6 border-b border-slate-200">
          <img src={logo} alt="Study Buddy" className="w-10 h-10" />
          <span className="text-xl font-bold text-slate-900">Study Buddy</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-2.5 bg-indigo-50 text-indigo-600 rounded-lg font-semibold">
            <LayoutDashboard size={20} />
            Dashboard
          </a>
        </nav>
        <div className="p-4 border-t border-slate-200">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg">
            <LogOut size={20} />
            Log Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <header className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Welcome back, {user?.firstname || 'User'}!
              </h1>
              <p className="text-slate-500 mt-1">Let's get back to your study materials.</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setIsHistoryOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-600 border border-indigo-200 font-semibold rounded-lg shadow-sm hover:bg-indigo-50 transition">
                <History size={18} />
                My Quizzes
              </button>

              <button onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition">
                <Upload size={18} />
                Upload New Note
              </button>
            </div>
          </header>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Your Recent Notes</h2>

            {loading && <p>Loading your notes...</p>}

            {!loading && (
              <div className="space-y-4">
                {notes.length > 0 ? (
                  notes.map((note, index) => (
                    <Link to={`/note/${note._id}`} key={note._id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between hover:border-indigo-500 hover:shadow-md transition-all" >
                        <div className="flex items-center gap-4">
                          <div className="bg-slate-100 p-3 rounded-lg">
                            <FileText className="text-slate-500" size={20} />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">
                              {note.textContent.substring(0, 120)}...
                            </p>
                            <p className="text-sm text-slate-500">
                              Created on: {new Date(note.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl">
                    <div className="mx-auto h-12 w-12 text-slate-400">
                      <Book size={48} />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-800">No notes yet</h3>
                    <p className="mt-1 text-slate-500">Upload your first note to get started!</p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  </>
  );
}
