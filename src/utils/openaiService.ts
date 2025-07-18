import OpenAI from 'openai';

// Configuração do OpenAI
let openai: OpenAI | null = null;

export const initializeOpenAI = (apiKey: string) => {
  openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true // Para uso no frontend
  });
};

export const analyzeQueryWithAI = async (query: string) => {
  if (!openai) {
    throw new Error('OpenAI não foi inicializado. Configure sua API key primeiro.');
  }

  const prompt = `
Você é um especialista em otimização de banco de dados SQL Server. Analise a seguinte query e forneça:

1. Um resumo da análise (2-3 frases)
2. Uma versão otimizada da query (se necessário)
3. 3-5 sugestões específicas de melhoria
4. Impacto esperado na performance (Alto/Médio/Baixo)

Query para análise:
\`\`\`sql
${query}
\`\`\`

Responda em formato JSON com esta estrutura:
{
  "summary": "Resumo da análise...",
  "optimizedQuery": "SELECT otimizada... (ou null se não precisar otimizar)",
  "detailedSuggestions": ["Sugestão 1", "Sugestão 2", "Sugestão 3"],
  "performanceImpact": "Alto/Médio/Baixo"
}

Foque em:
- Índices necessários
- Otimização de JOINs
- Eliminação de SELECT *
- Melhoria de WHERE clauses
- Uso adequado de funções
- Estrutura de subqueries
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em otimização de banco de dados SQL Server. Sempre responda em JSON válido."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('Resposta vazia da API');
    }

    // Tentar extrair JSON da resposta
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Formato de resposta inválido');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Erro na análise com IA:', error);
    throw new Error('Erro ao analisar query com IA. Verifique sua conexão e API key.');
  }
};

export const isOpenAIConfigured = () => {
  return openai !== null;
};