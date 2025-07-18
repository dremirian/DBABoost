import { QueryAnalysis } from '../types';

// Padrões avançados de análise
const PERFORMANCE_PATTERNS = {
  // Padrões críticos
  CRITICAL: [
    { pattern: /SELECT\s+\*/gi, weight: 25, message: 'SELECT * é ineficiente - especifique colunas necessárias' },
    { pattern: /LIKE\s+['"][%]/gi, weight: 30, message: 'LIKE com % no início impede uso de índices' },
    { pattern: /WHERE\s+.*\(\s*SELECT/gi, weight: 35, message: 'Subquery em WHERE pode ser muito lenta' },
    { pattern: /OR\s+.*OR/gi, weight: 20, message: 'Múltiplos ORs podem impedir uso de índices' },
    { pattern: /FUNCTION\s*\(/gi, weight: 25, message: 'Funções em WHERE impedem uso de índices' },
  ],
  
  // Padrões de alerta
  WARNING: [
    { pattern: /ORDER\s+BY.*,.*,/gi, weight: 15, message: 'Ordenação por múltiplas colunas pode ser custosa' },
    { pattern: /GROUP\s+BY.*HAVING/gi, weight: 18, message: 'HAVING após GROUP BY pode ser otimizado' },
    { pattern: /DISTINCT/gi, weight: 12, message: 'DISTINCT pode ser custoso - verifique se é necessário' },
    { pattern: /UNION(?!\s+ALL)/gi, weight: 20, message: 'UNION sem ALL remove duplicatas - considere UNION ALL' },
  ],
  
  // Padrões de boas práticas
  GOOD: [
    { pattern: /WHERE.*=.*AND/gi, weight: -5, message: 'Bom uso de filtros específicos' },
    { pattern: /INNER\s+JOIN/gi, weight: -3, message: 'INNER JOIN é eficiente' },
    { pattern: /TOP\s+\d+|LIMIT\s+\d+/gi, weight: -8, message: 'Limitação de resultados é uma boa prática' },
    { pattern: /WHERE.*IN\s*\(/gi, weight: 5, message: 'IN pode ser otimizado com EXISTS em alguns casos' },
  ]
};

const OPTIMIZATION_SUGGESTIONS = {
  'SELECT *': [
    'Especifique apenas as colunas necessárias: SELECT col1, col2 FROM...',
    'Reduza transferência de dados desnecessários',
    'Melhore a performance e legibilidade da query'
  ],
  'LIKE %': [
    'Use Full-Text Search para buscas de texto',
    'Considere reorganizar a condição: campo LIKE \'texto%\'',
    'Crie índices específicos para buscas frequentes'
  ],
  'Subquery': [
    'Converta subqueries em JOINs quando possível',
    'Use EXISTS ao invés de IN com subqueries',
    'Considere CTEs para melhor legibilidade'
  ],
  'JOIN': [
    'Certifique-se de que existem índices nas colunas de JOIN',
    'Use INNER JOIN quando não precisar de registros órfãos',
    'Ordene JOINs da tabela menor para maior'
  ],
  'ORDER BY': [
    'Crie índices compostos para colunas de ordenação',
    'Use TOP/LIMIT se não precisar de todos os registros',
    'Considere paginação para grandes resultados'
  ]
};

export const analyzeQuery = (query: string): QueryAnalysis => {
  const upperQuery = query.toUpperCase();
  let complexity = 0;
  const suggestions: string[] = [];
  const alerts: string[] = [];
  const detailedSuggestions: string[] = [];
  let performanceImpact = 'Baixo';

  // Análise avançada de padrões
  Object.entries(PERFORMANCE_PATTERNS).forEach(([category, patterns]) => {
    patterns.forEach(({ pattern, weight, message }) => {
      const matches = query.match(pattern);
      if (matches) {
        complexity += weight * matches.length;
        
        if (category === 'CRITICAL') {
          alerts.push(message);
          performanceImpact = 'Alto';
        } else if (category === 'WARNING') {
          suggestions.push(message);
          if (performanceImpact === 'Baixo') performanceImpact = 'Médio';
        }
      }
    });
  });

  // Análise estrutural detalhada
  const joins = (upperQuery.match(/JOIN/g) || []).length;
  const subqueries = (upperQuery.match(/\(SELECT/g) || []).length;
  const unions = (upperQuery.match(/UNION/g) || []).length;
  const orderBy = (upperQuery.match(/ORDER BY/g) || []).length;
  const groupBy = (upperQuery.match(/GROUP BY/g) || []).length;
  const having = (upperQuery.match(/HAVING/g) || []).length;
  const whereConditions = (upperQuery.match(/WHERE|AND|OR/g) || []).length;

  // Cálculo de complexidade mais sofisticado
  complexity += joins * 8;
  complexity += subqueries * 12;
  complexity += unions * 10;
  complexity += orderBy * 4;
  complexity += groupBy * 6;
  complexity += having * 8;
  complexity += Math.max(0, whereConditions - 2) * 3; // Penaliza muitas condições

  // Sugestões inteligentes baseadas na estrutura
  if (joins > 0) {
    detailedSuggestions.push(...OPTIMIZATION_SUGGESTIONS.JOIN);
    if (joins > 3) {
      alerts.push(`${joins} JOINs detectados - considere otimizar a estrutura da query`);
      performanceImpact = 'Alto';
    }
  }

  if (orderBy > 0) {
    detailedSuggestions.push(...OPTIMIZATION_SUGGESTIONS['ORDER BY']);
  }

  if (subqueries > 0) {
    detailedSuggestions.push(...OPTIMIZATION_SUGGESTIONS.Subquery);
    if (subqueries > 2) {
      alerts.push('Múltiplas subqueries detectadas - impacto significativo na performance');
      performanceImpact = 'Alto';
    }
  }

  // Verificações específicas com sugestões detalhadas
  if (upperQuery.includes('SELECT *')) {
    detailedSuggestions.push(...OPTIMIZATION_SUGGESTIONS['SELECT *']);
  }

  if (upperQuery.includes('LIKE \'%') || upperQuery.includes('LIKE "%')) {
    detailedSuggestions.push(...OPTIMIZATION_SUGGESTIONS['LIKE %']);
  }

  // Análise de índices necessários
  const indexSuggestions = analyzeIndexNeeds(query);
  detailedSuggestions.push(...indexSuggestions);

  // Estimativa de tempo mais precisa
  const baseTime = 100;
  const complexityMultiplier = Math.pow(1.1, complexity / 10);
  const joinPenalty = joins * 50;
  const subqueryPenalty = subqueries * 100;
  
  const estimatedTime = Math.round(baseTime * complexityMultiplier + joinPenalty + subqueryPenalty);

  // Remover duplicatas das sugestões
  const uniqueSuggestions = [...new Set([...suggestions, ...detailedSuggestions])];

  return {
    complexity: Math.min(100, complexity),
    estimatedTime,
    suggestions: uniqueSuggestions.slice(0, 8), // Limitar a 8 sugestões principais
    alerts,
    aiAnalysis: {
      summary: generateIntelligentSummary(query, complexity, joins, subqueries, alerts.length),
      optimizedQuery: generateOptimizedQuery(query),
      detailedSuggestions: uniqueSuggestions.slice(0, 5),
      performanceImpact
    }
  };
};

const analyzeIndexNeeds = (query: string): string[] => {
  const suggestions: string[] = [];
  const upperQuery = query.toUpperCase();
  
  // Detectar colunas em WHERE
  const whereMatch = upperQuery.match(/WHERE\s+([^=<>]+)[=<>]/g);
  if (whereMatch) {
    suggestions.push('Considere criar índices nas colunas utilizadas em WHERE');
  }
  
  // Detectar colunas em JOIN
  const joinMatch = upperQuery.match(/JOIN\s+\w+\s+ON\s+([^=]+)=/g);
  if (joinMatch) {
    suggestions.push('Verifique índices nas colunas de JOIN para melhor performance');
  }
  
  // Detectar ORDER BY
  const orderMatch = upperQuery.match(/ORDER\s+BY\s+([^,\s]+)/g);
  if (orderMatch) {
    suggestions.push('Crie índices compostos para colunas de ORDER BY');
  }
  
  return suggestions;
};

const generateIntelligentSummary = (
  query: string, 
  complexity: number, 
  joins: number, 
  subqueries: number, 
  alertCount: number
): string => {
  const queryType = query.toUpperCase().includes('SELECT') ? 'consulta' : 'operação';
  
  if (complexity > 70) {
    return `Esta ${queryType} apresenta alta complexidade (${complexity}/100) com ${joins} JOINs e ${subqueries} subqueries. ${alertCount > 0 ? `Foram identificados ${alertCount} problemas críticos que podem impactar significativamente a performance.` : 'Requer otimização cuidadosa para melhor performance.'}`;
  } else if (complexity > 40) {
    return `${queryType} de complexidade moderada (${complexity}/100). ${joins > 0 ? `Utiliza ${joins} JOINs` : 'Estrutura relativamente simples'}. ${alertCount > 0 ? `Alguns pontos de atenção identificados.` : 'Performance aceitável com possíveis melhorias.'}`;
  } else {
    return `${queryType} bem otimizada com baixa complexidade (${complexity}/100). ${alertCount === 0 ? 'Nenhum problema crítico identificado.' : 'Poucos ajustes necessários.'} Performance esperada é boa.`;
  }
};

const generateOptimizedQuery = (query: string): string | null => {
  let optimized = query;
  let hasChanges = false;
  
  // Otimização básica: substituir SELECT *
  if (optimized.toUpperCase().includes('SELECT *')) {
    optimized = optimized.replace(/SELECT\s+\*/gi, 'SELECT col1, col2, col3 -- Especifique as colunas necessárias');
    hasChanges = true;
  }
  
  // Adicionar TOP se não existir e não tiver WHERE
  if (!optimized.toUpperCase().includes('TOP') && 
      !optimized.toUpperCase().includes('LIMIT') && 
      !optimized.toUpperCase().includes('WHERE')) {
    optimized = optimized.replace(/SELECT/i, 'SELECT TOP 1000');
    hasChanges = true;
  }
  
  return hasChanges ? optimized : null;
};