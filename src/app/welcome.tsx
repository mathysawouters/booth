import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Sprinkles } from '@/components/confetti';
import { LeggySays } from '@/components/leggy';
import { Button, Screen } from '@/components/ui';
import { Colors, Fonts, Spacing } from '@/constants/theme';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  return (
    <Screen color={Colors.lemon} style={{ paddingBottom: insets.bottom + Spacing.four }}>
      <Sprinkles colors={[Colors.white, Colors.pink, Colors.mint]} />
      <View style={styles.hero}>
        <LeggySays side="top" size={250} pose="waving">
          Hi, I&apos;m Leggy! Ready to make today legendary?
        </LeggySays>
        <Text style={styles.wordmark}>Little Legends</Text>
      </View>
      <Button label="Let's go!" icon="arrow-forward" variant="accent" onPress={() => router.push('/onboarding')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  wordmark: {
    color: Colors.black,
    fontFamily: Fonts.displayBold,
    fontSize: 44,
    lineHeight: 50,
    textAlign: 'center',
  },
});
