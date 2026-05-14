import { useState } from "react";
import { POSITIONS, type Player, type Position } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  onAdd: (player: Player) => void;
}

export function PlayerForm({ onAdd }: Props) {
  const [name, setName] = useState("");
  const [position, setPosition] = useState<Position>("MEI");
  const [overall, setOverall] = useState(75);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd({
      id: crypto.randomUUID(),
      name: trimmed,
      position,
      overall: Math.max(1, Math.min(99, overall)),
      createdAt: Date.now(),
    });
    setName("");
    setOverall(75);
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-xl bg-card border border-border p-4 space-y-4"
    >
      <h3 className="font-display text-2xl text-primary">Novo Jogador</h3>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-wider text-muted-foreground">Nome</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Ronaldinho"
          className="bg-input border-border"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-wider text-muted-foreground">Posição</label>
        <div className="grid grid-cols-4 gap-2">
          {POSITIONS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPosition(p.value)}
              className={`rounded-lg border-2 py-2 font-display text-lg transition ${
                position === p.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-foreground border-border hover:border-primary/50"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs uppercase tracking-wider text-muted-foreground">Overall</label>
          <span className="font-display text-3xl text-accent leading-none">{overall}</span>
        </div>
        <input
          type="range"
          min={1}
          max={99}
          value={overall}
          onChange={(e) => setOverall(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      <Button type="submit" className="w-full font-display text-xl tracking-wider" size="lg">
        Adicionar
      </Button>
    </form>
  );
}
