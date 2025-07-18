export interface SQLMetrics {
  duration: number;
  cpu: number;
  logicalReads: number;
}

export interface ComparisonResult {
  before: SQLMetrics;
  after: SQLMetrics;
  improvements: {
    duration: number;
    cpu: number;
    logicalReads: number;
  };
}

export interface QueryAnalysis {
  complexity: number;
  estimatedTime: number;
  suggestions: string[];
  alerts: string[];
  aiAnalysis?: {
    summary: string;
    optimizedQuery?: string;
    detailedSuggestions: string[];
    performanceImpact: string;
  };
}

export interface ReportData {
  comparison?: ComparisonResult;
  analysis?: QueryAnalysis;
  query?: string;
  timestamp: string;
}