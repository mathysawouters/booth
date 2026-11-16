import type { CSSProperties, ReactNode } from 'react';
import { Img, interpolate, random, useCurrentFrame, useVideoConfig } from 'remotion';

import { CATEGORY_ART, LEGGY, type LeggyPose } from '../../lib/assets';
import { COPY } from '../../lib/data';
import { C, CLAMP, FONT, INK, pop, wobble } from './theme';

const DIE_CUT = 'drop-shadow(5px 0 0 #fff) drop-shadow(-5px 0 0 #fff) drop-shadow(0 5px 0 #fff) drop-shadow(0 -5px 0 #fff) drop-shadow(0 7px 4px rgba(70,45,10,0.3))';

type LeggyProps = { pose: LeggyPose; height: number; sticker?: boolean; style?: CSSProperties };

export function Leggy({ pose, height, sticker = false, style }: LeggyProps) {
  const art = LEGGY[pose];
  return <Img src={art.src} style={{ position: 'absolute', height, width: (height * art.width) / art.height, filter: sticker ? DIE_CUT : undefined, ...style }} />;
}

type ArtStickerProps = { art: keyof typeof CATEGORY_ART; size: number; at?: number; rotate?: number; style?: CSSProperties };

export function ArtSticker({ art, size, at = 0, rotate = 0, style }: ArtStickerProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(frame, fps, at);
  return (
    <Img
      src={CATEGORY_ART[art]}
      style={{ position: 'absolute', width: size, height: size, filter: DIE_CUT, transform: `rotate(${rotate + (1 - s) * -30 + wobble(frame, art, 2.5)}deg) scale(${s})`, ...style }}
    />
  );
}

type RoundStickerProps = { size: number; color: string; at?: number; rotate?: number; style?: CSSProperties; children: ReactNode };

export function RoundSticker({ size, color, at = 0, rotate = 0, style, children }: RoundStickerProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(frame, fps, at);
  return (
    <div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size,
        border: '7px solid #FFFFFF',
        backgroundColor: color,
        boxShadow: '0 7px 8px rgba(70,45,10,0.28)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT.chunky,
        fontWeight: 700,
        fontSize: size * 0.5,
        lineHeight: 1,
        color: INK,
        transform: `rotate(${rotate + wobble(frame, 'sticker' + size + at, 5)}deg) scale(${s})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

type DayTabProps = { label: string; color: string; at: number; active?: boolean; style?: CSSProperties };

export function DayTab({ label, color, at, active = false, style }: DayTabProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(frame, fps, at);
  return (
    <div
      style={{
        width: 122,
        height: 68,
        borderRadius: '14px 14px 4px 4px',
        backgroundColor: color,
        boxShadow: '0 5px 0 rgba(42,35,64,0.18)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT.chunky,
        fontWeight: 700,
        fontSize: 40,
        color: INK,
        transform: `translateY(${(1 - s) * 60 + (active ? -10 : 0)}px) rotate(${wobble(frame, label, active ? 3 : 1.2)}deg) scale(${s * (active ? 1.08 : 1)})`,
        ...style,
      }}
    >
      {label}
    </div>
  );
}

export function Disclaimer({ color = INK }: { color?: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 142,
        textAlign: 'center',
        fontFamily: FONT.chunky,
        fontWeight: 500,
        fontSize: 27,
        color,
        opacity: 0.72,
      }}
    >
      <span style={{ backgroundColor: 'rgba(255,253,246,0.75)', padding: '4px 16px', borderRadius: 20 }}>{COPY.disclaimer}</span>
    </div>
  );
}

export const TAB_COLORS = [C.pink, C.yellow, C.mint, C.lime, C.sky, C.pink, C.yellow];

type EmojiBurstProps = { emojis: string[]; at: number; origin: [number, number]; count?: number; size?: number };

export function EmojiBurst({ emojis, at, origin, count = 10, size = 150 }: EmojiBurstProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - at;
  if (t < 0) return null;
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const delay = i * 3;
        const s = pop(frame, fps, at + delay, 'bouncy');
        const angle = -Math.PI / 2 + (i / Math.max(1, count - 1) - 0.5) * 2.4 + (random('eb' + i) - 0.5) * 0.4;
        const reach = (i === 0 ? 0 : 340 + random('er' + i) * 280) * Math.min(1, (t - delay) / 18);
        const drift = Math.max(0, t - delay) * 3;
        const big = i === 0 ? 2.1 : 0.7 + random('es' + i) * 0.6;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: origin[0] + Math.cos(angle) * reach - size / 2,
              top: origin[1] + Math.sin(angle) * reach - drift - size / 2,
              fontSize: size * big,
              lineHeight: 1,
              opacity: interpolate(t - delay, [0, 4, 60, 80], [0, 1, 1, 0], CLAMP),
              transform: `scale(${s}) rotate(${(random('ee' + i) - 0.5) * 40 + wobble(frame, 'em' + i, 8)}deg)`,
              filter: 'drop-shadow(0 8px 6px rgba(70,45,10,0.3))',
            }}
          >
            {emojis[i % emojis.length]}
          </div>
        );
      })}
    </>
  );
}
