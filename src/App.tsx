import React, { useState } from 'react';
import { Zap, BarChart3, Calculator, FileText } from 'lucide-react';
import { TabButton } from './components/TabButton';
import { ExecutionComparator } from './components/ExecutionComparator';
import { CostEstimator } from './components/CostEstimator';
import { ReportGenerator } from './components/ReportGenerator';
import { ReportData, ComparisonResult, QueryAnalysis } from './types';
import dbaboostLogo from './dbaboost.png'; // ajuste o caminho se estiver em subpasta, tipo './assets/dbaboost.png'


type ActiveTab = 'comparison' | 'estimator' | 'report';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('comparison');
  const [reportData, setReportData] = useState<ReportData>({
    timestamp: new Date().toISOString(),
  });

  const handleComparisonResult = (result: ComparisonResult) => {
    setReportData(prev => ({ ...prev, comparison: result }));
  };

  const handleAnalysisResult = (analysis: QueryAnalysis, query: string) => {
    setReportData(prev => ({ ...prev, analysis, query }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
             <div className="bg-white p-2 rounded-lg shadow border border-gray-200">
           <img src={dbaboostLogo} alt="Logo DBA Boost" className="w-16 h-16" />

            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">DBABoost</h1>
              <p className="text-gray-600">Seu copiloto de performance em SQL</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          <TabButton
            active={activeTab === 'comparison'}
            onClick={() => setActiveTab('comparison')}
            icon={<BarChart3 className="w-4 h-4" />}
          >
            Comparador de Execução
          </TabButton>
          <TabButton
            active={activeTab === 'estimator'}
            onClick={() => setActiveTab('estimator')}
            icon={<Zap className="w-4 h-4" />}
          >
            Tuning de Querie
          </TabButton>
          <TabButton
            active={activeTab === 'report'}
            onClick={() => setActiveTab('report')}
            icon={<FileText className="w-4 h-4" />}
          >
            Gerador de Relatório
          </TabButton>
        </div>

        {/* Tab Content */}
        <div className="w-full">
          {activeTab === 'comparison' && (
            <ExecutionComparator onComparisonResult={handleComparisonResult} />
          )}
          {activeTab === 'estimator' && (
            <CostEstimator onAnalysisResult={handleAnalysisResult} />
          )}
          {activeTab === 'report' && (
            <ReportGenerator reportData={reportData} />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              <strong>DBABoost</strong> - Ferramenta profissional para otimização de queries SQL
            </p>
            
           <p>Desenvolvido por <strong><a href="https://www.linkedin.com/in/andressamirian/" target="_blank" rel="noopener noreferrer">AMS Data Consulting</a></strong> © {new Date().getFullYear()} - Todos os direitos reservados</p>

          </div>
        </div>
      </div>
    </div>
    
  );
}

export default App;