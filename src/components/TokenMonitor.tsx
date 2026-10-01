import React from 'react';
import { TokenMetrics } from '../types';
import { Gauge, CheckCircle2, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

interface TokenMonitorProps {
  metrics: TokenMetrics | null;
}

export const TokenMonitor: React.FC<TokenMonitorProps> = ({ metrics }) => {
  if (!metrics) return null;

  const percentageUsed = Math.min(100, Math.round((metrics.totalTokens / metrics.tokenBudget) * 100));

  return (
    <div className="flex flex-wrap items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs shadow-md">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
        </div>
        <span className="font-mono text-slate-300 font-medium">Token Guardrail:</span>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              metrics.withinBudget ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
            style={{ width: `${Math.max(4, percentageUsed)}%` }}
          />
        </div>
        <span className="font-mono text-emerald-400 font-bold">
          {metrics.totalTokens.toLocaleString()} / {metrics.tokenBudget.toLocaleString()}
        </span>
      </div>

      <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-slate-800 text-[11px] text-slate-400 font-mono">
        <Zap className="w-3 h-3 text-amber-400" />
        <span>{metrics.efficiencyPercentage}</span>
      </div>
    </div>
  );
};
