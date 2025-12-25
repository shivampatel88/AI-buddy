import React, { useState } from 'react';
import apiClient from '../services/api';
import { Sparkles } from 'lucide-react';
import { handleApiError } from '../utils/errorHandler';
import ReactMarkdown from 'react-markdown';

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
    } catch (err) {
      handleApiError(err, setError, 'Failed to generate summary.');
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
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400 transition">
          <Sparkles size={16} />
          {loading ? 'Generating...' : 'Generate Summary'}
        </button>
      )}
      {loading && <p className="mt-4 text-slate-500">AI is thinking...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {summary && (
        <div className="mt-4 text-slate-700 leading-relaxed">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-indigo-700 mt-6 mb-3 border-b-2 border-indigo-100 pb-2" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-xl font-semibold text-indigo-600 mt-5 mb-2" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-lg font-semibold text-slate-800 mt-4 mb-2" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-2 mb-4 marker:text-indigo-500" {...props} />,
              li: ({ node, ...props }) => <li className="pl-1" {...props} />,
              strong: ({ node, ...props }) => <strong className="font-semibold text-indigo-900 bg-indigo-50 px-1 rounded" {...props} />,
              p: ({ node, ...props }) => <p className="mb-4" {...props} />
            }}
          >
            {summary}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}