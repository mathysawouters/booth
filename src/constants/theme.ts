import { Platform } from 'react-native';

export const Colors = {
  white: '#ffffff',
  black: '#111111',
  gray: '#6f6f6f',
  line: '#e7e7e7',
  soft: '#f4f4f4',
  green: '#2fbf5b',
  greenSoft: '#e6f7eb',
} as const;

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', serif: 'Georgia', mono: 'ui-monospace' },
  web: {
    sans: 'Inter, ui-sans-serif, system-ui, sans-serif',
    serif: 'Georgia, "Times New Roman", serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  },
  default: { sans: 'normal', serif: 'serif', mono: 'monospace' },
});

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
  tile: 22,
  pill: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80, web: 80 }) ?? 0;
export const MaxContentWidth = 600;
