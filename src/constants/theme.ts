import { Platform } from 'react-native';

export const Colors = {
  black: '#000000',
  white: '#ffffff',
  gray: '#8a8a8a',
  line: '#2a2a2a',
} as const;

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', mono: 'ui-monospace' },
  web: {
    sans: 'Inter, ui-sans-serif, system-ui, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  },
  default: { sans: 'normal', mono: 'monospace' },
});

export const Spacing = {
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80, web: 80 }) ?? 0;
export const MaxContentWidth = 600;
