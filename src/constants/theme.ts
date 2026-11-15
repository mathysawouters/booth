import { Platform } from 'react-native';

export const Colors = {
  white: '#ffffff',
  black: '#111111',
  gray: '#6b7280',
  line: '#e5e7eb',
  soft: '#f3f4f6',
  green: '#93b743',
  greenDeep: '#5a7d2e',
  greenSoft: '#eff4e3',
} as const;

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
  field: 18,
  pill: 999,
} as const;

export const Shadow = {
  card: { boxShadow: '0 8px 24px rgba(17, 17, 17, 0.08)' },
  raised: { boxShadow: '0 2px 8px rgba(17, 17, 17, 0.1)' },
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80, web: 80 }) ?? 0;
export const MaxContentWidth = 600;
