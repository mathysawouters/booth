import { AbsoluteFill, useCurrentFrame } from 'remotion';

import { COPY } from '../../lib/data';
import { GhostNumeral, Hairline } from './Backdrop';
import { KineticLine, Label, toWords } from './KineticText';
import { FloatingLeggy } from './Leggy';
import { EXPO_OUT, mix, ramp, sway } from './motion';
import { COLOR, FONT, SAFE, accentGlow } from './theme';

type OutroSceneProps = { builtWithAt: number; length: number };

export function OutroScene({ builtWithAt, length }: OutroSceneProps) {
  const frame = useCurrentFrame();
  const push = 1 + (frame / length) * 0.04;
  const leggy = ramp(frame, 2, 34, EXPO_OUT);
  const tagline = COPY.tagline.split(', ');
  const built = ramp(frame, builtWithAt, builtWithAt + 22);
  const [first, ...rest] = COPY.name.split(' ');
  return (
    <AbsoluteFill style={{ transform: `scale(${push})` }}>
      <GhostNumeral
        text="10"
        size={980}
        color="rgba(12, 13, 11, 0.04)"
        x={560 + sway(frame, 'outro-ghost', 220, 30)}
        y={540}
        style={{ opacity: ramp(frame, 0, 30) }}
      />
      <div
        style={{
          position: 'absolute',
          left: 240,
          top: 190 + sway(frame, 'outro-halo', 140, 12),
          width: 600,
          height: 600,
          borderRadius: '50%',
          backgroundColor: COLOR.card,
          boxShadow: `0 60px 120px ${accentGlow(0.45)}, 0 0 0 ${mix(leggy, 0, 18)}px ${accentGlow(0.35)}`,
          opacity: leggy,
          transform: `scale(${mix(leggy, 0.6, 1)})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 360,
          top: 196,
          opacity: Math.min(1, leggy * 1.5),
          transform: `translateY(${mix(leggy, 160, 0)}px)`,
        }}
      >
        <FloatingLeggy pose="waving" height={600} seed="outro-leggy" swing={3.4} softShadow />
      </div>
      <div style={{ position: 'absolute', left: SAFE.x, right: SAFE.x, top: 850 }}>
        <KineticLine words={toWords(first)} at={8} size={226} color={COLOR.ink} />
        <KineticLine words={toWords(rest.join(' '), 1)} at={14} size={226} color={COLOR.ink} style={{ marginTop: 6 }} />
      </div>
      <div style={{ position: 'absolute', left: SAFE.x, right: SAFE.x, top: 1452 }}>
        <KineticLine words={toWords(`${tagline[0]},`)} at={22} stagger={2} size={62} weight={600} color={COLOR.ink} />
        <KineticLine
          words={toWords(tagline.slice(1).join(', '))}
          at={30}
          stagger={2}
          size={62}
          weight={800}
          color={COLOR.ink}
          style={{ marginTop: 10 }}
        />
      </div>
      <Hairline progress={ramp(frame, 26, 60)} color={COLOR.inkFaint} style={{ left: SAFE.x, right: SAFE.x, top: 1636 }} />
      <div
        style={{
          position: 'absolute',
          left: SAFE.x,
          right: SAFE.x,
          top: 1668,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: built,
          transform: `translateY(${mix(built, 20, 0)}px)`,
        }}
      >
        <div style={{ fontFamily: FONT.display, fontWeight: 500, fontSize: 30, color: COLOR.inkSoft }}>{COPY.builtWith}</div>
        <Label color={COLOR.inkSoft} size={24}>10 min · daily</Label>
      </div>
    </AbsoluteFill>
  );
}
