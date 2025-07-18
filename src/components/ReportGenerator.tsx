import React, { useState } from 'react';
import { FileText, Download, Eye } from 'lucide-react';
import { generateHTMLReport, downloadReport } from '../utils/reportGenerator';
import { ReportData } from '../types';

interface ReportGeneratorProps {
  reportData: ReportData;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ reportData }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [htmlContent, setHtmlContent] = useState<string>('');

  const handleGenerateReport = () => {
    const html = generateHTMLReport(reportData);
    setHtmlContent(html);
    setPreviewOpen(true);
  };

  const handleDownloadReport = () => {
    if (htmlContent) {
      downloadReport(htmlContent);
    }
  };

  const hasData = reportData.comparison || reportData.analysis;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Gerador de Relatório
        </h2>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Dados Disponíveis para Relatório:</h3>
            <ul className="space-y-1 text-sm">
              {reportData.comparison && (
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Comparação de performance
                </li>
              )}
              {reportData.analysis && (
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Análise de complexidade
                </li>
              )}
              {reportData.query && (
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Query analisada
                </li>
              )}
              {!hasData && (
                <li className="flex items-center gap-2 text-gray-500">
                  <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                  Nenhum dado disponível
                </li>
              )}
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleGenerateReport}
              disabled={!hasData}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Gerar Relatório
            </button>
            
            {htmlContent && (
              <button
                onClick={handleDownloadReport}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                Baixar HTML
              </button>
            )}
          </div>
        </div>
      </div>

      {previewOpen && htmlContent && (
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Preview do Relatório</h3>
            <button
              onClick={() => setPreviewOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <iframe
              srcDoc={htmlContent}
              className="w-full h-96 border-none"
              title="Preview do Relatório"
            />
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>💡 <strong>Dica:</strong> Este relatório será baixado como arquivo HTML que pode ser aberto em qualquer navegador ou compartilhado com stakeholders.</p>
          </div>
        </div>
      )}
    </div>
  );
};