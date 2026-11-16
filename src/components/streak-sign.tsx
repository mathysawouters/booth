import { useQuery } from 'convex/react';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts } from '@/constants/theme';
import type { KidId } from '@/lib/types';
import { api } from '../../convex/_generated/api';

export function StreakSign({ kid, day }: { kid: KidId; day: string }) {
  const streak = useQuery(api.kids.streak, { kid, day }) as number | undefined;
  return (
    <View style={styles.sign}>
      <Image source={require('@/assets/illustrations/wood-sign.png')} style={StyleSheet.absoluteFill} contentFit="contain" />
      <View style={styles.board}>
        <Text style={styles.text}>
          {streak === undefined
            ? ' '
            : streak === 0
              ? 'Start a\nstreak!'
              : `${streak} ${streak === 1 ? 'day' : 'days'}\nin a row`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sign: {
    width: 128,
    aspectRatio: 420 / 432,
    transform: [{ rotate: '3deg' }],
  },
  board: {
    position: 'absolute',
    top: '14%',
    height: '38%',
    left: '6%',
    right: '6%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Colors.cream,
    fontFamily: Fonts.displayBold,
    fontSize: 17,
    lineHeight: 20,
    textAlign: 'center',
  },
});
