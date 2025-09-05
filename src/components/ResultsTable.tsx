import { LotteryResult, NumberFrequency } from "@/types/lottery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ResultsTableProps {
  results: LotteryResult[];
  frequencies: NumberFrequency[];
  gameName: string;
}

export const ResultsTable = ({ results, frequencies, gameName }: ResultsTableProps) => {
  const getNumberClass = (number: string) => {
    const freq = frequencies.find(f => f.number === number)?.frequency || 0;
    const maxFreq = Math.max(...frequencies.map(f => f.frequency));
    const minFreq = Math.min(...frequencies.map(f => f.frequency));
    
    if (freq === maxFreq && maxFreq > minFreq) {
      return "bg-lottery-frequent text-lottery-frequent-foreground font-bold";
    } else if (freq === minFreq && maxFreq > minFreq) {
      return "bg-lottery-rare text-lottery-rare-foreground";
    }
    return "bg-muted text-muted-foreground";
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  if (results.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-muted-foreground">
            Nenhum resultado encontrado
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-primary">Últimos 10 Concursos - {gameName}</span>
          <Badge variant="secondary">{results.length} resultado(s)</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-semibold text-foreground">Concurso</th>
                <th className="text-left p-3 font-semibold text-foreground">Data</th>
                <th className="text-left p-3 font-semibold text-foreground">Números Sorteados</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr 
                  key={result.concurso} 
                  className={`border-b border-border hover:bg-accent/20 transition-colors ${
                    index === 0 ? 'bg-accent/10' : ''
                  }`}
                >
                  <td className="p-3">
                    <Badge variant={index === 0 ? "default" : "outline"}>
                      {result.concurso}
                    </Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {formatDate(result.data)}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      {result.dezenas?.map((number, numIndex) => (
                        <span
                          key={numIndex}
                          className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-110 ${getNumberClass(number)}`}
                        >
                          {number}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};