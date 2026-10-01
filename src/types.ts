export interface KeyLayer {
  name: string;
  role: string;
}

export interface StudentProject {
  id: number;
  projectTitle: string;
  exactExtension: string;
  targetedPerformanceMetric: string;
  recommendedTechStack: string[];
  difficulty: 'Beginner-Friendly' | 'Intermediate' | 'Advanced';
  estimatedWeeks: number;
  resumeBullet: string;
  implementationSteps: string[];
}

export interface CoreConceptExtraction {
  problemStatement: string;
  primaryMethodology: string;
  keyBreakthroughs: string;
  totalWords: number;
  combinedSummary: string;
}

export interface FlowchartData {
  mermaidCode: string;
  keyLayers: KeyLayer[];
}

export interface TokenMetrics {
  promptTokens: number;
  candidatesTokens: number;
  totalTokens: number;
  tokenBudget: number;
  budgetRemaining: number;
  efficiencyPercentage: string;
  withinBudget: boolean;
}

export interface PaperAnalysisResult {
  paperTitle: string;
  arxivId: string | null;
  paperUrl: string | null;
  coreConceptExtraction: CoreConceptExtraction;
  flowchart: FlowchartData;
  studentOpportunities: StudentProject[];
  formattedReport?: string;
  tokenMetrics: TokenMetrics;
}

export interface CuratedPaper {
  id: string;
  title: string;
  authors: string;
  year: number;
  category: string;
  summarySnippet: string;
  arxivUrl: string;
  arxivId: string;
  badge: string;
}
