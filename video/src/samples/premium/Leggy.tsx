import type { CSSProperties } from 'react';
import { Img, useCurrentFrame } from 'remotion';

import { LEGGY, type LeggyPose } from '../../lib/assets';
import { sway } from './motion';
import { shade } from './theme';

type FloatingLeggyProps = {
  pose: LeggyPose;
  height: number;
  seed: string;
  tilt?: number;
  swing?: number;
  floorShadow?: boolean;
  softShadow?: boolean;
  style?: CSSProperties;
};

export function FloatingLeggy({
  pose,
  height,
  seed,
  tilt = 0,
  swing = 1.6,
  floorShadow = true,
  softShadow = false,
  style,
}: FloatingLeggyProps) {
  const frame = useCurrentFrame();
  const art = LEGGY[pose];
  const width = (height * art.width) / art.height;
  const bob = sway(frame, `${seed}-bob`, 64, height * 0.022);
  const rotation = tilt + sway(frame, `${seed}-rot`, 82, swing);
  return (
    <div style={{ position: 'absolute', width, height, ...style }}>
      {floorShadow ? (
        <div
          style={{
            position: 'absolute',
            left: '14%',
            right: '14%',
            bottom: -height * 0.035,
            height: height * 0.07,
            borderRadius: '50%',
            background: `radial-gradient(closest-side, ${shade(0.3)}, ${shade(0)})`,
            transform: `scale(${1 - bob / (height * 0.12)})`,
          }}
        />
      ) : null}
      <Img
        src={art.src}
        style={{
          position: 'absolute',
          inset: 0,
          width,
          height,
          transformOrigin: '50% 92%',
          transform: `translateY(${bob}px) rotate(${rotation}deg)`,
          filter: softShadow ? `drop-shadow(0 ${height * 0.04}px ${height * 0.05}px ${shade(0.2)})` : undefined,
        }}
      />
    </div>
  );
}
