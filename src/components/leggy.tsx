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
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

type Mood = 'happy' | 'thinking' | 'wow';

export function Leggy({ size = 140, mood = 'happy' }: { size?: number; mood?: Mood }) {
  const wobble = useSharedValue(0);

  useEffect(() => {
    wobble.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 700, easing: Easing.inOut(Easing.quad) }),
        withTiming(-1, { duration: 700, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );
  }, [wobble]);

  const animated = useAnimatedStyle(() => ({
    transform: [{ translateY: -Math.abs(wobble.value) * 6 }, { rotate: `${wobble.value * 4}deg` }],
  }));

  const pupilShift = mood === 'thinking' ? -4 : 0;

  return (
    <Animated.View style={[{ width: size, height: size * 1.3 }, animated]}>
      <Svg width={size} height={size * 1.3} viewBox="0 0 100 130">
        <Path d="M38 70 C 30 88, 44 98, 32 112 S 26 124, 20 124" stroke={Colors.black} strokeWidth={4} fill="none" strokeLinecap="round" />
        <Path d="M62 70 C 72 86, 56 98, 68 112 S 76 124, 82 124" stroke={Colors.black} strokeWidth={4} fill="none" strokeLinecap="round" />
        <Ellipse cx={17} cy={125} rx={8} ry={4} fill={Colors.black} />
        <Ellipse cx={85} cy={125} rx={8} ry={4} fill={Colors.black} />
        <Path d="M50 14 C 50 6, 56 4, 58 8" stroke={Colors.black} strokeWidth={3} fill="none" strokeLinecap="round" />
        <Circle cx={59} cy={8} r={3.5} fill={Colors.green} stroke={Colors.black} strokeWidth={2} />
        <Circle cx={50} cy={48} r={34} fill={Colors.green} stroke={Colors.black} strokeWidth={3} />
        <Circle cx={37} cy={42} r={12} fill={Colors.white} stroke={Colors.black} strokeWidth={2.5} />
        <Circle cx={63} cy={42} r={12} fill={Colors.white} stroke={Colors.black} strokeWidth={2.5} />
        <Circle cx={39 + pupilShift} cy={mood === 'thinking' ? 38 : 44} r={5.5} fill={Colors.black} />
        <Circle cx={61 + pupilShift} cy={mood === 'thinking' ? 38 : 44} r={5.5} fill={Colors.black} />
        <Circle cx={41 + pupilShift} cy={mood === 'thinking' ? 36 : 42} r={1.8} fill={Colors.white} />
        <Circle cx={63 + pupilShift} cy={mood === 'thinking' ? 36 : 42} r={1.8} fill={Colors.white} />
        {mood === 'wow' ? (
          <Ellipse cx={50} cy={64} rx={5} ry={6} fill={Colors.black} />
        ) : mood === 'thinking' ? (
          <Path d="M43 64 Q 50 61, 57 64" stroke={Colors.black} strokeWidth={3} fill="none" strokeLinecap="round" />
        ) : (
          <Path d="M40 60 Q 50 70, 60 60" stroke={Colors.black} strokeWidth={3} fill="none" strokeLinecap="round" />
        )}
      </Svg>
    </Animated.View>
  );
}

export function LeggySays({
  children,
  mood,
  size = 110,
}: {
  children: string;
  mood?: Mood;
  size?: number;
}) {
  return (
    <View style={styles.row}>
      <Leggy size={size} mood={mood} />
      <View style={styles.bubble}>
        <Text style={styles.bubbleText}>{children}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  bubble: {
    flex: 1,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: Radius.tile,
    borderBottomLeftRadius: 6,
    padding: Spacing.three,
    backgroundColor: Colors.white,
  },
  bubbleText: {
    color: Colors.black,
    fontFamily: Fonts.sans,
    fontSize: 18,
    lineHeight: 25,
    fontWeight: '600',
  },
});
