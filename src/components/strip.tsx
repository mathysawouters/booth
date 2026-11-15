import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts, Spacing } from '@/constants/theme';
import { formatDay } from '@/lib/day';

export function Strip({ photos, day, width = 220 }: { photos: (string | null)[]; day: string; width?: number }) {
  return (
    <View style={[styles.strip, { width }]}>
      {photos.map((uri, index) => (
        <View key={index} style={styles.frame}>
          {uri !== null && <Image source={{ uri }} style={styles.photo} contentFit="cover" />}
        </View>
      ))}
      <Text style={styles.date}>{formatDay(day)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    backgroundColor: Colors.white,
    padding: Spacing.two + 2,
    gap: Spacing.two,
    alignSelf: 'center',
  },
  frame: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: Colors.black,
  },
  photo: {
    flex: 1,
  },
  date: {
    color: Colors.black,
    fontFamily: Fonts.mono,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
    paddingVertical: Spacing.two,
  },
});
