import { AbsoluteFill, useCurrentFrame } from 'remotion';

import { COPY } from '../../lib/data';
import { Bokeh, GhostNumeral, Hairline } from './Backdrop';
import { Clock } from './Clock';
import { KineticLine, toWords } from './KineticText';
import { FloatingLeggy } from './Leggy';
import { EXPO_IN, EXPO_OUT, mix, ramp } from './motion';
import { COLOR, FONT, SAFE, accentGlow } from './theme';

type BatteryRowProps = { label: string; level: number; at: number; accent: boolean };

function BatteryRow({ label, level, at, accent }: BatteryRowProps) {
  const frame = useCurrentFrame();
  const enter = ramp(frame, at, at + 20);
  const fill = ramp(frame, at + 6, at + 34) * level;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        fontFamily: FONT.display,
        fontWeight: 600,
        fontSize: 40,
        letterSpacing: '-0.02em',
        color: COLOR.snowSoft,
        opacity: enter,
        transform: `translateX(${mix(enter, -40, 0)}px)`,
      }}
    >
      <div style={{ position: 'relative', width: 92, height: 44, borderRadius: 13, border: `3px solid ${COLOR.snowSoft}` }}>
        <div
          style={{
            position: 'absolute',
            left: 5,
            top: 5,
            bottom: 5,
            width: `calc(${Math.max(fill, 0.06) * 100}% - 10px)`,
            minWidth: 8,
            borderRadius: 6,
            backgroundColor: accent ? COLOR.accent : COLOR.snow,
          }}
        />
        <div style={{ position: 'absolute', right: -11, top: 11, width: 5, height: 16, borderRadius: 3, backgroundColor: COLOR.snowSoft }} />
      </div>
      <span style={{ marginLeft: 8 }}>{label}</span>
      <span style={{ color: accent ? COLOR.accent : COLOR.snow, fontWeight: 800 }}>{Math.round(fill * 100)}%</span>
    </div>
  );
}

type HookSceneProps = { beat: number; exitAt: number };

export function HookScene({ beat, exitAt }: HookSceneProps) {
  const frame = useCurrentFrame();
  const starts = [4, 4 + beat, 4 + beat * 2];
  const push = frame / (exitAt + 20);
  const leave = ramp(frame, exitAt, exitAt + 22, EXPO_IN);
  const dim = (index: number) => {
    const next = starts[index + 1];
    return next === undefined ? 1 : mix(ramp(frame, next - 2, next + 14), 1, 0.36);
  };
  const clockDraw = ramp(frame, 0, 40, EXPO_OUT);
  return (
    <AbsoluteFill>
      <Bokeh count={12} />
      <GhostNumeral
        text="7"
        size={1500}
        color={accentGlow(0.07)}
        x={mix(push, 170, 110)}
        y={mix(push, 1420, 1360)}
        style={{ transform: `translate(-50%, -50%) rotate(${mix(push, -8, -4)}deg)` }}
      />
      <div
        style={{
          position: 'absolute',
          left: mix(push, 520, 470),
          top: mix(push, 180, 150),
          transform: `scale(${mix(push, 1, 1.1)}) translateY(${-leave * 260}px)`,
          opacity: 1 - leave,
        }}
      >
        <Clock size={660} hour={7} draw={clockDraw} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: SAFE.x,
          right: SAFE.x,
          top: 700,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          transform: `translateY(${mix(push, 30, -30) - leave * 420}px) scale(${mix(push, 1, 1.03)})`,
          transformOrigin: 'left center',
        }}
      >
        {COPY.hook.map((line, index) => (
          <div key={line} style={{ opacity: dim(index) }}>
            <KineticLine
              words={toWords(line, index === COPY.hook.length - 1 ? 1 : 0, 'text')}
              at={starts[index]}
              out={exitAt + index * 2}
              size={146}
              color={COLOR.snow}
            />
          </div>
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: SAFE.x,
          top: 1520,
          display: 'flex',
          flexDirection: 'column',
          gap: 30,
          opacity: 1 - leave,
          transform: `translateY(${mix(push, 30, -30) - leave * 200}px)`,
        }}
      >
        <BatteryRow label="You" level={0.04} at={starts[1] + 6} accent={false} />
        <BatteryRow label="Your kid" level={1} at={starts[2] + 6} accent />
      </div>
      <Hairline
        progress={ramp(frame, 8, 50)}
        color={COLOR.snowFaint}
        style={{ left: SAFE.x, right: SAFE.x, top: 1480, opacity: 1 - leave }}
      />
      <div
        style={{
          position: 'absolute',
          left: 760,
          top: 1430,
          opacity: ramp(frame, 8, 30) * (1 - leave),
          transform: `translateX(${mix(ramp(frame, 8, 36), 120, 0)}px)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: -90,
            top: -40,
            width: 440,
            height: 440,
            borderRadius: '50%',
            background: `radial-gradient(closest-side, ${accentGlow(0.22)}, ${accentGlow(0)})`,
          }}
        />
        <FloatingLeggy pose="sleeping" height={320} seed="hook-leggy" floorShadow={false} tilt={-6} />
      </div>
    </AbsoluteFill>
  );
}
