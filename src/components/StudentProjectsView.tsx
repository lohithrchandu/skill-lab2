import React, { useState } from 'react';
import { StudentProject } from '../types';
import {
  Briefcase,
  Code2,
  TrendingUp,
  Cpu,
  Clock,
  Award,
  CheckCircle,
  Copy,
  Check,
  ChevronRight,
  Terminal,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface StudentProjectsViewProps {
  projects: StudentProject[];
  paperTitle: string;
  onGenerateCode: (project: StudentProject) => void;
  loadingProjectId?: number | null;
}

export const StudentProjectsView: React.FC<StudentProjectsViewProps> = ({
  projects,
  paperTitle,
  onGenerateCode,
  loadingProjectId = null,
}) => {
  const [copiedResumeId, setCopiedResumeId] = useState<number | null>(null);

  const handleCopyResumeBullet = async (id: number, bullet: string) => {
    try {
      await navigator.clipboard.writeText(bullet);
      setCopiedResumeId(id);
      setTimeout(() => setCopiedResumeId(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner-Friendly':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Intermediate':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Advanced':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              Future Work & Internship Opportunities (3rd-Year CS Student)
            </h3>
            <p className="text-xs text-slate-400">
              Realistic, high-impact extensions specifically engineered for resume portfolio strength & engineering interviews
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-indigo-300 bg-indigo-950/60 px-2.5 py-1 rounded-md border border-indigo-800/40 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            3 Production Extensions Formulated
          </span>
        </div>
      </div>

      {/* 3 Projects Cards */}
      <div className="grid grid-cols-1 gap-6">
        {projects.map((proj, index) => (
          <div
            key={proj.id || index}
            className="group relative rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 shadow-xl transition-all hover:border-indigo-500/40 hover:shadow-indigo-500/10"
          >
            {/* Top row: Number, Title, Difficulty */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 font-mono font-bold text-xs text-indigo-400 flex items-center justify-center">
                  0{index + 1}
                </span>
                <div>
                  <h4 className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                    {proj.projectTitle}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      ~{proj.estimatedWeeks || 3} Weeks
                    </span>
                    <span>•</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getDifficultyBadge(
                        proj.difficulty
                      )}`}
                    >
                      {proj.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Generate Starter Code CTA */}
              <button
                onClick={() => onGenerateCode(proj)}
                disabled={loadingProjectId === proj.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {loadingProjectId === proj.id ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Generating PyTorch Scaffold...
                  </>
                ) : (
                  <>
                    <Terminal className="w-3.5 h-3.5" />
                    Generate PyTorch Scaffold
                  </>
                )}
              </button>
            </div>

            {/* Core Required Fields: Exact Extension, Metric, Tech Stack */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
              {/* The Exact Extension */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-indigo-300">
                  <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                  THE EXACT EXTENSION
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-normal">
                  {proj.exactExtension}
                </p>
              </div>

              {/* Targeted Performance Metric */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  TARGETED PERFORMANCE METRIC
                </div>
                <p className="text-xs text-emerald-200/90 leading-relaxed font-normal">
                  {proj.targetedPerformanceMetric}
                </p>
              </div>
            </div>

            {/* Recommended Tech Stack Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Cpu className="w-3.5 h-3.5 text-slate-500" />
                Recommended Tech Stack:
              </span>
              {proj.recommendedTechStack.map((tech, tIdx) => (
                <span
                  key={tIdx}
                  className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700/80 shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Implementation Roadmap Steps */}
            {proj.implementationSteps && proj.implementationSteps.length > 0 && (
              <div className="mb-4 space-y-1.5">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                  Undergraduate Implementation Roadmap:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {proj.implementationSteps.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resume Impact Bullet */}
            <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-start gap-2.5 max-w-3xl">
                <Award className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold block mb-0.5">
                    Ready-To-Use Resume Bullet:
                  </span>
                  <p className="text-xs text-slate-200 font-mono italic">
                    "{proj.resumeBullet}"
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleCopyResumeBullet(proj.id, proj.resumeBullet)}
                className="flex items-center gap-1 text-xs text-indigo-300 hover:text-white bg-indigo-900/30 hover:bg-indigo-900/50 px-2.5 py-1.5 rounded-lg border border-indigo-700/40 transition-colors"
                title="Copy bullet to clipboard"
              >
                {copiedResumeId === proj.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Bullet</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
