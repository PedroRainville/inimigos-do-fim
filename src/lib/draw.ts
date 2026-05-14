import type { Player, Team, DrawHistoryEntry, Position } from "./types";

const TEAM_SIZE = 5;
const TEAM_NAMES = ["Verdão", "Laranja Mecânica", "Roxo Imperial"];

const pairKey = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);

const teamPairs = (team: Team): string[] => {
  const out: string[] = [];
  for (let i = 0; i < team.players.length; i++) {
    for (let j = i + 1; j < team.players.length; j++) {
      out.push(pairKey(team.players[i].id, team.players[j].id));
    }
  }
  return out;
};

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const computeTeam = (id: string, name: string, players: Player[]): Team => {
  const total = players.reduce((s, p) => s + p.overall, 0);
  return {
    id,
    name,
    players,
    totalOverall: total,
    avgOverall: players.length ? Math.round(total / players.length) : 0,
  };
};

interface DrawResult {
  teams: Team[];
  leftovers: Player[];
}

/**
 * Distributes players across N teams of TEAM_SIZE.
 * Strategy: group by position, sort each group by overall desc, then
 * snake-draft into teams to balance both position spread and overall.
 * A small per-attempt shuffle (within equal-overall groups) keeps draws varied.
 */
const distributeOnce = (players: Player[], numTeams: number): DrawResult => {
  const slots: Player[][] = Array.from({ length: numTeams }, () => []);

  // Group by position, sort by overall desc, mild shuffle for ties.
  const positions: Position[] = ["GOL", "ZAG", "MEI", "ATA"];
  const buckets: Player[] = [];
  for (const pos of positions) {
    const group = players
      .filter((p) => p.position === pos)
      .sort((a, b) => b.overall - a.overall || Math.random() - 0.5);
    buckets.push(...group);
  }

  // Snake draft
  let dir = 1;
  let idx = 0;
  for (const player of buckets) {
    if (slots[idx].length < TEAM_SIZE) {
      slots[idx].push(player);
    } else {
      // find next team with space
      let placed = false;
      for (let k = 0; k < numTeams; k++) {
        if (slots[k].length < TEAM_SIZE) {
          slots[k].push(player);
          placed = true;
          break;
        }
      }
      if (!placed) break;
    }
    idx += dir;
    if (idx === numTeams) {
      idx = numTeams - 1;
      dir = -1;
    } else if (idx < 0) {
      idx = 0;
      dir = 1;
    }
  }

  const used = new Set(slots.flat().map((p) => p.id));
  const leftovers = players.filter((p) => !used.has(p.id));

  const teams = slots.map((ps, i) => computeTeam(`t${i + 1}`, TEAM_NAMES[i], shuffle(ps)));
  return { teams, leftovers };
};

const scoreBalance = (teams: Team[]): number => {
  // lower = more balanced (range of avg overall)
  const avgs = teams.map((t) => t.avgOverall);
  return Math.max(...avgs) - Math.min(...avgs);
};

const scoreRepetition = (teams: Team[], history: DrawHistoryEntry[]): number => {
  // count how many pairs already appeared in recent history (last 5 draws weigh more)
  const recent = history.slice(0, 5);
  const weight = new Map<string, number>();
  recent.forEach((h, i) => {
    const w = recent.length - i; // newer = heavier
    h.pairs.forEach((p) => weight.set(p, (weight.get(p) ?? 0) + w));
  });
  let score = 0;
  for (const team of teams) {
    for (const p of teamPairs(team)) score += weight.get(p) ?? 0;
  }
  return score;
};

export interface DrawOutput {
  teams: Team[];
  leftovers: Player[];
  numTeams: 2 | 3;
}

export const drawTeams = (
  players: Player[],
  history: DrawHistoryEntry[],
): DrawOutput | { error: string } => {
  if (players.length < TEAM_SIZE * 2) {
    return { error: `Mínimo ${TEAM_SIZE * 2} jogadores para sortear 2 times.` };
  }
  const numTeams: 2 | 3 = players.length >= TEAM_SIZE * 3 ? 3 : 2;

  // Try multiple attempts, pick the best by (repetition, balance)
  const ATTEMPTS = 60;
  let best: DrawResult | null = null;
  let bestScore = Infinity;
  for (let i = 0; i < ATTEMPTS; i++) {
    const result = distributeOnce(players, numTeams);
    const rep = scoreRepetition(result.teams, history);
    const bal = scoreBalance(result.teams);
    const score = rep * 100 + bal; // repetition dominates
    if (score < bestScore) {
      bestScore = score;
      best = result;
    }
  }
  if (!best) return { error: "Falha ao sortear." };
  return { teams: best.teams, leftovers: best.leftovers, numTeams };
};

export const buildHistoryEntry = (teams: Team[]): DrawHistoryEntry => ({
  id: crypto.randomUUID(),
  date: Date.now(),
  teams,
  pairs: teams.flatMap(teamPairs),
});

export { TEAM_SIZE };
