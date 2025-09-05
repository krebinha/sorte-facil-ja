export interface LotteryGame {
  id: string;
  name: string;
  numbersCount: number;
  maxNumber: number;
  apiUrl: string;
}

export interface LotteryResult {
  concurso: number;
  data: string;
  dezenas: string[];
  acumulou?: boolean;
  valorAcumuladoProximoConcurso?: number;
  valorAcumuladoConcursoEspecial?: number;
  valorEstimadoProximoConcurso?: number;
}

export interface NumberFrequency {
  number: string;
  frequency: number;
}

export interface SuggestionResult {
  numbers: string[];
  confidence: number;
  gameType: string;
}