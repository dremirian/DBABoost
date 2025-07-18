import React, { useState, useEffect } from 'react';
import { Calculator, AlertTriangle, Lightbulb, TrendingUp, Clock, Bot, Settings, Loader } from 'lucide-react';
import { analyzeQuery } from '../utils/queryAnalyzer';
import { analyzeQueryWithAI, initializeOpenAI, isOpenAIConfigured } from '../utils/openaiService';
import { QueryAnalysis } from '../types';
import { MetricsCard } from './MetricsCard';
import { AIConfigModal } from './AIConfigModal';

interface CostEstimatorProps {
  onAnalysisResult: (analysis: QueryAnalysis, query: string) => void;
}

export const CostEstimator: React.FC<CostEstimatorProps> = ({ onAnalysisResult }) => {
  const [query, setQuery] = useState('');
  const [analysis, setAnalysis] = useState<QueryAnalysis | null>(null);
  const [isAIConfigOpen, setIsAIConfigOpen] = useState(false);
  const [isAnalyzingWithAI, setIsAnalyzingWithAI] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('openai_api_key') || '';
  });

  useEffect(() => {
    if (apiKey) {
      initializeOpenAI(apiKey);
    }
  }, [apiKey]);

  useEffect(() => {
    if (query.trim()) {
      const result = analyzeQuery(query);
      setAnalysis(result);
      onAnalysisResult(result, query);
    } else {
      setAnalysis(null);
    }
  }, [query, onAnalysisResult]);

  const getComplexityColor = (complexity: number) => {
    if (complexity > 70) return 'red';
    if (complexity > 40) return 'yellow';
    return 'green';
  };

  const getComplexityLabel = (complexity: number) => {
    if (complexity > 70) return 'Alta';
    if (complexity > 40) return 'Média';
    return 'Baixa';
  };

  const handleSaveApiKey = (newApiKey: string) => {
    setApiKey(newApiKey);
    localStorage.setItem('openai_api_key', newApiKey);
    initializeOpenAI(newApiKey);
  };

  const handleAIAnalysis = async () => {
    if (!query.trim()) return;
    
    setIsAnalyzingWithAI(true);
    try {
      const aiResult = await analyzeQueryWithAI(query);
      
      if (analysis) {
        const updatedAnalysis = {
          ...analysis,
          aiAnalysis: aiResult
        };
        setAnalysis(updatedAnalysis);
        onAnalysisResult(updatedAnalysis, query);
      }
    } catch (error) {
      console.error('Erro na análise com o DBABooster:', error);
      alert('Erro ao analisar com IA. Verifique sua API key e conexão.');
    } finally {
      setIsAnalyzingWithAI(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Estimador de Custo
          </h2>
          <div className="flex items-center gap-2">
            {isOpenAIConfigured() && (
              <button
                onClick={handleAIAnalysis}
                disabled={!query.trim() || isAnalyzingWithAI}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                {isAnalyzingWithAI ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
                {isAnalyzingWithAI ? 'Analisando...' : 'Análise com o DBA Boost'}
              </button>
            )}
            <button
              onClick={() => setIsAIConfigOpen(true)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 flex items-center gap-2 transition-colors"
            >
              <Settings className="w-4 h-4" />
              {isOpenAIConfigured() ? 'Configurar IA' : 'Ativar IA'}
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cole sua Query SQL
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-40 p-3 border border-gray-300 rounded-md font-mono text-sm"
            placeholder="SELECT * FROM usuarios WHERE..."
          />
        </div>
      </div>

      {analysis && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricsCard
              title="Score de Complexidade"
              value={`${analysis.complexity}/100`}
              subtitle={`Complexidade ${getComplexityLabel(analysis.complexity)}`}
              color={getComplexityColor(analysis.complexity)}
              icon={<TrendingUp className="w-6 h-6" />}
            />
            <MetricsCard
              title="Tempo Estimado"
              value={`${analysis.estimatedTime}ms`}
              subtitle="Baseado em heurística"
              color="blue"
              icon={<Clock className="w-6 h-6" />}
            />
          </div>

          {analysis.alerts.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Alertas de Más Práticas
              </h3>
              <ul className="space-y-2">
                {analysis.alerts.map((alert, index) => (
                  <li key={index} className="flex items-start gap-2 text-red-700">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{alert}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.suggestions.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Sugestões de Otimização
              </h3>
              <ul className="space-y-2">
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2 text-blue-700">
                    <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis?.aiAnalysis && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Análise do DBABoost
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-purple-700 mb-2">Resumo da Análise:</h4>
                  <p className="text-purple-600">{analysis.aiAnalysis.summary}</p>
                </div>

                <div>
                  <h4 className="font-medium text-purple-700 mb-2">Impacto na Performance:</h4>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    analysis.aiAnalysis.performanceImpact === 'Alto' ? 'bg-red-100 text-red-800' :
                    analysis.aiAnalysis.performanceImpact === 'Médio' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {analysis.aiAnalysis.performanceImpact}
                  </span>
                </div>

                {analysis.aiAnalysis.detailedSuggestions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-purple-700 mb-2">Sugestões Detalhadas do DBABoost:</h4>
                    <ul className="space-y-2">
                      {analysis.aiAnalysis.detailedSuggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2 text-purple-600">
                          <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.aiAnalysis.optimizedQuery && (
                  <div>
                    <h4 className="font-medium text-purple-700 mb-2">Query Otimizada Sugerida:</h4>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{analysis.aiAnalysis.optimizedQuery}</pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Análise Detalhada</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">Score Total:</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        analysis.complexity > 70 ? 'bg-red-500' : 
                        analysis.complexity > 40 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${analysis.complexity}%` }}
                    ></div>
                  </div>
                  <span className="font-bold">{analysis.complexity}</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <p className="mb-2">
                  <strong>Previsão de Performance:</strong> {
                    analysis.complexity > 70 ? 'Query pode ser lenta e consumir muitos recursos' :
                    analysis.complexity > 40 ? 'Query com performance moderada' :
                    'Query otimizada com boa performance esperada'
                  }
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <AIConfigModal
        isOpen={isAIConfigOpen}
        onClose={() => setIsAIConfigOpen(false)}
        onSave={handleSaveApiKey}
        currentApiKey={apiKey}
      />
    </div>
  );
};

