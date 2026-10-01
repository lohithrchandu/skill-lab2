import React, { useState } from 'react';
import { CoreConceptExtraction } from '../types';
import { Target, Cpu, Sparkles, CheckCircle2, Copy, Check, BookOpen, Volume2, VolumeX } from 'lucide-react';

interface CoreExtractionViewProps {
  extraction: CoreConceptExtraction;
  paperTitle: string;
}

export const CoreExtractionView: React.FC<CoreExtractionViewProps> = ({ extraction, paperTitle }) => {
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Compute word count for strict verification of "< 300 words" constraint
  const combinedText = `${extraction.problemStatement} ${extraction.primaryMethodology} ${extraction.keyBreakthroughs}`;
  const computedWords = combinedText.trim().split(/\s+/).filter(Boolean).length;
  const isCompliant = computedWords <= 300;

  const handleCopy = async () => {
    try {
      const formatted = `CORE CONCEPT EXTRACTION: ${paperTitle}\n\n` +
        `1. PROBLEM STATEMENT:\n${extraction.problemStatement}\n\n` +
        `2. PRIMARY METHODOLOGY:\n${extraction.primaryMethodology}\n\n` +
        `3. KEY BREAKTHROUGHS:\n${extraction.keyBreakthroughs}\n\n` +
        `SUMMARY:\n${extraction.combinedSummary || combinedText}`;
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const textToRead = extraction.combinedSummary || `${extraction.problemStatement}. ${extraction.primaryMethodology}. ${extraction.keyBreakthroughs}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Word Constraint Metric */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Core Concept Extraction</h3>
            <p className="text-xs text-slate-400">
              High-signal deconstruction formatted in accessible, plain computer science language
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Word Count Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
            <span className="text-slate-400 font-mono">Word Count:</span>
            <span className={`font-mono font-bold ${isCompliant ? 'text-emerald-400' : 'text-amber-400'}`}>
              {computedWords} / 300 words
            </span>
            {isCompliant ? (
              <span title="Meets <300 words prompt constraint">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </span>
            ) : null}
          </div>

          {/* Audio Read-out */}
          {'speechSynthesis' in window && (
            <button
              onClick={handleSpeech}
              className={`p-2 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1.5 ${
                isPlaying
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title={isPlaying ? 'Stop voice readout' : 'Listen to accessible synthesis'}
            >
              {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* 3 Core Pillars Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 1. Problem Statement */}
        <div className="relative group rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-5 shadow-xl transition-all hover:border-indigo-500/40 hover:shadow-indigo-500/5">
          <div className="flex items-center gap-2.5 mb-3.5">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-rose-400">Pillar 1</span>
              <h4 className="text-sm font-semibold text-slate-100">Problem Statement</h4>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-slate-300/90 font-normal">
            {extraction.problemStatement}
          </p>
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
            <span>Root limitation in prior art</span>
            <span className="font-mono text-slate-400">Foundational Bottleneck</span>
          </div>
        </div>

        {/* 2. Primary Methodology */}
        <div className="relative group rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-5 shadow-xl transition-all hover:border-indigo-500/40 hover:shadow-indigo-500/5">
          <div className="flex items-center gap-2.5 mb-3.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-indigo-400">Pillar 2</span>
              <h4 className="text-sm font-semibold text-slate-100">Primary Methodology</h4>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-slate-300/90 font-normal">
            {extraction.primaryMethodology}
          </p>
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
            <span>Core architecture introduced</span>
            <span className="font-mono text-indigo-400">System Design</span>
          </div>
        </div>

        {/* 3. Mathematical & Algorithmic Breakthroughs */}
        <div className="relative group rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-5 shadow-xl transition-all hover:border-indigo-500/40 hover:shadow-indigo-500/5">
          <div className="flex items-center gap-2.5 mb-3.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-emerald-400">Pillar 3</span>
              <h4 className="text-sm font-semibold text-slate-100">Algorithmic Breakthroughs</h4>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-slate-300/90 font-normal">
            {extraction.keyBreakthroughs}
          </p>
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
            <span>Complexity & formulation</span>
            <span className="font-mono text-emerald-400">Mathematical Edge</span>
          </div>
        </div>
      </div>

      {/* Combined Synthesis Callout */}
      {extraction.combinedSummary && (
        <div className="p-4 rounded-xl bg-slate-900/50 border border-indigo-500/20 text-xs text-slate-300 leading-relaxed">
          <div className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-semibold mb-1.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Unified Abstract Synthesis
          </div>
          <p>{extraction.combinedSummary}</p>
        </div>
      )}
    </div>
  );
};
