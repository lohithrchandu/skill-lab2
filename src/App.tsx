import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Sparkles,
  Layers,
  BookOpen,
  Briefcase,
  Terminal,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Cpu,
  ArrowRight,
  Code2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Bookmark,
  Zap,
} from 'lucide-react';
import { PaperAnalysisResult, StudentProject } from './types';
import { CURATED_PAPERS } from './data/curatedPapers';
import { MermaidViewer } from './components/MermaidViewer';
import { CoreExtractionView } from './components/CoreExtractionView';
import { StudentProjectsView } from './components/StudentProjectsView';
import { CodeModal } from './components/CodeModal';
import { AgentQASection } from './components/AgentQASection';
import { TokenMonitor } from './components/TokenMonitor';
import { ArxivSearchModal } from './components/ArxivSearchModal';

// High-fidelity initial demo data for instant showcase
const INITIAL_DEMO_RESULT: PaperAnalysisResult = {
  paperTitle: 'Mamba: Linear-Time Sequence Modeling with Selective State Spaces',
  arxivId: '2312.00752',
  paperUrl: 'https://arxiv.org/abs/2312.00752',
  coreConceptExtraction: {
    problemStatement:
      'Transformers suffer from quadratic compute and memory scaling O(N²) relative to sequence length due to full self-attention, while prior linear-time State Space Models (SSMs) fail at content-based reasoning because their parameters are static and cannot select or discard information based on the current input tokens.',
    primaryMethodology:
      'Mamba introduces a hardware-aware Selective State Space Model where the state transition parameters (B, C, and step size Δ) are parameterized as input-dependent functions of the current token. To execute this efficiently without costly materialization in slow HBM, Mamba employs a hardware-optimized parallel associative scan algorithm mapped directly to high-speed GPU SRAM.',
    keyBreakthroughs:
      'The architecture achieves strict linear-time inference and training complexity O(N) with an 5x throughput advantage over comparable Transformers. The hardware scan eliminates memory-bound bandwidth bottlenecks, allowing Mamba-3B to outperform LLaMA models of equal size while supporting ultra-long 1M+ token context windows.',
    totalWords: 154,
    combinedSummary:
      'Mamba resolves the quadratic bottleneck of Transformers through selective state space modeling. By making state transition matrices time-varying and input-dependent, it achieves deep content-aware reasoning while preserving linear O(N) inference and training complexity. A hardware-aware fused GPU kernel computes the recurrence via parallel associative scan directly in SRAM, providing 5x higher throughput and linear scaling to 1M token contexts.',
  },
  flowchart: {
    mermaidCode: `graph TD
    IN["Input Sequence Tokens X: (B, L, D)"] --> PROJ["Linear Input Projections: Gate & Signal"]
    PROJ --> BRANCH1["Signal Path: 1D Conv (Kernel=4) + SiLU"]
    PROJ --> BRANCH2["Gating Path: Linear Projection + SiLU"]
    
    BRANCH1 --> SELECT["Selective Parameterization: Delta(X), B(X), C(X)"]
    SELECT --> SCAN["Hardware-Aware Parallel Associative Scan (GPU SRAM)"]
    
    SCAN --> STATE["Recurrent Latent State: h_t = A_bar * h_{t-1} + B_bar * x_t"]
    STATE --> OUT_PROJ["Output Modulation: y_t = C_bar * h_t + D * x_t"]
    
    OUT_PROJ --> MULT["Multiplicative Gating (Branch1 * Branch2)"]
    BRANCH2 --> MULT
    
    MULT --> FINAL_PROJ["Linear Projection Output: (B, L, D)"]
    FINAL_PROJ --> RESIDUAL["Residual Add + LayerNorm"]
    RESIDUAL --> OUT["Next-Token Probabilities / Output Representation"]`,
    keyLayers: [
      { name: 'Input Gating & 1D Conv', role: 'Splits input into twin signal/gate tracks and applies depthwise temporal convolution' },
      { name: 'Selective SSM Scan', role: 'Input-dependent discretization parameters (Δ, B, C) executed via fused parallel prefix scan in SRAM' },
      { name: 'Residual Modulation & Output', role: 'Multiplicative gating and linear residual projection without attention matrix storage' },
    ],
  },
  studentOpportunities: [
    {
      id: 1,
      projectTitle: 'Edge Hardware Mamba: INT8 / FP8 Quantization on Apple Silicon & Jetson',
      exactExtension:
        'Quantizing Mamba selective scan projection matrices to INT8/FP8 and benchmarking latency across edge GPU and NPU runtimes (ONNX Runtime and Metal Performance Shaders).',
      targetedPerformanceMetric:
        '65% reduction in model memory footprint with under 1.2% perplexity degradation and 2.2x faster token-generation latency on edge hardware.',
      recommendedTechStack: ['PyTorch', 'ONNX Runtime', 'CoreML / Metal', 'BitsAndBytes'],
      difficulty: 'Intermediate',
      estimatedWeeks: 3,
      resumeBullet:
        'Engineered an INT8 quantized variant of the Mamba state-space model, achieving 2.2x inference speedup and 65% memory reduction on edge hardware targets.',
      implementationSteps: [
        'Export selective scan layers into custom ONNX graph representations.',
        'Implement post-training weight and activation calibration on the Wikitext-103 dataset.',
        'Profile memory bandwidth and kernel execution latency using NVIDIA Nsight and Apple Instruments.',
      ],
    },
    {
      id: 2,
      projectTitle: 'Hybrid Mamba-Attention Architecture for Speculative Decoding KV Cache Reduction',
      exactExtension:
        'Constructing a hybrid sequence backbone interleaving Mamba selective scan blocks with sparse attention layers to act as a zero-overhead draft model for speculative decoding.',
      targetedPerformanceMetric:
        '80% reduction in KV cache memory footprint while maintaining 98.5% of full Transformer benchmark accuracy across GSM8K and HumanEval.',
      recommendedTechStack: ['PyTorch', 'Hugging Face Transformers', 'FlashAttention-2', 'vLLM'],
      difficulty: 'Advanced',
      estimatedWeeks: 4,
      resumeBullet:
        'Architected a hybrid Mamba-Transformer sequence engine that reduced KV cache VRAM by 80% and boosted speculative decoding throughput by 2.6x.',
      implementationSteps: [
        'Interleave 3 Mamba selective blocks for every 1 multi-head attention block.',
        'Fine-tune the hybrid weights using LoRA adapters on synthetic instruction datasets.',
        'Benchmark draft-to-target acceptance rate and memory consumption during continuous serving.',
      ],
    },
    {
      id: 3,
      projectTitle: 'Parameter-Efficient LoRA Adapter Tuning for Domain-Specific Code Generation',
      exactExtension:
        'Injecting low-rank adapters (LoRA) directly into the selective SSM parameters (Δ, B, C projection layers) for low-resource programming language fine-tuning.',
      targetedPerformanceMetric:
        'Training under 0.8% of total network parameters while achieving +14% pass@1 on specialized domain coding benchmarks.',
      recommendedTechStack: ['PyTorch', 'PEFT (Parameter-Efficient Fine-Tuning)', 'Weights & Biases', 'Triton'],
      difficulty: 'Beginner-Friendly',
      estimatedWeeks: 2,
      resumeBullet:
        'Formulated PEFT adapters for Mamba state-space layers, fine-tuning under 1% of model weights on a single consumer GPU with a 14% benchmark uplift.',
      implementationSteps: [
        'Freeze core Mamba weights and attach low-rank adapter matrices to input projection modules.',
        'Train on a single RTX 3060 GPU using 16-bit mixed precision and cosine learning rate schedules.',
        'Evaluate execution accuracy on HumanEval-Rust and compare checkpoint transfer sizes.',
      ],
    },
  ],
  tokenMetrics: {
    promptTokens: 820,
    candidatesTokens: 640,
    totalTokens: 1460,
    tokenBudget: 25000,
    budgetRemaining: 23540,
    efficiencyPercentage: '94.2% under budget',
    withinBudget: true,
  },
};

export default function App() {
  const [inputData, setInputData] = useState<string>('https://arxiv.org/abs/2312.00752');
  const [activeTab, setActiveTab] = useState<'flowchart' | 'extraction' | 'projects' | 'qa' | 'raw'>(
    'flowchart'
  );
  const [analysisResult, setAnalysisResult] = useState<PaperAnalysisResult>(INITIAL_DEMO_RESULT);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Starter code generator modal state
  const [selectedProjectForCode, setSelectedProjectForCode] = useState<StudentProject | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);
  const [loadingProjectId, setLoadingProjectId] = useState<number | null>(null);

  // ArXiv Search Modal state
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);

  // Copy raw report state
  const [copiedRaw, setCopiedRaw] = useState(false);

  // Analysis function
  const handleAnalyzePaper = async (customInput?: string, paperTitle?: string) => {
    const toAnalyze = customInput || inputData;
    if (!toAnalyze.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputData: toAnalyze.trim(),
          paperTitle: paperTitle || '',
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to analyze paper.');
      }

      setAnalysisResult(json.data);
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setErrorMessage(err.message || 'An error occurred while analyzing the academic paper.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate starter PyTorch scaffold
  const handleGenerateScaffold = async (project: StudentProject) => {
    setSelectedProjectForCode(project);
    setLoadingProjectId(project.id);

    try {
      const response = await fetch('/api/generate-starter-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paperTitle: analysisResult.paperTitle,
          projectTitle: project.projectTitle,
          exactExtension: project.exactExtension,
          recommendedTechStack: project.recommendedTechStack,
        }),
      });

      const data = await response.json();
      if (data.success && data.code) {
        setGeneratedCode(data.code);
        setIsCodeModalOpen(true);
      } else {
        throw new Error(data.error || 'Failed to generate scaffold code');
      }
    } catch (err: any) {
      alert(`Scaffold Generation Error: ${err.message}`);
    } finally {
      setLoadingProjectId(null);
    }
  };

  // Select paper from arXiv search
  const handleSelectFromSearch = (paper: {
    title: string;
    arxivId: string;
    url: string;
    summary: string;
  }) => {
    setInputData(paper.url);
    handleAnalyzePaper(paper.url, paper.title);
  };

  const handleCopyRaw = async () => {
    try {
      const formatted =
        `# ${analysisResult.paperTitle}\n` +
        `URL: ${analysisResult.paperUrl || 'N/A'}\n\n` +
        `## CORE CONCEPT EXTRACTION\n` +
        `**Problem Statement:** ${analysisResult.coreConceptExtraction.problemStatement}\n\n` +
        `**Primary Methodology:** ${analysisResult.coreConceptExtraction.primaryMethodology}\n\n` +
        `**Key Breakthroughs:** ${analysisResult.coreConceptExtraction.keyBreakthroughs}\n\n` +
        `[FLOWCHART]\n${analysisResult.flowchart.mermaidCode}\n\n` +
        `## FUTURE WORK & INTERNSHIP OPPORTUNITIES\n` +
        analysisResult.studentOpportunities
          .map(
            (p, i) =>
              `### ${i + 1}. ${p.projectTitle}\n` +
              `* Exact Extension: ${p.exactExtension}\n` +
              `* Targeted Performance Metric: ${p.targetedPerformanceMetric}\n` +
              `* Recommended Tech Stack: ${p.recommendedTechStack.join(', ')}\n`
          )
          .join('\n');

      await navigator.clipboard.writeText(formatted);
      setCopiedRaw(true);
      setTimeout(() => setCopiedRaw(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navigation & Status Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <Layers className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  ArchiPaper <span className="text-indigo-400 font-mono">AI</span>
                </h1>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  CS Research Agent
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Academic Paper Ingestion • System Architecture Flowcharts • Student Internship Roadmaps
              </p>
            </div>
          </div>

          {/* Right Header: Token Monitor & ArXiv Search Button */}
          <div className="flex items-center gap-3">
            {/* Token Guardrail Telemetry */}
            <TokenMonitor metrics={analysisResult.tokenMetrics} />

            {/* Live arXiv search modal button */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-colors shadow-sm"
              title="Search arXiv preprints"
            >
              <Search className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">Browse arXiv</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Paper Input Panel */}
        <section className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-5 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <label htmlFor="paper-input" className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                Academic Paper URL, arXiv ID, or Abstract
              </label>
            </div>
            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Token-Efficient Parsing (&lt;25k budget)</span>
            </div>
          </div>

          {/* Input field and primary action */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                id="paper-input"
                type="text"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyzePaper()}
                placeholder="Paste arXiv URL (e.g., https://arxiv.org/abs/2312.00752), arXiv ID (e.g., 2312.00752), or paper title..."
                className="w-full bg-slate-950/80 border border-slate-700/70 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
              />
              {inputData && (
                <button
                  onClick={() => setInputData('')}
                  className="absolute right-3 top-3 text-xs text-slate-500 hover:text-slate-300 font-mono"
                >
                  Clear
                </button>
              )}
            </div>

            <button
              onClick={() => handleAnalyzePaper()}
              disabled={isLoading || !inputData.trim()}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/25 shrink-0 hover:scale-[1.01] active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Agent Deconstructing Architecture...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4" />
                  <span>Parse Paper & Architecture</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Curated Benchmark Papers Quick Chips */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
              Seminal Papers:
            </span>
            {CURATED_PAPERS.map((paper) => (
              <button
                key={paper.id}
                onClick={() => {
                  setInputData(paper.arxivUrl);
                  handleAnalyzePaper(paper.arxivUrl, paper.title);
                }}
                disabled={isLoading}
                className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                  analysisResult.paperTitle.toLowerCase().includes(paper.title.slice(0, 15).toLowerCase())
                    ? 'bg-indigo-950/80 text-indigo-200 border-indigo-500/80 shadow-sm'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
                title={`${paper.title} (${paper.year})`}
              >
                <span>{paper.title.split(':')[0]}</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400">
                  {paper.year}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Error Alert if any */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-200 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="flex-1">
              <div className="font-semibold">Analysis Failed</div>
              <p className="text-rose-300/90">{errorMessage}</p>
            </div>
            <button
              onClick={() => handleAnalyzePaper()}
              className="px-3 py-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-white font-medium text-xs transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Paper Overview Header Card */}
        <section className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1.5 max-w-4xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
                  Active Analysis
                </span>
                {analysisResult.arxivId && (
                  <a
                    href={`https://arxiv.org/abs/${analysisResult.arxivId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono text-slate-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                  >
                    <span>arXiv:{analysisResult.arxivId}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-100 leading-snug">
                {analysisResult.paperTitle}
              </h2>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyRaw}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                title="Copy markdown research brief"
              >
                {copiedRaw ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRaw ? 'Copied' : 'Export Brief'}</span>
              </button>

              {analysisResult.paperUrl && (
                <a
                  href={analysisResult.paperUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Original Paper</span>
                </a>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-slate-800/80">
            <button
              onClick={() => setActiveTab('flowchart')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'flowchart'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Architectural Flowchart</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                [FLOWCHART]
              </span>
            </button>

            <button
              onClick={() => setActiveTab('extraction')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'extraction'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Core Concept Extraction</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                &lt; 300 words
              </span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'projects'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/60'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Student Opportunities (3 Ideas)</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800/40">
                Internship & Resume
              </span>
            </button>

            <button
              onClick={() => setActiveTab('qa')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'qa'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/60'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Agent Deep-Dive Q&A</span>
            </button>

            <button
              onClick={() => setActiveTab('raw')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'raw'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/60'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Verbatim Spec & Telemetry</span>
            </button>
          </div>
        </section>

        {/* Tab 1: Architectural Flowchart */}
        {activeTab === 'flowchart' && (
          <section className="space-y-4 animate-in fade-in duration-200">
            <MermaidViewer
              code={analysisResult.flowchart.mermaidCode}
              paperTitle={analysisResult.paperTitle}
              keyLayers={analysisResult.flowchart.keyLayers}
            />
          </section>
        )}

        {/* Tab 2: Core Concept Extraction (<300 Words) */}
        {activeTab === 'extraction' && (
          <section className="animate-in fade-in duration-200">
            <CoreExtractionView
              extraction={analysisResult.coreConceptExtraction}
              paperTitle={analysisResult.paperTitle}
            />
          </section>
        )}

        {/* Tab 3: Future Work & Student Opportunities */}
        {activeTab === 'projects' && (
          <section className="animate-in fade-in duration-200">
            <StudentProjectsView
              projects={analysisResult.studentOpportunities}
              paperTitle={analysisResult.paperTitle}
              onGenerateCode={handleGenerateScaffold}
              loadingProjectId={loadingProjectId}
            />
          </section>
        )}

        {/* Tab 4: Agent Q&A Deep Dive */}
        {activeTab === 'qa' && (
          <section className="animate-in fade-in duration-200">
            <AgentQASection
              paperTitle={analysisResult.paperTitle}
              context={{
                extraction: analysisResult.coreConceptExtraction,
                flowchart: analysisResult.flowchart,
                studentOpportunities: analysisResult.studentOpportunities,
              }}
            />
          </section>
        )}

        {/* Tab 5: Verbatim Output & Token Telemetry */}
        {activeTab === 'raw' && (
          <section className="space-y-5 animate-in fade-in duration-200">
            {/* Operational constraint details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Total Tokens Consumed
                </span>
                <div className="text-xl font-mono font-bold text-emerald-400">
                  {analysisResult.tokenMetrics.totalTokens.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Prompt: {analysisResult.tokenMetrics.promptTokens.toLocaleString()} • Completion: {analysisResult.tokenMetrics.candidatesTokens.toLocaleString()}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Budget Remaining
                </span>
                <div className="text-xl font-mono font-bold text-indigo-400">
                  {analysisResult.tokenMetrics.budgetRemaining.toLocaleString()} / 25,000
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Operational ceiling strictly observed
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Efficiency Status
                </span>
                <div className="text-xl font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>{analysisResult.tokenMetrics.efficiencyPercentage}</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  High-token efficiency via abstract distillation
                </div>
              </div>
            </div>

            {/* Verbatim Format Block */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="text-xs font-semibold text-slate-200 font-mono">
                  VERBATIM SYSTEM OUTPUT SPECIFICATION
                </div>
                <button
                  onClick={handleCopyRaw}
                  className="flex items-center gap-1 text-xs text-indigo-300 hover:text-white bg-indigo-950/60 px-2.5 py-1 rounded border border-indigo-800/40 transition-colors"
                >
                  {copiedRaw ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRaw ? 'Copied' : 'Copy Verbatim Output'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-[#070b14] border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[500px]">
{`CORE CONCEPT EXTRACTION:
1. Problem Statement:
${analysisResult.coreConceptExtraction.problemStatement}

2. Primary Methodology:
${analysisResult.coreConceptExtraction.primaryMethodology}

3. Key Mathematical/Algorithmic Breakthroughs:
${analysisResult.coreConceptExtraction.keyBreakthroughs}

[FLOWCHART]
${analysisResult.flowchart.mermaidCode}

FUTURE WORK & INTERNSHIP OPPORTUNITIES:
${analysisResult.studentOpportunities
  .map(
    (p, i) =>
      `${i + 1}. ${p.projectTitle}
 * The exact extension: ${p.exactExtension}
 * The targeted performance metric: ${p.targetedPerformanceMetric}
 * The recommended tech stack: ${p.recommendedTechStack.join(', ')}`
  )
  .join('\n\n')}`}
              </pre>
            </div>
          </section>
        )}
      </main>

      {/* Starter Code Scaffold Modal */}
      <CodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        project={selectedProjectForCode}
        code={generatedCode}
        paperTitle={analysisResult.paperTitle}
      />

      {/* Live arXiv Search Modal */}
      <ArxivSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectPaper={handleSelectFromSearch}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-4 lg:px-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-slate-400">ArchiPaper AI • CS Research Agent</span>
            <span>—</span>
            <span>Engineered for Systems, Theory & Student Research</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>Token Budget &lt; 25,000 Tokens</span>
            <span>•</span>
            <span>Mermaid.js Flowcharts</span>
            <span>•</span>
            <span>arXiv API Grounded</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
