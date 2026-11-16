import type { ReactNode } from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { SPRINGS, pop } from './motion';
import { C, H, W } from './theme';

type StripeWipeProps = {
  colors: string[];
  children: ReactNode;
  duration?: number;
  slant?: number;
  band?: number;
};

export function StripeWipe({ colors, children, duration = 13, slant = 260, band = 150 }: StripeWipeProps) {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });
  const lead = band * colors.length;
  const edge = -slant - lead + p * (W + slant * 2 + lead);
  const slice = (from: number, to: number) =>
    `polygon(${from + slant}px 0px, ${to + slant}px 0px, ${to - slant}px ${H}px, ${from - slant}px ${H}px)`;
  const done = p >= 1;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: done ? undefined : slice(-W * 2, edge) }}>{children}</AbsoluteFill>
      {done
        ? null
        : colors.map((color, i) => (
            <AbsoluteFill
              key={color}
              style={{ backgroundColor: color, clipPath: slice(edge + i * band - 1, edge + (i + 1) * band) }}
            />
          ))}
    </AbsoluteFill>
  );
}

type IrisPopProps = {
  x: number;
  y: number;
  children: ReactNode;
  ring?: string;
  duration?: number;
};

export function IrisPop({ x, y, children, ring = C.white, duration = 11 }: IrisPopProps) {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
  const reach = Math.hypot(Math.max(x, W - x), Math.max(y, H - y)) + 120;
  const r = 40 + p * reach;
  const done = p >= 1;
  const rings = [
    { color: ring, width: 44, grow: 46 },
    { color: C.ink, width: 16, grow: 0 },
  ];
  return (
    <AbsoluteFill>
      {done
        ? null
        : rings.map((item) => (
            <div
              key={item.color}
              style={{
                position: 'absolute',
                left: x - r - item.grow,
                top: y - r - item.grow,
                width: (r + item.grow) * 2,
                height: (r + item.grow) * 2,
                borderRadius: '50%',
                backgroundColor: item.color,
              }}
            />
          ))}
      <AbsoluteFill style={{ clipPath: done ? undefined : `circle(${r - 14}px at ${x}px ${y}px)` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
}

type SlamInProps = {
  from: 'top' | 'bottom' | 'left' | 'right';
  color: string;
  children: ReactNode;
};

export function SlamIn({ from, color, children }: SlamInProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rest = 1 - pop(frame, fps, 0, SPRINGS.panel);
  const dx = from === 'left' ? -rest * W : from === 'right' ? rest * W : 0;
  const dy = from === 'top' ? -rest * H : from === 'bottom' ? rest * H : 0;
  return (
    <AbsoluteFill style={{ transform: `translate(${dx}px, ${dy}px)` }}>
      <div
        style={{
          position: 'absolute',
          left: -320,
          top: -320,
          right: -320,
          bottom: -320,
          backgroundColor: color,
          border: `20px solid ${C.ink}`,
        }}
      />
      {children}
    </AbsoluteFill>
  );
}
