import { Image } from 'expo-image';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

const POSES = {
  waving: { source: require('@/assets/illustrations/leggy-waving.png'), ratio: 452 / 768 },
  thinking: { source: require('@/assets/illustrations/leggy-thinking.png'), ratio: 356 / 768 },
  reading: { source: require('@/assets/illustrations/leggy-reading.png'), ratio: 469 / 768 },
  sleeping: { source: require('@/assets/illustrations/leggy-sleeping.png'), ratio: 621 / 768 },
  cheering: { source: require('@/assets/illustrations/leggy-cheering.png'), ratio: 533 / 768 },
  proud: { source: require('@/assets/illustrations/leggy-proud.png'), ratio: 457 / 768 },
};

export type Pose = keyof typeof POSES;

export function Leggy({ size = 160, pose = 'waving' }: { size?: number; pose?: Pose }) {
  const wobble = useSharedValue(0);

  useEffect(() => {
    wobble.set(
      withRepeat(
        withSequence(
          withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) }),
          withTiming(-1, { duration: 900, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        true,
      ),
    );
  }, [wobble]);

  const animated = useAnimatedStyle(() => ({
    transform: [{ translateY: -Math.abs(wobble.get()) * 5 }, { rotate: `${wobble.get() * 2.5}deg` }],
  }));

  const { source, ratio } = POSES[pose];
  return (
    <Animated.View style={[{ width: size * ratio, height: size }, animated]}>
      <Image source={source} style={styles.image} contentFit="contain" accessibilityLabel="Leggy" />
    </Animated.View>
  );
}

export function LeggySays({
  children,
  pose,
  size = 120,
}: {
  children: string;
  pose?: Pose;
  size?: number;
}) {
  return (
    <View style={styles.row}>
      <Leggy size={size} pose={pose} />
      <View style={styles.bubble}>
        <Text style={styles.bubbleText}>{children}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  bubble: {
    flex: 1,
    borderRadius: Radius.tile,
    borderBottomLeftRadius: 8,
    padding: Spacing.three,
    backgroundColor: Colors.soft,
  },
  bubbleText: {
    color: Colors.black,
    fontFamily: Fonts.sansSemi,
    fontSize: 17,
    lineHeight: 24,
  },
});
