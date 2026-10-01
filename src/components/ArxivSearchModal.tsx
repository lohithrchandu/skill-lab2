import React, { useState } from 'react';
import { Search, Loader2, X, ExternalLink, Calendar, Users, FileText } from 'lucide-react';

interface ArxivEntry {
  id: string;
  title: string;
  summary: string;
  published: string;
  authors: string[];
}

interface ArxivSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPaper: (paper: { title: string; arxivId: string; url: string; summary: string }) => void;
}

export const ArxivSearchModal: React.FC<ArxivSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectPaper,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ArxivEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/search-arxiv?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (data.results) {
        setResults(data.results);
      } else {
        setError(data.error || 'No results found on arXiv');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to search arXiv');
    } finally {
      setLoading(false);
    }
  };

  const sampleKeywords = [
    'State space models',
    'KV cache compression',
    'Triton GPU kernels',
    'Low-rank adaptation',
    'Reasoning LLMs',
    'Vision transformers',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Live arXiv Academic Search</h3>
              <p className="text-xs text-slate-400">
                Directly query arXiv preprint library for CS papers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/40">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by topic, keyword, or author (e.g. Mamba, FlashAttention)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={!query.trim() || loading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Search</span>
            </button>
          </form>

          {/* Quick chips */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            <span className="text-[11px] text-slate-500 py-0.5">Popular:</span>
            {sampleKeywords.map((kw, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setQuery(kw);
                  // auto-trigger
                }}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

        {/* Results list */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
              <span className="text-xs font-mono">Querying arXiv public API...</span>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/40 text-xs text-rose-300 text-center">
              {error}
            </div>
          ) : results.length > 0 ? (
            results.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all flex flex-col justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800/40 text-indigo-300 shrink-0">
                      arXiv:{item.id}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-2 font-mono">
                    {item.authors && item.authors.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-500" />
                        {item.authors.slice(0, 3).join(', ')}
                        {item.authors.length > 3 ? ' et al.' : ''}
                      </span>
                    )}
                    {item.published && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {item.published}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/60">
                  <a
                    href={`https://arxiv.org/abs/${item.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 text-xs flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>arXiv Page</span>
                  </a>

                  <button
                    onClick={() => {
                      onSelectPaper({
                        title: item.title,
                        arxivId: item.id,
                        url: `https://arxiv.org/abs/${item.id}`,
                        summary: item.summary,
                      });
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Analyze This Paper</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs">
              Search by title, keywords, or topics above to retrieve recent preprints from arXiv.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
