import type { ReactNode } from 'react';
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { Rings } from './Paper';
import { C, CLAMP } from './theme';

type Point = [number, number];

function clip(points: Point[], n: Point, d: number, sign: number) {
  const side = (p: Point) => (p[0] * n[0] + p[1] * n[1] - d) * sign;
  const out: Point[] = [];
  points.forEach((current, i) => {
    const next = points[(i + 1) % points.length];
    const a = side(current);
    const b = side(next);
    if (a <= 0) out.push(current);
    if ((a < 0 && b > 0) || (a > 0 && b < 0)) {
      const t = a / (a - b);
      out.push([current[0] + (next[0] - current[0]) * t, current[1] + (next[1] - current[1]) * t]);
    }
  });
  return out;
}

type TurningPageProps = { start: number; duration: number; backColor?: string; children: ReactNode };

export function TurningPage({ start, duration, backColor = C.back, children }: TurningPageProps) {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const p = interpolate(frame, [start, start + duration], [0, 1], { ...CLAMP, easing: Easing.inOut(Easing.cubic) });
  if (p <= 0) return <AbsoluteFill>{children}</AbsoluteFill>;
  if (p >= 1) return null;

  const angle = (interpolate(p, [0, 1], [40, 5]) * Math.PI) / 180;
  const n: Point = [Math.cos(angle), Math.sin(angle)];
  const d = interpolate(p, [0, 1], [width * n[0] + height * n[1], -200]);
  const page: Point[] = [
    [0, 0],
    [width, 0],
    [width, height],
    [0, height],
  ];
  const kept = clip(page, n, d, 1);
  const hidden = clip(page, n, d, -1);
  const depth = Math.max(1, ...hidden.map((point) => point[0] * n[0] + point[1] * n[1] - d));
  const flap = hidden.map((point): Point => {
    const distance = point[0] * n[0] + point[1] * n[1] - d;
    return [point[0] - 2 * distance * n[0], point[1] - 2 * distance * n[1]];
  });
  const fold: Point = [n[0] * d, n[1] * d];
  const list = (points: Point[]) => points.map((point) => `${point[0].toFixed(1)},${point[1].toFixed(1)}`).join(' ');

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `polygon(${kept.map((point) => `${point[0].toFixed(1)}px ${point[1].toFixed(1)}px`).join(', ')})` }}>{children}</AbsoluteFill>
      <svg width={width} height={height} style={{ position: 'absolute', overflow: 'visible' }}>
        <defs>
          <linearGradient id="turn-cast" gradientUnits="userSpaceOnUse" x1={fold[0]} y1={fold[1]} x2={fold[0] + n[0] * 220} y2={fold[1] + n[1] * 220}>
            <stop offset="0" stopColor="rgba(50,30,5,0.42)" />
            <stop offset="1" stopColor="rgba(50,30,5,0)" />
          </linearGradient>
          <linearGradient id="turn-under" gradientUnits="userSpaceOnUse" x1={fold[0] - n[0] * depth} y1={fold[1] - n[1] * depth} x2={fold[0] - n[0] * (depth + 90)} y2={fold[1] - n[1] * (depth + 90)}>
            <stop offset="0" stopColor="rgba(50,30,5,0.3)" />
            <stop offset="1" stopColor="rgba(50,30,5,0)" />
          </linearGradient>
          <linearGradient id="turn-flap" gradientUnits="userSpaceOnUse" x1={fold[0]} y1={fold[1]} x2={fold[0] - n[0] * depth} y2={fold[1] - n[1] * depth}>
            <stop offset="0" stopColor="rgba(60,40,10,0.3)" />
            <stop offset="0.07" stopColor="rgba(60,40,10,0.04)" />
            <stop offset="0.16" stopColor="rgba(255,255,255,0.5)" />
            <stop offset="0.45" stopColor="rgba(255,255,255,0)" />
            <stop offset="1" stopColor="rgba(60,40,10,0.16)" />
          </linearGradient>
        </defs>
        <polygon points={list(hidden)} fill="url(#turn-cast)" />
        <polygon points={list(flap)} fill="rgba(50,30,5,0.22)" transform={`translate(${-n[0] * 26} ${-n[1] * 26 + 14})`} />
        <polygon points={list(flap)} fill="rgba(50,30,5,0.12)" transform={`translate(${-n[0] * 48} ${-n[1] * 48 + 22})`} />
        <polygon points={list(flap)} fill={backColor} />
        <polygon points={list(flap)} fill="url(#turn-flap)" />
      </svg>
    </AbsoluteFill>
  );
}

export type BookPage = { length: number; node: ReactNode; backColor?: string };

export function bookFrames(pages: BookPage[]) {
  return pages.reduce((total, page) => total + page.length, 0);
}

export function Book({ pages, turn = 18 }: { pages: BookPage[]; turn?: number }) {
  let cursor = 0;
  const placed = pages.map((page, i) => {
    const from = cursor;
    cursor += page.length;
    return { page, from, last: i === pages.length - 1 };
  });
  return (
    <AbsoluteFill style={{ backgroundColor: C.cream }}>
      {placed
        .map(({ page, from, last }) => (
          <Sequence key={from} from={from} durationInFrames={page.length + (last ? 0 : turn)}>
            {last ? page.node : (
              <TurningPage start={page.length} duration={turn} backColor={page.backColor}>
                {page.node}
              </TurningPage>
            )}
          </Sequence>
        ))
        .reverse()}
      <Rings />
    </AbsoluteFill>
  );
}
