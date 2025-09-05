import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LOTTERY_GAMES } from "@/services/lotteryService";

interface LoterySelectorProps {
  selectedGame: string;
  onGameChange: (gameId: string) => void;
}

export const LotterySelector = ({ selectedGame, onGameChange }: LoterySelectorProps) => {
  return (
    <div className="w-full max-w-md">
      <label className="block text-sm font-medium text-foreground mb-2">
        Escolha o Jogo
      </label>
      <Select value={selectedGame} onValueChange={onGameChange}>
        <SelectTrigger className="w-full bg-card border-border hover:bg-accent/50 transition-colors">
          <SelectValue placeholder="Selecione uma loteria" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border shadow-lg">
          {LOTTERY_GAMES.map((game) => (
            <SelectItem 
              key={game.id} 
              value={game.id}
              className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              {game.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};