import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from 'remotion';

import { C, H, W } from './theme';

const COLORS = [C.pink, C.lemon, C.mint, C.white, C.lime];

type ConfettiProps = {
  x: number;
  y: number;
  seed: string;
  delay?: number;
  count?: number;
  power?: number;
  colors?: string[];
};

export function Confetti({ x, y, seed, delay = 0, count = 44, power = 2100, colors = COLORS }: ConfettiProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (frame - delay) / fps;
  if (t < 0 || t > 2) {
    return null;
  }
  const drag = 2.4;
  const travel = (1 - Math.exp(-drag * t)) / drag;
  return (
    <AbsoluteFill>
      {Array.from({ length: count }, (_, i) => {
        const key = `${seed}-${i}`;
        const angle = random(`${key}-a`) * Math.PI * 2;
        const speed = power * (0.3 + 0.7 * random(`${key}-s`));
        const size = 20 + random(`${key}-size`) * 22;
        const spin = random(`${key}-r`) * 360 + (random(`${key}-rs`) - 0.5) * 1000 * t;
        const flip = Math.cos(t * (7 + random(`${key}-f`) * 9) + i);
        const kind = i % 3;
        return (
          <div
            key={key}
            style={{
              position: 'absolute',
              left: x + Math.cos(angle) * speed * travel,
              top: y + Math.sin(angle) * speed * travel - 500 * travel + 1300 * t * t,
              width: size,
              height: kind === 0 ? size * 0.55 : size,
              borderRadius: kind === 1 ? '50%' : 5,
              backgroundColor: colors[i % colors.length],
              border: `3px solid ${C.ink}`,
              transform: `translate(-50%, -50%) rotate(${spin}deg) scaleY(${flip}) scale(${Math.min(1, t * 12)})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
}

type ConfettiRainProps = {
  seed: string;
  count?: number;
  delay?: number;
  colors?: string[];
};

export function ConfettiRain({ seed, count = 26, delay = 0, colors = COLORS }: ConfettiRainProps) {
  const frame = useCurrentFrame();
  const t = frame - delay;
  if (t < 0) {
    return null;
  }
  return (
    <AbsoluteFill>
      {Array.from({ length: count }, (_, i) => {
        const key = `${seed}-${i}`;
        const speed = 9 + random(`${key}-s`) * 9;
        const start = -80 - random(`${key}-y`) * (H + 200);
        const y = start + t * speed;
        const wrapped = y > H + 60 ? ((y + 80) % (H + 160)) - 80 : y;
        const x = random(`${key}-x`) * W + Math.sin(t * 0.12 + i) * 40;
        const size = 18 + random(`${key}-size`) * 20;
        const kind = i % 3;
        return (
          <div
            key={key}
            style={{
              position: 'absolute',
              left: x,
              top: wrapped,
              width: size,
              height: kind === 0 ? size * 0.55 : size,
              borderRadius: kind === 1 ? '50%' : 5,
              backgroundColor: colors[i % colors.length],
              border: `3px solid ${C.ink}`,
              transform: `rotate(${t * (4 + (i % 5)) + i * 40}deg) scaleY(${Math.cos(t * 0.3 + i)})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
}
