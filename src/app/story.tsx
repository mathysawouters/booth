import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from 'convex/react';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Loading } from '@/components/ui';
import { Colors, Fonts, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import type { KidId, Legend } from '@/lib/types';
import { api } from '../../convex/_generated/api';

export default function StoryScreen() {
  const insets = useSafeAreaInsets();
  const { kid, day } = useLocalSearchParams<{ kid: KidId; day: string }>();
  const legend = useQuery(api.legends.legendToday, { kid, day }) as Legend | null | undefined;
  const [page, setPage] = useState(0);

  if (legend === undefined) {
    return <Loading />;
  }
  if (legend === null) {
    return (
      <View style={[styles.screen, styles.empty]}>
        <Text style={styles.text}>No story today yet.</Text>
        <Button label="Close" variant="outline" onPress={() => router.back()} />
      </View>
    );
  }

  const pages = legend.story ?? [];
  const hasQuestion = (legend.question ?? '').length > 0;
  const total = pages.length + (hasQuestion ? 1 : 0);
  const onQuestion = page >= pages.length;
  const last = page >= total - 1;

  return (
    <View style={[styles.screen, { paddingTop: insets.top + Spacing.two, paddingBottom: insets.bottom + Spacing.three }]}>
      <View style={styles.top}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => router.back()} hitSlop={16}>
          <Ionicons name="close" size={32} color={Colors.black} />
        </Pressable>
        <Text style={styles.counter}>
          {Math.min(page + 1, total)} / {total}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.page}>
        {page === 0 && <Text style={styles.title}>{legend.title}</Text>}
        {onQuestion ? (
          <View style={styles.question}>
            <Text style={styles.questionLabel}>Ask together</Text>
            <Text style={styles.text}>{legend.question}</Text>
          </View>
        ) : (
          <Text style={styles.text}>{pages[page]}</Text>
        )}
      </ScrollView>

      <View style={styles.actions}>
        {last ? (
          <Button
            label="We did it!"
            icon="checkmark-circle"
            variant="accent"
            onPress={() => router.replace({ pathname: '/done', params: { kid, day } })}
          />
        ) : (
          <Button label="Next page" icon="arrow-forward" onPress={() => setPage(page + 1)} />
        )}
        {page > 0 && <Button label="Back" variant="outline" onPress={() => setPage(page - 1)} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
  },
  empty: {
    justifyContent: 'center',
    gap: Spacing.four,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counter: {
    color: Colors.gray,
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  page: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: Spacing.four,
    paddingVertical: Spacing.five,
  },
  title: {
    color: Colors.green,
    fontFamily: Fonts.serif,
    fontSize: 26,
    fontWeight: '700',
  },
  text: {
    color: Colors.black,
    fontFamily: Fonts.serif,
    fontSize: 32,
    lineHeight: 46,
  },
  question: {
    gap: Spacing.three,
    borderWidth: 2,
    borderColor: Colors.green,
    borderRadius: Radius.card,
    padding: Spacing.four,
  },
  questionLabel: {
    color: Colors.green,
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  actions: {
    gap: Spacing.three,
  },
});
