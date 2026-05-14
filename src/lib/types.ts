export type Position = "GOL" | "ZAG" | "MEI" | "ATA";

export const POSITIONS: { value: Position; label: string; full: string }[] = [
  { value: "GOL", label: "GOL", full: "Goleiro" },
  { value: "ZAG", label: "ZAG", full: "Zagueiro" },
  { value: "MEI", label: "MEI", full: "Meia" },
  { value: "ATA", label: "ATA", full: "Atacante" },
];

export interface Player {
  id: string;
  name: string;
  position: Position;
  overall: number; // 1-99
  createdAt: number;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
  totalOverall: number;
  avgOverall: number;
}

export interface DrawHistoryEntry {
  id: string;
  date: number;
  teams: Team[];
  /** Set of "playerId|playerId" pairs that were on the same team. */
  pairs: string[];
}
