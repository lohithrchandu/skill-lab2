import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { ZoomIn, ZoomOut, RotateCcw, Copy, Check, Download, Code2, Eye, ShieldAlert, Layers } from 'lucide-react';
import { KeyLayer } from '../types';

interface MermaidViewerProps {
  code: string;
  paperTitle?: string;
  keyLayers?: KeyLayer[];
}

export const MermaidViewer: React.FC<MermaidViewerProps> = ({
  code,
  paperTitle = 'System Architecture',
  keyLayers = [],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [showCode, setShowCode] = useState<boolean>(false);
  const [selectedLayer, setSelectedLayer] = useState<KeyLayer | null>(null);

  // Initialize mermaid configuration once
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: 'JetBrains Mono, ui-monospace, monospace',
      themeVariables: {
        darkMode: true,
        background: '#090d16',
        primaryColor: '#1e293b',
        primaryTextColor: '#f8fafc',
        primaryBorderColor: '#6366f1',
        lineColor: '#818cf8',
        secondaryColor: '#0f172a',
        tertiaryColor: '#1e1b4b',
        edgeLabelBackground: '#0f172a',
        nodeBorder: '#6366f1',
        clusterBkg: '#0b1120',
        clusterBorder: '#334155',
      },
      flowchart: {
        htmlLabels: true,
        curve: 'basis',
        nodeSpacing: 45,
        rankSpacing: 50,
        padding: 15,
      },
    });
  }, []);

  // Clean code and render SVG whenever code changes
  useEffect(() => {
    let isMounted = true;
    setError(null);

    const renderChart = async () => {
      try {
        if (!code) return;

        // Clean any code block tags if present
        let cleanCode = code
          .replace(/```mermaid/gi, '')
          .replace(/```/g, '')
          .replace(/\[FLOWCHART\]/gi, '')
          .trim();

        if (!cleanCode.startsWith('graph TD') && !cleanCode.startsWith('graph LR')) {
          cleanCode = `graph TD\n${cleanCode}`;
        }

        const id = `mermaid-svg-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(id, cleanCode);

        if (isMounted) {
          setSvgContent(svg);
          setError(null);
        }
      } catch (err: any) {
        console.error('Mermaid render error:', err);
        if (isMounted) {
          setError(err?.message || 'Failed to render Mermaid diagram. Check syntax.');
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [code]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.4));
  const handleResetZoom = () => setZoom(1);

  const handleCopyCode = async () => {
    try {
      const formattedOutput = `[FLOWCHART]\n${code.trim()}`;
      await navigator.clipboard.writeText(formattedOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadSVG = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${paperTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}_architecture.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                [FLOWCHART]
              </span>
              <h3 className="text-sm font-semibold text-slate-100">System Architecture Flowchart</h3>
            </div>
            <p className="text-xs text-slate-400">
              Interactive pipeline mapping components, data inputs, model layers & tensor outputs
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60">
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-400 px-2 min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors ml-0.5"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Toggle view */}
          <button
            onClick={() => setShowCode(!showCode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              showCode
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {showCode ? (
              <>
                <Eye className="w-3.5 h-3.5" /> Diagram View
              </>
            ) : (
              <>
                <Code2 className="w-3.5 h-3.5" /> Mermaid Syntax
              </>
            )}
          </button>

          {/* Copy Mermaid */}
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Copy clean Mermaid syntax"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy [FLOWCHART]'}
          </button>

          {/* Download SVG */}
          <button
            onClick={handleDownloadSVG}
            disabled={!svgContent}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-colors shadow-lg shadow-indigo-600/20"
            title="Download SVG vector graphic"
          >
            <Download className="w-3.5 h-3.5" />
            SVG Export
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative bg-[#070b14] min-h-[460px] overflow-hidden flex items-center justify-center p-6">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #6366f1 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {showCode ? (
          /* Code View */
          <div className="w-full h-full max-h-[500px] overflow-auto z-10">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs leading-relaxed text-indigo-200">
              <div className="text-slate-400 mb-2 font-sans font-semibold flex items-center justify-between">
                <span>Mermaid Flowchart String ([FLOWCHART]):</span>
                <span className="text-[11px] text-emerald-400">Strictly no backtick markdown inside label</span>
              </div>
              <pre className="whitespace-pre overflow-x-auto text-emerald-300/90 font-mono p-3 bg-black/40 rounded-lg">
                {`[FLOWCHART]\n${code.trim()}`}
              </pre>
            </div>
          </div>
        ) : error ? (
          /* Error State */
          <div className="z-10 max-w-md p-6 rounded-xl bg-rose-950/30 border border-rose-800/50 text-center">
            <ShieldAlert className="w-10 h-10 text-rose-400 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-rose-200 mb-1">Diagram Rendering Notice</h4>
            <p className="text-xs text-rose-300/80 mb-4">{error}</p>
            <p className="text-xs text-slate-400 mb-3">You can view or copy the raw Mermaid specification below:</p>
            <pre className="text-left p-3 rounded bg-slate-950 text-indigo-300 font-mono text-xs overflow-x-auto max-h-40">
              {code}
            </pre>
          </div>
        ) : svgContent ? (
          /* Rendered SVG */
          <div
            ref={containerRef}
            className="w-full flex justify-center items-center transition-transform duration-150 ease-out select-none cursor-grab active:cursor-grabbing"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
            }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-slate-500 z-10">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-500/40 border-t-indigo-500 animate-spin" />
            <p className="text-xs font-mono">Generating architecture diagram layout...</p>
          </div>
        )}
      </div>

      {/* Architectural Layer Breakdown Inspector */}
      {keyLayers && keyLayers.length > 0 && (
        <div className="border-t border-slate-800/80 bg-slate-950/70 p-4">
          <div className="text-xs font-semibold text-slate-300 mb-2.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            Key Subsystems & Data Layers
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {keyLayers.map((layer, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedLayer(selectedLayer?.name === layer.name ? null : layer)}
                className={`text-left p-2.5 rounded-lg border transition-all ${
                  selectedLayer?.name === layer.name
                    ? 'bg-indigo-950/40 border-indigo-500/80 ring-1 ring-indigo-500/40'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="text-xs font-medium text-indigo-300 font-mono flex items-center justify-between">
                  <span>{layer.name}</span>
                  <span className="text-[10px] text-slate-500 font-sans">Layer {idx + 1}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{layer.role}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
