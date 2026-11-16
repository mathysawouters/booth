import { Image } from 'expo-image';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';

import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { popHaptic } from '@/lib/haptics';

type Eye = [left: number, top: number, right: number, bottom: number];

const POSES: Record<string, { source: number; ratio: number; eyes: Eye[] }> = {
  waving: {
    source: require('@/assets/illustrations/leggy-waving.png'),
    ratio: 452 / 768,
    eyes: [
      [0.184, 0.246, 0.374, 0.372],
      [0.489, 0.193, 0.686, 0.322],
    ],
  },
  thinking: {
    source: require('@/assets/illustrations/leggy-thinking.png'),
    ratio: 356 / 768,
    eyes: [
      [0.219, 0.224, 0.466, 0.345],
      [0.57, 0.177, 0.787, 0.288],
    ],
  },
  reading: {
    source: require('@/assets/illustrations/leggy-reading.png'),
    ratio: 469 / 768,
    eyes: [
      [0.192, 0.268, 0.39, 0.397],
      [0.497, 0.227, 0.678, 0.358],
    ],
  },
  sleeping: { source: require('@/assets/illustrations/leggy-sleeping.png'), ratio: 621 / 768, eyes: [] },
  cheering: { source: require('@/assets/illustrations/leggy-cheering.png'), ratio: 533 / 768, eyes: [] },
  proud: {
    source: require('@/assets/illustrations/leggy-proud.png'),
    ratio: 457 / 768,
    eyes: [
      [0.335, 0.238, 0.519, 0.363],
      [0.63, 0.186, 0.818, 0.312],
    ],
  },
};

export type Pose = 'waving' | 'thinking' | 'reading' | 'sleeping' | 'cheering' | 'proud';

const EYE_MARGIN = 0.02;
const BLINK = { duration: 80 };
const OPEN = { duration: 110 };

export function Leggy({
  size = 160,
  pose = 'waving',
  sun,
  bouncy,
}: {
  size?: number;
  pose?: Pose;
  sun?: string;
  bouncy?: boolean;
}) {
  const wobble = useSharedValue(0);
  const blink = useSharedValue(0);
  const jump = useSharedValue(0);

  useEffect(() => {
    wobble.set(
      withRepeat(
        withSequence(
          withTiming(1, { duration: bouncy ? 320 : 900, easing: Easing.inOut(Easing.quad) }),
          withTiming(-1, { duration: bouncy ? 320 : 900, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        true,
      ),
    );
    blink.set(
      withRepeat(
        withSequence(
          withDelay(2200, withTiming(1, BLINK)),
          withTiming(0, OPEN),
          withDelay(3100, withTiming(1, BLINK)),
          withTiming(0, OPEN),
          withDelay(160, withTiming(1, BLINK)),
          withTiming(0, OPEN),
        ),
        -1,
      ),
    );
  }, [wobble, blink, bouncy]);

  const body = useAnimatedStyle(() => ({
    transform: [
      { translateY: -Math.abs(wobble.get()) * (bouncy ? size * 0.08 : 5) - jump.get() * size * 0.28 },
      { rotate: `${wobble.get() * (bouncy ? 5 : 2.5)}deg` },
      { scaleX: 1 - jump.get() * 0.05 },
      { scaleY: 1 + jump.get() * 0.07 },
    ],
  }));
  const lid = useAnimatedStyle(() => ({ transform: [{ scaleY: blink.get() }] }));

  const { source, ratio, eyes } = POSES[pose];
  const width = size * ratio;
  const frame = sun === undefined ? width : Math.max(width, size * 0.92);
  return (
    <Pressable
      accessibilityLabel="Leggy"
      onPress={() => {
        popHaptic();
        jump.set(
          withSequence(
            withTiming(1, { duration: 220, easing: Easing.out(Easing.quad) }),
            withSpring(0, { damping: 7, stiffness: 220 }),
          ),
        );
      }}
      style={{ width: frame, height: size, alignItems: 'center' }}>
      {sun !== undefined && (
        <View style={[styles.sun, { backgroundColor: sun, width: size * 0.92, height: size * 0.92, borderRadius: size }]} />
      )}
      <Animated.View style={[{ width, height: size }, body]}>
        <Image source={source} style={styles.image} contentFit="contain" />
        {eyes.map(([left, top, right, bottom], i) => (
          <Animated.View
            key={i}
            style={[
              styles.lid,
              {
                left: (left - EYE_MARGIN) * width,
                top: (top - EYE_MARGIN) * size,
                width: (right - left + EYE_MARGIN * 2) * width,
                height: (bottom - top + EYE_MARGIN * 2) * size,
                borderBottomWidth: Math.max(2, size * 0.014),
              },
              lid,
            ]}
          />
        ))}
      </Animated.View>
    </Pressable>
  );
}

export function LeggySays({
  children,
  pose,
  size = 120,
  side = 'right',
  sun,
  bouncy,
}: {
  children: string;
  pose?: Pose;
  size?: number;
  side?: 'right' | 'top';
  sun?: string;
  bouncy?: boolean;
}) {
  return (
    <View style={side === 'right' ? styles.row : styles.column}>
      {side === 'right' && <Leggy size={size} pose={pose} sun={sun} bouncy={bouncy} />}
      <Animated.View
        key={children}
        entering={ZoomIn.springify().damping(13)}
        style={[styles.bubble, side === 'right' && styles.bubbleRight]}>
        <View style={[styles.tail, side === 'right' ? styles.tailLeft : styles.tailBottom]} />
        <Text style={[styles.bubbleText, side === 'top' && styles.bubbleTextCenter]}>{children}</Text>
      </Animated.View>
      {side === 'top' && <Leggy size={size} pose={pose} sun={sun} bouncy={bouncy} />}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  sun: {
    position: 'absolute',
    top: '2%',
  },
  lid: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#ABCA4F',
    borderColor: '#3F5E1C',
    transformOrigin: 'top',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  column: {
    alignItems: 'center',
    gap: Spacing.three,
  },
  bubble: {
    borderRadius: Radius.tile,
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderBottomWidth: 5,
    borderColor: 'rgba(27, 42, 18, 0.14)',
  },
  bubbleRight: {
    flex: 1,
  },
  tail: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 3,
    backgroundColor: Colors.white,
    transform: [{ rotate: '45deg' }],
  },
  tailLeft: {
    left: -7,
    top: 18,
  },
  tailBottom: {
    bottom: -8,
    alignSelf: 'center',
  },
  bubbleText: {
    color: Colors.black,
    fontFamily: Fonts.display,
    fontSize: 19,
    lineHeight: 25,
  },
  bubbleTextCenter: {
    textAlign: 'center',
  },
});
