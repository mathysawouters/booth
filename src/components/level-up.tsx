import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Modal, Platform, StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { Confetti } from '@/components/confetti';
import { Leggy } from '@/components/leggy';
import { Button } from '@/components/ui';
import { Colors, Fonts, Spacing } from '@/constants/theme';
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
        <Animated.View entering={ZoomIn.springify()} style={styles.center}>
          <Leggy size={160} mood="wow" />
          <Text style={styles.kicker}>Level up!</Text>
          <Text style={styles.title}>
            {SKILLS[skill].label} level {level}!
          </Text>
          <Text style={styles.body}>{name} is getting more {SKILLS[skill].label.toLowerCase()} every day.</Text>
        </Animated.View>
        <View style={styles.action}>
          <Button label="Yay!" onPress={onClose} />
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
  },
  kicker: {
    color: Colors.black,
    fontFamily: Fonts.sans,
    fontSize: 20,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  title: {
    color: Colors.black,
    fontFamily: Fonts.sans,
    fontSize: 52,
    lineHeight: 58,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -1,
  },
  body: {
    color: Colors.black,
    fontFamily: Fonts.sans,
    fontSize: 20,
    lineHeight: 27,
    textAlign: 'center',
  },
  action: {
    position: 'absolute',
    left: Spacing.four,
    right: Spacing.four,
    bottom: Spacing.six,
  },
});
