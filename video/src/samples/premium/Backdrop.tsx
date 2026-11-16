import type { CSSProperties } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';

import { sway } from './motion';
import { COLOR, FONT, accentGlow } from './theme';

export function PaperBackdrop() {
  const frame = useCurrentFrame();
  const greenX = 78 + sway(frame, 'paper-green-x', 260, 14);
  const greenY = 74 + sway(frame, 'paper-green-y', 200, 10);
  const whiteX = 22 + sway(frame, 'paper-white-x', 220, 12);
  const whiteY = 20 + sway(frame, 'paper-white-y', 280, 9);
  const shadeX = 12 + sway(frame, 'paper-shade-x', 240, 10);
  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.paper }}>
      <AbsoluteFill
        style={{
          background: [
            `radial-gradient(900px 900px at ${whiteX}% ${whiteY}%, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0) 70%)`,
            `radial-gradient(1000px 1100px at ${greenX}% ${greenY}%, ${accentGlow(0.2)}, ${accentGlow(0)} 68%)`,
            `radial-gradient(900px 1000px at ${shadeX}% 92%, rgba(12, 13, 11, 0.07), rgba(12, 13, 11, 0) 70%)`,
          ].join(', '),
        }}
      />
    </AbsoluteFill>
  );
}

export function NightBackdrop() {
  const frame = useCurrentFrame();
  const greenX = 30 + sway(frame, 'night-green-x', 240, 16);
  const warmX = 82 + sway(frame, 'night-warm-x', 200, 10);
  const warmY = 18 + sway(frame, 'night-warm-y', 260, 8);
  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.night }}>
      <AbsoluteFill
        style={{
          background: [
            `radial-gradient(1100px 900px at ${greenX}% 104%, ${accentGlow(0.2)}, ${accentGlow(0)} 70%)`,
            `radial-gradient(900px 900px at ${warmX}% ${warmY}%, rgba(247, 247, 242, 0.09), rgba(247, 247, 242, 0) 70%)`,
            'radial-gradient(1400px 1700px at 50% 50%, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.55) 100%)',
          ].join(', '),
        }}
      />
    </AbsoluteFill>
  );
}

export function Bokeh({ count = 12 }: { count?: number }) {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {new Array(count).fill(0).map((_, index) => {
        const size = 90 + random(`bokeh-size-${index}`) * 240;
        const depth = 0.4 + random(`bokeh-depth-${index}`) * 0.6;
        const x = random(`bokeh-x-${index}`) * 1080 + sway(frame, `bokeh-sway-${index}`, 160, 24);
        const travel = 1920 + size * 2;
        const y = ((random(`bokeh-y-${index}`) * travel - frame * depth * 2.4) % travel + travel) % travel - size;
        const green = random(`bokeh-tint-${index}`) > 0.55;
        const alpha = (green ? 0.2 : 0.09) * depth;
        const tint = green ? accentGlow(alpha) : `rgba(247, 247, 242, ${alpha})`;
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: x - size / 2,
              top: y,
              width: size,
              height: size,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${tint} 0%, ${tint} 38%, rgba(0, 0, 0, 0) 70%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
}

type GhostNumeralProps = {
  text: string;
  size: number;
  color: string;
  x: number;
  y: number;
  align?: 'left' | 'center' | 'right';
  outline?: boolean;
  style?: CSSProperties;
};

export function GhostNumeral({ text, size, color, x, y, align = 'center', outline = false, style }: GhostNumeralProps) {
  const shift = align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0%';
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(${shift}, -50%)`,
        fontFamily: FONT.display,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 0.8,
        letterSpacing: '-0.06em',
        whiteSpace: 'nowrap',
        color: outline ? 'transparent' : color,
        WebkitTextStroke: outline ? `2px ${color}` : undefined,
        ...style,
      }}
    >
      {text}
    </div>
  );
}

type HairlineProps = {
  progress: number;
  color: string;
  vertical?: boolean;
  origin?: string;
  style?: CSSProperties;
};

export function Hairline({ progress, color, vertical = false, origin, style }: HairlineProps) {
  return (
    <div
      style={{
        position: 'absolute',
        width: vertical ? 2 : undefined,
        height: vertical ? undefined : 2,
        backgroundColor: color,
        transformOrigin: origin ?? (vertical ? 'center top' : 'left center'),
        transform: vertical ? `scaleY(${progress})` : `scaleX(${progress})`,
        ...style,
      }}
    />
  );
}
