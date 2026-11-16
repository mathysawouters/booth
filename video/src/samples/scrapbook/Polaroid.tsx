import type { CSSProperties, ReactNode } from 'react';
import { Img, useCurrentFrame, useVideoConfig } from 'remotion';

import { pop, wobble } from './theme';

type PolaroidProps = {
  src: string;
  size: number;
  at?: number;
  rotate?: number;
  seed?: string;
  captionHeight?: number;
  caption?: ReactNode;
  style?: CSSProperties;
  children?: ReactNode;
};

export function Polaroid({ src, size, at = 0, rotate = 0, seed = src, captionHeight, caption, style, children }: PolaroidProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(frame, fps, at);
  const air = Math.max(0, 1 - s);
  const pad = Math.round(size * 0.055);
  return (
    <div
      style={{
        position: 'absolute',
        opacity: frame >= at ? 1 : 0,
        transform: `translateY(${(1 - s) * -260}px) rotate(${rotate + (1 - s) * 16 + wobble(frame, seed, 0.9)}deg) scale(${1 + air * 0.45})`,
        ...style,
      }}
    >
      <div
        style={{
          padding: `${pad}px ${pad}px 0`,
          backgroundColor: '#FFFEFA',
          borderRadius: 5,
          boxShadow: `0 ${6 + air * 40}px ${12 + air * 30}px rgba(70,45,10,${0.3 - air * 0.12})`,
        }}
      >
        <Img src={src} style={{ display: 'block', width: size, height: size, borderRadius: 3, boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.08)' }} />
        <div style={{ height: captionHeight ?? size * 0.28, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{caption}</div>
      </div>
      {children}
    </div>
  );
}
