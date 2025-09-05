import { LotteryGame, LotteryResult, NumberFrequency, SuggestionResult } from '@/types/lottery';

export const LOTTERY_GAMES: LotteryGame[] = [
  { id: 'megasena', name: 'Mega-Sena', numbersCount: 6, maxNumber: 60, apiUrl: 'megasena' },
  { id: 'quina', name: 'Quina', numbersCount: 5, maxNumber: 80, apiUrl: 'quina' },
  { id: 'lotofacil', name: 'Lotofácil', numbersCount: 15, maxNumber: 25, apiUrl: 'lotofacil' },
  { id: 'lotomania', name: 'Lotomania', numbersCount: 20, maxNumber: 100, apiUrl: 'lotomania' },
  { id: 'duplasena', name: 'Dupla Sena', numbersCount: 6, maxNumber: 50, apiUrl: 'duplasena' },
  { id: 'diadesorte', name: 'Dia de Sorte', numbersCount: 7, maxNumber: 31, apiUrl: 'diadesorte' },
  { id: 'timemania', name: 'Timemania', numbersCount: 10, maxNumber: 80, apiUrl: 'timemania' },
  { id: 'federal', name: 'Federal', numbersCount: 5, maxNumber: 99999, apiUrl: 'federal' },
  { id: 'loteca', name: 'Loteca', numbersCount: 14, maxNumber: 3, apiUrl: 'loteca' },
  { id: 'supersete', name: 'Super Sete', numbersCount: 7, maxNumber: 10, apiUrl: 'supersete' },
];

const BASE_URL = 'https://servicebus2.caixa.gov.br/portaldeloterias/api';

export const fetchLatestResult = async (gameId: string): Promise<LotteryResult | null> => {
  try {
    const game = LOTTERY_GAMES.find(g => g.id === gameId);
    if (!game) throw new Error('Jogo não encontrado');

    const response = await fetch(`${BASE_URL}/${game.apiUrl}`);
    if (!response.ok) throw new Error('Erro ao buscar resultado');
    
    const data = await response.json();
    
    // Mapeia os dados da API para a estrutura esperada
    return {
      concurso: data.numero,
      data: data.dataApuracao,
      dezenas: data.listaDezenas || [],
      acumulou: data.acumulado,
      valorAcumuladoProximoConcurso: data.valorAcumuladoProximoConcurso,
      valorAcumuladoConcursoEspecial: data.valorAcumuladoConcursoEspecial,
      valorEstimadoProximoConcurso: data.valorEstimadoProximoConcurso
    };
  } catch (error) {
    console.error('Erro ao buscar último resultado:', error);
    return null;
  }
};

export const fetchHistoryResults = async (gameId: string): Promise<LotteryResult[]> => {
  try {
    const game = LOTTERY_GAMES.find(g => g.id === gameId);
    if (!game) throw new Error('Jogo não encontrado');

    // Primeiro, busca o último concurso
    const latest = await fetchLatestResult(gameId);
    if (!latest) return [];

    const results: LotteryResult[] = [latest];
    const latestNumber = latest.concurso;

    // Busca os 9 concursos anteriores
    const promises = [];
    for (let i = 1; i < 10; i++) {
      const concursoNumber = latestNumber - i;
      if (concursoNumber > 0) {
        promises.push(
          fetch(`${BASE_URL}/${game.apiUrl}/${concursoNumber}`)
            .then(res => {
              if (res.ok) {
                return res.json().then(data => ({
                  concurso: data.numero,
                  data: data.dataApuracao,
                  dezenas: data.listaDezenas || [],
                  acumulou: data.acumulado,
                  valorAcumuladoProximoConcurso: data.valorAcumuladoProximoConcurso,
                  valorAcumuladoConcursoEspecial: data.valorAcumuladoConcursoEspecial,
                  valorEstimadoProximoConcurso: data.valorEstimadoProximoConcurso
                }));
              }
              return null;
            })
            .catch(() => null)
        );
      }
    }

    const historicalResults = await Promise.all(promises);
    const validResults = historicalResults.filter(result => result !== null);
    
    return [...results, ...validResults];
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    return [];
  }
};

export const calculateNumberFrequency = (results: LotteryResult[]): NumberFrequency[] => {
  const frequency: { [key: string]: number } = {};

  results.forEach(result => {
    if (result.dezenas) {
      result.dezenas.forEach(number => {
        frequency[number] = (frequency[number] || 0) + 1;
      });
    }
  });

  return Object.entries(frequency)
    .map(([number, freq]) => ({ number, frequency: freq }))
    .sort((a, b) => b.frequency - a.frequency);
};

export const generateSuggestion = (gameId: string, frequencies: NumberFrequency[]): SuggestionResult => {
  const game = LOTTERY_GAMES.find(g => g.id === gameId);
  if (!game) throw new Error('Jogo não encontrado');

  // Pega os números mais frequentes
  const mostFrequent = frequencies.slice(0, Math.ceil(game.numbersCount * 0.7));
  
  // Adiciona alguns números menos frequentes para diversificar
  const lessFrequent = frequencies.slice(-Math.ceil(game.numbersCount * 0.3));
  
  // Combina e embaralha
  const allCandidates = [...mostFrequent, ...lessFrequent];
  const shuffled = allCandidates.sort(() => Math.random() - 0.5);
  
  const suggestedNumbers = shuffled
    .slice(0, game.numbersCount)
    .map(f => f.number)
    .sort((a, b) => parseInt(a) - parseInt(b));

  const confidence = Math.round((mostFrequent.length / game.numbersCount) * 100);

  return {
    numbers: suggestedNumbers,
    confidence,
    gameType: game.name
  };
};