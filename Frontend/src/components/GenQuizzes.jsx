import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { handleApiError } from '../utils/errorHandler.js';

export default function GenQuizzes({ onQuizSelect }) {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/quizzes');
                setQuizzes(response.data);
            } catch (err) {
                handleApiError(err, setError, 'Failed to fetch quizzes');
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, []);

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 mt-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">📚 Your Quiz History</h2>

            {loading && <p className="text-slate-500">Loading Quizzes...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && quizzes.length === 0 && (
                <p className="text-slate-500 italic">You haven't generated any quizzes yet.</p>
            )}

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {quizzes.map((q) => {
                    const noteTitle = q.noteId?.textContent
                        ? q.noteId.textContent.substring(0, 30) + "..."
                        : "Untitled Quiz";

                    const dateStr = new Date(q.createdAt).toLocaleDateString();

                    return (
                        <div
                            key={q._id}
                            onClick={() => onQuizSelect(q)}
                            className="p-4 border border-slate-200 rounded-lg hover:shadow-lg hover:border-indigo-400 cursor-pointer transition bg-slate-50 group"
                        >
                            <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-indigo-600 transition">
                                {noteTitle}
                            </h3>
                            <div className="text-xs text-slate-500 flex justify-between">
                                <span>📅 {dateStr}</span>
                                <span>❓ {q.questions?.length || 0} Questions</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}