import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Burst } from '@/components/confetti';
import { Colors, Fonts } from '@/constants/theme';

export type BoxState = 'idle' | 'shaking' | 'open';

export function MysteryBox({ state, size = 150 }: { state: BoxState; size?: number }) {
  const shake = useSharedValue(0);
  const open = useSharedValue(0);

  useEffect(() => {
    cancelAnimation(shake);
    if (state === 'open') {
      shake.set(withTiming(0, { duration: 80 }));
      open.set(withSpring(1, { damping: 9, stiffness: 140 }));
      return;
    }
    open.set(0);
    shake.set(
      state === 'shaking'
        ? withRepeat(withSequence(withTiming(1, { duration: 70 }), withTiming(-1, { duration: 70 })), -1, true)
        : withRepeat(
            withSequence(
              withDelay(1300, withTiming(1, { duration: 80 })),
              withTiming(-1, { duration: 100 }),
              withTiming(1, { duration: 100 }),
              withTiming(-1, { duration: 100 }),
              withTiming(0, { duration: 80 }),
            ),
            -1,
          ),
    );
  }, [state, shake, open]);

  const box = useAnimatedStyle(() => ({
    transform: [
      { translateY: -Math.abs(shake.get()) * size * 0.05 },
      { rotate: `${shake.get() * 7}deg` },
      { scale: 1 + open.get() * 0.08 },
    ],
  }));
  const lid = useAnimatedStyle(() => ({
    transform: [
      { translateX: -open.get() * size * 0.3 },
      { translateY: -open.get() * size * 0.55 },
      { rotate: `${-open.get() * 32}deg` },
    ],
  }));
  const glow = useAnimatedStyle(() => ({
    opacity: open.get(),
    transform: [{ scale: 0.4 + open.get() * 0.8 }],
  }));

  return (
    <Animated.View style={[{ width: size, height: size * 1.05 }, styles.box, box]}>
      <Animated.View
        style={[styles.glow, { width: size * 0.9, height: size * 0.9, borderRadius: size, bottom: size * 0.4 }, glow]}
      />
      {state === 'open' && <Burst radius={size * 1.1} />}
      <View style={[styles.body, { width: size * 0.82, height: size * 0.6 }]}>
        <View style={[styles.ribbon, { width: size * 0.16 }]} />
        <View style={[styles.badge, { width: size * 0.36, height: size * 0.36, borderRadius: size }]}>
          <Text style={[styles.question, { fontSize: size * 0.27, lineHeight: size * 0.34 }]}>?</Text>
        </View>
      </View>
      <Animated.View style={[styles.lid, { width: size * 0.94, height: size * 0.2, bottom: size * 0.56 }, lid]}>
        <View style={[styles.ribbon, { width: size * 0.16 }]} />
        <View style={[styles.bow, { bottom: size * 0.17 }]}>
          <View style={[styles.loop, { width: size * 0.22, height: size * 0.15, transform: [{ rotate: '24deg' }] }]} />
          <View style={[styles.knot, { width: size * 0.1, height: size * 0.1 }]} />
          <View style={[styles.loop, { width: size * 0.22, height: size * 0.15, transform: [{ rotate: '-24deg' }] }]} />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  glow: {
    position: 'absolute',
    backgroundColor: Colors.white,
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.pink,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderBottomWidth: 7,
    borderColor: Colors.pinkDark,
    overflow: 'hidden',
  },
  lid: {
    position: 'absolute',
    alignItems: 'center',
    backgroundColor: Colors.pink,
    borderRadius: 12,
    borderBottomWidth: 5,
    borderColor: Colors.pinkDark,
  },
  ribbon: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: Colors.white,
  },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderWidth: 4,
    borderColor: Colors.pinkDark,
  },
  question: {
    color: Colors.pinkDark,
    fontFamily: Fonts.displayBold,
  },
  bow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  loop: {
    borderRadius: 999,
    backgroundColor: Colors.white,
    borderWidth: 4,
    borderColor: Colors.pinkDark,
  },
  knot: {
    borderRadius: 999,
    backgroundColor: Colors.pinkDark,
    marginHorizontal: -6,
    zIndex: 1,
  },
});
