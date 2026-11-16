import { AbsoluteFill, Img, random, useCurrentFrame } from 'remotion';

import { CATEGORY_ART } from '../../lib/assets';
import { sway } from './motion';
import { shade } from './theme';

const ART = Object.values(CATEGORY_ART);

export function DriftCards({ count = 6, opacity = 1 }: { count?: number; opacity?: number }) {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity }}>
      {new Array(count).fill(0).map((_, index) => {
        const depth = 0.35 + random(`card-depth-${index}`) * 0.65;
        const size = 150 + depth * 150;
        const side = index % 2 === 0 ? 0 : 1;
        const x = side * 800 + random(`card-x-${index}`) * 220 - 60 + sway(frame, `card-sway-${index}`, 190, 18);
        const travel = 1920 + size * 2;
        const y = ((((index / count) * travel + random(`card-y-${index}`) * 200 - frame * depth * 1.5) % travel) + travel) % travel - size;
        const rotation = (random(`card-rot-${index}`) - 0.5) * 24 + sway(frame, `card-spin-${index}`, 240, 5);
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: size * 0.24,
              backgroundColor: 'rgba(255, 255, 255, 0.82)',
              boxShadow: `0 ${size * 0.1}px ${size * 0.2}px ${shade(0.08)}`,
              opacity: 0.22 + depth * 0.3,
              transform: `rotate(${rotation}deg)`,
              filter: `blur(${(1 - depth) * 5 + 1.5}px)`,
            }}
          >
            <Img
              src={ART[index % ART.length]}
              style={{ position: 'absolute', inset: '12%', width: '76%', height: '76%', objectFit: 'contain' }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
}
