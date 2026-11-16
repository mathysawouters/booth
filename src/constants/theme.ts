import { Platform } from 'react-native';

import type { Category, SkillName } from '@/lib/types';

export const Colors = {
  white: '#ffffff',
  black: '#1B2A12',
  gray: '#5F6B55',
  line: '#D5E6C3',
  soft: '#EEF8E1',
  paper: '#F3FCE8',
  green: '#84E030',
  greenDark: '#58AC14',
  greenDeep: '#2C6B08',
  greenSoft: '#E1F9C6',
  lemon: '#FFEB3D',
  lemonDark: '#E3D000',
  lemonSoft: '#FFF7A6',
  pink: '#FF7EC3',
  pinkDark: '#E0509C',
  pinkSoft: '#FFD6EC',
  mint: '#74EDBB',
  mintDark: '#36C28B',
  mintSoft: '#D2FBEA',
} as const;

export const Tones = {
  green: { face: Colors.green, edge: Colors.greenDark, soft: Colors.greenSoft },
  lemon: { face: Colors.lemon, edge: Colors.lemonDark, soft: Colors.lemonSoft },
  pink: { face: Colors.pink, edge: Colors.pinkDark, soft: Colors.pinkSoft },
  mint: { face: Colors.mint, edge: Colors.mintDark, soft: Colors.mintSoft },
  white: { face: Colors.white, edge: Colors.line, soft: Colors.white },
} as const;

export type Tone = keyof typeof Tones;

export const BRIGHT_TONES = ['lemon', 'pink', 'mint'] as const satisfies readonly Tone[];

export const CATEGORY_TONE: Record<Category, Tone> = {
  bedtime: 'pink',
  build: 'lemon',
  story: 'mint',
  outside: 'pink',
  kitchen: 'lemon',
  art: 'mint',
  music: 'pink',
  skills: 'lemon',
  calm: 'mint',
  surprise: 'pink',
};

export const SKILL_TONE: Record<SkillName, Tone> = {
  brave: 'pink',
  kind: 'mint',
  curious: 'lemon',
  money: 'green',
  helper: 'pink',
  reader: 'mint',
};

export const Fonts = {
  display: 'Fredoka_600SemiBold',
  displayBold: 'Fredoka_700Bold',
  sans: 'Nunito_400Regular',
  sansSemi: 'Nunito_600SemiBold',
  sansBold: 'Nunito_700Bold',
  sansHeavy: 'Nunito_800ExtraBold',
  serif: 'Literata_400Regular',
  serifItalic: 'Literata_400Regular_Italic',
  serifBold: 'Literata_600SemiBold',
} as const;

export const Spacing = {
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  card: 28,
  tile: 24,
  field: 20,
  pill: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80, web: 80 }) ?? 0;
export const MaxContentWidth = 600;
