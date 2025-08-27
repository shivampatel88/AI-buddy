import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Book, Settings, LogOut, Upload, Plus, FileText, BrainCircuit, Layers } from 'lucide-react';
import apiClient from '../services/api';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await apiClient.get('/auth/me');
        const notesResponse = await apiClient.get('/notes');
        setUser(userResponse.data);
        setNotes(notesResponse.data);

      } catch (err) {
        setError('Failed to fetch data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Navigation */}
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
          <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg">
            <Book size={20} />
            My Notes
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg">
            <Settings size={20} />
            Settings
          </a>
        </nav>
        <div className="p-4 border-t border-slate-200">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg">
                <LogOut size={20} />
                Log Out
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <header className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Welcome back, {user?.firstname || 'User'}!
              </h1>
              <p className="text-slate-500 mt-1">Let's get back to your study materials.</p>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition">
              <Upload size={18} />
              Upload New Note
            </button>
          </header>

          {/* Recent Notes Section */}
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Your Recent Notes</h2>
            
            {loading && <p>Loading your notes...</p>}
            {error && <p className="text-red-500">{error}</p>}
            
            {!loading && !error && (
              <div className="space-y-4">
                {notes.length > 0 ? (
                  notes.map((note, index) => (
                    <motion.div
                      key={note._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-slate-100 p-3 rounded-lg">
                            <FileText className="text-slate-500" size={20} />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800">
                                {note.textContent.substring(0, 50)}...
                            </p>
                            <p className="text-sm text-slate-500">
                                Created on: {new Date(note.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100">
                            <BrainCircuit size={14} className="inline mr-1"/>
                            Summary
                        </button>
                        <button className="px-3 py-1.5 text-xs font-semibold text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100">
                            <Layers size={14} className="inline mr-1"/>
                            Flashcards
                        </button>
                      </div>
                    </motion.div>
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
  );
}
