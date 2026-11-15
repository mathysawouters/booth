import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, ReactNode } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type PressableProps,
  type StyleProp,
  type TextInputProps,
  type TextProps,
  type ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Fonts, MaxContentWidth, Radius, Shadow, Spacing } from '@/constants/theme';
import { tapHaptic } from '@/lib/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Tappable({
  style,
  scaleTo = 0.96,
  onPressIn,
  onPressOut,
  ...props
}: Omit<PressableProps, 'style'> & { style?: StyleProp<ViewStyle>; scaleTo?: number }) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));
  return (
    <AnimatedPressable
      accessibilityRole="button"
      {...props}
      onPressIn={(event) => {
        scale.set(withSpring(scaleTo, { damping: 18, stiffness: 320 }));
        tapHaptic();
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.set(withSpring(1, { damping: 12, stiffness: 260 }));
        onPressOut?.(event);
      }}
      style={[style, animated]}
    />
  );
}

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
  variant?: 'solid' | 'accent' | 'soft';
}) {
  const color = variant === 'solid' ? Colors.white : Colors.black;
  return (
    <Tappable
      accessibilityLabel={label}
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.button, styles[variant], disabled && styles.dimmed]}>
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <View style={styles.buttonRow}>
          {icon !== undefined && <Ionicons name={icon} size={22} color={color} />}
          <Text style={[styles.buttonLabel, { color }]}>{label}</Text>
        </View>
      )}
    </Tappable>
  );
}

export function TextButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Tappable onPress={onPress} hitSlop={12} style={styles.textButton}>
      <Text style={styles.textButtonLabel}>{label}</Text>
    </Tappable>
  );
}

export function IconButton({
  icon,
  label,
  onPress,
}: {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
}) {
  return (
    <Tappable accessibilityLabel={label} onPress={onPress} hitSlop={12} scaleTo={0.9} style={styles.iconButton}>
      <Ionicons name={icon} size={24} color={Colors.black} />
    </Tappable>
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
    <Tappable
      accessibilityState={{ selected }}
      onPress={onPress}
      disabled={onPress === undefined}
      scaleTo={0.92}
      style={[styles.chip, selected && styles.chipSelected]}>
      <Text style={styles.chipLabel}>{label}</Text>
    </Tappable>
  );
}

export function Avatar({ name, size = 48 }: { name: string; size?: number }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.4 }]}>{name.trim().slice(0, 2).toUpperCase()}</Text>
    </View>
  );
}

export function Loading() {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={Colors.greenDeep} size="large" />
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
    fontFamily: Fonts.displayBold,
    fontSize: 34,
    lineHeight: 40,
  },
  body: {
    color: Colors.black,
    fontFamily: Fonts.sans,
    fontSize: 18,
    lineHeight: 26,
  },
  muted: {
    color: Colors.gray,
  },
  button: {
    minHeight: 60,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  solid: {
    backgroundColor: Colors.black,
  },
  accent: {
    backgroundColor: Colors.green,
  },
  soft: {
    backgroundColor: Colors.soft,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  buttonLabel: {
    fontFamily: Fonts.display,
    fontSize: 20,
  },
  dimmed: {
    opacity: 0.45,
  },
  textButton: {
    alignSelf: 'center',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  textButtonLabel: {
    color: Colors.gray,
    fontFamily: Fonts.sansBold,
    fontSize: 16,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  field: {
    minHeight: 58,
    borderRadius: Radius.field,
    paddingHorizontal: Spacing.three,
    color: Colors.black,
    backgroundColor: Colors.soft,
    fontFamily: Fonts.sansSemi,
    fontSize: 18,
    ...Platform.select({ web: { outlineColor: Colors.green } }),
  },
  card: {
    borderRadius: Radius.card,
    backgroundColor: Colors.white,
    padding: Spacing.four,
    gap: Spacing.three,
    ...Shadow.card,
  },
  chip: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    backgroundColor: Colors.soft,
  },
  chipSelected: {
    backgroundColor: Colors.green,
  },
  chipLabel: {
    color: Colors.black,
    fontFamily: Fonts.sansBold,
    fontSize: 16,
  },
  avatar: {
    backgroundColor: Colors.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.black,
    fontFamily: Fonts.display,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
});
