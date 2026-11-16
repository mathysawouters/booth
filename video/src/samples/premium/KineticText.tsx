import type { CSSProperties } from 'react';
import { useCurrentFrame } from 'remotion';

import { EXPO_IN, EXPO_OUT, SOFT, mix, ramp } from './motion';
import { COLOR, FONT } from './theme';

export type KineticWord = { text: string; accent?: 'text' | 'bar' };

export function toWords(text: string, accentLast = 0, accent: KineticWord['accent'] = 'bar'): KineticWord[] {
  const parts = text.split(' ');
  return parts.map((part, index) => ({
    text: part,
    accent: index >= parts.length - accentLast ? accent : undefined,
  }));
}

type KineticLineProps = {
  words: KineticWord[];
  at: number;
  out?: number;
  stagger?: number;
  size: number;
  color: string;
  barTextColor?: string;
  weight?: number;
  style?: CSSProperties;
};

export function KineticLine({
  words,
  at,
  out,
  stagger = 3,
  size,
  color,
  barTextColor = COLOR.ink,
  weight = 900,
  style,
}: KineticLineProps) {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        columnGap: '0.2em',
        fontFamily: FONT.display,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: '-0.045em',
        color,
        ...style,
      }}
    >
      {words.map((word, index) => {
        const start = at + index * stagger;
        const enter = ramp(frame, start, start + 22, EXPO_OUT);
        const leave = out === undefined ? 0 : ramp(frame, out + index, out + index + 12, EXPO_IN);
        const bar = ramp(frame, start + 8, start + 26, EXPO_OUT);
        const y = mix(enter, 108, 0) - leave * 108;
        const blur = (1 - enter) * 14 + leave * 10;
        return (
          <span key={index} style={{ position: 'relative', display: 'inline-block' }}>
            {word.accent === 'bar' ? (
              <span
                style={{
                  position: 'absolute',
                  left: '-0.07em',
                  right: '-0.07em',
                  top: '0.1em',
                  bottom: '-0.04em',
                  borderRadius: '0.12em',
                  backgroundColor: COLOR.accent,
                  transformOrigin: 'left center',
                  transform: `scaleX(${bar * (1 - leave)})`,
                }}
              />
            ) : null}
            <span
              style={{
                position: 'relative',
                display: 'inline-block',
                overflow: 'hidden',
                padding: '0.08em 0.06em 0.18em',
                margin: '-0.08em -0.06em -0.18em',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  transform: `translateY(${y}%)`,
                  filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
                  opacity: Math.min(1, enter * 1.6) * (1 - leave),
                  color: word.accent === 'text' ? COLOR.accent : word.accent === 'bar' ? barTextColor : undefined,
                }}
              >
                {word.text}
              </span>
            </span>
          </span>
        );
      })}
    </div>
  );
}

type PullQuoteProps = {
  text: string;
  at: number;
  out: number;
  size: number;
  accentLast?: number;
  style?: CSSProperties;
};

export function PullQuote({ text, at, out, size, accentLast = 2, style }: PullQuoteProps) {
  const frame = useCurrentFrame();
  const words = text.split(' ');
  const leave = ramp(frame, out, out + 10, SOFT);
  const mark = ramp(frame, at - 2, at + 18, EXPO_OUT);
  return (
    <div
      style={{
        fontFamily: FONT.serif,
        fontStyle: 'italic',
        fontSize: size,
        lineHeight: 1.06,
        letterSpacing: '-0.015em',
        color: COLOR.ink,
        opacity: 1 - leave,
        transform: `translateY(${-leave * 30}px)`,
        filter: leave > 0.02 ? `blur(${leave * 10}px)` : undefined,
        ...style,
      }}
    >
      <div
        style={{
          height: size * 0.86,
          fontSize: size * 2,
          lineHeight: 1,
          color: COLOR.accent,
          opacity: mark,
          transform: `translateY(${mix(mark, 30, 0)}px)`,
        }}
      >
        {'\u201C'}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: '0.24em', rowGap: '0.04em' }}>
        {words.map((word, index) => {
          const start = at + index * 1.2;
          const enter = ramp(frame, start, start + 16, EXPO_OUT);
          const accented = index >= words.length - accentLast;
          const bar = ramp(frame, at + words.length * 1.2 + 4, at + words.length * 1.2 + 22, EXPO_OUT);
          return (
            <span key={index} style={{ position: 'relative', display: 'inline-block' }}>
              {accented ? (
                <span
                  style={{
                    position: 'absolute',
                    left: '-0.13em',
                    right: '-0.13em',
                    top: '0.58em',
                    bottom: '0.06em',
                    backgroundColor: COLOR.accent,
                    borderRadius: index === words.length - 1 ? '0 0.1em 0.1em 0' : index === words.length - accentLast ? '0.1em 0 0 0.1em' : 0,
                    transformOrigin: 'left center',
                    transform: `scaleX(${ramp(bar, (index - (words.length - accentLast)) / accentLast, (index - (words.length - accentLast) + 1) / accentLast, (t) => t)})`,
                  }}
                />
              ) : null}
              <span
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  opacity: enter,
                  transform: `translateY(${mix(enter, 26, 0)}px)`,
                  filter: enter < 0.98 ? `blur(${(1 - enter) * 12}px)` : undefined,
                }}
              >
                {word}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

type LabelProps = {
  children: string;
  color: string;
  size?: number;
  style?: CSSProperties;
};

export function Label({ children, color, size = 28, style }: LabelProps) {
  return (
    <div
      style={{
        fontFamily: FONT.display,
        fontWeight: 600,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        color,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
