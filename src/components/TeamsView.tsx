import type { Team, Player } from "@/lib/types";
import { PlayerCard } from "./PlayerCard";

const TEAM_BG = ["bg-team-1/15 border-team-1", "bg-team-2/15 border-team-2", "bg-team-3/15 border-team-3"];
const TEAM_TEXT = ["text-team-1", "text-team-2", "text-team-3"];

export function TeamsView({ teams, leftovers }: { teams: Team[]; leftovers: Player[] }) {
  return (
    <div className="space-y-4">
      {teams.map((team, i) => (
        <div key={team.id} className={`rounded-xl border-2 p-4 ${TEAM_BG[i]}`}>
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Time {i + 1}</div>
              <h3 className={`font-display text-3xl ${TEAM_TEXT[i]}`}>{team.name}</h3>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Média</div>
              <div className="font-display text-3xl text-foreground">{team.avgOverall}</div>
            </div>
          </div>
          <div className="space-y-2">
            {team.players.map((p) => <PlayerCard key={p.id} player={p} compact />)}
          </div>
        </div>
      ))}
      {leftovers.length > 0 && (
        <div className="rounded-xl border-2 border-dashed border-border bg-card/50 p-4">
          <h3 className="font-display text-xl text-muted-foreground mb-2">Reservas</h3>
          <div className="space-y-2">
            {leftovers.map((p) => <PlayerCard key={p.id} player={p} compact />)}
          </div>
        </div>
      )}
    </div>
  );
}
