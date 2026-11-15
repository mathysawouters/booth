import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { Colors } from '@/constants/theme';

const PIECES = Array.from({ length: 54 }, (_, i) => ({
  x: (i * 37) % 100,
  drift: ((i * 53) % 60) - 30,
  delay: (i * 71) % 900,
  spin: ((i * 29) % 4) + 2,
  size: 8 + ((i * 13) % 8),
  color: [Colors.white, Colors.black, Colors.greenDeep, Colors.white, Colors.greenSoft, Colors.black][i % 6],
  round: i % 3 === 0,
}));

export function Confetti() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {PIECES.map((piece, i) => (
        <Piece key={i} {...piece} />
      ))}
    </View>
  );
}

function Piece({ x, drift, delay, spin, size, color, round }: (typeof PIECES)[number]) {
  const { width, height } = useWindowDimensions();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.set(withDelay(delay, withTiming(1, { duration: 2800, easing: Easing.in(Easing.quad) })));
  }, [delay, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: 1 - progress.get() * 0.3,
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

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
