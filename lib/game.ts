export const LINES = [
  { name: 'Scrap press', product: 'Salvage into cash.', base: 4, time: 1.5, unlock: 0, upgrade: 12, manager: 60, color: '#fbb454' },
  { name: 'Gear cutter', product: 'A better kind of grind.', base: 48, time: 4, unlock: 150, upgrade: 100, manager: 350, color: '#79c5fc' },
  { name: 'Circuit printer', product: 'Small parts. Big margins.', base: 440, time: 6, unlock: 2400, upgrade: 1600, manager: 5200, color: '#b8a0ff' },
  { name: 'Turbine works', product: 'Business is picking up speed.', base: 4600, time: 9, unlock: 36000, upgrade: 18000, manager: 65000, color: '#60dcc0' },
  { name: 'Robotics lab', product: 'Workers making workers.', base: 38000, time: 12, unlock: 400000, upgrade: 160000, manager: 600000, color: '#f4a3c1' },
  { name: 'Reactor assembly', product: 'Now that is a power move.', base: 400000, time: 16, unlock: 5000000, upgrade: 2200000, manager: 8000000, color: '#e4ec74' },
] as const;
export const RESEARCH = [
  { name: 'Precision tooling', desc: 'All production earns 50% more.', cost: 600 },
  { name: 'Fast conveyors', desc: 'All production runs 30% faster.', cost: 6500 },
  { name: 'Premium contracts', desc: 'Double all production earnings.', cost: 90000 },
  { name: 'Predictive maintenance', desc: 'All production runs 40% faster.', cost: 1200000 },
] as const;
export type Line = { level: number; auto: boolean; progress: number; running: boolean };
export type Game = { version: 1; cash: number; runEarned: number; allEarned: number; points: number; shifts: number; lines: Line[]; research: boolean[]; claimed: number[]; last: number; boostUntil: number; boostReady: number };
export function fresh(now = Date.now(), points = 0, shifts = 0, allEarned = 0): Game {
  return { version: 1, cash: 12, runEarned: 0, allEarned, points, shifts, lines: LINES.map((_, i) => ({ level: i === 0 ? 1 : 0, auto: false, progress: 0, running: false })), research: RESEARCH.map(() => false), claimed: [], last: now, boostUntil: 0, boostReady: 0 };
}
export const money = (v: number) => {
  if (v < 1000) return '$' + Math.floor(v).toLocaleString('en-US');
  const units = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx'];
  const tier = Math.min(units.length - 1, Math.floor(Math.log10(Math.max(1, v)) / 3));
  return '$' + (v / (1000 ** tier)).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 0 }) + units[tier];
};
export function multiplier(level: number) { return 2 ** [10, 25, 50, 100, 200].filter(n => level >= n).length; }
export function payout(g: Game, i: number) { return LINES[i].base * g.lines[i].level * multiplier(g.lines[i].level) * (1 + g.points * .25) * (g.research[0] ? 1.5 : 1) * (g.research[2] ? 2 : 1); }
export function duration(g: Game, i: number) { return LINES[i].time / (g.research[1] ? 1.3 : 1) / (g.research[3] ? 1.4 : 1); }
export function upgradePrice(g: Game, i: number) { return Math.ceil(LINES[i].upgrade * 1.14 ** (g.lines[i].level - 1)); }
export function autoRate(g: Game) { return g.lines.reduce((sum, l, i) => sum + (l.auto ? payout(g, i) / duration(g, i) : 0), 0); }
export function prestigePoints(g: Game) { return Math.floor(Math.sqrt(g.runEarned / 1e6)); }
export const GOALS = [
  { name: 'Find your rhythm', desc: 'Upgrade the scrap press to level 10.', target: 10, reward: 80, value: (g: Game) => g.lines[0].level },
  { name: 'Hands off', desc: 'Automate two production lines.', target: 2, reward: 400, value: (g: Game) => g.lines.filter(l => l.auto).length },
  { name: 'Room to grow', desc: 'Open three production lines.', target: 3, reward: 4000, value: (g: Game) => g.lines.filter(l => l.level).length },
  { name: 'The night crew', desc: 'Automate four production lines.', target: 4, reward: 60000, value: (g: Game) => g.lines.filter(l => l.auto).length },
  { name: 'Industrial empire', desc: 'Open every production line.', target: 6, reward: 1000000, value: (g: Game) => g.lines.filter(l => l.level).length },
];
function earn(g: Game, amount: number) { g.cash += amount; g.runEarned += amount; g.allEarned += amount; }
export function tick(state: Game, now = Date.now()): Game {
  const g = structuredClone(state);
  const elapsed = Math.min(8 * 3600, Math.max(0, (now - g.last) / 1000));
  const boosted = Math.min(elapsed, Math.max(0, (Math.min(now, g.boostUntil) - g.last) / 1000));
  const work = elapsed + boosted * 2;
  g.lines.forEach((line, i) => {
    if (!line.level || (!line.running && !line.auto)) return;
    const progress = line.progress + work / duration(g, i);
    const completed = Math.floor(progress + 1e-10);
    if (line.auto) { earn(g, completed * payout(g, i)); line.progress = Math.max(0, progress - completed); line.running = true; }
    else if (completed) { earn(g, payout(g, i)); line.progress = 0; line.running = false; }
    else line.progress = progress;
  });
  g.last = now;
  return g;
}
export type Action = { type: 'run' | 'upgrade' | 'automate' | 'unlock' | 'research' | 'claim'; index: number; count?: number } | { type: 'boost' } | { type: 'prestige' };
export function act(state: Game, action: Action, now = Date.now()): { game: Game; message: string; ok: boolean } {
  let g = tick(state, now); let message = ''; let ok = false;
  const pay = (cost: number) => { if (g.cash + 1e-7 < cost) return false; g.cash = Math.max(0, g.cash - cost); return true; };
  if (action.type === 'boost') {
    if (g.boostReady <= now) { g.boostUntil = now + 12000; g.boostReady = now + 60000; message = 'Overdrive! Production is 3× faster for 12 seconds.'; ok = true; }
  } else if (action.type === 'prestige') {
    const points = prestigePoints(g);
    if (points > 0) { g = fresh(now, g.points + points, g.shifts + 1, g.allEarned); message = `New shift. +${points} blueprint${points === 1 ? '' : 's'} secured.`; ok = true; }
  } else {
    const i = action.index;
    if (!Number.isInteger(i) || i < 0) return { game: g, message: 'Unknown item.', ok: false };
    if (action.type === 'claim') {
      const goal = GOALS[i];
      if (goal && !g.claimed.includes(i) && goal.value(g) >= goal.target) { earn(g, goal.reward); g.claimed.push(i); ok = true; message = `Contract complete. ${money(goal.reward)} paid.`; }
    } else if (action.type === 'research') {
      if (RESEARCH[i] && !g.research[i] && pay(RESEARCH[i].cost)) { g.research[i] = true; ok = true; message = `${RESEARCH[i].name} installed.`; }
    } else if (LINES[i]) {
      const line = g.lines[i];
      if (action.type === 'run' && line.level && !line.running && !line.auto) { line.running = true; ok = true; }
      if (action.type === 'unlock' && !line.level && (i === 0 || g.lines[i - 1].level > 0) && pay(LINES[i].unlock)) { line.level = 1; ok = true; message = `${LINES[i].name} is open for business.`; }
      if (action.type === 'automate' && line.level && !line.auto && pay(LINES[i].manager)) { line.auto = true; line.running = true; ok = true; message = `${LINES[i].name} now runs itself, even while you’re away.`; }
      if (action.type === 'upgrade' && line.level) {
        const count = Math.min(200, Math.max(1, Math.floor(action.count || 1)));
        let bought = 0; const before = multiplier(line.level);
        while (bought < count && line.level < 200 && pay(upgradePrice(g, i))) { line.level++; bought++; }
        ok = bought > 0;
        if (multiplier(line.level) > before) message = `${LINES[i].name}: level ${line.level}! Earnings multiplier doubled.`;
      }
    }
  }
  return { game: g, message: message || (ok ? '' : 'Not available yet.'), ok };
}
export function validGame(value: unknown): value is Game {
  if (!value || typeof value !== 'object') return false;
  const g = value as Game;
  const finite = (n: unknown, max = 1e100) => typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= max;
  return g.version === 1 && [g.cash, g.runEarned, g.allEarned].every(n => finite(n))
    && [g.points, g.shifts].every(n => finite(n, 1e12) && Number.isInteger(n))
    && [g.last, g.boostUntil, g.boostReady].every(n => finite(n, Date.now() + 120000))
    && Array.isArray(g.lines) && g.lines.length === LINES.length && g.lines.every(l => l && Number.isInteger(l.level) && finite(l.level, 200) && typeof l.auto === 'boolean' && typeof l.running === 'boolean' && finite(l.progress, 1))
    && g.lines[0].level >= 1 && g.lines.every((l, i) => l.level > 0 ? i === 0 || g.lines[i - 1].level > 0 : !l.auto && !l.running)
    && Array.isArray(g.research) && g.research.length === RESEARCH.length && g.research.every(v => typeof v === 'boolean')
    && Array.isArray(g.claimed) && g.claimed.length <= GOALS.length && g.claimed.every(n => Number.isInteger(n) && n >= 0 && n < GOALS.length) && new Set(g.claimed).size === g.claimed.length;
}
