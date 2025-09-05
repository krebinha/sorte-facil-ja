import { SuggestionResult } from "@/types/lottery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, RefreshCw } from "lucide-react";

interface SuggestionCardProps {
  suggestion: SuggestionResult | null;
  onRefresh: () => void;
  loading?: boolean;
}

export const SuggestionCard = ({ suggestion, onRefresh, loading }: SuggestionCardProps) => {
  if (!suggestion) {
    return null;
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return "bg-lottery-frequent text-lottery-frequent-foreground";
    if (confidence >= 50) return "bg-lottery-gold text-lottery-gold-foreground";
    return "bg-lottery-rare text-lottery-rare-foreground";
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 70) return "Alta";
    if (confidence >= 50) return "Média";
    return "Baixa";
  };

  return (
    <Card className="shadow-xl border-2 border-primary/20 bg-gradient-to-br from-card to-accent/5">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-primary">
          <Sparkles className="w-6 h-6" />
          Sugestão de Aposta - {suggestion.gameType}
          <Sparkles className="w-6 h-6" />
        </CardTitle>
        <div className="flex items-center justify-center gap-2">
          <Badge className={getConfidenceColor(suggestion.confidence)}>
            Confiança: {getConfidenceText(suggestion.confidence)} ({suggestion.confidence}%)
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        {/* Números Sugeridos */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Números Sugeridos:</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {suggestion.numbers.map((number, index) => (
              <div
                key={index}
                className="w-12 h-12 bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold shadow-lg hover:scale-110 transition-transform duration-300"
              >
                {number}
              </div>
            ))}
          </div>
        </div>

        {/* Avisos */}
        <div className="bg-muted/50 p-4 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground font-medium">
            ⚠️ <strong>SIMULAÇÃO - SEM VALOR OFICIAL</strong>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Esta sugestão é baseada em análise estatística dos últimos concursos e não garante resultado.
            Jogue com responsabilidade.
          </p>
        </div>

        {/* Botão para Nova Sugestão */}
        <Button
          variant="lottery"
          onClick={onRefresh}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Gerando nova sugestão...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Gerar Nova Sugestão
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};