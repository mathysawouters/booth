import type { CSSProperties, ReactNode } from 'react';
import { Img } from 'remotion';

import { SCREEN_HEIGHT } from '../../lib/assets';
import { clamp } from './motion';
import { COLOR, FONT, accentGlow, shade } from './theme';

const POINTS = { width: 390, height: 844, status: 47, bezel: 12, radius: 54 };
const DISPLAY_HEIGHT = POINTS.height;

export function phoneSize(screenWidth: number) {
  const unit = screenWidth / POINTS.width;
  return {
    unit,
    width: (POINTS.width + POINTS.bezel * 2) * unit,
    height: (DISPLAY_HEIGHT + POINTS.bezel * 2) * unit,
  };
}

type ScreenShotProps = {
  src: string;
  longHeight?: number;
  scroll?: number;
  offset?: number;
  dim?: number;
};

export function ScreenShot({ src, longHeight = SCREEN_HEIGHT, scroll = 0, offset = 0, dim = 0 }: ScreenShotProps) {
  const shift = clamp(scroll, 0, 1) * (1 - SCREEN_HEIGHT / longHeight) * 100;
  return (
    <div style={{ position: 'absolute', inset: 0, transform: `translateX(${offset * 100}%)`, backgroundColor: COLOR.card, overflow: 'hidden' }}>
      <Img
        src={src}
        style={{ position: 'absolute', left: 0, top: 0, display: 'block', width: '100%', height: 'auto', transform: `translateY(${-shift}%)` }}
      />
      {dim > 0 ? <div style={{ position: 'absolute', inset: 0, backgroundColor: `rgba(0, 0, 0, ${dim})` }} /> : null}
    </div>
  );
}

type PhoneFrameProps = {
  screenWidth: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  sheen?: number;
  children: ReactNode;
};

export function PhoneFrame({
  screenWidth,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  sheen = -1,
  children,
}: PhoneFrameProps) {
  const { unit, width, height } = phoneSize(screenWidth);
  const outerRadius = (POINTS.radius + POINTS.bezel) * unit;
  const band: CSSProperties = {
    position: 'absolute',
    inset: 0,
    borderRadius: outerRadius,
  };
  const button = (side: 'left' | 'right', top: number, length: number): CSSProperties => ({
    position: 'absolute',
    [side]: -2.6 * unit,
    top: top * unit,
    width: 4 * unit,
    height: length * unit,
    borderRadius: 2 * unit,
    background: 'linear-gradient(90deg, #3A3B3D, #17181A)',
  });
  return (
    <div style={{ width, height, perspective: 2600 }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
        }}
      >
        {[4, 3, 2, 1].map((layer) => (
          <div
            key={layer}
            style={{
              ...band,
              transform: `translateZ(${-layer * 3.2 * unit}px)`,
              background: layer === 4 ? '#0B0B0C' : 'linear-gradient(120deg, #55575A, #1B1C1E 40%, #3C3D40 70%, #101112)',
            }}
          />
        ))}
        <div style={{ position: 'absolute', inset: 0, transform: `translateZ(${-6 * unit}px)`, transformStyle: 'preserve-3d' }}>
          <div style={button('left', 150, 30)} />
          <div style={button('left', 210, 56)} />
          <div style={button('left', 280, 56)} />
          <div style={button('right', 250, 92)} />
        </div>
        <div
          style={{
            ...band,
            background: 'linear-gradient(135deg, #6A6C70 0%, #2A2B2E 22%, #151617 55%, #4B4D51 100%)',
            boxShadow: `inset 0 0 0 ${1.2 * unit}px rgba(255, 255, 255, 0.22)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 3 * unit,
            borderRadius: outerRadius - 3 * unit,
            backgroundColor: '#050505',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: POINTS.bezel * unit,
            borderRadius: POINTS.radius * unit,
            overflow: 'hidden',
            backgroundColor: COLOR.card,
          }}
        >
          {children}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 8 * unit,
              width: 136 * unit,
              height: 5 * unit,
              marginLeft: -68 * unit,
              borderRadius: 3 * unit,
              backgroundColor: 'rgba(12, 13, 11, 0.85)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(128deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 34%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '-20%',
              height: '140%',
              width: '70%',
              left: `${sheen * 100}%`,
              transform: 'skewX(-18deg)',
              background:
                'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.34) 50%, rgba(255, 255, 255, 0) 100%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: POINTS.radius * unit,
              boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.25)',
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: (POINTS.bezel + 9) * unit,
            width: 112 * unit,
            height: 32 * unit,
            marginLeft: -56 * unit,
            borderRadius: 16 * unit,
            backgroundColor: '#050505',
          }}
        >
          <div
            style={{
              position: 'absolute',
              right: 10 * unit,
              top: 10 * unit,
              width: 12 * unit,
              height: 12 * unit,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #2B3550, #0A0C12 70%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

type FloatingPhoneProps = PhoneFrameProps & {
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
  blur?: number;
  glow?: number;
};

export function FloatingPhone({
  x,
  y,
  scale = 1,
  opacity = 1,
  blur = 0,
  glow = 1,
  rotateX = 0,
  rotateY = 0,
  ...frameProps
}: FloatingPhoneProps) {
  const { width, height } = phoneSize(frameProps.screenWidth);
  const shadowX = -rotateY * 5;
  const shadowY = 70 + rotateX * 5;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - width / 2,
        top: y - height / 2,
        width,
        height,
        opacity,
        transform: `scale(${scale})`,
        filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '-22%',
          right: '-22%',
          bottom: '-13%',
          height: '30%',
          borderRadius: '50%',
          background: `radial-gradient(closest-side, ${accentGlow(0.75 * glow)}, ${accentGlow(0)})`,
          transform: `translateX(${shadowX * 1.6}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: '-6% -22% -14%',
          borderRadius: width * 0.16,
          background: `radial-gradient(closest-side, ${shade(0.5)}, ${shade(0.28)} 55%, ${shade(0)})`,
          transform: `translate(${shadowX * 2.4}px, ${shadowY}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: '2% 4% 1%',
          borderRadius: width * 0.16,
          boxShadow: `0 30px 60px ${shade(0.35)}`,
          transform: `translate(${shadowX * 0.7}px, ${shadowY * 0.24}px)`,
        }}
      />
      <PhoneFrame rotateX={rotateX} rotateY={rotateY} {...frameProps} />
    </div>
  );
}
