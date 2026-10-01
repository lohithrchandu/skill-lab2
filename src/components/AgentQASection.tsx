import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, Loader2, HelpCircle } from 'lucide-react';

interface AgentQASectionProps {
  paperTitle: string;
  context: any;
}

interface QAMessage {
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
}

export const AgentQASection: React.FC<AgentQASectionProps> = ({ paperTitle, context }) => {
  const [messages, setMessages] = useState<QAMessage[]>([
    {
      role: 'agent',
      content: `Hello! I'm your CS Research Agent. Ask me anything about the system architecture, mathematical formulations, or implementation bottlenecks of "${paperTitle}".`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sampleQuestions = [
    'Where is the primary memory bottleneck in this architecture?',
    'How does training compute complexity scale with sequence length?',
    'What dataset should an undergraduate student use for benchmarking?',
    'Explain the mathematical formulation behind the core breakthrough simply.',
  ];

  const handleSend = async (queryToSend?: string) => {
    const text = queryToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg: QAMessage = {
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ask-research-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paperTitle,
          question: text.trim(),
          context,
        }),
      });

      const data = await response.json();
      if (data.success && data.answer) {
        const agentMsg: QAMessage = {
          role: 'agent',
          content: data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, agentMsg]);
      } else {
        throw new Error(data.error || 'Failed to get answer');
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'agent',
          content: `Apologies, I encountered an issue querying the agent: ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl flex flex-col h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100">Architecture & Theory Deep-Dive</h4>
            <p className="text-xs text-slate-400">Ask the CS Research Agent specific system questions</p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
          Agent Active
        </span>
      </div>

      {/* Suggested quick questions */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={isLoading}
            className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-indigo-900/40 hover:text-indigo-200 text-slate-300 border border-slate-700/60 transition-colors text-left"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages stream */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'agent' && (
              <div className="w-6 h-6 rounded-md bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-xl p-3 leading-relaxed ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950/80 border border-slate-800 text-slate-200'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>
              <div
                className={`text-[9px] mt-1 text-right ${
                  m.role === 'user' ? 'text-indigo-200' : 'text-slate-500'
                }`}
              >
                {m.timestamp}
              </div>
            </div>
            {m.role === 'user' && (
              <div className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-indigo-400 p-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Research Agent analyzing paper structure...</span>
          </div>
        )}
      </div>

      {/* Input box */}
      <div className="pt-3 mt-2 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask about ${paperTitle}...`}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask</span>
        </button>
      </div>
    </div>
  );
};
