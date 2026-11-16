import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from 'convex/react';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { Card } from '@/components/ui';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { localDay } from '@/lib/day';
import type { KidId, Legend } from '@/lib/types';
import { api } from '../../convex/_generated/api';

const LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function StreakCard({ kid, day }: { kid: KidId; day: string }) {
  const streak = useQuery(api.kids.streak, { kid, day }) as number | undefined;
  const done = useQuery(api.legends.memoryBook, { kid }) as Legend[] | undefined;
  const flicker = useSharedValue(0);

  useEffect(() => {
    flicker.set(withRepeat(withTiming(1, { duration: 700 }), -1, true));
  }, [flicker]);

  const flame = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + flicker.get() * 0.08 }, { rotate: `${(flicker.get() - 0.5) * 6}deg` }],
  }));

  const doneDays = new Set(done?.map((legend) => legend.day));
  const week = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return { key: localDay(date), letter: LETTERS[date.getDay()] };
  });

  return (
    <Card style={styles.card}>
      <View style={styles.count}>
        <Animated.View style={[styles.flame, flame]}>
          <Ionicons name="flame" size={64} color={Colors.pink} />
          <Ionicons name="flame" size={30} color={Colors.lemon} style={styles.flameCore} />
        </Animated.View>
        <Text style={styles.number}>{streak ?? ' '}</Text>
        <Text style={styles.label}>day streak</Text>
      </View>
      <View style={styles.week}>
        {week.map(({ key, letter }) => {
          const filled = doneDays.has(key);
          return (
            <View key={key} style={styles.day}>
              <Text style={[styles.letter, key === day && styles.today]}>{letter}</Text>
              <View style={[styles.dot, filled && styles.dotDone, key === day && !filled && styles.dotToday]}>
                {filled && <Ionicons name="checkmark" size={22} color={Colors.black} />}
              </View>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
    padding: Spacing.three,
  },
  count: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  flame: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  flameCore: {
    position: 'absolute',
    bottom: 6,
  },
  number: {
    color: Colors.black,
    fontFamily: Fonts.displayBold,
    fontSize: 52,
    lineHeight: 56,
    fontVariant: ['tabular-nums'],
  },
  label: {
    color: Colors.black,
    fontFamily: Fonts.display,
    fontSize: 22,
  },
  week: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  day: {
    alignItems: 'center',
    gap: 4,
  },
  letter: {
    color: Colors.gray,
    fontFamily: Fonts.sansHeavy,
    fontSize: 13,
  },
  today: {
    color: Colors.greenDeep,
  },
  dot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.soft,
  },
  dotDone: {
    backgroundColor: Colors.green,
    borderBottomWidth: 4,
    borderColor: Colors.greenDark,
  },
  dotToday: {
    backgroundColor: Colors.white,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: Colors.greenDark,
  },
});
