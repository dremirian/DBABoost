import { SQLMetrics } from '../types';

export const parseSQLMetrics = (text: string): SQLMetrics => {
  const timeRegex = /elapsed time\s*=\s*(\d+)\s*ms/gi;
  const cpuRegex = /CPU time\s*=\s*(\d+)\s*ms/gi;
  const readsRegex = /logical reads\s*(\d+)/gi;

  const sum = (matches: RegExpMatchArray[] | null) =>
    matches?.reduce((acc, m) => acc + Number(m[1]), 0) || 0;

  return {
    duration: sum([...text.matchAll(timeRegex)]),
    cpu: sum([...text.matchAll(cpuRegex)]),
    logicalReads: sum([...text.matchAll(readsRegex)]),
  };
};

export const calculateImprovement = (before: number, after: number): number => {
  return before ? Number((((before - after) / before) * 100).toFixed(2)) : 0;
};

export const getImprovementColor = (improvement: number): string => {
  if (improvement > 20) return 'text-green-600';
  if (improvement > 0) return 'text-yellow-600';
  return 'text-red-600';
};

export const getImprovementBadge = (improvement: number): string => {
  if (improvement > 20) return 'bg-green-100 text-green-800';
  if (improvement > 0) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};