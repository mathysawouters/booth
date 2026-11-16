import { loadFont as loadCaveat } from '@remotion/google-fonts/Caveat';
import { loadFont as loadFredoka } from '@remotion/google-fonts/Fredoka';
import { loadFont as loadLiterata } from '@remotion/google-fonts/Literata';
import { Easing, interpolate, random, spring } from 'remotion';

export const FONT = {
  hand: loadCaveat('normal', { weights: ['700'], subsets: ['latin'] }).fontFamily,
  chunky: loadFredoka('normal', { weights: ['500', '700'], subsets: ['latin'] }).fontFamily,
  serif: loadLiterata('normal', { weights: ['900'], subsets: ['latin'] }).fontFamily,
};

export const INK = '#2A2340';

export const C = {
  cream: '#FFF7E3',
  paper: '#FFFDF6',
  back: '#F3E7CB',
  lime: '#8FDD3C',
  green: '#35A84A',
  yellow: '#FFE04A',
  pink: '#FF86BC',
  mint: '#8FEBD0',
  coral: '#FF5468',
  sky: '#7CC8FF',
};

export const PARTY = [C.yellow, C.pink, C.mint, C.lime, C.paper];

export const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const SPRINGS = {
  bouncy: { damping: 9, stiffness: 170, mass: 0.7 },
  soft: { damping: 14, stiffness: 110, mass: 0.9 },
  snappy: { damping: 18, stiffness: 240, mass: 0.6 },
};

export function pop(frame: number, fps: number, at = 0, kind: keyof typeof SPRINGS = 'bouncy') {
  return spring({ frame: Math.max(0, frame - at), fps, config: SPRINGS[kind] });
}

export function ramp(frame: number, at: number, duration: number) {
  return interpolate(frame, [at, at + duration], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
}

export function wobble(frame: number, seed: string, amplitude: number, speed = 1) {
  return Math.sin(frame * 0.14 * speed + random(seed) * Math.PI * 2) * amplitude;
}

export function jitter(seed: string, amplitude: number) {
  return (random(seed) - 0.5) * 2 * amplitude;
}

export function wrap(text: string, max: number) {
  const lines: string[] = [];
  for (const word of text.split(' ')) {
    const last = lines[lines.length - 1];
    if (last !== undefined && (last + ' ' + word).length <= max) {
      lines[lines.length - 1] = last + ' ' + word;
    } else {
      lines.push(word);
    }
  }
  return lines;
}
