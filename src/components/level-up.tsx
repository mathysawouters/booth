import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Modal, Platform, StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { Confetti } from '@/components/confetti';
import { Leggy } from '@/components/leggy';
import { Tappable } from '@/components/ui';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { SKILLS } from '@/lib/legends';
import type { SkillName } from '@/lib/types';

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
  useEffect(() => {
    if (Platform.OS !== 'web') {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);

  return (
    <Modal visible animationType="fade" onRequestClose={onClose}>
      <View style={styles.screen}>
        <Confetti />
        <Animated.View entering={ZoomIn.springify().damping(14)} style={styles.center}>
          <View style={styles.spotlight}>
            <Leggy size={210} pose="cheering" />
          </View>
          <View style={styles.kicker}>
            <Text style={styles.kickerText}>Level up!</Text>
          </View>
          <Text style={styles.title}>
            {SKILLS[skill].label} level {level}!
          </Text>
          <Text style={styles.body}>
            {name} is getting {SKILLS[skill].growing} every day.
          </Text>
        </Animated.View>
        <View style={styles.action}>
          <Tappable accessibilityLabel="Yay!" onPress={onClose} style={styles.button}>
            <Text style={styles.buttonLabel}>Yay!</Text>
          </Tappable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.green,
    justifyContent: 'center',
    padding: Spacing.four,
  },
  center: {
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: Spacing.six,
  },
  spotlight: {
    width: 264,
    height: 264,
    borderRadius: 132,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  kicker: {
    backgroundColor: Colors.black,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
  },
  kickerText: {
    color: Colors.white,
    fontFamily: Fonts.sansHeavy,
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  title: {
    color: Colors.black,
    fontFamily: Fonts.displayBold,
    fontSize: 46,
    lineHeight: 52,
    textAlign: 'center',
  },
  body: {
    color: Colors.black,
    fontFamily: Fonts.sansSemi,
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
  button: {
    minHeight: 72,
    borderRadius: Radius.pill,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    color: Colors.white,
    fontFamily: Fonts.displayBold,
    fontSize: 26,
  },
});
