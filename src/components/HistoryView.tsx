import type { DrawHistoryEntry } from "@/lib/types";

const TEAM_TEXT = ["text-team-1", "text-team-2", "text-team-3"];

export function HistoryView({
  history,
  onClear,
}: {
  history: DrawHistoryEntry[];
  onClear: () => void;
}) {
  if (history.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
        Nenhum sorteio ainda. Os últimos 20 ficam salvos aqui.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {history.length} sorteio{history.length === 1 ? "" : "s"} salvos
        </p>
        <button
          onClick={onClear}
          className="text-xs uppercase tracking-wider text-destructive hover:underline"
        >
          Limpar
        </button>
      </div>
      {history.map((h) => (
        <div key={h.id} className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
            {new Date(h.date).toLocaleString("pt-BR")}
          </div>
          <div className="grid grid-cols-1 gap-3">
            {h.teams.map((t, i) => (
              <div key={t.id}>
                <div className={`font-display text-lg ${TEAM_TEXT[i]}`}>
                  {t.name} <span className="text-muted-foreground text-sm font-body">· média {t.avgOverall}</span>
                </div>
                <div className="text-sm text-foreground/80">
                  {t.players.map((p) => p.name).join(" · ")}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
