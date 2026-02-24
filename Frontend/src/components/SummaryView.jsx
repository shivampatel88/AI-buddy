import React, { useState, useRef, useEffect } from 'react';
import apiClient from '../services/api';
import { FileText, StopCircle, RefreshCw, Download, Save } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-hot-toast';

export default function SummaryView({ textContent }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const abortControllerRef = useRef(null);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom while streaming
  useEffect(() => {
    if (isStreaming && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [summary, isStreaming]);

  const handleGenerateSummary = async () => {
    if (!textContent?.trim()) {
      setError('No text content available to summarize.');
      return;
    }

    setLoading(true);
    setIsStreaming(true);
    setError('');
    setSummary('');

    abortControllerRef.current = new AbortController();
    const token = localStorage.getItem("token");
    const baseURL = apiClient.defaults.baseURL || "http://localhost:3000/api";

    try {
      const response = await fetch(`${baseURL}/ai/summarizeStream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ text: textContent }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split('\n\n');
          buffer = parts.pop(); // Keep the last incomplete chunk

          for (const part of parts) {
            const lines = part.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.substring(6).trim();
                if (dataStr === '[DONE]') {
                  done = true;
                  break;
                }
                if (dataStr) {
                  try {
                    const dataObj = JSON.parse(dataStr);
                    if (dataObj.error) {
                      setError(dataObj.error);
                      done = true;
                    } else {
                      // Extract text from Gemini structure or fallback
                      let textCh = dataObj.candidates?.[0]?.content?.parts?.[0]?.text || dataObj.text || '';
                      if (textCh) {
                        setSummary((prev) => prev + textCh);
                      }
                    }
                  } catch (e) {
                    console.error("Failed to parse stream chunk JSON:", e);
                  }
                }
              }
            }
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Stream aborted by user');
      } else {
        console.error('Streaming error:', err);
        setError('Failed to generate summary. Please try again.');
      }
    } finally {
      setLoading(false);
      setIsStreaming(false);
    }
  };

  const handleStopStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
      setIsStreaming(false);
    }
  };

  const handleDownload = () => {
    if (!summary) return;
    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Study_Summary_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Summary downloaded!");
  };

  const handleSave = async () => {
    if (!summary) return;
    setIsSaving(true);
    try {
      // NOTE: Make sure to implement POST /api/summaries in the backend to save this
      // await apiClient.post('/summaries', { content: summary, sourceText: textContent });
      
      // Simulating a network request for now
      await new Promise(resolve => setTimeout(resolve, 800)); 
      
      toast.success("Summary saved to your account!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save summary.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent flex items-center gap-2">
          <FileText className="text-blue-600" size={20} />
          Smart Summary
        </h3>
        
        <div className="flex flex-wrap items-center gap-2">
          {(!summary && !loading) && (
            <button
              onClick={handleGenerateSummary}
              className="group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white transition-all bg-slate-900 rounded-xl hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 overflow-hidden shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30"
            >
              <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                <div className="relative h-full w-8 bg-white/10" />
              </div>
              <FileText size={16} className="transition-transform group-hover:-translate-y-0.5" />
              <span>Generate Summary</span>
            </button>
          )}

          {(loading || isStreaming) && (
            <button
              onClick={handleStopStream}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors shadow-sm"
            >
              <StopCircle size={16} />
              <span>Stop Generating</span>
            </button>
          )}

          {(!loading && !isStreaming && summary) && (
            <>
              <button
                onClick={handleGenerateSummary}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm group"
                title="Regenerate"
              >
                <RefreshCw size={16} className="text-slate-500 group-hover:rotate-180 transition-transform duration-500" />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors shadow-sm"
              >
                <Download size={16} className="text-indigo-500" />
                <span>Download</span>
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-xl hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 transition-colors shadow-sm shadow-indigo-600/20"
              >
                {isSaving ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                <span>{isSaving ? 'Saving...' : 'Save to App'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 mb-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-start gap-3">
          <div className="mt-0.5 font-bold uppercase tracking-wider text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Error</div>
          <p>{error}</p>
        </div>
      )}

      {loading && !summary && !error && (
        <div className="space-y-4 animate-pulse mt-6">
          <div className="h-4 bg-slate-200 rounded-full w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded-full w-full"></div>
          <div className="h-4 bg-slate-200 rounded-full w-5/6"></div>
          <div className="h-4 bg-slate-200 rounded-full w-4/6 mt-6"></div>
          <div className="h-4 bg-slate-200 rounded-full w-full"></div>
        </div>
      )}

      {summary && (
        <div 
          ref={scrollRef}
          className="relative mt-2 p-1 text-slate-700 leading-relaxed max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar transition-opacity duration-500"
        >
          <div className="prose prose-slate max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-slate-900 mt-8 mb-4 border-b border-slate-100 pb-2" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-slate-800 mt-6 mb-3" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-lg font-semibold text-slate-800 mt-5 mb-2" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-6 space-y-2 mb-6 marker:text-slate-400" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-6 space-y-2 mb-6 marker:text-slate-400 font-medium" {...props} />,
                li: ({ node, ...props }) => <li className="pl-1 text-slate-600" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-semibold text-slate-900" {...props} />,
                p: ({ node, ...props }) => <p className="mb-4 text-slate-600" {...props} />,
                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-blue-500 bg-slate-50 pl-4 py-2 italic text-slate-700 rounded-r-lg" {...props} />
              }}
            >
              {summary}
            </ReactMarkdown>
            
            {isStreaming && (
              <span className="inline-block w-2.5 h-4 ml-1 bg-blue-600 animate-pulse rounded-sm align-middle"></span>
            )}
          </div>
        </div>
      )}
      
      {/* Custom Styles for Scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #94a3b8;
        }
      `}</style>
    </div>
  );
}