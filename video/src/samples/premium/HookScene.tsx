import { AbsoluteFill, Img, useCurrentFrame } from 'remotion';

import meadow from '../../../../assets/illustrations/meadow-welcome.jpg';
import { COPY } from '../../lib/data';
import { KineticLine, Label, toWords } from './KineticText';
import { FloatingLeggy } from './Leggy';
import { EXPO_IN, EXPO_OUT, SOFT, mix, ramp, sway } from './motion';
import { COLOR, FONT, SAFE } from './theme';

type BatteryRowProps = { label: string; level: number; at: number; accent: boolean };

function BatteryRow({ label, level, at, accent }: BatteryRowProps) {
  const frame = useCurrentFrame();
  const enter = ramp(frame, at, at + 20);
  const fill = ramp(frame, at + 6, at + 40) * level;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        fontFamily: FONT.display,
        fontWeight: 600,
        fontSize: 42,
        letterSpacing: '-0.02em',
        color: COLOR.ink,
        opacity: enter,
        transform: `translateX(${mix(enter, -40, 0)}px)`,
      }}
    >
      <div style={{ position: 'relative', width: 96, height: 46, borderRadius: 13, border: `3px solid ${COLOR.ink}` }}>
        <div
          style={{
            position: 'absolute',
            left: 5,
            top: 5,
            bottom: 5,
            width: `calc(${Math.max(fill, 0.06) * 100}% - 10px)`,
            minWidth: 8,
            borderRadius: 6,
            backgroundColor: accent ? COLOR.accent : COLOR.ink,
          }}
        />
        <div style={{ position: 'absolute', right: -11, top: 12, width: 5, height: 16, borderRadius: 3, backgroundColor: COLOR.ink }} />
      </div>
      <span style={{ marginLeft: 8 }}>{label}</span>
      <span style={{ fontWeight: 800 }}>{Math.round(fill * 100)}%</span>
    </div>
  );
}

type HookSceneProps = { beat: number; exitAt: number };

export function HookScene({ beat, exitAt }: HookSceneProps) {
  const frame = useCurrentFrame();
  const starts = [6, 6 + beat, 6 + beat * 2];
  const push = frame / (exitAt + 30);
  const leave = ramp(frame, exitAt, exitAt + 22, EXPO_IN);
  const dusk = ramp(frame, 0, exitAt + 20, SOFT);
  const scrim = ramp(frame, 0, 24, EXPO_OUT);
  return (
    <AbsoluteFill>
      <Img
        src={meadow}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${mix(push, 1.04, 1.2)}) translateY(${mix(push, 0, -30)}px)`,
          transformOrigin: '50% 60%',
        }}
      />
      <AbsoluteFill
        style={{
          opacity: dusk * 0.85,
          background:
            'linear-gradient(180deg, rgba(255, 126, 84, 0.78) 0%, rgba(255, 170, 110, 0.55) 34%, rgba(150, 90, 150, 0.35) 62%, rgba(60, 40, 90, 0.4) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 520,
          height: 1000,
          opacity: scrim * (1 - leave),
          background:
            'linear-gradient(180deg, rgba(247, 245, 236, 0) 0%, rgba(247, 245, 236, 0.86) 18%, rgba(247, 245, 236, 0.86) 82%, rgba(247, 245, 236, 0) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: SAFE.x,
          top: 300,
          opacity: ramp(frame, 4, 26) * (1 - leave),
          transform: `translateY(${mix(ramp(frame, 4, 30), 30, 0)}px)`,
        }}
      >
        <Label color={COLOR.ink} size={34}>Tonight · 7 PM</Label>
        <div style={{ height: 4, width: 120, marginTop: 20, borderRadius: 2, backgroundColor: COLOR.accent }} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: SAFE.x,
          right: SAFE.x,
          top: 640,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          transform: `translateY(${-leave * 300}px)`,
        }}
      >
        {COPY.hook.map((line, index) => (
          <KineticLine
            key={line}
            words={toWords(line, index === COPY.hook.length - 1 ? 1 : 0, 'bar')}
            at={starts[index]}
            out={exitAt + index * 3}
            size={146}
            color={COLOR.ink}
          />
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: SAFE.x,
          top: 1330,
          display: 'flex',
          flexDirection: 'column',
          gap: 26,
          opacity: 1 - leave,
        }}
      >
        <BatteryRow label="You" level={0.04} at={starts[1] + 10} accent={false} />
        <BatteryRow label="Your kid" level={1} at={starts[2] + 10} accent />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 700,
          top: 1360 + sway(frame, 'hook-sleep', 90, 8),
          opacity: ramp(frame, starts[1] + 4, starts[1] + 30) * (1 - leave),
          transform: `translateX(${mix(ramp(frame, starts[1] + 4, starts[1] + 34), 120, 0)}px)`,
        }}
      >
        <FloatingLeggy pose="sleeping" height={340} seed="hook-leggy" floorShadow={false} tilt={-4} />
      </div>
    </AbsoluteFill>
  );
}
