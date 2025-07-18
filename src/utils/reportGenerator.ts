import { ReportData } from '../types';

export const generateHTMLReport = (data: ReportData): string => {
  const { comparison, analysis, query, timestamp } = data;
  const reportDate = new Date(timestamp).toLocaleDateString('pt-BR');
  const reportTime = new Date(timestamp).toLocaleTimeString('pt-BR');

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório DBABoost - Análise de Performance</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f8fafc;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .header {
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
      color: white;
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 30px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .header h1 {
      font-size: 2.5rem;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .header .subtitle {
      font-size: 1.1rem;
      opacity: 0.9;
    }
    
    .report-info {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
      border-left: 4px solid #3b82f6;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .section {
      background: white;
      margin-bottom: 30px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .section-header {
      background: #f1f5f9;
      padding: 20px;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .section-header h2 {
      color: #1e40af;
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .section-content {
      padding: 25px;
    }
    
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 25px;
    }
    
    .metric-card {
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      border: 2px solid;
    }
    
    .metric-card.improvement {
      background: #f0fdf4;
      border-color: #16a34a;
      color: #15803d;
    }
    
    .metric-card.warning {
      background: #fffbeb;
      border-color: #d97706;
      color: #92400e;
    }
    
    .metric-card.critical {
      background: #fef2f2;
      border-color: #dc2626;
      color: #b91c1c;
    }
    
    .metric-card h3 {
      font-size: 0.9rem;
      margin-bottom: 8px;
      opacity: 0.8;
    }
    
    .metric-card .value {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .metric-card .subtitle {
      font-size: 0.8rem;
      opacity: 0.7;
    }
    
    .comparison-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    
    .comparison-table th,
    .comparison-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .comparison-table th {
      background: #f8fafc;
      font-weight: 600;
      color: #374151;
    }
    
    .comparison-table tr:hover {
      background: #f9fafb;
    }
    
    .improvement-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
    }
    
    .improvement-badge.positive {
      background: #dcfce7;
      color: #166534;
    }
    
    .improvement-badge.neutral {
      background: #fef3c7;
      color: #92400e;
    }
    
    .improvement-badge.negative {
      background: #fee2e2;
      color: #991b1b;
    }
    
    .suggestions-list {
      list-style: none;
      padding: 0;
    }
    
    .suggestions-list li {
      padding: 12px;
      margin-bottom: 8px;
      background: #f8fafc;
      border-left: 4px solid #3b82f6;
      border-radius: 4px;
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }
    
    .alert-list {
      list-style: none;
      padding: 0;
    }
    
    .alert-list li {
      padding: 12px;
      margin-bottom: 8px;
      background: #fef2f2;
      border-left: 4px solid #dc2626;
      border-radius: 4px;
      display: flex;
      align-items: flex-start;
      gap: 10px;
      color: #991b1b;
    }
    
    .code-block {
      background: #1f2937;
      color: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 0.9rem;
      overflow-x: auto;
      margin: 15px 0;
    }
    
    .complexity-bar {
      width: 100%;
      height: 20px;
      background: #e5e7eb;
      border-radius: 10px;
      overflow: hidden;
      margin: 10px 0;
    }
    
    .complexity-fill {
      height: 100%;
      transition: width 0.3s ease;
    }
    
    .complexity-low { background: #10b981; }
    .complexity-medium { background: #f59e0b; }
    .complexity-high { background: #ef4444; }
    
    .footer {
      text-align: center;
      padding: 30px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
      margin-top: 40px;
    }
    
    @media print {
      body { background: white; }
      .section { box-shadow: none; border: 1px solid #e5e7eb; }
    }
  </style>
</head>
<body>
  <div class="container">
<!-- Header -->
<div class="header" style="text-align: center; padding: 20px;">
  <img src="./dbaboost.png" alt="Logo DBA Boost" style="width: 160px; height: auto;" />
  <div class="subtitle">Relatório de Análise de Performance SQL</div>
</div>

    <!-- Report Info -->
    <div class="report-info">
      <h3>📋 Informações do Relatório</h3>
      <p><strong>Data:</strong> ${reportDate} às ${reportTime}</p>
      <p><strong>Tipo:</strong> ${comparison ? 'Comparação de Performance' : 'Análise de Query'}</p>
    </div>

    ${comparison ? `
    <!-- Performance Comparison Section -->
    <div class="section">
      <div class="section-header">
        <h2>📊 Comparação de Performance</h2>
      </div>
      <div class="section-content">
        <div class="metrics-grid">
          <div class="metric-card ${comparison.improvements.duration > 20 ? 'improvement' : comparison.improvements.duration > 0 ? 'warning' : 'critical'}">
            <h3>Melhoria no Tempo</h3>
            <div class="value">${comparison.improvements.duration}%</div>
            <div class="subtitle">${comparison.after.duration}ms vs ${comparison.before.duration}ms</div>
          </div>
          <div class="metric-card ${comparison.improvements.cpu > 20 ? 'improvement' : comparison.improvements.cpu > 0 ? 'warning' : 'critical'}">
            <h3>Melhoria no CPU</h3>
            <div class="value">${comparison.improvements.cpu}%</div>
            <div class="subtitle">${comparison.after.cpu}ms vs ${comparison.before.cpu}ms</div>
          </div>
          <div class="metric-card ${comparison.improvements.logicalReads > 20 ? 'improvement' : comparison.improvements.logicalReads > 0 ? 'warning' : 'critical'}">
            <h3>Melhoria em Reads</h3>
            <div class="value">${comparison.improvements.logicalReads}%</div>
            <div class="subtitle">${comparison.after.logicalReads} vs ${comparison.before.logicalReads}</div>
          </div>
        </div>

        <table class="comparison-table">
          <thead>
            <tr>
              <th>Métrica</th>
              <th>Antes</th>
              <th>Depois</th>
              <th>Melhoria</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Tempo Total (ms)</strong></td>
              <td>${comparison.before.duration.toLocaleString()}</td>
              <td>${comparison.after.duration.toLocaleString()}</td>
              <td>
                <span class="improvement-badge ${comparison.improvements.duration > 20 ? 'positive' : comparison.improvements.duration > 0 ? 'neutral' : 'negative'}">
                  ${comparison.improvements.duration > 20 ? '🚀' : comparison.improvements.duration > 0 ? '📈' : '⚠️'}
                  ${comparison.improvements.duration > 0 ? '+' : ''}${comparison.improvements.duration}%
                </span>
              </td>
            </tr>
            <tr>
              <td><strong>CPU Time (ms)</strong></td>
              <td>${comparison.before.cpu.toLocaleString()}</td>
              <td>${comparison.after.cpu.toLocaleString()}</td>
              <td>
                <span class="improvement-badge ${comparison.improvements.cpu > 20 ? 'positive' : comparison.improvements.cpu > 0 ? 'neutral' : 'negative'}">
                  ${comparison.improvements.cpu > 20 ? '🚀' : comparison.improvements.cpu > 0 ? '📈' : '⚠️'}
                  ${comparison.improvements.cpu > 0 ? '+' : ''}${comparison.improvements.cpu}%
                </span>
              </td>
            </tr>
            <tr>
              <td><strong>Logical Reads</strong></td>
              <td>${comparison.before.logicalReads.toLocaleString()}</td>
              <td>${comparison.after.logicalReads.toLocaleString()}</td>
              <td>
                <span class="improvement-badge ${comparison.improvements.logicalReads > 20 ? 'positive' : comparison.improvements.logicalReads > 0 ? 'neutral' : 'negative'}">
                  ${comparison.improvements.logicalReads > 20 ? '🚀' : comparison.improvements.logicalReads > 0 ? '📈' : '⚠️'}
                  ${comparison.improvements.logicalReads > 0 ? '+' : ''}${comparison.improvements.logicalReads}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    ` : ''}

    ${analysis ? `
    <!-- Query Analysis Section -->
    <div class="section">
      <div class="section-header">
        <h2>🔍 Análise da Query</h2>
      </div>
      <div class="section-content">
        <div class="metrics-grid">
          <div class="metric-card ${analysis.complexity > 70 ? 'critical' : analysis.complexity > 40 ? 'warning' : 'improvement'}">
            <h3>Score de Complexidade</h3>
            <div class="value">${analysis.complexity}/100</div>
            <div class="subtitle">Complexidade ${analysis.complexity > 70 ? 'Alta' : analysis.complexity > 40 ? 'Média' : 'Baixa'}</div>
          </div>
          <div class="metric-card warning">
            <h3>Tempo Estimado</h3>
            <div class="value">${analysis.estimatedTime}ms</div>
            <div class="subtitle">Baseado em heurística</div>
          </div>
        </div>

        <div class="complexity-bar">
          <div class="complexity-fill ${analysis.complexity > 70 ? 'complexity-high' : analysis.complexity > 40 ? 'complexity-medium' : 'complexity-low'}" 
               style="width: ${analysis.complexity}%"></div>
        </div>

        ${analysis.alerts && analysis.alerts.length > 0 ? `
        <h3 style="color: #dc2626; margin: 25px 0 15px 0;">⚠️ Alertas Críticos</h3>
        <ul class="alert-list">
          ${analysis.alerts.map(alert => `<li>⚠️ ${alert}</li>`).join('')}
        </ul>
        ` : ''}

        ${analysis.suggestions && analysis.suggestions.length > 0 ? `
        <h3 style="color: #3b82f6; margin: 25px 0 15px 0;">💡 Sugestões de Otimização</h3>
        <ul class="suggestions-list">
          ${analysis.suggestions.map(suggestion => `<li>💡 ${suggestion}</li>`).join('')}
        </ul>
        ` : ''}

        ${analysis.aiAnalysis ? `
        <h3 style="color: #7c3aed; margin: 25px 0 15px 0;">🤖 Análise com Inteligência Artificial</h3>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; border-left: 4px solid #7c3aed;">
          <p><strong>Resumo:</strong> ${analysis.aiAnalysis.summary}</p>
          <p style="margin-top: 10px;"><strong>Impacto na Performance:</strong> 
            <span class="improvement-badge ${analysis.aiAnalysis.performanceImpact === 'Alto' ? 'negative' : analysis.aiAnalysis.performanceImpact === 'Médio' ? 'neutral' : 'positive'}">
              ${analysis.aiAnalysis.performanceImpact}
            </span>
          </p>
          
          ${analysis.aiAnalysis.detailedSuggestions && analysis.aiAnalysis.detailedSuggestions.length > 0 ? `
          <h4 style="margin: 15px 0 10px 0;">Sugestões Detalhadas da IA:</h4>
          <ul style="margin-left: 20px;">
            ${analysis.aiAnalysis.detailedSuggestions.map(suggestion => `<li style="margin-bottom: 5px;">🤖 ${suggestion}</li>`).join('')}
          </ul>
          ` : ''}

          ${analysis.aiAnalysis.optimizedQuery ? `
          <h4 style="margin: 15px 0 10px 0;">Query Otimizada Sugerida:</h4>
          <div class="code-block">${analysis.aiAnalysis.optimizedQuery}</div>
          ` : ''}
        </div>
        ` : ''}
      </div>
    </div>
    ` : ''}

    ${query ? `
    <!-- Original Query Section -->
    <div class="section">
      <div class="section-header">
        <h2>📝 Query Analisada</h2>
      </div>
      <div class="section-content">
        <div class="code-block">${query}</div>
      </div>
    </div>
    ` : ''}

    <!-- Footer -->
    <div class="footer">
      <p><strong>DBABoost</strong> - Ferramenta profissional para otimização de queries SQL</p>
      <p>Relatório gerado automaticamente em ${reportDate} às ${reportTime}</p>
    </div>
  </div>
</body>
</html>`;
};

export const downloadReport = (htmlContent: string, filename: string = 'relatorio-dbaboost.html') => {
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};