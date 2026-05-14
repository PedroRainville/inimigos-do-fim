import type { Player } from "@/lib/types";
import { X } from "lucide-react";

interface Props {
  player: Player;
  onRemove?: (id: string) => void;
  compact?: boolean;
}

const positionColor = (pos: Player["position"]) => {
  switch (pos) {
    case "GOL": return "bg-accent text-accent-foreground";
    case "ZAG": return "bg-team-3 text-primary-foreground";
    case "MEI": return "bg-team-1 text-primary-foreground";
    case "ATA": return "bg-team-2 text-primary-foreground";
  }
};

export function PlayerCard({ player, onRemove, compact }: Props) {
  return (
    <div className={`flex items-center gap-3 rounded-lg border border-border bg-card ${compact ? "p-2" : "p-3"}`}>
      <div className={`flex flex-col items-center justify-center rounded-md w-12 h-14 ${positionColor(player.position)}`}>
        <span className="font-display text-2xl leading-none">{player.overall}</span>
        <span className="text-[10px] font-bold tracking-wider mt-0.5">{player.position}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display text-lg uppercase truncate">{player.name}</div>
      </div>
      {onRemove && (
        <button
          onClick={() => onRemove(player.id)}
          className="text-muted-foreground hover:text-destructive p-2 -mr-1"
          aria-label={`Remover ${player.name}`}
        >
          <X className="size-5" />
        </button>
      )}
    </div>
  );
}
