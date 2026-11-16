import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Sprinkles } from '@/components/confetti';
import { LeggySays } from '@/components/leggy';
import { Colors, Spacing } from '@/constants/theme';

export function LeggyWaiting({ lines }: { lines: string[] }) {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * lines.length));

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % lines.length), 2400);
    return () => clearInterval(timer);
  }, [lines.length]);

  return (
    <View style={styles.center}>
      <Sprinkles colors={[Colors.white, Colors.pink, Colors.mint]} />
      <LeggySays side="top" size={230} pose="thinking" bouncy>
        {lines[index]}
      </LeggySays>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.five,
    backgroundColor: Colors.lemon,
  },
});
