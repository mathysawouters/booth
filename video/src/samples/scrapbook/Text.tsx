import type { CSSProperties, ReactNode } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { C, CLAMP, FONT, INK, PARTY, jitter, pop, ramp, wobble } from './theme';

type CutoutProps = { text: string; size: number; at?: number; stagger?: number; colors?: string[]; seed?: string; style?: CSSProperties };

export function Cutout({ text, size, at = 0, stagger = 2, colors = PARTY, seed = text, style }: CutoutProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap', ...style }}>
      {text.split('').map((letter, i) => {
        if (letter === ' ') return <span key={i} style={{ width: size * 0.22 }} />;
        const id = seed + i;
        const s = pop(frame, fps, at + i * stagger);
        const skew = 3 + jitter(id + 'k', 2.5);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              margin: `0 ${size * 0.012}px`,
              opacity: frame >= at + i * stagger ? 1 : 0,
              transform: `translateY(${jitter(id + 'y', size * 0.05) + (1 - s) * -size * 0.5}px) rotate(${jitter(id + 'r', 5) + wobble(frame, id, 1.6) + (1 - s) * 30}deg) scale(${s})`,
              filter: 'drop-shadow(0 6px 0 rgba(42,35,64,0.2))',
            }}
          >
            <span
              style={{
                display: 'block',
                padding: `0 ${size * 0.13}px`,
                backgroundColor: colors[i % colors.length],
                clipPath: `polygon(${skew}% 2%, 99% 0%, ${100 - skew}% 99%, 0% 97%)`,
                fontFamily: FONT.chunky,
                fontWeight: 700,
                fontSize: size,
                lineHeight: 1.14,
                color: INK,
              }}
            >
              {letter}
            </span>
          </span>
        );
      })}
    </span>
  );
}

type StampedProps = { children: ReactNode; size: number; at?: number; color?: string; style?: CSSProperties };

export function Stamped({ children, size, at = 0, color = INK, style }: StampedProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(frame, fps, at, 'snappy');
  return (
    <span
      style={{
        display: 'inline-block',
        position: 'relative',
        whiteSpace: 'nowrap',
        fontFamily: FONT.serif,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.08,
        letterSpacing: '-0.02em',
        color,
        opacity: ramp(frame, at, 3),
        transform: `scale(${interpolate(s, [0, 1], [1.8, 1])}) rotate(${(1 - s) * -7}deg)`,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

type HeadlineProps = { text: string; size: number; at?: number; stagger?: number; color?: string; style?: CSSProperties };

export function Headline({ text, size, at = 0, stagger = 3, color, style }: HeadlineProps) {
  return (
    <div style={{ position: 'absolute', display: 'flex', flexWrap: 'wrap', columnGap: size * 0.26, rowGap: 0, ...style }}>
      {text.split(' ').map((word, i) => (
        <Stamped key={i} size={size} at={at + i * stagger} color={color}>
          {word}
        </Stamped>
      ))}
    </div>
  );
}

type HandwritingProps = {
  lines: string[];
  size: number;
  at?: number;
  speed?: number;
  color?: string;
  rotate?: number;
  align?: 'flex-start' | 'center' | 'flex-end';
  style?: CSSProperties;
};

export function Handwriting({ lines, size, at = 0, speed = 2, color = INK, rotate = 0, align = 'flex-start', style }: HandwritingProps) {
  const frame = useCurrentFrame();
  let cursor = at;
  return (
    <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: align, transform: `rotate(${rotate}deg)`, ...style }}>
      {lines.map((line, i) => {
        const duration = Math.max(3, line.length / speed);
        const reveal = interpolate(frame, [cursor, cursor + duration], [0, 1], CLAMP);
        cursor += duration;
        return (
          <div
            key={i}
            style={{
              fontFamily: FONT.hand,
              fontWeight: 700,
              fontSize: size,
              lineHeight: 1.02,
              color,
              whiteSpace: 'nowrap',
              clipPath: `inset(-30% ${(1 - reveal) * 104 - 4}% -30% -6%)`,
              transform: `translateY(${wobble(frame, line + i, 1.5)}px)`,
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
}

type RubberStampProps = { text: string; at: number; size?: number; color?: string; rotate?: number; style?: CSSProperties };

export function RubberStamp({ text, at, size = 44, color = C.coral, rotate = -8, style }: RubberStampProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(frame, fps, at, 'snappy');
  return (
    <div
      style={{
        position: 'absolute',
        padding: `${size * 0.22}px ${size * 0.5}px`,
        border: `6px solid ${color}`,
        borderRadius: 16,
        outline: `3px solid ${color}`,
        outlineOffset: 5,
        fontFamily: FONT.chunky,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        color,
        opacity: frame >= at ? 0.92 : 0,
        transform: `rotate(${rotate + wobble(frame, text, 0.8)}deg) scale(${interpolate(s, [0, 1], [2.6, 1])})`,
        ...style,
      }}
    >
      {text}
    </div>
  );
}
