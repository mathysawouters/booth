import { useCurrentFrame, useVideoConfig } from 'remotion';

import { SPRINGS, pop } from './motion';
import { C, FONT } from './theme';

type FinePrintProps = {
  text: string;
  top?: number;
  delay?: number;
  size?: number;
};

export function FinePrint({ text, top = 1734, delay = 0, size = 28 }: FinePrintProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(frame, fps, delay, SPRINGS.snap);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top,
        display: 'flex',
        justifyContent: 'center',
        opacity: s,
        transform: `translateY(${(1 - s) * 40}px)`,
      }}
    >
      <span
        style={{
          fontFamily: FONT.brand,
          fontWeight: 500,
          fontSize: size,
          lineHeight: 1,
          color: C.ink,
          backgroundColor: 'rgba(255, 255, 255, 0.88)',
          borderRadius: 999,
          padding: '9px 22px',
        }}
      >
        {text}
      </span>
    </div>
  );
}
