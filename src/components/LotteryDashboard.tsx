import { useState, useEffect } from "react";
import { LotterySelector } from "./LotterySelector";
import { ResultsTable } from "./ResultsTable";
import { NumberFrequencyDisplay } from "./NumberFrequency";
import { SuggestionCard } from "./SuggestionCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  fetchHistoryResults,
  calculateNumberFrequency,
  generateSuggestion,
  LOTTERY_GAMES
} from "@/services/lotteryService";
import { LotteryResult, NumberFrequency, SuggestionResult } from "@/types/lottery";
import { Search, TrendingUp, Sparkles } from "lucide-react";
import heroLottery from "@/assets/hero-lottery.jpg";

export const LotteryDashboard = () => {
  const [selectedGame, setSelectedGame] = useState<string>("megasena");
  const [results, setResults] = useState<LotteryResult[]>([]);
  const [frequencies, setFrequencies] = useState<NumberFrequency[]>([]);
  const [suggestion, setSuggestion] = useState<SuggestionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  const { toast } = useToast();

  const selectedGameData = LOTTERY_GAMES.find(g => g.id === selectedGame);

  const fetchData = async (gameId: string) => {
    setLoading(true);
    try {
      const historyResults = await fetchHistoryResults(gameId);
      if (historyResults.length === 0) {
        toast({
          title: "Sem resultados",
          description: "Não foi possível carregar os resultados deste jogo.",
          variant: "destructive",
        });
        return;
      }

      setResults(historyResults);
      const freq = calculateNumberFrequency(historyResults);
      setFrequencies(freq);

      // Gera sugestão automaticamente
      const newSuggestion = generateSuggestion(gameId, freq);
      setSuggestion(newSuggestion);

      toast({
        title: "Resultados carregados!",
        description: `${historyResults.length} concursos encontrados para ${selectedGameData?.name}`,
      });
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar os dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateNewSuggestion = async () => {
    if (frequencies.length === 0) return;
    
    setLoadingSuggestion(true);
    try {
      // Simula um pequeno delay para melhor UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newSuggestion = generateSuggestion(selectedGame, frequencies);
      setSuggestion(newSuggestion);
      
      toast({
        title: "Nova sugestão gerada!",
        description: `Sugestão com ${newSuggestion.confidence}% de confiança`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao gerar nova sugestão.",
        variant: "destructive",
      });
    } finally {
      setLoadingSuggestion(false);
    }
  };

  const handleGameChange = (gameId: string) => {
    setSelectedGame(gameId);
    setResults([]);
    setFrequencies([]);
    setSuggestion(null);
  };

  useEffect(() => {
    if (selectedGame) {
      fetchData(selectedGame);
    }
  }, [selectedGame]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <img 
              src={heroLottery} 
              alt="Sorte Fácil JÁ - Logo" 
              className="mx-auto h-32 w-auto object-contain"
            />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Sorte Fácil JÁ
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Consulte os resultados oficiais das loterias da Caixa e receba sugestões baseadas em análise estatística
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="text-sm text-accent font-semibold">Dados Oficiais da Caixa Econômica Federal</span>
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
        </div>

        {/* Seletor de Jogo e Botão de Busca */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
          <LotterySelector 
            selectedGame={selectedGame} 
            onGameChange={handleGameChange} 
          />
          <Button
            variant="lottery"
            size="lg"
            onClick={() => fetchData(selectedGame)}
            disabled={loading}
          >
            {loading ? (
              <>
                <Search className="w-4 h-4 animate-spin" />
                Carregando...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Buscar Resultados
              </>
            )}
          </Button>
        </div>

        {/* Resultados */}
        {results.length > 0 && (
          <div className="space-y-8">
            {/* Tabela de Resultados */}
            <ResultsTable
              results={results}
              frequencies={frequencies}
              gameName={selectedGameData?.name || ""}
            />

            {/* Análise de Frequência */}
            {frequencies.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-bold text-primary">Análise de Frequência</h2>
                </div>
                <NumberFrequencyDisplay
                  frequencies={frequencies}
                  gameName={selectedGameData?.name || ""}
                />
              </div>
            )}

            {/* Sugestão de Aposta */}
            {suggestion && (
              <div>
                <SuggestionCard
                  suggestion={suggestion}
                  onRefresh={generateNewSuggestion}
                  loading={loadingSuggestion}
                />
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p>
            Dados oficiais da Caixa Econômica Federal • Desenvolvido com ❤️ para análise estatística
          </p>
        </div>
      </div>
    </div>
  );
};