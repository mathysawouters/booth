import type { CSSProperties, ReactNode } from 'react';
import { Easing, Img, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../lib/assets';
import { CLAMP, pop } from './theme';

type PhoneProps = { screenWidth: number; style?: CSSProperties; children?: ReactNode };

export function phoneSize(screenWidth: number) {
  const bezel = Math.round(screenWidth * 0.03);
  const border = 10;
  const screenHeight = Math.round((screenWidth * SCREEN_HEIGHT) / SCREEN_WIDTH);
  return { bezel, border, screenHeight, width: screenWidth + (bezel + border) * 2, height: screenHeight + (bezel + border) * 2 };
}

export function Phone({ screenWidth, style, children }: PhoneProps) {
  const { bezel, border, screenHeight } = phoneSize(screenWidth);
  const radius = screenWidth * 0.14;
  return (
    <div style={{ position: 'absolute', padding: border, backgroundColor: '#FFFEFA', borderRadius: radius + bezel + border, boxShadow: '0 16px 26px rgba(70,45,10,0.3)', ...style }}>
      <div style={{ position: 'absolute', left: -2, top: '22%', width: 10, height: 70, borderRadius: 5, backgroundColor: '#17131F' }} />
      <div style={{ position: 'absolute', right: -2, top: '28%', width: 10, height: 110, borderRadius: 5, backgroundColor: '#17131F' }} />
      <div style={{ position: 'relative', padding: bezel, backgroundColor: '#221C31', borderRadius: radius + bezel, boxShadow: 'inset 0 0 0 3px rgba(255,255,255,0.14)' }}>
        <div style={{ position: 'relative', width: screenWidth, height: screenHeight, overflow: 'hidden', borderRadius: radius, backgroundColor: '#FFFFFF' }}>
          {children}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(120deg, rgba(255,255,255,0.16) 0%, transparent 28%)' }} />
        </div>
      </div>
    </div>
  );
}

export type Slide = { src: string; at: number; scroll?: number; scrollFrames?: number };

export function PhoneSlides({ slides, screenWidth }: { slides: Slide[]; screenWidth: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      {slides.map((slide, i) => {
        const enter = i === 0 ? 1 : pop(frame, fps, slide.at, 'snappy');
        const next = slides[i + 1];
        const exit = next ? pop(frame, fps, next.at, 'snappy') : 0;
        if (frame < slide.at && i > 0) return null;
        if (next && frame > next.at + 14) return null;
        const scroll = slide.scroll
          ? interpolate(frame, [slide.at + 6, slide.at + 6 + (slide.scrollFrames ?? 60)], [0, slide.scroll], { ...CLAMP, easing: Easing.inOut(Easing.quad) })
          : 0;
        return (
          <Img
            key={i}
            src={slide.src}
            style={{ position: 'absolute', left: 0, top: 0, width: screenWidth, transform: `translate(${(1 - enter) * screenWidth - exit * screenWidth * 0.3}px, ${-scroll}px)` }}
          />
        );
      })}
    </>
  );
}
