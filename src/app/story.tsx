import { useQuery } from 'convex/react';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Leggy, LeggySays } from '@/components/leggy';
import { Button, IconButton, Loading, ProgressBar } from '@/components/ui';
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
        <Button label="Close" variant="soft" onPress={() => router.back()} />
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
        <IconButton icon="close" label="Close" onPress={() => router.back()} />
        <View style={styles.track}>
          <ProgressBar progress={Math.min(page + 1, total) / Math.max(total, 1)} track={Colors.soft} />
        </View>
        <Text style={styles.counter}>
          {Math.min(page + 1, total)} / {total}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        {page === 0 && (
          <View style={styles.cover}>
            <LeggySays side="top" size={132} pose="reading">
              Story time! Get comfy.
            </LeggySays>
            <Text style={styles.title}>{legend.title}</Text>
          </View>
        )}
        {onQuestion ? (
          <View style={styles.question}>
            <View style={styles.questionHead}>
              <Leggy size={72} pose={legend.category === 'bedtime' ? 'sleeping' : 'reading'} />
              <Text style={styles.questionLabel}>Ask together</Text>
            </View>
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
          <Button label="Next page" icon="arrow-forward" variant="lemon" onPress={() => setPage(page + 1)} />
        )}
        {page > 0 && <Button label="Back" variant="soft" onPress={() => setPage(page - 1)} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.paper,
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
    alignItems: 'center',
    gap: Spacing.three,
  },
  track: {
    flex: 1,
  },
  counter: {
    color: Colors.gray,
    fontFamily: Fonts.sansBold,
    fontSize: 15,
    fontVariant: ['tabular-nums'],
  },
  page: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: Spacing.four,
    paddingVertical: Spacing.four,
  },
  cover: {
    alignItems: 'center',
    gap: Spacing.three,
  },
  title: {
    color: Colors.black,
    fontFamily: Fonts.displayBold,
    fontSize: 30,
    lineHeight: 36,
    textAlign: 'center',
  },
  text: {
    color: Colors.black,
    fontFamily: Fonts.serif,
    fontSize: 25,
    lineHeight: 40,
  },
  question: {
    gap: Spacing.three,
    backgroundColor: Colors.lemon,
    borderRadius: Radius.card,
    borderBottomWidth: 6,
    borderColor: Colors.lemonDark,
    padding: Spacing.four,
  },
  questionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  questionLabel: {
    color: Colors.black,
    fontFamily: Fonts.sansHeavy,
    fontSize: 15,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  actions: {
    gap: Spacing.three,
    paddingTop: Spacing.two,
  },
});
