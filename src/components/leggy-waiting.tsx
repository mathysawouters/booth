import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Leggy } from '@/components/leggy';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { WAITING_LINES } from '@/lib/legends';

export function LeggyWaiting({ lines = WAITING_LINES }: { lines?: string[] }) {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * lines.length));

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % lines.length), 2400);
    return () => clearInterval(timer);
  }, [lines.length]);

  return (
    <View style={styles.center}>
      <Leggy size={170} mood="thinking" />
      <Text style={styles.line}>{lines[index]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.four,
    padding: Spacing.four,
    backgroundColor: Colors.white,
  },
  line: {
    color: Colors.black,
    fontFamily: Fonts.sans,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '800',
    textAlign: 'center',
  },
});
