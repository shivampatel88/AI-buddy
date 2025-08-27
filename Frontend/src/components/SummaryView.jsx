import React, { useState } from 'react';
import apiClient from '../services/api';
import { Sparkles } from 'lucide-react';

export default function SummaryView({ textContent }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateSummary = async () => {
    setLoading(true);
    setError('');
    setSummary('');
    try {
      const response = await apiClient.post('/ai/summarize', { text: textContent });
      setSummary(response.data.summary);
    } catch {
      setError('Failed to generate summary.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
      <h3 className="text-lg font-bold mb-4">AI-Generated Summary</h3>
      {!summary && (
        <button
          onClick={handleGenerateSummary}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400 transition"
        >
          <Sparkles size={16} />
          {loading ? 'Generating...' : 'Generate Summary'}
        </button>
      )}
      {loading && <p className="mt-4 text-slate-500">AI is thinking...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {summary && (
        <div className="mt-4 prose prose-slate max-w-none">
            {summary.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
        </div>
      )}
    </div>
  );
}