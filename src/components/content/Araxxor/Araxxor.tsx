import { useContext, useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import { BaseContext } from '../../base/Base';
import './araxxor.css';

export const Araxxor = () => {
  const baseContext = useContext(BaseContext);
  useEffect(() => baseContext.setTitle('Araxxor'));

  // Use the same timing model as Cerberus: 6 ticks = 3.6s per standard attack.
  const ATTACK_INTERVAL_MS = 3600;
  const TICK_MS = 100;

  // Canonical wiki-derived paragraphs (source: wiki/Araxxor_Strategies - OSRS Wiki.html)
  const paragraphs = [
    "Around Araxxor's lair, there are nine eggs; three each of red, white, and green. The first egg hatches after three standard attacks from Araxxor, hatching clockwise starting from the south-easternmost egg, with subsequent eggs hatching after every six standard attacks.",
    "Every six standard attacks, Araxxor will use the same one of three possible special attacks for the remainder of the fight, which can be quickly determined by identifying the south-easternmost egg. All of these attacks leave acid pools that inflict venom and increasing damage the longer the player stands in them.",
    "The three possible egg rotation patterns are: Green → White → Red, White → Red → Green, and Red → Green → White. Identifying the south-easternmost egg determines the rotation and thus which special will be used."
  ];

  // Specials table derived from the wiki (only specials — autos are skipped).
  const specials = [
    {
      num: 1,
      name: 'Acid Ball',
      description: "Araxxor launches a projectile in a straight line that leaves acidic pools and splatters on impact (high venom/damage).",
      attacksBetween: 6,
    },
    {
      num: 2,
      name: 'Acid Splatter',
      description: "Araxxor launches venom blobs in a wide arc that leave acid pools (low venom damage per hit).",
      attacksBetween: 6,
    },
    {
      num: 3,
      name: 'Acid Drip',
      description: "Araxxor launches a homing venom blob that trails acid pools for several ticks; players should continuously move to avoid the pools.",
      attacksBetween: 6,
    },
  ].map(s => ({ ...s, delayMs: s.attacksBetween * ATTACK_INTERVAL_MS }));

  const [running, setRunning] = useState(false);
  const [timeLeftMs, setTimeLeftMs] = useState(() => specials[0]?.delayMs ?? ATTACK_INTERVAL_MS);
  const specialIndex = useRef(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      if (timerRef.current == null) {
        setTimeLeftMs(specials[specialIndex.current]?.delayMs ?? ATTACK_INTERVAL_MS);
      }
      timerRef.current = window.setInterval(() => {
        setTimeLeftMs(prev => {
          const next = prev - TICK_MS;
          if (next <= 0) {
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
      <h2>Araxxor — Specials (source: provided wiki HTML)</h2>
      {paragraphs.map((p, i) => <p key={i}>{p}</p>)}

      <div style={{ margin: '12px 0' }}>
        <Button type={running ? 'default' : 'primary'} onClick={() => { if (!running) { specialIndex.current = 0; setTimeLeftMs(specials[0]?.delayMs ?? ATTACK_INTERVAL_MS); } setRunning(r => !r); }}>
          {running ? 'Stop Timer' : 'Start Timer'}
        </Button>
      </div>

      <div>Current special #: <strong>{current.num}</strong></div>
      <div>Current special: <strong>{current.name}</strong></div>
      <div>Time until next special: <strong>{(timeLeftMs/1000).toFixed(1)}s</strong></div>
      <div style={{ marginTop: 12 }}>Next special: <strong>{next.num} — {next.name}</strong></div>

      <h3 style={{ marginTop: 18 }}>Special attacks (with delay until next special)</h3>
      <ol>
        {specials.map(s => (
          <li key={s.num}>{s.num}: {s.name} — {s.description} — delay to next: {(s.delayMs/1000).toFixed(1)}s</li>
        ))}
      </ol>

      <p style={{ marginTop: 12 }}><em>Note:</em> Araxxor enrages under 255 HP, increasing attack speed (6 ticks → 4 ticks). This component currently models the standard 6-tick attack cycle; enrage adjustments are not simulated.</p>
    </div>
  );
}

export default Araxxor;
