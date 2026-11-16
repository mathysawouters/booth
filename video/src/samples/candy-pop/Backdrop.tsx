import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from 'remotion';

import { pop, wobble } from './motion';
import { C, H, W } from './theme';

type BackdropProps = {
  color: string;
  accent: string;
  kind: 'sunburst' | 'halftone';
  cx?: number;
  cy?: number;
};

export function Backdrop({ color, accent, kind, cx = W / 2, cy = H / 2 }: BackdropProps) {
  return (
    <AbsoluteFill style={{ backgroundColor: color, overflow: 'hidden' }}>
      {kind === 'sunburst' ? <Sunburst accent={accent} cx={cx} cy={cy} /> : <Halftone accent={accent} cx={cx} cy={cy} />}
    </AbsoluteFill>
  );
}

function Sunburst({ accent, cx, cy }: { accent: string; cx: number; cy: number }) {
  const frame = useCurrentFrame();
  const radius = 2400;
  return (
    <div
      style={{
        position: 'absolute',
        left: cx - radius,
        top: cy - radius,
        width: radius * 2,
        height: radius * 2,
        borderRadius: '50%',
        background: `repeating-conic-gradient(${accent} 0deg 9.9deg, transparent 10deg 19.9deg, ${accent} 20deg)`,
        transform: `rotate(${frame * 0.6}deg)`,
      }}
    />
  );
}

function Halftone({ accent, cx, cy }: { accent: string; cx: number; cy: number }) {
  const frame = useCurrentFrame();
  const gap = 62;
  const rowGap = gap * 0.866;
  const dots: { x: number; y: number; r: number }[] = [];
  for (let row = 0; row * rowGap < H + gap; row++) {
    for (let col = 0; col * gap < W + gap; col++) {
      const x = col * gap + (row % 2 === 0 ? 0 : gap / 2);
      const y = row * rowGap;
      const distance = Math.hypot(x - cx, y - cy);
      const wave = 0.5 + 0.5 * Math.sin(distance * 0.0055 - frame * 0.17);
      const r = gap * 0.4 * wave;
      if (r > 1.5) {
        dots.push({ x, y, r });
      }
    }
  }
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
      {dots.map((dot) => (
        <circle key={`${dot.x}-${dot.y}`} cx={dot.x} cy={dot.y} r={dot.r} fill={accent} />
      ))}
    </svg>
  );
}

const KINDS = ['ring', 'plus', 'squiggle', 'triangle', 'spark', 'dot'] as const;

type ShapeKind = (typeof KINDS)[number];

function Shape({ kind, color }: { kind: ShapeKind; color: string }) {
  if (kind === 'ring') {
    return (
      <>
        <circle cx={50} cy={50} r={30} fill="none" stroke={C.ink} strokeWidth={30} />
        <circle cx={50} cy={50} r={30} fill="none" stroke={color} strokeWidth={17} />
      </>
    );
  }
  if (kind === 'plus') {
    return (
      <>
        <path d="M50 14 V86 M14 50 H86" fill="none" stroke={C.ink} strokeWidth={36} strokeLinecap="round" />
        <path d="M50 14 V86 M14 50 H86" fill="none" stroke={color} strokeWidth={22} strokeLinecap="round" />
      </>
    );
  }
  if (kind === 'squiggle') {
    const d = 'M8 50 Q22 18 36 50 T64 50 T92 50';
    return (
      <>
        <path d={d} fill="none" stroke={C.ink} strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} fill="none" stroke={color} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
      </>
    );
  }
  if (kind === 'triangle') {
    return <path d="M50 16 L88 82 L12 82 Z" fill={color} stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />;
  }
  if (kind === 'spark') {
    return (
      <path
        d="M50 4 Q57 43 96 50 Q57 57 50 96 Q43 57 4 50 Q43 43 50 4 Z"
        fill={color}
        stroke={C.ink}
        strokeWidth={7}
        strokeLinejoin="round"
      />
    );
  }
  return <circle cx={50} cy={50} r={28} fill={color} stroke={C.ink} strokeWidth={8} />;
}

type FloatingShapesProps = {
  seed: string;
  colors: string[];
  count?: number;
  top?: number;
  bottom?: number;
};

export function FloatingShapes({ seed, colors, count = 10, top = 150, bottom = H - 150 }: FloatingShapesProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      {Array.from({ length: count }, (_, i) => {
        const key = `${seed}-${i}`;
        const size = 54 + random(`${key}-size`) * 56;
        const inset = 50 + random(`${key}-x`) * 170;
        const x = i % 2 === 0 ? inset : W - inset;
        const y = top + ((i + random(`${key}-y`)) / count) * (bottom - top);
        const spin = (random(`${key}-spin`) > 0.5 ? 1 : -1) * (1 + random(`${key}-speed`)) * 1.4;
        const s = pop(frame, fps, i);
        const dx = wobble(frame, `${key}-dx`, 0.6) * 18;
        const dy = wobble(frame, `${key}-dy`, 0.8) * 26;
        return (
          <svg
            key={key}
            width={size}
            height={size}
            viewBox="0 0 100 100"
            style={{
              position: 'absolute',
              left: x - size / 2 + dx,
              top: y - size / 2 + dy,
              overflow: 'visible',
              transform: `rotate(${frame * spin + random(`${key}-rot`) * 360}deg) scale(${s})`,
            }}
          >
            <Shape kind={KINDS[i % KINDS.length]} color={colors[i % colors.length]} />
          </svg>
        );
      })}
    </AbsoluteFill>
  );
}
