import type { ReactNode } from 'react';
import { Img } from 'remotion';

import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../lib/assets';
import { C } from './theme';

const BASE = 544;
const PAD = 22;

export function phoneMetrics(width: number) {
  const unit = width / BASE;
  const screenWidth = width - PAD * 2 * unit;
  const screenHeight = (screenWidth * SCREEN_HEIGHT) / SCREEN_WIDTH;
  return { unit, screenWidth, screenHeight, height: screenHeight + PAD * 2 * unit };
}

type ToyPhoneProps = {
  children: ReactNode;
  width?: number;
  body?: string;
  sheen?: number;
};

export function ToyPhone({ children, width = BASE, body = C.white, sheen }: ToyPhoneProps) {
  const { unit, screenWidth, screenHeight, height } = phoneMetrics(width);
  const button = (side: 'left' | 'right', top: number, length: number) => (
    <div
      style={{
        position: 'absolute',
        [side]: -16 * unit,
        top: top * unit,
        width: 40 * unit,
        height: length * unit,
        borderRadius: 14 * unit,
        backgroundColor: body,
        border: `${8 * unit}px solid ${C.ink}`,
        boxSizing: 'border-box',
      }}
    />
  );
  return (
    <div style={{ position: 'relative', width, height }}>
      {button('left', 210, 76)}
      {button('left', 310, 76)}
      {button('right', 260, 130)}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width,
          height,
          borderRadius: 84 * unit,
          backgroundColor: body,
          boxShadow: `0 0 0 ${10 * unit}px ${C.ink}, ${16 * unit}px ${22 * unit}px 0 ${10 * unit}px ${C.ink}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: PAD * unit,
          top: PAD * unit,
          width: screenWidth,
          height: screenHeight,
          borderRadius: 62 * unit,
          overflow: 'hidden',
          backgroundColor: C.white,
          boxShadow: `0 0 0 ${7 * unit}px ${C.ink}`,
        }}
      >
        {children}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: screenHeight * 0.013,
            width: screenWidth * 0.3,
            height: screenHeight * 0.034,
            marginLeft: -screenWidth * 0.15,
            borderRadius: 999,
            backgroundColor: C.ink,
          }}
        />
        {sheen === undefined ? null : (
          <div
            style={{
              position: 'absolute',
              left: -screenWidth * 0.7 + sheen * screenWidth * 2.2,
              top: -screenHeight * 0.2,
              width: screenWidth * 0.34,
              height: screenHeight * 1.4,
              backgroundColor: 'rgba(255, 255, 255, 0.35)',
              transform: 'rotate(18deg)',
            }}
          />
        )}
      </div>
    </div>
  );
}

type ScreenShotProps = {
  src: string;
  scroll?: number;
  shiftX?: number;
};

export function ScreenShot({ src, scroll = 0, shiftX = 0 }: ScreenShotProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: C.white,
        transform: `translateX(${shiftX}px)`,
        boxShadow: `-8px 0 0 ${C.ink}`,
      }}
    >
      <Img src={src} style={{ display: 'block', width: '100%', transform: `translateY(${-scroll}px)` }} />
    </div>
  );
}
