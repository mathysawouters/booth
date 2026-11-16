import { loadFont as loadFredoka } from '@remotion/google-fonts/Fredoka';
import { loadFont as loadNunito } from '@remotion/google-fonts/Nunito';
import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, Img, interpolate, random, spring, useCurrentFrame, useVideoConfig } from 'remotion';

import { LEGGY, type LeggyPose, SCREEN_HEIGHT, SCREEN_WIDTH } from '../../lib/assets';
import { COPY } from '../../lib/data';

export const DISPLAY = loadFredoka('normal', { weights: ['600', '700'], subsets: ['latin'] }).fontFamily;
export const SANS = loadNunito('normal', { weights: ['800'], subsets: ['latin'] }).fontFamily;

export const C = {
  ink: '#1B2A12',
  white: '#ffffff',
  green: '#84E030',
  greenDark: '#58AC14',
  lemon: '#FFEB3D',
  lemonLight: '#FFF58A',
  pink: '#FF7EC3',
  pinkLight: '#FFA3D5',
  mint: '#74EDBB',
  mintLight: '#A5F5D5',
  night: '#16240E',
  nightLight: '#22381A',
} as const;

const PARTY = [C.green, C.lemon, C.pink, C.mint, C.white];

export function usePop(delay = 0, config = { damping: 9, stiffness: 190, mass: 0.6 }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config });
}

function Star({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <path
        d="M50 4 L62 36 L96 38 L69 59 L79 93 L50 73 L21 93 L31 59 L4 38 L38 36 Z"
        fill={color}
        stroke={C.ink}
        strokeWidth={7}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Bg({ color, ray, seed = 'bg', children }: { color: string; ray: string; seed?: string; children?: ReactNode }) {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: color, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          left: -700,
          top: -280,
          width: 2480,
          height: 2480,
          borderRadius: '50%',
          background: `repeating-conic-gradient(${ray} 0deg 10deg, transparent 10deg 20deg)`,
          transform: `rotate(${frame * 0.4}deg)`,
        }}
      />
      {Array.from({ length: 16 }, (_, i) => {
        const x = random(`${seed}x${i}`) * 1080;
        const speed = 2 + random(`${seed}s${i}`) * 4;
        const y = 2100 - ((random(`${seed}y${i}`) * 2300 + frame * speed) % 2300);
        const size = 36 + random(`${seed}z${i}`) * 60;
        const tint = PARTY[i % PARTY.length] === color ? C.white : PARTY[i % PARTY.length];
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + Math.sin((frame + i * 20) / 18) * 26,
              top: y,
              transform: `rotate(${frame * (i % 2 === 0 ? 2 : -2) + i * 40}deg)`,
            }}>
            {i % 3 === 0 ? (
              <Star size={size} color={tint} />
            ) : (
              <div
                style={{
                  width: size * 0.6,
                  height: size * 0.6,
                  borderRadius: i % 3 === 1 ? '50%' : 12,
                  backgroundColor: tint,
                  border: `6px solid ${C.ink}`,
                }}
              />
            )}
          </div>
        );
      })}
      {children}
    </AbsoluteFill>
  );
}

export function PopWords({
  text,
  start = 0,
  gap = 4,
  size = 150,
  color = C.ink,
  shadow = C.white,
  outline,
  accent,
  accentColor = C.green,
}: {
  text: string;
  start?: number;
  gap?: number;
  size?: number;
  color?: string;
  shadow?: string;
  outline?: string;
  accent?: string;
  accentColor?: string;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        columnGap: size * 0.24,
        fontFamily: DISPLAY,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.04,
        textAlign: 'center',
      }}>
      {text.split(' ').map((word, i) => {
        const s = spring({ frame: frame - start - i * gap, fps, config: { damping: 8, stiffness: 210, mass: 0.5 } });
        const wobble = Math.sin((frame + i * 9) / 8) * 2.2;
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              color: word === accent ? accentColor : color,
              transform: `translateY(${(1 - s) * 90}px) scale(${s}) rotate(${(1 - s) * (i % 2 === 0 ? -20 : 20) + wobble}deg)`,
              textShadow: `0 ${size * 0.07}px 0 ${shadow}`,
              WebkitTextStroke: outline ? `${size * 0.09}px ${outline}` : undefined,
              paintOrder: 'stroke fill',
            }}>
            {word}
          </span>
        );
      })}
    </div>
  );
}

export function Sticker({
  children,
  x,
  y,
  rot = 0,
  start = 0,
  bg = C.white,
  size = 56,
  style,
}: {
  children: ReactNode;
  x: number;
  y: number;
  rot?: number;
  start?: number;
  bg?: string;
  size?: number;
  style?: CSSProperties;
}) {
  const frame = useCurrentFrame();
  const s = usePop(start);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${s}) rotate(${rot + Math.sin((frame + x) / 7) * 4}deg)`,
        backgroundColor: bg,
        color: C.ink,
        fontFamily: DISPLAY,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.1,
        padding: `${size * 0.22}px ${size * 0.5}px`,
        borderRadius: size * 0.7,
        border: `${Math.max(6, size * 0.14)}px solid ${C.white}`,
        boxShadow: `0 0 0 6px ${C.ink}, 0 16px 0 6px ${C.ink}`,
        whiteSpace: 'nowrap',
        ...style,
      }}>
      {children}
    </div>
  );
}

export function Confetti({ start, x = 540, y = 900, count = 80, seed = 'c' }: { start: number; x?: number; y?: number; count?: number; seed?: string }) {
  const frame = useCurrentFrame();
  const t = frame - start;
  if (t < 0 || t > 75) {
    return null;
  }
  const fade = interpolate(t, [50, 75], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {Array.from({ length: count }, (_, i) => {
        const angle = random(`${seed}a${i}`) * Math.PI * 2;
        const speed = 16 + random(`${seed}v${i}`) * 34;
        const drag = 1 - Math.exp(-t / 14);
        const px = x + Math.cos(angle) * speed * 15 * drag;
        const py = y + Math.sin(angle) * speed * 15 * drag - 220 * drag + 0.42 * t * t;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: px,
              top: py,
              width: 18 + (i % 3) * 8,
              height: 14 + (i % 2) * 14,
              borderRadius: i % 4 === 0 ? '50%' : 5,
              backgroundColor: PARTY[i % PARTY.length],
              border: `4px solid ${C.ink}`,
              opacity: fade,
              transform: `rotate(${t * (10 + (i % 7) * 4) * (i % 2 === 0 ? 1 : -1)}deg)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
}

export const PHONE_SCREEN = 560;
export const PHONE_SCREEN_HEIGHT = (PHONE_SCREEN * SCREEN_HEIGHT) / SCREEN_WIDTH;

export function Phone({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        width: PHONE_SCREEN + 36,
        height: PHONE_SCREEN_HEIGHT + 36,
        padding: 18,
        borderRadius: 86,
        backgroundColor: C.ink,
        boxShadow: `0 0 0 8px ${C.white}, 0 28px 0 8px rgba(27, 42, 18, 0.35)`,
        ...style,
      }}>
      <div
        style={{
          position: 'relative',
          width: PHONE_SCREEN,
          height: PHONE_SCREEN_HEIGHT,
          borderRadius: 68,
          overflow: 'hidden',
          backgroundColor: C.white,
        }}>
        {children}
      </div>
    </div>
  );
}

export function Shot({ src, at = 0, scroll = 0 }: { src: string; at?: number; scroll?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) {
    return null;
  }
  const s = spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 170, mass: 0.6 } });
  return (
    <Img
      src={src}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: PHONE_SCREEN,
        transform: `translateY(${(1 - s) * 260 - scroll}px) scale(${0.86 + s * 0.14})`,
        transformOrigin: '50% 0%',
        opacity: Math.min(1, s * 2.4),
      }}
    />
  );
}

export function Leggy({
  pose,
  x,
  y,
  height = 480,
  from = 'left',
  start = 0,
}: {
  pose: LeggyPose;
  x: number;
  y: number;
  height?: number;
  from?: 'left' | 'right' | 'bottom';
  start?: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - start, fps, config: { damping: 9, stiffness: 120, mass: 0.8 } });
  const off = (1 - s) * 800;
  const hop = Math.abs(Math.sin(frame / 7)) * 22;
  const squash = 1 - Math.abs(Math.cos(frame / 7)) * 0.04;
  return (
    <Img
      src={LEGGY[pose].src}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        height,
        transformOrigin: '50% 100%',
        transform: `translate(${from === 'left' ? -off : from === 'right' ? off : 0}px, ${(from === 'bottom' ? off : 0) - hop}px) rotate(${Math.sin(frame / 10) * 5}deg) scale(${2 - squash}, ${squash})`,
        filter: 'drop-shadow(0 10px 0 rgba(27, 42, 18, 0.22))',
      }}
    />
  );
}

export function PhotoCard({ src, size, rot = 0, style }: { src: string; size: number; rot?: number; style?: CSSProperties }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        padding: size * 0.035,
        borderRadius: size * 0.09,
        backgroundColor: C.white,
        boxShadow: `0 0 0 6px ${C.ink}, 0 ${size * 0.035}px 0 6px ${C.ink}`,
        transform: `rotate(${rot}deg)`,
        ...style,
      }}>
      <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: size * 0.06 }} />
    </div>
  );
}

export function Disclaimer() {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 64,
        display: 'flex',
        justifyContent: 'center',
      }}>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 28,
          color: C.ink,
          backgroundColor: 'rgba(255, 255, 255, 0.82)',
          padding: '8px 22px',
          borderRadius: 999,
        }}>
        {COPY.disclaimer}
      </div>
    </div>
  );
}

export function Wipe({ children, x = 540, y = 960, off = false }: { children: ReactNode; x?: number; y?: number; off?: boolean }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const r = off ? 2400 : spring({ frame, fps, config: { damping: 200 }, durationInFrames: 12 }) * 2400;
  return <AbsoluteFill style={{ clipPath: `circle(${r}px at ${x}px ${y}px)` }}>{children}</AbsoluteFill>;
}
