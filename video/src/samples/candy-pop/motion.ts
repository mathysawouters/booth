import { Easing, interpolate, random, spring } from 'remotion';

export type SpringSetup = { damping: number; stiffness: number; mass: number };

export const SPRINGS = {
  pop: { damping: 9, stiffness: 190, mass: 0.6 },
  slam: { damping: 11, stiffness: 150, mass: 0.9 },
  panel: { damping: 17, stiffness: 200, mass: 0.7 },
  snap: { damping: 200, stiffness: 240, mass: 0.6 },
} as const satisfies Record<string, SpringSetup>;

export function pop(frame: number, fps: number, delay = 0, config: SpringSetup = SPRINGS.pop) {
  return spring({ frame: Math.max(0, frame - delay), fps, config });
}

export function squash(frame: number, fps: number, delay = 0, config: SpringSetup = SPRINGS.pop, amount = 0.7) {
  const speed = pop(frame, fps, delay, config) - pop(frame - 1, fps, delay, config);
  const stretch = Math.max(-0.2, Math.min(0.28, speed * amount));
  return { x: 1 - stretch, y: 1 + stretch };
}

export function kick(frame: number, fps: number, at: number) {
  return pop(frame, fps, at, SPRINGS.pop) - pop(frame, fps, at, SPRINGS.snap);
}

export function wobble(frame: number, seed: string, speed = 1) {
  return Math.sin(frame * 0.22 * speed + random(seed) * Math.PI * 2);
}

export function popOut(frame: number, at?: number, length = 5) {
  if (at === undefined) {
    return 1;
  }
  return interpolate(frame, [at, at + length], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.back(2.2)),
  });
}
