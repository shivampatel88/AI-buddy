import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Book, Settings, LogOut, Upload, Plus, FileText, BrainCircuit, Layers } from 'lucide-react';
import apiClient from '../services/api';
import UploadModal from '../components/UploadModal';

const Logo = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17L12 22L22 17" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12L12 17L22 12" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchNotes = async () => {
      try {
        const notesResponse = await apiClient.get('/notes');
        setNotes(notesResponse.data);
      } catch  {
        setError('Failed to fetch notes.');
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
        setError('Failed to fetch data. Please try logging in again.');
        if (err.response && err.response.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
        }
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

  return (<>
      <UploadModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={fetchNotes} />
    <div className="flex min-h-screen bg-slate-50">
    
      <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
        <div className="flex items-center gap-3 p-6 border-b border-slate-200">
          <Logo />
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
            <button onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition">
              <Upload size={18} />
              Upload New Note
            </button>
          </header>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Your Recent Notes</h2>
            
            {loading && <p>Loading your notes...</p>}
            {error && <p className="text-red-500">{error}</p>}
            
            {!loading && !error && (
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
                                    {note.textContent.substring(0, 80)}...
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
