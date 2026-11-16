import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Colors } from '@/constants/theme';

const PARTY = [Colors.white, Colors.lemon, Colors.pink, Colors.mint, Colors.green, Colors.pinkDark];

const PIECES = Array.from({ length: 60 }, (_, i) => ({
  x: (i * 37) % 100,
  drift: ((i * 53) % 60) - 30,
  delay: (i * 71) % 900,
  spin: ((i * 29) % 4) + 2,
  size: 9 + ((i * 13) % 9),
  color: PARTY[i % PARTY.length],
  round: i % 3 === 0,
}));

export function Confetti({ waves = 1 }: { waves?: number }) {
  return (
    <View pointerEvents="none" style={styles.clip}>
      {PIECES.map((piece, i) => (
        <Piece key={i} waves={waves} {...piece} />
      ))}
    </View>
  );
}

function Piece({ x, drift, delay, spin, size, color, round, waves }: (typeof PIECES)[number] & { waves: number }) {
  const { width, height } = useWindowDimensions();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.set(
      withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(0, { duration: 0 }),
            withTiming(1, { duration: 2800, easing: Easing.in(Easing.quad) }),
          ),
          waves,
        ),
      ),
    );
  }, [delay, progress, waves]);

  const style = useAnimatedStyle(() => ({
    opacity: progress.get() === 0 ? 0 : 1 - progress.get() * 0.3,
    transform: [
      { translateX: (x / 100) * width + drift * progress.get() * 3 },
      { translateY: -40 + progress.get() * (height + 80) },
      { rotate: `${progress.get() * 360 * spin}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.piece,
        { width: size, height: round ? size : size * 1.6, borderRadius: round ? size / 2 : 3, backgroundColor: color },
        style,
      ]}
    />
  );
}

const SPARKS = Array.from({ length: 14 }, (_, i) => ({
  angle: (i / 14) * Math.PI * 2 + ((i * 17) % 10) / 20,
  reach: 0.7 + ((i * 37) % 30) / 100,
  size: 16 + ((i * 13) % 14),
  delay: (i * 29) % 140,
  color: [Colors.lemon, Colors.white, Colors.pink, Colors.mint][i % 4] as string,
  star: i % 3 !== 2,
}));

export function Burst({ radius = 130, bursts = 1, colors }: { radius?: number; bursts?: number; colors?: string[] }) {
  return (
    <View pointerEvents="none" style={styles.burst}>
      {SPARKS.map((spark, i) => (
        <Spark key={i} radius={radius} bursts={bursts} {...spark} color={colors?.[i % colors.length] ?? spark.color} />
      ))}
    </View>
  );
}

function Spark({
  angle,
  reach,
  size,
  delay,
  color,
  star,
  radius,
  bursts,
}: (typeof SPARKS)[number] & { radius: number; bursts: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.set(
      withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(0, { duration: 0 }),
            withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) }),
            withTiming(1, { duration: 500 }),
          ),
          bursts,
        ),
      ),
    );
  }, [delay, progress, bursts]);

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(progress.get(), [0, 0.05, 0.7, 1], [0, 1, 1, 0]),
    transform: [
      { translateX: Math.cos(angle) * radius * reach * progress.get() - size / 2 },
      { translateY: Math.sin(angle) * radius * reach * progress.get() - size / 2 },
      { scale: interpolate(progress.get(), [0, 0.35, 1], [0.2, 1.25, 0.6]) },
      { rotate: `${progress.get() * 160}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.piece, style]}>
      {star ? (
        <Ionicons name="star" size={size} color={color} />
      ) : (
        <View style={{ width: size * 0.5, height: size * 0.5, borderRadius: size, backgroundColor: color }} />
      )}
    </Animated.View>
  );
}

const SPRINKLES = [
  { x: 7, y: 9, size: 30, star: true },
  { x: 84, y: 6, size: 18, star: false },
  { x: 90, y: 24, size: 26, star: true },
  { x: 4, y: 38, size: 16, star: false },
  { x: 88, y: 52, size: 20, star: true },
  { x: 6, y: 74, size: 24, star: true },
  { x: 80, y: 78, size: 14, star: false },
  { x: 20, y: 86, size: 18, star: false },
];

export function Sprinkles({ colors }: { colors: string[] }) {
  const twinkle = useSharedValue(0);

  useEffect(() => {
    twinkle.set(withRepeat(withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.quad) }), -1, true));
  }, [twinkle]);

  const even = useAnimatedStyle(() => ({ transform: [{ scale: 0.8 + twinkle.get() * 0.4 }, { rotate: '12deg' }] }));
  const odd = useAnimatedStyle(() => ({ transform: [{ scale: 1.2 - twinkle.get() * 0.4 }, { rotate: '-14deg' }] }));

  return (
    <View pointerEvents="none" style={styles.clip}>
      {SPRINKLES.map(({ x, y, size, star }, i) => (
        <Animated.View key={i} style={[styles.piece, { left: `${x}%`, top: `${y}%` }, i % 2 === 0 ? even : odd]}>
          {star ? (
            <Ionicons name="star" size={size} color={colors[i % colors.length]} />
          ) : (
            <View style={{ width: size, height: size, borderRadius: size, backgroundColor: colors[i % colors.length] }} />
          )}
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  piece: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  burst: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 0,
    height: 0,
  },
});
