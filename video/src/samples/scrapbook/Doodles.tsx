import type { CSSProperties } from 'react';
import { interpolate, random, useCurrentFrame, useVideoConfig } from 'remotion';

import { C, CLAMP, INK, pop } from './theme';

export type Shape = { d: string; box: [number, number] };

export const STAR: Shape = { box: [100, 100], d: 'M50 6 L62 37 L95 39 L69 60 L78 93 L50 74 L22 93 L31 60 L5 39 L38 37 Z' };
export const HEART: Shape = { box: [100, 100], d: 'M50 88 C12 62 2 32 22 17 C38 6 50 20 50 34 C50 20 62 6 78 17 C98 32 88 62 50 88 Z' };
export const ARROW: Shape = { box: [200, 120], d: 'M8 22 C70 0 150 24 178 94 M146 84 L180 98 L190 62' };
export const CLOCK: Shape = {
  box: [120, 120],
  d: 'M60 8 C90 6 112 30 112 60 C112 90 90 112 60 112 C30 112 8 90 8 60 C8 30 30 10 62 8 M60 60 L60 28 M60 60 L44 88',
};
export const MOON: Shape = { box: [100, 100], d: 'M66 10 C36 10 14 34 18 62 C22 86 48 98 72 88 C50 84 38 62 44 40 C48 26 56 16 66 10 Z' };
export const BATTERY: Shape = {
  box: [170, 90],
  d: 'M12 10 H132 C140 10 146 16 146 24 V66 C146 74 140 80 132 80 H12 C4 80 0 74 0 66 V24 C0 16 4 10 12 10 Z M148 32 H160 V58 H148',
};
export const SPIRAL: Shape = {
  box: [100, 100],
  d: Array.from({ length: 60 }, (_, i) => {
    const angle = i * 0.33;
    const radius = 3 + i * 0.75;
    return `${i ? 'L' : 'M'}${(50 + Math.cos(angle) * radius).toFixed(1)} ${(50 + Math.sin(angle) * radius).toFixed(1)}`;
  }).join(' '),
};
export const ZIGZAG: Shape = { box: [200, 30], d: 'M4 22 L28 6 L52 24 L76 6 L100 24 L124 6 L148 24 L172 6 L196 22' };

export function underline(w: number): Shape {
  return { box: [w, 30], d: `M4 12 C${w * 0.25} 2 ${w * 0.6} 22 ${w - 4} 8 C${w * 0.7} 16 ${w * 0.35} 20 ${w * 0.1} 26` };
}

export function loop(w: number, h: number): Shape {
  const p = (x: number, y: number) => `${(x * w).toFixed(1)} ${(y * h).toFixed(1)}`;
  return {
    box: [w, h],
    d: `M${p(0.52, 0.05)} C${p(0.9, 0)} ${p(1, 0.3)} ${p(0.97, 0.55)} C${p(0.93, 0.95)} ${p(0.5, 1)} ${p(0.25, 0.94)} C${p(0, 0.85)} ${p(-0.02, 0.4)} ${p(0.12, 0.2)} C${p(0.25, 0.03)} ${p(0.55, -0.03)} ${p(0.78, 0.12)}`,
  };
}

export function burst(rays = 9, inner = 0.55): Shape {
  return {
    box: [200, 200],
    d: Array.from({ length: rays }, (_, i) => {
      const angle = (i / rays) * Math.PI * 2 + 0.3;
      const point = (r: number) => `${(100 + Math.cos(angle) * r).toFixed(1)} ${(100 + Math.sin(angle) * r).toFixed(1)}`;
      return `M${point(100 * inner)} L${point(i % 2 ? 96 : 80)}`;
    }).join(' '),
  };
}

type DoodleProps = Shape & {
  width: number;
  progress: number;
  color?: string;
  weight?: number;
  fill?: string;
  rotate?: number;
  style?: CSSProperties;
};

export function Doodle({ d, box, width, progress, color = INK, weight = 7, fill, rotate = 0, style }: DoodleProps) {
  const frame = useCurrentFrame();
  const scale = width / box[0];
  const shake = (Math.floor(frame / 4) % 3) - 1;
  return (
    <svg
      width={width}
      height={box[1] * scale}
      viewBox={`0 0 ${box[0]} ${box[1]}`}
      style={{ position: 'absolute', overflow: 'visible', opacity: progress > 0.01 ? 1 : 0, transform: `rotate(${rotate + shake * 1.1}deg)`, ...style }}
    >
      <path
        d={d}
        pathLength={1}
        fill={fill ?? 'none'}
        fillOpacity={interpolate(progress, [0.7, 1], [0, 1], CLAMP)}
        stroke={color}
        strokeWidth={weight / scale}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1 1"
        strokeDashoffset={1 - progress}
      />
    </svg>
  );
}

type FootprintsProps = {
  from: [number, number];
  to: [number, number];
  count: number;
  at: number;
  every?: number;
  size?: number;
  color?: string;
};

export function Footprints({ from, to, count, at, every = 3, size = 62, color = C.green }: FootprintsProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const length = Math.hypot(dx, dy);
  const heading = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const t = count > 1 ? i / (count - 1) : 0;
        const side = i % 2 ? 1 : -1;
        const s = pop(frame, fps, at + i * every, 'snappy');
        const x = from[0] + dx * t + ((-dy / length) * side * size) / 2.4;
        const y = from[1] + dy * t + ((dx / length) * side * size) / 2.4;
        return (
          <svg
            key={i}
            width={size}
            height={size * 1.1}
            viewBox="0 0 80 88"
            style={{
              position: 'absolute',
              left: x - size / 2,
              top: y - size / 2,
              opacity: s * 0.85,
              transform: `rotate(${heading + side * 12 + (random('print' + i) - 0.5) * 14}deg) scale(${2 - s})`,
            }}
          >
            <g fill={color}>
              <path d="M40 2 C49 18 47 36 40 46 C33 36 31 18 40 2 Z" />
              <path d="M40 2 C49 18 47 36 40 46 C33 36 31 18 40 2 Z" transform="rotate(-38 40 58)" />
              <path d="M40 2 C49 18 47 36 40 46 C33 36 31 18 40 2 Z" transform="rotate(38 40 58)" />
              <path d="M40 50 C54 50 58 68 49 79 C44 85 36 85 31 79 C22 68 26 50 40 50 Z" />
            </g>
          </svg>
        );
      })}
    </>
  );
}

type ConfettiProps = { at: number; origin: [number, number]; count?: number; power?: number; seed?: string; colors?: string[] };

export function Confetti({ at, origin, count = 46, power = 1, seed = 'confetti', colors = [C.yellow, C.pink, C.mint, C.lime, C.coral, C.paper] }: ConfettiProps) {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0) return null;
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const angle = -Math.PI / 2 + (random(seed + 'a' + i) - 0.5) * 2.6;
        const speed = (16 + random(seed + 's' + i) * 30) * power;
        const drag = 1 - Math.exp(-t / 9);
        const x = origin[0] + Math.cos(angle) * speed * 9 * drag;
        const y = origin[1] + Math.sin(angle) * speed * 9 * drag + 0.42 * t * t;
        const size = 14 + random(seed + 'z' + i) * 20;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: size * (i % 3 ? 0.55 : 1),
              borderRadius: i % 4 === 0 ? size : 3,
              backgroundColor: colors[i % colors.length],
              opacity: interpolate(t, [0, 2, 50, 70], [0, 1, 1, 0], CLAMP),
              transform: `rotate(${t * (8 + random(seed + 'r' + i) * 16) * (i % 2 ? 1 : -1)}deg) scaleY(${Math.cos(t * 0.3 + i)})`,
            }}
          />
        );
      })}
    </>
  );
}
