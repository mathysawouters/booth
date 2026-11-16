import { router } from 'expo-router';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Leggy } from '@/components/leggy';
import { Chunky, Screen } from '@/components/ui';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  return (
    <Screen style={{ paddingBottom: insets.bottom + Spacing.four }}>
      <View style={styles.sky}>
        <Text style={styles.wordmark}>Little Legends</Text>
        <Text style={styles.tagline}>One fun thing with your kid, every day</Text>
      </View>
      <View style={styles.hill}>
        <Leggy size={Math.min(320, height * 0.38)} pose="waving" />
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
    gap: Spacing.two,
    paddingTop: Spacing.five,
  },
  wordmark: {
    color: Colors.white,
    fontFamily: Fonts.displayBold,
    fontSize: 54,
    lineHeight: 58,
    textAlign: 'center',
    textShadowColor: 'rgba(27, 42, 18, 0.28)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  tagline: {
    color: Colors.white,
    fontFamily: Fonts.display,
    fontSize: 21,
    lineHeight: 27,
    textAlign: 'center',
    maxWidth: 260,
    textShadowColor: 'rgba(27, 42, 18, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  hill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: Spacing.six,
  },
  pill: {
    minHeight: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillLabel: {
    color: Colors.greenDeep,
    fontFamily: Fonts.displayBold,
    fontSize: 22,
  },
});
