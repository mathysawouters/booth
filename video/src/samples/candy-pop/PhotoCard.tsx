import type { CSSProperties, ReactNode } from 'react';
import { Img, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { SPRINGS, pop, popOut, squash, wobble } from './motion';
import { C, FONT } from './theme';

type PhotoCardProps = {
  src: string;
  size: number;
  x: number;
  y: number;
  seed: string;
  rotate?: number;
  delay?: number;
  exitAt?: number;
  from?: { x: number; y: number; rotate: number };
  border?: number;
  scale?: number;
  children?: ReactNode;
};

export function PhotoCard({
  src,
  size,
  x,
  y,
  seed,
  rotate = 0,
  delay = 0,
  exitAt,
  from = { x: -900, y: 200, rotate: -40 },
  border = size * 0.045,
  scale = 1,
  children,
}: PhotoCardProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < delay) {
    return null;
  }
  const p = pop(frame, fps, delay, SPRINGS.slam);
  const sq = squash(frame, fps, delay, SPRINGS.slam, 0.5);
  const rest = 1 - p;
  const k = interpolate(p, [0, 1], [1.4, 1]) * popOut(frame, exitAt) * scale;
  const turn = rotate + rest * from.rotate + wobble(frame, seed, 0.8) * 1.5;
  const bob = wobble(frame, `${seed}-bob`, 0.6) * size * 0.012;
  const line = Math.max(3, size * 0.011);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        transform: `translate(${rest * from.x}px, ${rest * from.y + bob}px) rotate(${turn}deg) scale(${k * sq.x}, ${k * sq.y})`,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          boxSizing: 'border-box',
          padding: border,
          borderRadius: border * 1.9,
          backgroundColor: C.white,
          boxShadow: `0 0 0 ${line}px ${C.ink}, ${size * 0.025}px ${size * 0.035}px 0 ${line}px ${C.ink}`,
        }}
      >
        <Img
          src={src}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: border * 1.1,
            boxShadow: `0 0 0 ${line}px ${C.ink}`,
          }}
        />
      </div>
      {children}
    </div>
  );
}

type SpeechBubbleProps = {
  text: string;
  x: number;
  top: number;
  width: number;
  seed: string;
  tail: 'up' | 'down' | 'left' | 'right';
  tailAt?: number;
  size?: number;
  delay?: number;
  exitAt?: number;
  rotate?: number;
  fill?: string;
};

const TAIL_SIDES: Record<SpeechBubbleProps['tail'], [keyof CSSProperties, keyof CSSProperties]> = {
  up: ['borderLeft', 'borderTop'],
  right: ['borderTop', 'borderRight'],
  down: ['borderRight', 'borderBottom'],
  left: ['borderBottom', 'borderLeft'],
};

export function SpeechBubble({
  text,
  x,
  top,
  width,
  seed,
  tail,
  tailAt = 0.5,
  size = 46,
  delay = 0,
  exitAt,
  rotate = 0,
  fill = C.white,
}: SpeechBubbleProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(frame, fps, delay);
  const k = s * popOut(frame, exitAt);
  const turn = rotate + interpolate(s, [0, 1], [-14, 0]) + wobble(frame, seed, 0.7) * 1.3;
  const nib = 48;
  const line = 6;
  const along = `${tailAt * 100}%`;
  const vertical = tail === 'up' || tail === 'down';
  const [first, second] = TAIL_SIDES[tail];
  const nibStyle: CSSProperties = {
    position: 'absolute',
    width: nib,
    height: nib,
    backgroundColor: fill,
    boxSizing: 'border-box',
    transform: 'rotate(45deg)',
    [first]: `${line}px solid ${C.ink}`,
    [second]: `${line}px solid ${C.ink}`,
    ...(vertical
      ? { left: along, marginLeft: -nib / 2, [tail === 'up' ? 'top' : 'bottom']: -nib / 2 - line / 2 }
      : { top: along, marginTop: -nib / 2, [tail]: -nib / 2 - line / 2 }),
  };
  const origin = vertical
    ? `${along} ${tail === 'up' ? '0%' : '100%'}`
    : `${tail === 'left' ? '0%' : '100%'} ${along}`;
  const words = text.split(' ');
  return (
    <div
      style={{
        position: 'absolute',
        left: x - width / 2,
        top,
        width,
        transformOrigin: origin,
        transform: `rotate(${turn}deg) scale(${k})`,
      }}
    >
      <div
        style={{
          position: 'relative',
          boxSizing: 'border-box',
          backgroundColor: fill,
          border: `${line}px solid ${C.ink}`,
          borderRadius: 46,
          boxShadow: `9px 12px 0 ${C.ink}`,
          padding: `${size * 0.55}px ${size * 0.75}px ${size * 0.62}px`,
        }}
      >
        <div style={nibStyle} />
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: size * 0.26,
            fontFamily: FONT.brand,
            fontWeight: 700,
            fontSize: size,
            lineHeight: 1.18,
            color: C.ink,
          }}
        >
          {words.map((word, i) => {
            const w = pop(frame, fps, delay + 2 + i * 0.7);
            return (
              <span key={i} style={{ display: 'inline-block', transform: `scale(${w})` }}>
                {i === 0 ? '\u201C' : ''}
                {word}
                {i === words.length - 1 ? '\u201D' : ''}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
