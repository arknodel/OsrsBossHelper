import { useContext, useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import { BaseContext } from '../../base/Base';
import './araxxor.css';

export const Araxxor = () => {
  const baseContext = useContext(BaseContext);
  useEffect(() => baseContext.setTitle('Araxxor'));

  // Concise Araxxor guide + canonical repeating mechanic sequence (summary from OSRS Wiki):
  // Araxxor encounters include a repeating set of mechanics and path-dependent modifiers.
  const pattern = [
    'Acid Webs — Webs that damage and restrict movement; avoid standing in webs.',
    'Leap & Bite — Araxxor leaps and does a frontal bite/cleave; dodge or tank with prayers.',
    'Spawn Minions — Spiderlings spawn that must be cleared quickly.',
    'Web Explosion / Reconfiguration — Araxxor places dangerous web zones; reposition.'
  ];

  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(6);
  const indexRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  const nextAction = () => pattern[(indexRef.current + 1) % pattern.length] ?? '—';

  useEffect(() => {
    if (running) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            indexRef.current = (indexRef.current + 1) % pattern.length;
            return 6;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    }
    return () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } }
  }, [running]);

  return (
    <div>
      <div className="margin-bottom-md">Araxxor concise guide (from OSRS wiki):</div>

      <ul>
        <li><strong>Acid Webs:</strong> Avoid standing in webs; clear webs with movement.</li>
        <li><strong>Leap & Bite:</strong> Telegraphed leap — move or protect from melee.</li>
        <li><strong>Spawn Minions:</strong> Spiderlings appear — kill or kite them quickly.</li>
        <li><strong>Web Explosion / Reconfiguration:</strong> Reposition to safe ground.</li>
      </ul>

      <div className="margin-bottom-md">
        <Button type={running ? "default" : "primary"} onClick={() => { setRunning(!running); if (!running) { indexRef.current = 0; setTimeLeft(6); } }}>
          {running ? "Stop Timer" : "Start Timer"}
        </Button>
      </div>

      <div className="margin-bottom-md">Time until next action: <strong>{timeLeft}s</strong></div>
      <div className="margin-bottom-md">Next action: <strong>{nextAction()}</strong></div>
      <div className="margin-bottom-md">Pattern cycle: {pattern.map(p => p.split(' — ')[0]).join(' → ')}</div>
    </div>
  );
}

export default Araxxor;
