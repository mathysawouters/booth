import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type TextProps,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Fonts, MaxContentWidth, Spacing } from '@/constants/theme';

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
  variant = 'solid',
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'solid' | 'outline';
}) {
  const solid = variant === 'solid';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        solid ? styles.buttonSolid : styles.buttonOutline,
        (pressed || disabled) && styles.dimmed,
      ]}>
      {loading ? (
        <ActivityIndicator color={solid ? Colors.black : Colors.white} />
      ) : (
        <Text style={[styles.buttonLabel, { color: solid ? Colors.black : Colors.white }]}>
          {label}
        </Text>
      )}
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

export function Loading() {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={Colors.white} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.black,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
  },
  title: {
    color: Colors.white,
    fontFamily: Fonts.sans,
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: -1,
  },
  body: {
    color: Colors.white,
    fontFamily: Fonts.sans,
    fontSize: 20,
    lineHeight: 26,
  },
  muted: {
    color: Colors.gray,
  },
  button: {
    minHeight: 60,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  buttonSolid: {
    backgroundColor: Colors.white,
  },
  buttonOutline: {
    backgroundColor: Colors.black,
  },
  buttonLabel: {
    fontFamily: Fonts.sans,
    fontSize: 20,
    fontWeight: '800',
  },
  dimmed: {
    opacity: 0.5,
  },
  field: {
    minHeight: 60,
    borderWidth: 2,
    borderColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: Spacing.three,
    color: Colors.white,
    fontFamily: Fonts.sans,
    fontSize: 20,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.black,
  },
});
