import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { type ComponentProps, type ReactNode, useEffect } from 'react';
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
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BRIGHT_TONES, Colors, Fonts, MaxContentWidth, Radius, Spacing, Tones, type Tone } from '@/constants/theme';
import { tapHaptic } from '@/lib/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const BOUNCE = { damping: 9, stiffness: 320 };

export function Tappable({
  style,
  scaleTo = 0.94,
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
        scale.set(withTiming(scaleTo, { duration: 70 }));
        tapHaptic();
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.set(withSpring(1, BOUNCE));
        onPressOut?.(event);
      }}
      style={[style, animated]}
    />
  );
}

export function Chunky({
  tone = 'white',
  radius = Radius.tile,
  depth = 6,
  style,
  faceStyle,
  children,
  onPressIn,
  onPressOut,
  ...props
}: Omit<PressableProps, 'style' | 'children'> & {
  tone?: Tone;
  radius?: number;
  depth?: number;
  style?: StyleProp<ViewStyle>;
  faceStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  const pressed = useSharedValue(0);
  const squash = useAnimatedStyle(() => ({
    transform: [{ scaleX: 1 + pressed.get() * 0.03 }, { scaleY: 1 - pressed.get() * 0.05 }],
  }));
  const face = useAnimatedStyle(() => ({ transform: [{ translateY: pressed.get() * depth }] }));
  const { face: color, edge } = Tones[tone];
  return (
    <AnimatedPressable
      accessibilityRole="button"
      {...props}
      onPressIn={(event) => {
        pressed.set(withTiming(1, { duration: 70 }));
        tapHaptic();
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        pressed.set(withSpring(0, BOUNCE));
        onPressOut?.(event);
      }}
      style={[{ paddingBottom: depth }, style, squash]}>
      <View style={[styles.chunkyEdge, { top: depth, borderRadius: radius, backgroundColor: edge }]} />
      <Animated.View
        style={[
          styles.chunkyFace,
          { borderRadius: radius, backgroundColor: color },
          tone === 'white' && styles.chunkyOutline,
          faceStyle,
          face,
        ]}>
        {children}
      </Animated.View>
    </AnimatedPressable>
  );
}

export function Screen({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { paddingTop: insets.top + Spacing.three }]}>
      <Image
        source={require('@/assets/illustrations/meadow-welcome.jpg')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      <View style={[styles.content, style]}>{children}</View>
    </View>
  );
}

export function Hero({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.hero, { paddingTop: insets.top + Spacing.three }, style]}>
      <View style={styles.heroOverscroll} />
      <Image
        source={require('@/assets/illustrations/meadow-today.jpg')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      {children}
      <View style={styles.heroSheet} />
    </View>
  );
}

export function Title({ style, ...props }: TextProps) {
  return <Text {...props} style={[styles.title, style]} />;
}

export function Body({ style, muted, ...props }: TextProps & { muted?: boolean }) {
  return <Text {...props} style={[styles.body, muted && styles.muted, style]} />;
}

const VARIANT_TONE = { accent: 'green', solid: 'pink', soft: 'white', lemon: 'lemon', mint: 'mint' } as const;

export function Button({
  label,
  onPress,
  disabled,
  loading,
  icon,
  variant = 'solid',
  small,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: ComponentProps<typeof Ionicons>['name'];
  variant?: keyof typeof VARIANT_TONE;
  small?: boolean;
}) {
  return (
    <Chunky
      accessibilityLabel={label}
      onPress={onPress}
      disabled={disabled || loading}
      tone={disabled ? 'white' : VARIANT_TONE[variant]}
      radius={small ? 18 : 22}
      depth={small ? 4 : 6}
      style={disabled && styles.dimmed}
      faceStyle={[styles.button, small && styles.buttonSmall]}>
      {loading ? (
        <ActivityIndicator color={Colors.black} />
      ) : (
        <View style={styles.buttonRow}>
          {icon !== undefined && <Ionicons name={icon} size={small ? 18 : 24} color={Colors.black} />}
          <Text style={[styles.buttonLabel, small && styles.buttonLabelSmall]}>{label}</Text>
        </View>
      )}
    </Chunky>
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
    <Chunky accessibilityLabel={label} onPress={onPress} hitSlop={12} radius={24} depth={4} faceStyle={styles.iconButton}>
      <Ionicons name={icon} size={24} color={Colors.black} />
    </Chunky>
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
    <Chunky
      accessibilityState={{ selected }}
      onPress={onPress}
      disabled={onPress === undefined}
      tone={selected ? 'green' : 'white'}
      radius={Radius.pill}
      depth={4}
      faceStyle={styles.chip}>
      <Text style={styles.chipLabel}>{label}</Text>
    </Chunky>
  );
}

export function ProgressBar({
  progress,
  color = Colors.green,
  track = Colors.white,
  height = 16,
}: {
  progress: number;
  color?: string;
  track?: string;
  height?: number;
}) {
  const shown = useSharedValue(0);
  useEffect(() => {
    shown.set(withSpring(Math.max(0, Math.min(1, progress)), { damping: 14, stiffness: 120 }));
  }, [progress, shown]);
  const fill = useAnimatedStyle(() => ({ width: `${Math.max(0, Math.min(1, shown.get())) * 100}%` }));
  return (
    <View style={[styles.track, { height, borderRadius: height / 2, backgroundColor: track }]}>
      <Animated.View style={[styles.fill, { borderRadius: height / 2, backgroundColor: color }, fill]}>
        <View style={[styles.shine, { top: height * 0.2, height: height * 0.22 }]} />
      </Animated.View>
    </View>
  );
}

export function Avatar({ name, size = 48 }: { name: string; size?: number }) {
  const tone = BRIGHT_TONES[(name.codePointAt(0) ?? 0) % BRIGHT_TONES.length];
  return (
    <View
      style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: Tones[tone].face }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.4 }]}>{name.trim().slice(0, 2).toUpperCase()}</Text>
    </View>
  );
}

export function Loading() {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={Colors.greenDark} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.sky,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
  },
  hero: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four + 28,
    gap: Spacing.three,
  },
  heroOverscroll: {
    position: 'absolute',
    top: -800,
    left: 0,
    right: 0,
    height: 800,
    backgroundColor: Colors.sky,
  },
  heroSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 28,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: Colors.paper,
  },
  chunkyEdge: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  chunkyFace: {
    flexGrow: 1,
  },
  chunkyOutline: {
    borderWidth: 2,
    borderColor: Colors.line,
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  buttonSmall: {
    minHeight: 44,
    paddingHorizontal: Spacing.three,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  buttonLabel: {
    color: Colors.black,
    fontFamily: Fonts.displayBold,
    fontSize: 21,
  },
  buttonLabelSmall: {
    fontFamily: Fonts.display,
    fontSize: 16,
  },
  dimmed: {
    opacity: 0.6,
  },
  textButton: {
    alignSelf: 'center',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  textButtonLabel: {
    color: Colors.greenDeep,
    fontFamily: Fonts.sansHeavy,
    fontSize: 16,
  },
  iconButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  field: {
    minHeight: 60,
    borderRadius: Radius.field,
    borderWidth: 2,
    borderColor: Colors.line,
    paddingHorizontal: Spacing.three,
    color: Colors.black,
    backgroundColor: Colors.white,
    fontFamily: Fonts.sansBold,
    fontSize: 18,
    ...Platform.select({ web: { outlineColor: Colors.green } }),
  },
  card: {
    borderRadius: Radius.card,
    borderWidth: 2,
    borderBottomWidth: 6,
    borderColor: Colors.line,
    backgroundColor: Colors.white,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
  },
  chipLabel: {
    color: Colors.black,
    fontFamily: Fonts.sansBold,
    fontSize: 16,
  },
  track: {
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    minWidth: 0,
  },
  shine: {
    position: 'absolute',
    left: 8,
    right: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  avatar: {
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
    backgroundColor: Colors.paper,
  },
});
