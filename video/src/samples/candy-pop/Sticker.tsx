import type { ReactNode } from 'react';
import { Img, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { ChunkyText } from './ChunkyText';
import { pop, popOut, squash, wobble } from './motion';
import { C } from './theme';

export function StickerDefs() {
  return (
    <svg width={0} height={0} style={{ position: 'absolute' }}>
      <defs>
        <filter id="cp-diecut" x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
          <feMorphology in="SourceAlpha" operator="dilate" radius={8} result="grown" />
          <feGaussianBlur in="grown" stdDeviation={2} result="soft" />
          <feComponentTransfer in="soft" result="edge">
            <feFuncA type="linear" slope={14} intercept={-6} />
          </feComponentTransfer>
          <feFlood floodColor={C.white} />
          <feComposite in2="edge" operator="in" result="border" />
          <feMorphology in="edge" operator="dilate" radius={3} result="keyArea" />
          <feFlood floodColor={C.ink} />
          <feComposite in2="keyArea" operator="in" result="keyline" />
          <feOffset in="keyline" dx={7} dy={10} result="shadow" />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="keyline" />
            <feMergeNode in="border" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

export const DIECUT = 'url(#cp-diecut)';

type StickerProps = {
  x: number;
  y: number;
  seed: string;
  children: ReactNode;
  rotate?: number;
  delay?: number;
  exitAt?: number;
  scale?: number;
};

export function Sticker({ x, y, seed, children, rotate = 0, delay = 0, exitAt, scale = 1 }: StickerProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(frame, fps, delay);
  const sq = squash(frame, fps, delay);
  const k = s * popOut(frame, exitAt) * scale;
  const turn = rotate + interpolate(s, [0, 1], [-30, 0]) + wobble(frame, seed) * 3.5;
  const bob = wobble(frame, `${seed}-bob`, 0.7) * 9;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + bob,
        transform: `translate(-50%, -50%) rotate(${turn}deg) scale(${k * sq.x}, ${k * sq.y})`,
      }}
    >
      {children}
    </div>
  );
}

type DieCutProps = {
  size: number;
  d: string;
  fill: string;
  children?: ReactNode;
};

function DieCut({ size, d, fill, children }: DieCutProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block', overflow: 'visible' }}>
      <path d={d} transform="translate(4 6)" fill={C.ink} stroke={C.ink} strokeWidth={19} strokeLinejoin="round" />
      <path d={d} fill={C.ink} stroke={C.ink} strokeWidth={19} strokeLinejoin="round" />
      <path d={d} fill={C.white} stroke={C.white} strokeWidth={14} strokeLinejoin="round" />
      <path d={d} fill={fill} stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round" />
      {children}
    </svg>
  );
}

function spikes(count: number, outer: number, inner: number) {
  const points = Array.from({ length: count * 2 }, (_, i) => {
    const angle = (i * Math.PI) / count - Math.PI / 2;
    const r = i % 2 === 0 ? outer : inner;
    return `${(50 + Math.cos(angle) * r).toFixed(2)} ${(50 + Math.sin(angle) * r).toFixed(2)}`;
  });
  return `M${points.join(' L')} Z`;
}

const STAR = spikes(5, 46, 21);
const BURST = spikes(14, 48, 40);
const HEART =
  'M50 90 C22 66 5 48 5 29 C5 15 16 6 28 6 C38 6 46 11 50 20 C54 11 62 6 72 6 C84 6 95 15 95 29 C95 48 78 66 50 90 Z';

export function StarSticker({ size, fill = C.lemon }: { size: number; fill?: string }) {
  return <DieCut size={size} d={STAR} fill={fill} />;
}

export function HeartSticker({ size, fill = C.pink }: { size: number; fill?: string }) {
  return <DieCut size={size} d={HEART} fill={fill} />;
}

type BurstStickerProps = {
  size: number;
  lines: string[];
  fill?: string;
  textFill?: string;
  textSize?: number;
};

export function BurstSticker({ size, lines, fill = C.pink, textFill = C.white, textSize = size * 0.27 }: BurstStickerProps) {
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <DieCut size={size} d={BURST} fill={fill} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: size,
          height: size,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {lines.map((line) => (
          <ChunkyText key={line} size={textSize} fill={textFill} outline={textSize * 0.08} depth={textSize * 0.06}>
            {line}
          </ChunkyText>
        ))}
      </div>
    </div>
  );
}

export function EmojiSticker({ emoji, size }: { emoji: string; size: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: C.white,
        border: `${Math.max(4, size * 0.035)}px solid ${C.ink}`,
        boxShadow: `${size * 0.04}px ${size * 0.06}px 0 ${C.ink}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Noto Color Emoji", "Apple Color Emoji", sans-serif',
        fontSize: size * 0.56,
        lineHeight: 1,
      }}
    >
      {emoji}
    </div>
  );
}

export function CutoutSticker({ src, size }: { src: string; size: number }) {
  return <Img src={src} style={{ display: 'block', width: size, height: size, filter: DIECUT }} />;
}

type TagStickerProps = {
  text: string;
  size: number;
  fill?: string;
  textFill?: string;
};

export function TagSticker({ text, size, fill = C.lemon, textFill = C.ink }: TagStickerProps) {
  return (
    <div
      style={{
        backgroundColor: fill,
        border: `${Math.max(4, size * 0.1)}px solid ${C.ink}`,
        boxShadow: `${size * 0.1}px ${size * 0.14}px 0 ${C.ink}`,
        borderRadius: size,
        padding: `${size * 0.22}px ${size * 0.5}px ${size * 0.26}px`,
        fontFamily: 'inherit',
        whiteSpace: 'nowrap',
      }}
    >
      <ChunkyText size={size} fill={textFill} outline={0} depth={0}>
        {text}
      </ChunkyText>
    </div>
  );
}
