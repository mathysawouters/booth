import { random, useCurrentFrame } from 'remotion';

import { EXPO_OUT, ramp } from './motion';
import { COLOR, accentGlow } from './theme';

const TINTS = [COLOR.accent, COLOR.accent, COLOR.ink, '#FFFFFF', accentGlow(0.5)];

type ConfettiProps = { at: number; x: number; y: number; count?: number; seed: string };

export function Confetti({ at, x, y, count = 54, seed }: ConfettiProps) {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 70) {
    return null;
  }
  const burst = ramp(t, 0, 26, EXPO_OUT);
  return (
    <>
      {new Array(count).fill(0).map((_, index) => {
        const angle = random(`${seed}-a-${index}`) * Math.PI * 2;
        const reach = 220 + random(`${seed}-r-${index}`) * 520;
        const size = 14 + random(`${seed}-s-${index}`) * 22;
        const px = x + Math.cos(angle) * reach * burst;
        const py = y + Math.sin(angle) * reach * burst * 0.9 - 160 * burst + t * t * 0.16;
        const round = random(`${seed}-k-${index}`) > 0.6;
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: px,
              top: py,
              width: size,
              height: round ? size : size * 0.5,
              borderRadius: round ? size : 3,
              backgroundColor: TINTS[index % TINTS.length],
              opacity: 1 - ramp(t, 44, 68, (v) => v),
              transform: `rotate(${t * (6 + random(`${seed}-w-${index}`) * 14) + index * 40}deg)`,
            }}
          />
        );
      })}
    </>
  );
}

type EmojiBurstProps = { at: number; x: number; y: number; emoji: string[]; seed: string };

export function EmojiBurst({ at, x, y, emoji, seed }: EmojiBurstProps) {
  const frame = useCurrentFrame();
  return (
    <>
      {emoji.map((glyph, index) => {
        const start = at + index * 5;
        const t = frame - start;
        if (t < 0 || t > 80) {
          return null;
        }
        const pop = ramp(t, 0, 16, EXPO_OUT);
        const size = 150 + random(`${seed}-size-${index}`) * 90;
        const dx = (random(`${seed}-x-${index}`) - 0.5) * 760;
        const rise = ramp(t, 0, 80, (v) => 1 - (1 - v) * (1 - v)) * (520 + random(`${seed}-y-${index}`) * 420);
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: x + dx * pop - size / 2,
              top: y - rise - size / 2,
              fontSize: size,
              lineHeight: 1,
              opacity: 1 - ramp(t, 58, 80, (v) => v),
              transform: `scale(${0.2 + pop * 0.8}) rotate(${(random(`${seed}-rot-${index}`) - 0.5) * 30 + Math.sin(t / 9 + index) * 8}deg)`,
            }}
          >
            {glyph}
          </div>
        );
      })}
    </>
  );
}
