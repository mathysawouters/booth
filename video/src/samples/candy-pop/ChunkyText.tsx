import type { CSSProperties } from 'react';

import { C, FONT } from './theme';

type ChunkyTextProps = {
  children: string;
  size: number;
  fill?: string;
  stroke?: string;
  outline?: number;
  depth?: number;
  font?: string;
  weight?: number;
};

export function ChunkyText({
  children,
  size,
  fill = C.white,
  stroke = C.ink,
  outline = size * 0.07,
  depth = size * 0.075,
  font = FONT.display,
  weight = 400,
}: ChunkyTextProps) {
  const steps = Math.max(1, Math.round(depth / 2));
  const shadow = Array.from({ length: steps }, (_, i) => {
    const d = (depth * (i + 1)) / steps;
    return `${(d * 0.55).toFixed(1)}px ${d.toFixed(1)}px 0 ${stroke}`;
  }).join(', ');
  const base: CSSProperties = {
    fontFamily: font,
    fontWeight: weight,
    fontSize: size,
    lineHeight: 1,
    letterSpacing: size * 0.015,
    whiteSpace: 'pre',
  };
  return (
    <span style={{ ...base, position: 'relative', display: 'inline-block' }}>
      <span
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          color: stroke,
          WebkitTextStroke: `${outline * 2}px ${stroke}`,
          strokeLinejoin: 'round',
          textShadow: shadow,
        }}
      >
        {children}
      </span>
      <span style={{ position: 'relative', color: fill }}>{children}</span>
    </span>
  );
}
