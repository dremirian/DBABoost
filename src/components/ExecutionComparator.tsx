import React, { useState } from 'react';
import { BarChart3, Play, TrendingUp, Clock, Cpu, Database } from 'lucide-react';
import { parseSQLMetrics, calculateImprovement, getImprovementColor, getImprovementBadge } from '../utils/sqlParser';
import { ComparisonResult } from '../types';
import { MetricsCard } from './MetricsCard';
import { ComparisonChart } from './ComparisonChart';

interface ExecutionComparatorProps {
  onComparisonResult: (result: ComparisonResult) => void;
}

export const ExecutionComparator: React.FC<ExecutionComparatorProps> = ({ onComparisonResult }) => {
  const [beforeOutput, setBeforeOutput] = useState('');
  const [afterOutput, setAfterOutput] = useState('');
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);

  const handleAnalyze = () => {
    const before = parseSQLMetrics(beforeOutput);
    const after = parseSQLMetrics(afterOutput);
    
    const improvements = {
      duration: calculateImprovement(before.duration, after.duration),
      cpu: calculateImprovement(before.cpu, after.cpu),
      logicalReads: calculateImprovement(before.logicalReads, after.logicalReads),
    };

    const result = { before, after, improvements };
    setComparison(result);
    onComparisonResult(result);
  };

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 20) return '🚀';
    if (improvement > 0) return '📈';
    return '⚠️';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Comparador de Execução
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Saída do SQL Antes
            </label>
            <textarea
              value={beforeOutput}
              onChange={(e) => setBeforeOutput(e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded-md font-mono text-sm"
              placeholder="Cole aqui a saída do SET STATISTICS TIME, IO ON (versão ANTES)..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Saída do SQL Depois
            </label>
            <textarea
              value={afterOutput}
              onChange={(e) => setAfterOutput(e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded-md font-mono text-sm"
              placeholder="Cole aqui a saída do SET STATISTICS TIME, IO ON (versão DEPOIS)..."
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={handleAnalyze}
            disabled={!beforeOutput.trim() || !afterOutput.trim()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            <Play className="w-4 h-4" />
            Analisar
          </button>
        </div>
      </div>

      {comparison && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricsCard
              title="Melhoria no Tempo"
              value={`${comparison.improvements.duration}%`}
              subtitle={`${comparison.after.duration}ms vs ${comparison.before.duration}ms`}
              color={comparison.improvements.duration > 20 ? 'green' : comparison.improvements.duration > 0 ? 'yellow' : 'red'}
              icon={<Clock className="w-6 h-6" />}
            />
            <MetricsCard
              title="Melhoria no CPU"
              value={`${comparison.improvements.cpu}%`}
              subtitle={`${comparison.after.cpu}ms vs ${comparison.before.cpu}ms`}
              color={comparison.improvements.cpu > 20 ? 'green' : comparison.improvements.cpu > 0 ? 'yellow' : 'red'}
              icon={<Cpu className="w-6 h-6" />}
            />
            <MetricsCard
              title="Melhoria em Reads"
              value={`${comparison.improvements.logicalReads}%`}
              subtitle={`${comparison.after.logicalReads} vs ${comparison.before.logicalReads}`}
              color={comparison.improvements.logicalReads > 20 ? 'green' : comparison.improvements.logicalReads > 0 ? 'yellow' : 'red'}
              icon={<Database className="w-6 h-6" />}
            />
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Tabela de Comparação</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-3 text-left font-medium">Métrica</th>
                    <th className="border p-3 text-left font-medium">Antes</th>
                    <th className="border p-3 text-left font-medium">Depois</th>
                    <th className="border p-3 text-left font-medium">Melhoria</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-3 font-medium">Tempo Total (ms)</td>
                    <td className="border p-3">{comparison.before.duration.toLocaleString()}</td>
                    <td className="border p-3">{comparison.after.duration.toLocaleString()}</td>
                    <td className="border p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getImprovementBadge(comparison.improvements.duration)}`}>
                        {getImprovementIcon(comparison.improvements.duration)}
                        {comparison.improvements.duration > 0 ? '+' : ''}{comparison.improvements.duration}%
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-3 font-medium">CPU Time (ms)</td>
                    <td className="border p-3">{comparison.before.cpu.toLocaleString()}</td>
                    <td className="border p-3">{comparison.after.cpu.toLocaleString()}</td>
                    <td className="border p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getImprovementBadge(comparison.improvements.cpu)}`}>
                        {getImprovementIcon(comparison.improvements.cpu)}
                        {comparison.improvements.cpu > 0 ? '+' : ''}{comparison.improvements.cpu}%
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-3 font-medium">Logical Reads</td>
                    <td className="border p-3">{comparison.before.logicalReads.toLocaleString()}</td>
                    <td className="border p-3">{comparison.after.logicalReads.toLocaleString()}</td>
                    <td className="border p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getImprovementBadge(comparison.improvements.logicalReads)}`}>
                        {getImprovementIcon(comparison.improvements.logicalReads)}
                        {comparison.improvements.logicalReads > 0 ? '+' : ''}{comparison.improvements.logicalReads}%
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <ComparisonChart comparison={comparison} />
        </>
      )}
    </div>
  );
};