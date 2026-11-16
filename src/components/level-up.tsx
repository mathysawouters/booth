import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Modal, Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';

import { Burst, Confetti } from '@/components/confetti';
import { Leggy } from '@/components/leggy';
import { Button } from '@/components/ui';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { successHaptic } from '@/lib/haptics';
import { SKILLS } from '@/lib/legends';
import type { SkillName } from '@/lib/types';

const RAYS = 10;
const RAY_LENGTH = 720;
const RAY_HALF_WIDTH = 105;

export function LevelUp({
  skill,
  level,
  name,
  onClose,
}: {
  skill: SkillName;
  level: number;
  name: string;
  onClose: () => void;
}) {
  const { height } = useWindowDimensions();
  const turn = useSharedValue(0);
  const top = height * 0.11;
  const spot = Math.min(290, height * 0.34);

  useEffect(() => {
    successHaptic();
    turn.set(withRepeat(withTiming(360, { duration: 16000, easing: Easing.linear }), -1));
    if (Platform.OS === 'web') return;
    const thumps = [350, 700].map((delay) =>
      setTimeout(() => void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), delay),
    );
    return () => thumps.forEach(clearTimeout);
  }, [turn]);

  const spin = useAnimatedStyle(() => ({ transform: [{ rotate: `${turn.get()}deg` }] }));

  return (
    <Modal visible animationType="fade" onRequestClose={onClose}>
      <View style={[styles.screen, { paddingTop: top }]}>
        <View pointerEvents="none" style={styles.backdrop}>
          <View style={[styles.burstCenter, { top: top + spot / 2 }]}>
            <Animated.View style={[styles.rayPivot, spin]}>
              {Array.from({ length: RAYS }, (_, i) => (
                <View key={i} style={[styles.rayPivot, { transform: [{ rotate: `${(i * 360) / RAYS}deg` }] }]}>
                  <View style={styles.ray} />
                </View>
              ))}
            </Animated.View>
            <Burst radius={230} bursts={8} />
          </View>
        </View>
        <Animated.View
          entering={ZoomIn.springify().damping(9)}
          style={[styles.spotlight, { width: spot, height: spot, borderRadius: spot / 2 }]}>
          <Leggy size={spot * 0.82} pose="cheering" bouncy />
        </Animated.View>
        <Animated.View entering={ZoomIn.delay(250).springify().damping(10)} style={styles.center}>
          <View style={styles.kicker}>
            <Text style={styles.kickerText}>Level up!</Text>
          </View>
          <Text style={styles.title}>
            {SKILLS[skill].label} level {level}!
          </Text>
          <Text style={styles.body}>
            {name} is getting {SKILLS[skill].growing}!
          </Text>
        </Animated.View>
        <Confetti waves={4} />
        <View style={styles.action}>
          <Button label="Yay!" variant="lemon" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.green,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    overflow: 'hidden',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  burstCenter: {
    position: 'absolute',
    left: '50%',
    width: 0,
    height: 0,
  },
  rayPivot: {
    position: 'absolute',
    width: 0,
    height: 0,
  },
  ray: {
    position: 'absolute',
    left: -RAY_HALF_WIDTH,
    top: -RAY_LENGTH,
    width: 0,
    height: 0,
    borderLeftWidth: RAY_HALF_WIDTH,
    borderRightWidth: RAY_HALF_WIDTH,
    borderTopWidth: RAY_LENGTH,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'rgba(255, 235, 61, 0.45)',
  },
  spotlight: {
    backgroundColor: Colors.white,
    borderBottomWidth: 10,
    borderColor: Colors.lemon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingTop: Spacing.four,
  },
  kicker: {
    backgroundColor: Colors.pink,
    borderRadius: Radius.pill,
    borderBottomWidth: 4,
    borderColor: Colors.pinkDark,
    paddingHorizontal: Spacing.four,
    paddingVertical: 8,
  },
  kickerText: {
    color: Colors.black,
    fontFamily: Fonts.displayBold,
    fontSize: 20,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  title: {
    color: Colors.black,
    fontFamily: Fonts.displayBold,
    fontSize: 50,
    lineHeight: 56,
    textAlign: 'center',
  },
  body: {
    color: Colors.black,
    fontFamily: Fonts.sansBold,
    fontSize: 19,
    lineHeight: 26,
    textAlign: 'center',
  },
  action: {
    position: 'absolute',
    left: Spacing.four,
    right: Spacing.four,
    bottom: Spacing.six,
  },
});
