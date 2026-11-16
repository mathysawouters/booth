import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from 'remotion';

import { C, pop, wobble } from './theme';

const svgUrl = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

export const GRAIN = svgUrl(
  "<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.42 0 0 0 0 0.3 0 0 0 0 0.14 0 0 0 0.7 -0.2'/></filter><rect width='300' height='300' filter='url(#n)'/></svg>",
);

const PATTERNS = {
  none: {},
  dots: { backgroundImage: 'radial-gradient(rgba(42,35,64,0.17) 3px, transparent 3.6px)', backgroundSize: '54px 54px' },
  grid: {
    backgroundImage:
      'linear-gradient(rgba(42,35,64,0.09) 2px, transparent 2px), linear-gradient(90deg, rgba(42,35,64,0.09) 2px, transparent 2px)',
    backgroundSize: '60px 60px',
  },
  ruled: {
    backgroundImage:
      'linear-gradient(90deg, transparent 108px, rgba(255,110,160,0.5) 108px, rgba(255,110,160,0.5) 112px, transparent 112px), linear-gradient(transparent 70px, rgba(90,165,235,0.4) 70px)',
    backgroundSize: '100% 100%, 100% 74px',
  },
  stripes: {
    backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.4) 0 14px, transparent 14px 34px)',
  },
  confetti: {
    backgroundImage: 'radial-gradient(rgba(255,255,255,0.55) 7px, transparent 8px)',
    backgroundSize: '64px 64px',
  },
} satisfies Record<string, CSSProperties>;

export type Pattern = keyof typeof PATTERNS;

export const RING_GAP = 96;
export const RING_TOP = 70;

type PaperPageProps = { color?: string; pattern?: Pattern; children?: ReactNode };

export function PaperPage({ color = C.cream, pattern = 'dots', children }: PaperPageProps) {
  const { height } = useVideoConfig();
  const holes = Array.from({ length: Math.floor(height / RING_GAP) }, (_, i) => RING_TOP + i * RING_GAP);
  return (
    <AbsoluteFill style={{ backgroundColor: color, overflow: 'hidden' }}>
      <AbsoluteFill style={PATTERNS[pattern]} />
      <AbsoluteFill style={{ backgroundImage: GRAIN, backgroundSize: '300px 300px', opacity: 0.6 }} />
      <AbsoluteFill style={{ backgroundImage: 'radial-gradient(ellipse at center, transparent 55%, rgba(150,100,30,0.16) 100%)' }} />
      {children}
      {holes.map((y) => (
        <div
          key={y}
          style={{ position: 'absolute', left: 30, top: y - 14, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(42,35,64,0.8)' }}
        />
      ))}
    </AbsoluteFill>
  );
}

export function Rings() {
  const { height } = useVideoConfig();
  const rings = Array.from({ length: Math.floor(height / RING_GAP) }, (_, i) => RING_TOP + i * RING_GAP);
  return (
    <AbsoluteFill>
      <svg width={80} height={height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {rings.map((y) => {
          const d = `M46 ${y + 4} C34 ${y - 26} -6 ${y - 20} -20 ${y - 2}`;
          return (
            <g key={y} fill="none" strokeLinecap="round">
              <path d={d} stroke="rgba(42,35,64,0.25)" strokeWidth={13} transform="translate(0 7)" />
              <path d={d} stroke="#5E6577" strokeWidth={12} />
              <path d={d} stroke="#E4E8F0" strokeWidth={5} />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
}

export function torn(w: number, h: number, seed: string, rough = 5, step = 18) {
  const points: string[] = [];
  const edge = (index: number, x: number, y: number, nx: number, ny: number) => {
    const offset = random(`${seed}-${index}-${points.length}`) * rough;
    points.push(`${(x + nx * offset).toFixed(1)}px ${(y + ny * offset).toFixed(1)}px`);
  };
  for (let x = 0; x < w; x += step) edge(0, x, 0, 0, 1);
  for (let y = 0; y < h; y += step) edge(1, w, y, -1, 0);
  for (let x = w; x > 0; x -= step) edge(2, x, h, 0, -1);
  for (let y = h; y > 0; y -= step) edge(3, 0, y, 1, 0);
  return `polygon(${points.join(', ')})`;
}

type ScrapProps = {
  w: number;
  h: number;
  color: string;
  seed: string;
  pattern?: Pattern;
  rotate?: number;
  at?: number;
  from?: [number, number];
  round?: boolean;
  style?: CSSProperties;
  children?: ReactNode;
};

export function Scrap({ w, h, color, seed, pattern = 'none', rotate = 0, at = 0, from = [0, -80], round = false, style, children }: ScrapProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(frame, fps, at, 'soft');
  const shape = round ? { borderRadius: '50%' } : { clipPath: torn(w, h, seed) };
  return (
    <div
      style={{
        position: 'absolute',
        width: w,
        height: h,
        opacity: frame >= at ? 1 : 0,
        transform: `translate(${(1 - s) * from[0]}px, ${(1 - s) * from[1]}px) rotate(${rotate + (1 - s) * 8 + wobble(frame, seed, 0.5)}deg) scale(${0.7 + s * 0.3})`,
        filter: 'drop-shadow(0 7px 5px rgba(70,45,10,0.22))',
        ...style,
      }}
    >
      {round ? null : <div style={{ position: 'absolute', inset: 0, backgroundColor: '#FFFFFF', transform: 'translate(3px, 4px)', clipPath: torn(w, h, seed + 'rim') }} />}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: color, ...shape }}>
        <div style={{ position: 'absolute', inset: 0, ...PATTERNS[pattern] }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: GRAIN, backgroundSize: '300px 300px', opacity: 0.5 }} />
      </div>
      {children}
    </div>
  );
}

type TapeProps = { w: number; h?: number; color: string; rotate?: number; at?: number; seed?: string; style?: CSSProperties };

export function Tape({ w, h = 52, color, rotate = 0, at = 0, seed = 'tape', style }: TapeProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(frame, fps, at, 'snappy');
  const teeth = 5;
  const left = Array.from({ length: teeth * 2 + 1 }, (_, i) => `${i % 2 ? 9 : 0}px ${(100 - (i * 100) / (teeth * 2)).toFixed(1)}%`);
  const right = Array.from({ length: teeth * 2 + 1 }, (_, i) => `calc(100% - ${i % 2 ? 9 : 0}px) ${((i * 100) / (teeth * 2)).toFixed(1)}%`);
  return (
    <div
      style={{
        position: 'absolute',
        width: w,
        height: h,
        opacity: frame >= at ? 0.86 : 0,
        transformOrigin: '0% 50%',
        transform: `rotate(${rotate + (1 - s) * -10 + wobble(frame, seed, 0.7)}deg) scaleX(${s})`,
        backgroundColor: color,
        backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.45) 0 10px, transparent 10px 26px)',
        clipPath: `polygon(${[...right, ...left].join(', ')})`,
        boxShadow: 'inset 0 -6px 0 rgba(0,0,0,0.06)',
        ...style,
      }}
    />
  );
}
