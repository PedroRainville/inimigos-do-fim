import type { Player, DrawHistoryEntry } from "./types";

const PLAYERS_KEY = "ftb:players:v1";
const HISTORY_KEY = "ftb:history:v1";

const isBrowser = () => typeof window !== "undefined";

export const loadPlayers = (): Player[] => {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(PLAYERS_KEY);
    return raw ? (JSON.parse(raw) as Player[]) : [];
  } catch {
    return [];
  }
};

export const savePlayers = (players: Player[]) => {
  if (!isBrowser()) return;
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
};

export const loadHistory = (): DrawHistoryEntry[] => {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as DrawHistoryEntry[]) : [];
  } catch {
    return [];
  }
};

export const saveHistory = (history: DrawHistoryEntry[]) => {
  if (!isBrowser()) return;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
};
