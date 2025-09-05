import { NumberFrequency } from "@/types/lottery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NumberFrequencyProps {
  frequencies: NumberFrequency[];
  gameName: string;
}

export const NumberFrequencyDisplay = ({ frequencies, gameName }: NumberFrequencyProps) => {
  if (frequencies.length === 0) {
    return null;
  }

  const maxFrequency = Math.max(...frequencies.map(f => f.frequency));
  const mostFrequent = frequencies.filter(f => f.frequency === maxFrequency);
  const leastFrequent = frequencies.filter(f => f.frequency === Math.min(...frequencies.map(f => f.frequency)));

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Números Mais Frequentes */}
      <Card className="shadow-lg border-lottery-frequent/20">
        <CardHeader>
          <CardTitle className="text-lottery-frequent flex items-center gap-2">
            🔥 Números Mais Sorteados
            <Badge variant="secondary">{mostFrequent.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {mostFrequent.map((item) => (
              <div
                key={item.number}
                className="flex flex-col items-center p-3 bg-lottery-frequent text-lottery-frequent-foreground rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
              >
                <span className="text-2xl font-bold">{item.number}</span>
                <span className="text-xs opacity-90">{item.frequency}x</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Apareceram {maxFrequency} vez(es) nos últimos concursos
          </p>
        </CardContent>
      </Card>

      {/* Números Menos Frequentes */}
      <Card className="shadow-lg border-lottery-rare/20">
        <CardHeader>
          <CardTitle className="text-lottery-rare flex items-center gap-2">
            ❄️ Números Menos Sorteados
            <Badge variant="outline">{leastFrequent.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {leastFrequent.slice(0, 10).map((item) => (
              <div
                key={item.number}
                className="flex flex-col items-center p-3 bg-lottery-rare text-lottery-rare-foreground rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
              >
                <span className="text-2xl font-bold">{item.number}</span>
                <span className="text-xs opacity-90">{item.frequency}x</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Apareceram menos vezes nos últimos concursos
          </p>
        </CardContent>
      </Card>
    </div>
  );
};