import type { CSSProperties, ReactNode } from 'react';
import { Img } from 'remotion';

import { SCREEN_HEIGHT } from '../../lib/assets';
import { clamp } from './motion';
import { COLOR, FONT, accentGlow, shade } from './theme';

const POINTS = { width: 390, height: 844, status: 47, bezel: 12, radius: 54 };
const DISPLAY_HEIGHT = POINTS.height + POINTS.status;
const LONG_MIN_HEIGHT = 5000;

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
  scroll?: number;
  offset?: number;
  dim?: number;
};

export function ScreenShot({ src, scroll = 0, offset = 0, dim = 0 }: ScreenShotProps) {
  const shift = clamp(scroll, 0, 1) * (1 - SCREEN_HEIGHT / LONG_MIN_HEIGHT) * 100;
  return (
    <div style={{ position: 'absolute', inset: 0, transform: `translateX(${offset * 100}%)`, backgroundColor: COLOR.card }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: `${(POINTS.status / DISPLAY_HEIGHT) * 100}%`,
          bottom: 0,
          overflow: 'hidden',
        }}
      >
        <Img src={src} style={{ display: 'block', width: '100%', height: 'auto', transform: `translateY(${-shift}%)` }} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: `${(POINTS.status / DISPLAY_HEIGHT) * 100 + 0.1}%`,
          overflow: 'hidden',
        }}
      >
        <Img
          src={src}
          style={{ display: 'block', width: '100%', height: 'auto', transformOrigin: 'center top', transform: 'scaleY(240)' }}
        />
      </div>
      {dim > 0 ? <div style={{ position: 'absolute', inset: 0, backgroundColor: `rgba(0, 0, 0, ${dim})` }} /> : null}
    </div>
  );
}

function StatusBar({ unit, time }: { unit: number; time: string }) {
  const ink = 'rgba(12, 13, 11, 0.9)';
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: POINTS.status * unit }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: 132 * unit,
          top: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 3 * unit,
          fontFamily: FONT.display,
          fontWeight: 600,
          fontSize: 16.5 * unit,
          letterSpacing: '-0.01em',
          color: ink,
        }}
      >
        {time}
      </div>
      <svg
        width={78 * unit}
        height={16 * unit}
        viewBox="0 0 78 16"
        style={{ position: 'absolute', right: 26 * unit, top: 17 * unit }}
      >
        <rect x={0} y={10} width={3.4} height={5} rx={1} fill={ink} />
        <rect x={5.2} y={7.5} width={3.4} height={7.5} rx={1} fill={ink} />
        <rect x={10.4} y={4.5} width={3.4} height={10.5} rx={1} fill={ink} />
        <rect x={15.6} y={1.5} width={3.4} height={13.5} rx={1} fill={ink} />
        <path d="M26 6.2a10.5 10.5 0 0 1 15 0" fill="none" stroke={ink} strokeWidth={2.4} strokeLinecap="round" />
        <path d="M28.9 9.6a6.4 6.4 0 0 1 9.2 0" fill="none" stroke={ink} strokeWidth={2.4} strokeLinecap="round" />
        <circle cx={33.5} cy={13.2} r={1.8} fill={ink} />
        <rect x={48.6} y={2.1} width={24.8} height={12.8} rx={4} fill="none" stroke={ink} strokeOpacity={0.45} strokeWidth={1.2} />
        <rect x={50.4} y={3.9} width={17} height={9.2} rx={2.4} fill={ink} />
        <rect x={74.8} y={6} width={2} height={5} rx={1} fill={ink} fillOpacity={0.45} />
      </svg>
    </div>
  );
}

type PhoneFrameProps = {
  screenWidth: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  sheen?: number;
  time?: string;
  children: ReactNode;
};

export function PhoneFrame({
  screenWidth,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  sheen = -1,
  time = '7:00',
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
          <StatusBar unit={unit} time={time} />
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
