import { interpolate, random, useCurrentFrame, useVideoConfig } from 'remotion';

import { ChunkyText } from './ChunkyText';
import { pop, popOut, squash, wobble } from './motion';

export type PopLine = { text: string; fill?: string };

type PopTextProps = {
  lines: PopLine[];
  size: number;
  seed: string;
  delay?: number;
  stagger?: number;
  exitAt?: number;
  leading?: number;
  align?: 'center' | 'flex-start' | 'flex-end';
  stroke?: string;
  outline?: number;
  depth?: number;
  font?: string;
  weight?: number;
};

export function breakLines(text: string, wordsPerLine: number[]) {
  const words = text.split(' ');
  let cursor = 0;
  return wordsPerLine.map((count) => {
    const line = words.slice(cursor, cursor + count).join(' ');
    cursor += count;
    return line;
  });
}

export function PopText({
  lines,
  size,
  seed,
  delay = 0,
  stagger = 3,
  exitAt,
  leading = 1.04,
  align = 'center',
  stroke,
  outline,
  depth,
  font,
  weight,
}: PopTextProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const counts = lines.map((line) => line.text.split(' ').length);
  const offsets = counts.map((_, i) => counts.slice(0, i).reduce((sum, count) => sum + count, 0));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: align }}>
      {lines.map((line, row) => (
        <div key={row} style={{ display: 'flex', gap: size * 0.24, height: size * leading, alignItems: 'center' }}>
          {line.text.split(' ').map((word, col) => {
            const index = offsets[row] + col;
            const start = delay + index * stagger;
            const s = pop(frame, fps, start);
            const sq = squash(frame, fps, start);
            const out = popOut(frame, exitAt === undefined ? undefined : exitAt + index);
            const rest = (random(`${seed}-rest-${index}`) - 0.5) * 7;
            const swing = index % 2 === 0 ? -18 : 18;
            const rotate = interpolate(s, [0, 1], [rest + swing, rest]) + wobble(frame, `${seed}-rot-${index}`) * 1.6;
            const y = interpolate(s, [0, 1], [size * 0.45, 0]) + wobble(frame, `${seed}-y-${index}`, 0.8) * size * 0.018;
            const k = s * out;
            return (
              <div
                key={col}
                style={{ transform: `translateY(${y}px) rotate(${rotate}deg) scale(${k * sq.x}, ${k * sq.y})` }}
              >
                <ChunkyText
                  size={size}
                  fill={line.fill}
                  stroke={stroke}
                  outline={outline}
                  depth={depth}
                  font={font}
                  weight={weight}
                >
                  {word}
                </ChunkyText>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
