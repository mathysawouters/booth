import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Leggy } from '@/components/leggy';
import { Body, Button, Screen } from '@/components/ui';
import { Colors, Fonts, Spacing } from '@/constants/theme';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  return (
    <Screen style={{ paddingBottom: insets.bottom + Spacing.four }}>
      <View style={styles.hero}>
        <Leggy size={240} pose="waving" />
        <Text style={styles.wordmark}>Little Legends</Text>
        <Body muted style={styles.tagline}>
          One fun thing with your kid, every day
        </Body>
      </View>
      <Button label="Let's start" icon="arrow-forward" variant="accent" onPress={() => router.push('/onboarding')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  wordmark: {
    color: Colors.black,
    fontFamily: Fonts.displayBold,
    fontSize: 42,
    lineHeight: 48,
    textAlign: 'center',
  },
  tagline: {
    textAlign: 'center',
  },
});
