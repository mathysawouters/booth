import { Easing, interpolate, random } from 'remotion';

type EasingFn = (t: number) => number;

export const EXPO_OUT: EasingFn = Easing.bezier(0.16, 1, 0.3, 1);
export const EXPO_IN: EasingFn = Easing.bezier(0.7, 0, 0.84, 0);
export const GLIDE: EasingFn = Easing.bezier(0.72, 0, 0.18, 1);
export const SOFT: EasingFn = Easing.bezier(0.45, 0, 0.3, 1);

export function ramp(frame: number, from: number, to: number, easing: EasingFn = EXPO_OUT) {
  return interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });
}

export function mix(t: number, from: number, to: number) {
  return from + (to - from) * t;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function sway(frame: number, seed: string, period: number, amplitude: number) {
  return Math.sin((frame / period + random(seed)) * Math.PI * 2) * amplitude;
}
