import { router } from 'expo-router';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Leggy } from '@/components/leggy';
import { Chunky, Screen } from '@/components/ui';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const title = Math.min(width, 430) * 0.175;
  return (
    <Screen style={{ paddingBottom: insets.bottom + Spacing.three }}>
      <View style={[styles.sky, { paddingTop: Math.max(Spacing.three, height * 0.145 - insets.top - Spacing.three) }]}>
        <Text style={[styles.wordmark, { fontSize: title, lineHeight: title * 1.04 }]}>Little{'\n'}Legends</Text>
        <Text style={styles.tagline}>One fun thing with{'\n'}your kid, every day</Text>
      </View>
      <View style={styles.hill}>
        <Leggy size={height * 0.38} pose="waving" />
      </View>
      <Chunky
        accessibilityLabel="Let's start"
        onPress={() => router.push('/onboarding')}
        radius={Radius.pill}
        faceStyle={styles.pill}>
        <Text style={styles.pillLabel}>Let&apos;s start</Text>
      </Chunky>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sky: {
    alignItems: 'center',
    gap: 10,
  },
  wordmark: {
    color: Colors.white,
    fontFamily: Fonts.displayBold,
    textAlign: 'center',
    textShadowColor: 'rgba(27, 42, 18, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  tagline: {
    color: Colors.white,
    fontFamily: Fonts.sansHeavy,
    fontSize: 22,
    lineHeight: 28,
    textAlign: 'center',
    textShadowColor: 'rgba(27, 42, 18, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  hill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: Spacing.four + 4,
  },
  pill: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillLabel: {
    color: Colors.greenDeep,
    fontFamily: Fonts.displayBold,
    fontSize: 22,
  },
});
