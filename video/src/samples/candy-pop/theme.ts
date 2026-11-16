import { loadFont as loadFredoka } from '@remotion/google-fonts/Fredoka';
import { loadFont as loadTitanOne } from '@remotion/google-fonts/TitanOne';

import { HEIGHT, WIDTH } from '../../lib/format';

const titanOne = loadTitanOne('normal', { weights: ['400'], subsets: ['latin'] });
const fredoka = loadFredoka('normal', { weights: ['500', '700'], subsets: ['latin'] });

export const FONT = {
  display: titanOne.fontFamily,
  brand: fredoka.fontFamily,
} as const;

export const C = {
  lime: '#8FE03A',
  limeSoft: '#A9EC5F',
  lemon: '#FFE83B',
  lemonSoft: '#FFF285',
  pink: '#FF5FA8',
  pinkSoft: '#FF85BD',
  mint: '#7CF2CB',
  mintSoft: '#B4F8E1',
  white: '#FFFFFF',
  ink: '#1A1A1A',
} as const;

export const W = WIDTH;
export const H = HEIGHT;
