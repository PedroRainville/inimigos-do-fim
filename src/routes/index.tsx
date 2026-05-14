import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast, Toaster } from "sonner";
import { Users, Shuffle, History, Trophy } from "lucide-react";

import type { Player, DrawHistoryEntry } from "@/lib/types";
import { loadPlayers, savePlayers, loadHistory, saveHistory } from "@/lib/storage";
import { drawTeams, buildHistoryEntry, TEAM_SIZE } from "@/lib/draw";
import { PlayerForm } from "@/components/PlayerForm";
import { PlayerCard } from "@/components/PlayerCard";
import { TeamsView } from "@/components/TeamsView";
import { HistoryView } from "@/components/HistoryView";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Pelotas FC — Sorteador de Times de Futebol" },
      {
        name: "description",
        content: "Cadastre jogadores, sorteie times equilibrados por posição e overall, com histórico para variar as equipes.",
      },
    ],
  }),
});

type Tab = "players" | "draw" | "history";

function Index() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [history, setHistory] = useState<DrawHistoryEntry[]>([]);
  const [tab, setTab] = useState<Tab>("players");
  const [currentDraw, setCurrentDraw] = useState<ReturnType<typeof drawTeams> | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPlayers(loadPlayers());
    setHistory(loadHistory());
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) savePlayers(players); }, [players, hydrated]);
  useEffect(() => { if (hydrated) saveHistory(history); }, [history, hydrated]);

  const addPlayer = (p: Player) => {
    setPlayers((prev) => [p, ...prev]);
    toast.success(`${p.name} adicionado`);
  };
  const removePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDraw = () => {
    const result = drawTeams(players, history);
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    setCurrentDraw(result);
    setHistory((prev) => [buildHistoryEntry(result.teams), ...prev]);
    setTab("draw");
    toast.success(`${result.numTeams} times sorteados!`);
  };

  const stats = useMemo(() => {
    const total = players.length;
    const possibleTeams = Math.floor(total / TEAM_SIZE);
    return { total, possibleTeams };
  }, [players]);

  return (
    <div className="min-h-screen pb-24">
      <Toaster theme="dark" position="top-center" richColors />

      {/* Header */}
      <header className="pitch-bg border-b-4 border-pitch-line/40 px-4 py-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="size-6 text-accent" />
              <span className="text-xs uppercase tracking-[0.3em] text-foreground/80">Pelotas FC</span>
            </div>
            <h1 className="font-display text-5xl leading-none mt-1 text-foreground">
              SORTEADOR
            </h1>
          </div>
          <div className="text-right">
            <div className="font-display text-4xl text-accent leading-none">{stats.total}</div>
            <div className="text-[10px] uppercase tracking-widest text-foreground/70">jogadores</div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6">
        {tab === "players" && (
          <div className="space-y-6">
            <PlayerForm onAdd={addPlayer} />

            <div>
              <div className="flex items-end justify-between mb-3">
                <h2 className="font-display text-2xl">Plantel</h2>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  {stats.possibleTeams >= 2 ? `Dá para ${Math.min(3, stats.possibleTeams)} times` : `Faltam ${TEAM_SIZE * 2 - stats.total} para 2 times`}
                </span>
              </div>
              {players.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
                  Nenhum jogador ainda. Cadastre acima.
                </div>
              ) : (
                <div className="space-y-2">
                  {players.map((p) => (
                    <PlayerCard key={p.id} player={p} onRemove={removePlayer} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "draw" && (
          <div className="space-y-4">
            <Button
              onClick={handleDraw}
              size="lg"
              className="w-full font-display text-2xl tracking-wider h-16"
              disabled={players.length < TEAM_SIZE * 2}
            >
              <Shuffle className="size-6 mr-2" />
              {currentDraw && !("error" in currentDraw) ? "Sortear de novo" : "Sortear times"}
            </Button>
            {players.length < TEAM_SIZE * 2 && (
              <p className="text-center text-sm text-muted-foreground">
                Precisa de pelo menos {TEAM_SIZE * 2} jogadores ({TEAM_SIZE} por time).
              </p>
            )}
            {currentDraw && !("error" in currentDraw) && (
              <TeamsView teams={currentDraw.teams} leftovers={currentDraw.leftovers} />
            )}
          </div>
        )}

        {tab === "history" && (
          <HistoryView history={history} onClear={() => { setHistory([]); toast.success("Histórico limpo"); }} />
        )}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 border-t-2 border-border bg-card/95 backdrop-blur">
        <div className="max-w-2xl mx-auto grid grid-cols-3">
          {([
            { id: "players", icon: Users, label: "Jogadores" },
            { id: "draw", icon: Shuffle, label: "Sortear" },
            { id: "history", icon: History, label: "Histórico" },
          ] as const).map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`flex flex-col items-center gap-1 py-3 transition ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="size-5" />
                <span className="text-[10px] uppercase tracking-widest font-bold">{item.label}</span>
                {active && <span className="absolute bottom-0 h-1 w-12 bg-primary rounded-t-full" />}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
