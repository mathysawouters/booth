import { Easing, Img, interpolate, random, useCurrentFrame, useVideoConfig } from 'remotion';

import { LEGGY, type LeggyPose } from '../../lib/assets';
import { SPRINGS, pop, wobble } from './motion';
import { DIECUT } from './Sticker';
import { W } from './theme';

type LeggyProps = {
  pose: LeggyPose;
  height: number;
  x: number;
  bottom: number;
  from?: 'left' | 'right';
  delay?: number;
  exitAt?: number;
  tilt?: number;
  flip?: boolean;
  seed?: string;
};

export function Leggy({ pose, height, x, bottom, from = 'right', delay = 0, exitAt, tilt = 0, flip = false, seed = pose }: LeggyProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const art = LEGGY[pose];
  const width = (height * art.width) / art.height;
  const t = frame - delay;
  if (t < 0) {
    return null;
  }
  const dir = from === 'left' ? -1 : 1;
  const p = pop(frame, fps, delay, SPRINGS.slam);
  const away =
    exitAt === undefined
      ? 0
      : interpolate(frame, [exitAt, exitAt + 7], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.in(Easing.cubic),
        });
  const beat = Math.abs(Math.sin((t * Math.PI) / 9));
  const decay = Math.exp(-t / 9);
  const hop = beat * decay * height * 0.13;
  const squashed = (1 - 2 * beat) * decay * 0.14;
  const breathe = Math.sin(frame * 0.3 + random(seed) * 6) * 0.02;
  const sx = (1 + squashed - breathe) * (flip ? -1 : 1);
  const sy = 1 - squashed + breathe;
  const lean = tilt + dir * (1 - p) * 16 + wobble(frame, seed, 0.9) * 2.2;
  return (
    <Img
      src={art.src}
      style={{
        position: 'absolute',
        left: x - width / 2,
        top: bottom - height,
        width,
        height,
        filter: DIECUT,
        transformOrigin: '50% 100%',
        transform: `translate(${dir * W * (1 - p + away)}px, ${-hop}px) rotate(${lean}deg) scale(${sx}, ${sy})`,
      }}
    />
  );
}
