'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Factory, Cog, Cpu, Fan, Bot, Atom, Hammer, Zap, Play, LockKeyhole, Check, Volume2, VolumeX, BookOpen, Trophy, RotateCcw, FlaskConical, CloudCheck, LoaderCircle, X, CircleHelp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Toaster, toast } from 'sonner';
import { act, autoRate, duration, fresh, GOALS, LINES, money, multiplier, payout, prestigePoints, RESEARCH, tick, upgradePrice, validGame, type Action, type Game } from '@/lib/game';

const ICONS = [Hammer, Cog, Cpu, Fan, Bot, Atom];
type ContextAPI = { registerTool: (tool: { name: string; title: string; description: string; inputSchema: object; annotations: object; execute: (input: unknown) => unknown }, options: { signal: AbortSignal }) => unknown };

export default function Home() {
  const [game, setGame] = useState<Game>(() => fresh());
  const state = useRef(game);
  const revision = useRef(0);
  const ready = useRef(false);
  const saving = useRef(false);
  const blocked = useRef(false);
  const queued = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [saveStatus, setSaveStatus] = useState('Loading');
  const [saveError, setSaveError] = useState('');
  const [conflict, setConflict] = useState(false);
  const [buy, setBuy] = useState(1);
  const [sound, setSound] = useState(false);
  const soundRef = useRef(false);
  const audio = useRef<AudioContext | null>(null);
  const [help, setHelp] = useState(false);
  const [away, setAway] = useState<{ amount: number; minutes: number } | null>(null);
  const [paid, setPaid] = useState<Record<number, { amount: number; key: number }>>({});

  const commit = useCallback((g: Game) => { state.current = g; setGame(g); }, []);
  const save = useCallback(async function save(keepalive = false) {
    if (!ready.current || blocked.current) return;
    if (saving.current) { queued.current = true; return; }
    saving.current = true; setSaveStatus('Saving');
    const snapshot = tick(state.current); commit(snapshot);
    try {
      const response = await fetch('/api/game', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ state: snapshot, revision: revision.current }), keepalive });
      const result = await response.json() as { state: unknown; revision: number; error?: string };
      if (response.status === 409) { blocked.current = true; setConflict(true); }
      if (!response.ok) throw new Error(result.error || 'Save interrupted. Please retry.');
      revision.current = result.revision;
      setSaveStatus('Saved'); setSaveError('');
    } catch (error) {
      setSaveStatus('Not saved'); setSaveError(error instanceof Error ? error.message : 'Save interrupted. Please retry.');
    } finally {
      saving.current = false;
      if (queued.current && !blocked.current) { queued.current = false; void save(); }
    }
  }, [commit]);

  const load = useCallback(async () => {
    setLoadError(''); setSaveStatus('Loading');
    try {
      const response = await fetch('/api/game', { cache: 'no-store' });
      const result = await response.json() as { state: unknown; revision: number; error?: string };
      if (!response.ok) throw new Error(result.error || 'Could not load your factory.');
      if (!validGame(result.state)) throw new Error('Could not read your factory save.');
      const before = result.state as Game;
      const current = tick(before);
      const income = current.cash - before.cash;
      const minutes = Math.min(480, Math.floor((Date.now() - before.last) / 60000));
      if (income > 0 && minutes >= 1) setAway({ amount: income, minutes });
      revision.current = result.revision;
      commit(current); ready.current = true; blocked.current = false;
      setConflict(false); setLoaded(true); setSaveStatus('Saved');
      void save();
    } catch (error) { setLoadError(error instanceof Error ? error.message : 'Could not load your factory.'); }
  }, [commit, save]);

  useEffect(() => {
    try { const enabled = localStorage.getItem('night-shift-sound') === 'true'; setSound(enabled); soundRef.current = enabled; } catch { /* Preference storage can be unavailable. */ }
    void load();
    const clock = setInterval(() => {
      if (!ready.current || blocked.current || document.hidden) return;
      const before = state.current; const after = tick(before);
      const receipts: Record<number, { amount: number; key: number }> = {};
      before.lines.forEach((l, i) => { if (l.level && (l.running || l.auto) && (after.lines[i].progress < l.progress || (l.running && !after.lines[i].running))) receipts[i] = { amount: payout(before, i), key: Date.now() }; });
      if (Object.keys(receipts).length) setPaid(old => ({ ...old, ...receipts }));
      commit(after);
    }, 80);
    const autoSave = setInterval(() => { void save(); }, 15000);
    const visibility = () => { if (document.hidden) void save(true); else if (ready.current && !blocked.current) commit(tick(state.current)); };
    const closing = () => { void save(true); };
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('pagehide', closing);
    return () => { clearInterval(clock); clearInterval(autoSave); if (timer.current) clearTimeout(timer.current); document.removeEventListener('visibilitychange', visibility); window.removeEventListener('pagehide', closing); };
  }, [load, commit, save]);

  const ping = useCallback(() => {
    if (!soundRef.current) return;
    try {
      audio.current ||= new AudioContext(); const ctx = audio.current; void ctx.resume();
      const oscillator = ctx.createOscillator(); const gain = ctx.createGain(); oscillator.connect(gain); gain.connect(ctx.destination);
      oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(520, ctx.currentTime); oscillator.frequency.exponentialRampToValueAtTime(820, ctx.currentTime + .07);
      gain.gain.setValueAtTime(.04, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .12); oscillator.start(); oscillator.stop(ctx.currentTime + .13);
    } catch { /* Sound is optional. */ }
  }, []);

  const perform = useCallback((action: Action) => {
    if (!ready.current || blocked.current) return { ok: false, message: 'Load your factory first.' };
    const result = act(state.current, action);
    commit(result.game);
    if (result.ok) {
      ping(); if (result.message) toast.success(result.message);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => { void save(); }, 500);
    }
    return { ok: result.ok, message: result.message, cash: result.game.cash };
  }, [commit, ping, save]);

  useEffect(() => {
    const context = (document as Document & { modelContext?: ContextAPI }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = (tool: Parameters<ContextAPI['registerTool']>[0]) => { try { Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {}); } catch { /* Optional browser API. */ } };
    register({ name: 'read_factory', title: 'Read factory', description: 'Read cash, production lines, automation, and available permanent bonuses.', inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true, untrustedContentHint: false }, execute: () => ({ loaded: ready.current, cash: state.current.cash, automatedIncomePerSecond: autoRate(state.current), lines: state.current.lines.map((l, i) => ({ name: LINES[i].name, ...l })), blueprints: state.current.points }) });
    register({ name: 'operate_factory', title: 'Operate factory', description: 'Start a batch, buy upgrades, unlock a line, hire a manager, purchase research, claim a contract, or activate overdrive in the visible game. Indexes start at zero. Does not reset the factory.', inputSchema: { type: 'object', properties: { type: { type: 'string', enum: ['run', 'upgrade', 'unlock', 'automate', 'research', 'claim', 'boost'] }, index: { type: 'integer', minimum: 0, maximum: 5 }, count: { type: 'integer', minimum: 1, maximum: 200 } }, required: ['type'], additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false }, execute: (input) => {
      if (!input || typeof input !== 'object') throw new Error('Expected an action.');
      const a = input as Record<string, unknown>;
      if (!['run','upgrade','unlock','automate','research','claim','boost'].includes(String(a.type))) throw new Error('Unknown action.');
      if (a.type !== 'boost' && (!Number.isInteger(a.index) || Number(a.index) < 0 || Number(a.index) > 5)) throw new Error('Invalid index.');
      if (a.count !== undefined && (!Number.isInteger(a.count) || Number(a.count) < 1 || Number(a.count) > 200)) throw new Error('Invalid count.');
      return perform(a as Action);
    } });
    return () => lifecycle.abort();
  }, [perform]);

  const active = game.lines.filter(l => l.level).length;
  const automated = game.lines.filter(l => l.auto).length;
  const isBoosted = game.boostUntil > game.last;
  const boostCooldown = Math.max(0, Math.ceil((game.boostReady - game.last) / 1000));
  const goalIndex = GOALS.findIndex((_, i) => !game.claimed.includes(i));
  const goal = GOALS[goalIndex];
  const points = prestigePoints(game);

  return <main className={isBoosted ? 'game overdrive' : 'game'}>
    <Toaster position="bottom-center" theme="dark" richColors />
    <header className="masthead">
      <a href="/classic" className="brand" aria-label="Original Night Shift factory"><span className="brand-icon"><Factory size={27} strokeWidth={1.8} /></span><span>NIGHT<span className="brand-second">SHIFT</span></span><span className="edition">IDLE INDUSTRIES</span></a>
      <div className="header-actions"><a href="/" style={{color:"#fbb454",fontSize:14,marginRight:12}}>Gear Works</a><span className={`save-status ${saveError ? 'error-text' : ''}`}><CloudCheck size={15} />{saveStatus}</span><button className="icon-button" aria-label={sound ? 'Turn sound off' : 'Turn sound on'} aria-pressed={sound} onClick={() => { const next = !sound; setSound(next); soundRef.current = next; try { localStorage.setItem('night-shift-sound', String(next)); } catch {} if (next) ping(); }}>{sound ? <Volume2 size={19} /> : <VolumeX size={19} />}</button><button className="icon-button" aria-label="How to play" aria-expanded={help} onClick={() => setHelp(!help)}><CircleHelp size={19} /></button></div>
    </header>
    {help && <section className="help-panel"><div><h2>Clock in. Build up. Step back.</h2><p>Start a batch to earn cash. Upgrade the line to make each batch worth more, then hire a manager to keep it running. Earnings double at levels 10, 25, 50, 100, and 200.</p><p>Overdrive triples production speed for 12 seconds. Automated lines earn while you’re away, up to 8 hours. Earn $1M in a shift to restart with permanent blueprints: each adds 25% to all earnings.</p></div><button className="icon-button" onClick={() => setHelp(false)} aria-label="Close help"><X size={20} /></button></section>}
    {!loaded ? <section className="loading-screen"><Factory size={54} /><h1>{loadError ? 'The factory is waiting.' : 'Clocking in…'}</h1><p>{loadError || 'Loading your production lines.'}</p>{loadError ? <div className="loading-actions"><button className="primary-button" onClick={() => void load()}>Try again</button>{loadError.includes('sign in') && <a className="secondary-button" href="/signin-with-chatgpt?return_to=%2F" target="_top">Sign in with ChatGPT</a>}</div> : <LoaderCircle className="spin" size={24} />}</section> : <>
      {saveError && <div className="error-banner" role="alert"><p>{saveError}</p><button onClick={() => conflict ? window.location.reload() : void save()}>{conflict ? 'Reload factory' : 'Retry save'}</button></div>}
      {away && <div className="away-banner"><div><strong>Welcome back. Your crew kept working.</strong><span>Earned {money(away.amount)} during {away.minutes >= 60 ? `${Math.floor(away.minutes / 60)}h ${away.minutes % 60}m` : `${away.minutes}m`} away. Already in your balance.</span></div><button className="icon-button" onClick={() => setAway(null)} aria-label="Dismiss offline earnings"><X size={19} /></button></div>}
      <section className="balance-bar" aria-label="Factory balance">
        <div className="balance-main"><div className="eyebrow">AVAILABLE CASH <span>SHIFT {String(game.shifts + 1).padStart(2, '0')}</span></div><h1>{money(game.cash)}</h1><div className="earning-rate"><span className="live-dot" /><strong>{money(autoRate(game) * (isBoosted ? 3 : 1))}<small> / sec</small></strong><span>automated income</span></div></div>
        <div className="factory-stats"><div><span>PRODUCTION</span><strong>{active}<small> / 6</small></strong><p>lines open</p></div><div><span>AUTOMATION</span><strong>{automated}<small> / {active}</small></strong><p>managers hired</p></div><div><span>PERMANENT</span><strong>+{game.points * 25}<small>%</small></strong><p>earnings bonus</p></div></div>
        <button className={`boost-button ${isBoosted ? 'boosting' : ''}`} onClick={() => perform({ type: 'boost' })} disabled={boostCooldown > 0 || conflict}><Zap size={26} fill="currentColor" /><span><strong>{isBoosted ? 'OVERDRIVE ACTIVE' : 'OVERDRIVE'}</strong><small>{isBoosted ? `${Math.ceil((game.boostUntil - game.last) / 1000)}s of 3× speed` : boostCooldown > 0 ? `Ready in ${boostCooldown}s` : '3× speed · 12 seconds'}</small></span></button>
      </section>
      <div className="game-grid"><section className="production" aria-label="Production lines">
        <div className="section-heading"><div><span className="eyebrow">THE FACTORY FLOOR</span><h2>Make something.</h2></div><div className="buy-control" aria-label="Upgrade purchase quantity"><span>BUY</span>{[1, 10, 200].map(n => <button key={n} aria-pressed={buy === n} onClick={() => setBuy(n)}>{n === 200 ? 'MAX' : `×${n}`}</button>)}</div></div>
        {!automated && <div className="first-tip"><Play size={15} fill="currentColor" /><span>Start a batch below. Save {money(LINES[0].manager)} to hire your first manager.</span></div>}
        <div className="lines">{LINES.map((line, i) => {
          const l = game.lines[i]; const Icon = ICONS[i]; const unlocked = l.level > 0; const available = i === 0 || game.lines[i - 1].level > 0;
          const nextMilestone = [10, 25, 50, 100, 200].find(n => n > l.level);
          let amount = 0, cost = 0;
          for (let n = 0; n < buy && l.level + n < 200; n++) { const c = Math.ceil(line.upgrade * 1.14 ** (l.level + n - 1)); if (cost + c > game.cash + 1e-7) break; cost += c; amount++; }
          return <article key={line.name} className={`line ${unlocked ? 'unlocked' : 'locked'} ${l.auto ? 'automated' : ''}`} style={{ '--line-color': line.color } as React.CSSProperties}>
            <div className="line-top"><div className={`machine-icon ${l.running ? 'working' : ''}`}><Icon size={29} strokeWidth={1.7} /></div><div className="line-title"><span className="line-number">LINE {String(i + 1).padStart(2, '0')}</span><h3>{line.name}</h3><p>{line.product}</p></div>{unlocked ? <div className="level"><span>LVL</span><strong>{l.level}</strong></div> : <LockKeyhole className="lock-icon" size={19} />}</div>
            {unlocked ? <><div className="production-details"><strong>{money(payout(game, i))}<small> / batch</small></strong><span>{(duration(game, i) / (isBoosted ? 3 : 1)).toFixed(1)} sec{multiplier(l.level) > 1 && <b className="multiplier">{multiplier(l.level)}×</b>}</span></div>
              <button className={`run-button ${l.running ? 'running' : ''} ${!l.running && !l.auto ? 'ready-to-run' : ''}`} disabled={l.running || l.auto || conflict} onClick={() => perform({ type: 'run', index: i })} aria-label={l.auto ? `${line.name} automated` : `Start ${line.name} batch`}><span className="run-fill" style={{ width: `${l.progress * 100}%` }} /><span className="run-label">{l.auto ? <><Cog size={17} className="spin" /> AUTOMATED</> : l.running ? <><LoaderCircle size={17} className="spin" /> PRODUCING</> : <><Play size={17} fill="currentColor" /> START BATCH</>}</span><span className="run-value">{l.running ? `${Math.max(0, duration(game, i) * (1 - l.progress) / (isBoosted ? 3 : 1)).toFixed(1)}s` : `+${money(payout(game, i))}`}</span></button>
              {paid[i] && <span key={paid[i].key} className="cash-pop" aria-hidden="true">+{money(paid[i].amount)}</span>}
              <div className="line-buttons"><button className="upgrade-button" disabled={!amount || l.level >= 200 || conflict} onClick={() => perform({ type: 'upgrade', index: i, count: buy })}><span>{l.level >= 200 ? 'MAX LEVEL' : `UPGRADE ${amount > 1 ? `×${amount}` : '+1'}`}</span><strong>{l.level >= 200 ? <Check size={17} /> : money(amount ? cost : upgradePrice(game, i))}</strong></button><button className={`manager-button ${l.auto ? 'hired' : ''}`} disabled={l.auto || game.cash < line.manager || conflict} onClick={() => perform({ type: 'automate', index: i })}><span>{l.auto ? <><Check size={14} /> MANAGER HIRED</> : 'HIRE MANAGER'}</span><strong>{l.auto ? 'Runs automatically' : money(line.manager)}</strong></button></div>
              <div className="milestone-track"><span>{nextMilestone ? `Level ${nextMilestone}: 2× earnings` : 'All milestones complete'}</span>{nextMilestone && <Progress value={l.level / nextMilestone * 100} aria-label={`${line.name} next level milestone`} />}</div>
            </> : <div className="unlock-row"><span>{available ? 'New line. Bigger returns.' : `Open ${LINES[i - 1].name.toLowerCase()} first.`}</span><button disabled={!available || game.cash < line.unlock || conflict} onClick={() => perform({ type: 'unlock', index: i })}>{available ? 'OPEN LINE' : 'LOCKED'}<strong>{money(line.unlock)}</strong></button></div>}
          </article>;
        })}</div>
      </section>
      <aside className="management">
        <section className="contract-panel"><div className="panel-heading"><Trophy size={19} /><span>SHIFT CONTRACT</span><small>{game.claimed.length}/{GOALS.length}</small></div>{goal ? <><h3>{goal.name}</h3><p>{goal.desc}</p><Progress className="contract-progress" value={Math.min(100, goal.value(game) / goal.target * 100)} aria-label="Contract progress" /><div className="contract-numbers"><span>{Math.min(goal.target, goal.value(game))} / {goal.target}</span><strong>+{money(goal.reward)}</strong></div><button className="contract-claim" disabled={goal.value(game) < goal.target || conflict} onClick={() => perform({ type: 'claim', index: goalIndex })}>{goal.value(game) >= goal.target ? 'COLLECT REWARD' : 'IN PROGRESS'}</button></> : <><h3>Good shift.</h3><p>Every contract is complete. A new shift brings a fresh set.</p><span className="complete-seal"><Check size={18} /> All rewards collected</span></>}</section>
        <section className="research-panel"><div className="panel-heading"><FlaskConical size={19} /><span>FACTORY UPGRADES</span></div>{RESEARCH.map((r, i) => <div className={`research-item ${game.research[i] ? 'purchased' : ''}`} key={r.name}><div><h3>{r.name}</h3><p>{r.desc}</p></div><button disabled={game.research[i] || game.cash < r.cost || conflict} onClick={() => perform({ type: 'research', index: i })} aria-label={game.research[i] ? `${r.name} installed` : `Buy ${r.name} for ${money(r.cost)}`}>{game.research[i] ? <Check size={19} /> : money(r.cost)}</button></div>)}</section>
        <section className="prestige-panel"><div className="panel-heading"><BookOpen size={19} /><span>THE NEXT SHIFT</span></div><h3>Build it better.</h3><p>Restart your factory with permanent blueprints. Each blueprint adds <strong>25% to all future earnings.</strong></p><div className="blueprints"><div><strong>{game.points}</strong><span>OWNED</span></div><div><strong>+{points}</strong><span>ON RESTART</span></div></div><AlertDialog><AlertDialogTrigger asChild><button className="prestige-button" disabled={points === 0 || conflict}><RotateCcw size={17} /> START A NEW SHIFT</button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Clock in for a new shift?</AlertDialogTitle><AlertDialogDescription>You will gain {points} blueprint{points === 1 ? '' : 's'}, bringing your permanent earnings bonus to {(game.points + points) * 25}%. Your cash, machines, managers, research, and contracts reset. Existing blueprints and lifetime earnings stay.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Keep this factory</AlertDialogCancel><AlertDialogAction onClick={() => perform({ type: 'prestige' })}>Start new shift</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog><small className="next-blueprint">Next blueprint at {money((points + 1) ** 2 * 1e6)} earned this shift.</small><div className="lifetime"><span>This shift</span><strong>{money(game.runEarned)}</strong><span>Lifetime earned</span><strong>{money(game.allEarned)}</strong></div></section>
        <p className="shift-note">Take a break. Your managers won’t.<br />Up to 8 hours of offline production.</p>
      </aside></div>
      <footer><span><Factory size={15} /> NIGHT SHIFT INDUSTRIES</span><span>One more upgrade.</span></footer>
    </>}
  </main>;
}
