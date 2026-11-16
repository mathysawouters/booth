import { loadFont as loadSerif } from '@remotion/google-fonts/InstrumentSerif';
import { loadFont as loadGrotesk } from '@remotion/google-fonts/InterTight';

const grotesk = loadGrotesk('normal', { weights: ['500', '600', '800', '900'], subsets: ['latin'] });
const serif = loadSerif('italic', { weights: ['400'], subsets: ['latin'] });

export const FONT = {
  display: grotesk.fontFamily,
  serif: serif.fontFamily,
} as const;

export const COLOR = {
  ink: '#0C0D0B',
  inkSoft: 'rgba(12, 13, 11, 0.56)',
  inkFaint: 'rgba(12, 13, 11, 0.14)',
  paper: '#F4F3EE',
  card: '#FFFFFF',
  night: '#090A08',
  snow: '#F7F7F2',
  snowSoft: 'rgba(247, 247, 242, 0.6)',
  snowFaint: 'rgba(247, 247, 242, 0.16)',
  accent: '#84DB28',
} as const;

export const SAFE = { x: 64, y: 140 } as const;

export type Tone = 'light' | 'dark';

export const toneColors = (tone: Tone) =>
  tone === 'light'
    ? { text: COLOR.ink, soft: COLOR.inkSoft, faint: COLOR.inkFaint }
    : { text: COLOR.snow, soft: COLOR.snowSoft, faint: COLOR.snowFaint };

export const accentGlow = (alpha: number) => `rgba(132, 219, 40, ${alpha})`;
export const shade = (alpha: number) => `rgba(18, 22, 10, ${alpha})`;
