import { useContext, useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import { BaseContext } from '../../base/Base';
import './cerberus.css';

export const Cerberus = () => {
  const baseContext = useContext(BaseContext);
  useEffect(() => baseContext.setTitle('Cerberus'));

  // Timer state: Cerberus cycles every 3.6s per attack (six ticks). We'll use a 100ms internal tick to show a countdown with one decimal.
  const ATTACK_INTERVAL_MS = 3600;

  // Canonical rules and timing copied from the provided wiki HTML (source file: wiki/Cerberus_Strategies - OSRS Wiki.html)
  const rulesParagraphs = [
    "Cerberus has a special attack pattern that determines how she uses her attacks.",
    "As mentioned in each attack section, Cerberus' mechanics are initiated after the following, quickly summarized here:",
  ];

  const ruleBullets = [
    "The triple attack is performed as the first attack, then after every ten normal attacks.",
    "The summoned souls attack is performed every seventh attack, but only after Cerberus has under 400 hitpoints.",
    "The lava pools are deployed every fifth attack, but only after Cerberus has under 200 hitpoints.",
  ];

  const priority = "If the attacks end up overlapping with each other (e.g a triple attack and summoned souls on attack #21), Cerberus will instead prioritise the attacks in the following order: Triple attack > Summoned Souls > Lava pools";
  const randomNote = "There is also a 10% chance that Cerberus will not use the summoned souls or lava pools special attacks when she is supposed to, and will use a regular attack instead.";
  const cycleNote = "Cerberus attacks on a six-tick (3.6s) cycle.";

  // Full attack table (1..28) as found in the wiki HTML. We'll condense this into a
  // `specials` array that omits 'Auto' entries and stores how long until the next special.
  const fullAttackTable: {num: number; type: string; condition?: string}[] = [
    { num: 1, type: 'COMBO' },
    { num: 2, type: 'Auto' },
    { num: 3, type: 'Auto' },
    { num: 4, type: 'Auto' },
    { num: 5, type: 'LAVA', condition: 'Only if < 200 HP' },
    { num: 6, type: 'Auto' },
    { num: 7, type: 'GHOSTS', condition: 'Only if < 400 HP' },
    { num: 8, type: 'Auto' },
    { num: 9, type: 'Auto' },
    { num: 10, type: 'LAVA', condition: 'Only if < 200 HP' },
    { num: 11, type: 'COMBO' },
    { num: 12, type: 'Auto' },
    { num: 13, type: 'Auto' },
    { num: 14, type: 'GHOSTS', condition: 'Only if < 400 HP' },
    { num: 15, type: 'LAVA', condition: 'Only if < 200 HP' },
    { num: 16, type: 'Auto' },
    { num: 17, type: 'Auto' },
    { num: 18, type: 'Auto' },
    { num: 19, type: 'Auto' },
    { num: 20, type: 'LAVA', condition: 'Only if < 200 HP' },
    { num: 21, type: 'COMBO' },
    { num: 22, type: 'Auto' },
    { num: 23, type: 'Auto' },
    { num: 24, type: 'Auto' },
    { num: 25, type: 'LAVA', condition: 'Only if < 200 HP' },
    { num: 26, type: 'Auto' },
    { num: 27, type: 'Auto' },
    { num: 28, type: 'GHOSTS', condition: 'Only if < 400 HP' },
  ];

  // Build `specials` by extracting non-Auto entries and computing the delay (ms)
  // to the next special based on number of attacks in-between * ATTACK_INTERVAL_MS.
  const specialIndices: number[] = [];
  fullAttackTable.forEach((a, i) => { if (a.type !== 'Auto') specialIndices.push(i); });

  const specials: { num: number; type: string; condition?: string; delayMs: number }[] = specialIndices.map((idx, i, arr) => {
    const nextIdx = arr[(i + 1) % arr.length];
    // distance in attacks between this special and the next special
    let distance = (nextIdx - idx + fullAttackTable.length) % fullAttackTable.length;
    if (distance === 0) distance = fullAttackTable.length;
    const delayMs = distance * ATTACK_INTERVAL_MS;
    const entry = fullAttackTable[idx];
    return { num: entry.num, type: entry.type, condition: entry.condition, delayMs };
  });
  const TICK_MS = 100;

  const [running, setRunning] = useState(false);
  const [timeLeftMs, setTimeLeftMs] = useState(() => (specials.length ? specials[0].delayMs : ATTACK_INTERVAL_MS));
  const specialIndex = useRef(0); // 0-based index into specials
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      // reset to start when starting
      if (timerRef.current == null) {
        setTimeLeftMs(specials[specialIndex.current]?.delayMs ?? ATTACK_INTERVAL_MS);
      }
      timerRef.current = window.setInterval(() => {
        setTimeLeftMs(prev => {
          const next = prev - TICK_MS;
          if (next <= 0) {
            // advance to the next special (we step between specials using their delayMs)
            specialIndex.current = (specialIndex.current + 1) % specials.length;
            return specials[specialIndex.current].delayMs;
          }
          return next;
        });
      }, TICK_MS);
    } else {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    }
    return () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } }
  }, [running]);

  const current = specials[specialIndex.current];
  const next = specials[(specialIndex.current + 1) % specials.length];

  return (
    <div>
      <h2>Cerberus — Attack pattern (source: provided wiki HTML)</h2>
      {rulesParagraphs.map((p, i) => <p key={i}>{p}</p>)}
      <ul>
        {ruleBullets.map((b, i) => <li key={i}>{b}</li>)}
      </ul>
      <p>{priority}</p>
      <p>{randomNote}</p>
      <p>{cycleNote}</p>

      <div style={{ margin: '12px 0' }}>
        <Button type={running ? 'default' : 'primary'} onClick={() => { if (!running) { specialIndex.current = 0; setTimeLeftMs(specials[0]?.delayMs ?? ATTACK_INTERVAL_MS); } setRunning(r => !r); }}>
          {running ? 'Stop Timer' : 'Start Timer'}
        </Button>
      </div>

      <div>Current special attack #: <strong>{current.num}</strong></div>
      <div>Current special type: <strong>{current.type}{current.condition ? ` (${current.condition})` : ''}</strong></div>
      <div>Time until next special: <strong>{(timeLeftMs/1000).toFixed(1)}s</strong></div>
      <div style={{ marginTop: 12 }}>Next special: <strong>{next.num} — {next.type}{next.condition ? ` (${next.condition})` : ''}</strong></div>

      <h3 style={{ marginTop: 18 }}>Special attacks (with delay until next special)</h3>
      <ol>
        {specials.map(s => (
          <li key={s.num}>{s.num}: {s.type}{s.condition ? ` — ${s.condition}` : ''} — delay to next: {(s.delayMs/1000).toFixed(1)}s</li>
        ))}
      </ol>
    </div>
  );
};

export default Cerberus;
