import React, { useState } from 'react';
import { X, Copy, Check, Download, Terminal, Play, Sparkles } from 'lucide-react';
import { StudentProject } from '../types';

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: StudentProject | null;
  code: string;
  paperTitle: string;
}

export const CodeModal: React.FC<CodeModalProps> = ({
  isOpen,
  onClose,
  project,
  code,
  paperTitle,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !project) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    const filename = `${project.projectTitle.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_scaffold.py`;
    const blob = new Blob([code], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-indigo-400 font-semibold px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800/40">
                  PyTorch Starter Scaffold
                </span>
                <span className="text-xs text-slate-400">• {paperTitle}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-100 mt-0.5">
                {project.projectTitle}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Code'}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download .py
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Code Metadata Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-2.5 bg-slate-950/40 border-b border-slate-800/60 text-xs text-slate-400">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-emerald-400 font-semibold">Target:</span>
            <span>{project.targetedPerformanceMetric}</span>
          </div>
          <div className="flex items-center gap-2 font-mono">
            <span className="text-indigo-400 font-semibold">Stack:</span>
            <span>{project.recommendedTechStack.join(' • ')}</span>
          </div>
        </div>

        {/* Code View Area */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#070b14] font-mono text-xs leading-relaxed text-slate-200">
          <pre className="whitespace-pre overflow-x-auto selection:bg-indigo-500/40">
            <code>{code}</code>
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-950/80 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ready to execute in Jupyter, Google Colab, or local Python 3.10+ virtualenv.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
