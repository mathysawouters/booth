import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

import { COPY } from '../../lib/data';
import { ramp } from './motion';
import { COLOR, FONT, SAFE, type Tone, toneColors } from './theme';

type ChromeProps = {
  tone: Tone;
  chapters: number[];
  hideTopAt?: number;
};

export function Chrome({ tone, chapters, hideTopAt }: ChromeProps) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const colors = toneColors(tone);
  const chapter = chapters.filter((start) => frame >= start).length;
  const lastStart = chapters[Math.max(0, chapter - 1)] ?? 0;
  const tick = ramp(frame, lastStart, lastStart + 14);
  const top = hideTopAt === undefined ? 1 : 1 - ramp(frame, hideTopAt, hideTopAt + 12);
  const progress = frame / (durationInFrames - 1);
  const pad = (value: number) => String(value).padStart(2, '0');
  return (
    <AbsoluteFill style={{ fontFamily: FONT.display }}>
      <div
        style={{
          position: 'absolute',
          left: SAFE.x,
          right: SAFE.x,
          top: SAFE.y,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: colors.text,
          opacity: top,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: COLOR.accent }} />
          {COPY.name}
        </div>
        <div style={{ display: 'flex', gap: 10, fontWeight: 600, color: colors.soft }}>
          <span style={{ color: colors.text, opacity: tick, transform: `translateY(${(1 - tick) * 14}px)` }}>
            {pad(chapter)}
          </span>
          <span>/</span>
          <span>{pad(chapters.length)}</span>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: SAFE.x,
          right: SAFE.x,
          bottom: SAFE.y,
          height: 4,
          borderRadius: 2,
          backgroundColor: colors.faint,
        }}
      >
        <div style={{ width: `${progress * 100}%`, height: 4, borderRadius: 2, backgroundColor: COLOR.accent }} />
        <div
          style={{
            position: 'absolute',
            left: `${progress * 100}%`,
            top: -5,
            width: 14,
            height: 14,
            marginLeft: -7,
            borderRadius: 7,
            backgroundColor: COLOR.accent,
          }}
        />
      </div>
    </AbsoluteFill>
  );
}

export function Disclaimer({ opacity }: { opacity: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.x,
        bottom: SAFE.y + 22,
        fontFamily: FONT.display,
        fontWeight: 500,
        fontSize: 28,
        color: COLOR.inkSoft,
        opacity,
      }}
    >
      {COPY.disclaimer}
    </div>
  );
}
