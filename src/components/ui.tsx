import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextProps,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Fonts, MaxContentWidth, Radius, Spacing } from '@/constants/theme';

export function Screen({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { paddingTop: insets.top + Spacing.three }]}>
      <View style={[styles.content, style]}>{children}</View>
    </View>
  );
}

export function Title({ style, ...props }: TextProps) {
  return <Text {...props} style={[styles.title, style]} />;
}

export function Body({ style, muted, ...props }: TextProps & { muted?: boolean }) {
  return <Text {...props} style={[styles.body, muted && styles.muted, style]} />;
}

export function Button({
  label,
  onPress,
  disabled,
  loading,
  icon,
  variant = 'solid',
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: ComponentProps<typeof Ionicons>['name'];
  variant?: 'solid' | 'accent' | 'outline';
}) {
  const color = variant === 'solid' ? Colors.white : Colors.black;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        (pressed || disabled) && styles.dimmed,
      ]}>
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <View style={styles.buttonRow}>
          {icon !== undefined && <Ionicons name={icon} size={22} color={color} />}
          <Text style={[styles.buttonLabel, { color }]}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

export function TextButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} hitSlop={12} style={styles.textButton}>
      <Text style={styles.textButtonLabel}>{label}</Text>
    </Pressable>
  );
}

export function Field({ style, ...props }: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={Colors.gray}
      autoCapitalize="none"
      autoCorrect={false}
      {...props}
      style={[styles.field, style]}
    />
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      disabled={onPress === undefined}
      style={[styles.chip, selected && styles.chipSelected]}>
      <Text style={styles.chipLabel}>{label}</Text>
    </Pressable>
  );
}

export function Loading() {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={Colors.black} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
  },
  title: {
    color: Colors.black,
    fontFamily: Fonts.sans,
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '900',
    letterSpacing: -1,
  },
  body: {
    color: Colors.black,
    fontFamily: Fonts.sans,
    fontSize: 19,
    lineHeight: 26,
  },
  muted: {
    color: Colors.gray,
  },
  button: {
    minHeight: 62,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    borderWidth: 2,
    borderColor: Colors.black,
  },
  solid: {
    backgroundColor: Colors.black,
  },
  accent: {
    backgroundColor: Colors.green,
    borderColor: Colors.green,
  },
  outline: {
    backgroundColor: Colors.white,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  buttonLabel: {
    fontFamily: Fonts.sans,
    fontSize: 20,
    fontWeight: '800',
  },
  dimmed: {
    opacity: 0.5,
  },
  textButton: {
    alignSelf: 'center',
    paddingVertical: Spacing.two,
  },
  textButtonLabel: {
    color: Colors.gray,
    fontFamily: Fonts.sans,
    fontSize: 17,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  field: {
    minHeight: 60,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: 18,
    paddingHorizontal: Spacing.three,
    color: Colors.black,
    backgroundColor: Colors.white,
    fontFamily: Fonts.sans,
    fontSize: 20,
  },
  card: {
    borderRadius: Radius.card,
    borderWidth: 2,
    borderColor: Colors.black,
    backgroundColor: Colors.white,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  chip: {
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    backgroundColor: Colors.white,
  },
  chipSelected: {
    backgroundColor: Colors.green,
    borderColor: Colors.green,
  },
  chipLabel: {
    color: Colors.black,
    fontFamily: Fonts.sans,
    fontSize: 17,
    fontWeight: '700',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
});
