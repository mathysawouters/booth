import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from 'convex/react';
import { Image } from 'expo-image';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { KidSwitcher } from '@/components/kid-switcher';
import { LeggySays } from '@/components/leggy';
import { Card, Loading, Title } from '@/components/ui';
import { BottomTabInset, Colors, Fonts, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { formatDay } from '@/lib/day';
import { SKILLS } from '@/lib/legends';
import { useKids } from '@/lib/kids';
import type { Legend } from '@/lib/types';
import { api } from '../../../convex/_generated/api';

export default function BookScreen() {
  const insets = useSafeAreaInsets();
  const { kids, kid, select } = useKids();
  const legends = useQuery(api.legends.memoryBook, kid === null ? 'skip' : { kid: kid._id }) as
    | Legend[]
    | undefined;

  if (kids === undefined || (kid !== null && legends === undefined)) {
    return <Loading />;
  }

  return (
    <FlatList
      style={styles.screen}
      data={legends ?? []}
      keyExtractor={(legend) => legend._id}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + Spacing.three, paddingBottom: insets.bottom + BottomTabInset + Spacing.five },
      ]}
      ListHeaderComponent={
        <View style={styles.header}>
          <Title>Memory book</Title>
          {kid !== null && <KidSwitcher kids={kids} selected={kid._id} onSelect={select} />}
        </View>
      }
      ListEmptyComponent={
        <LeggySays>
          {kid === null
            ? 'Add your kid on Today and your legends will land here.'
            : `Finish your first legend with ${kid.name} and it lands right here.`}
        </LeggySays>
      }
      renderItem={({ item }) => <Page legend={item} />}
    />
  );
}

function Page({ legend }: { legend: Legend }) {
  return (
    <Card style={styles.card}>
      <View style={styles.meta}>
        <Text style={styles.day}>{formatDay(legend.day)}</Text>
        {legend.levelUp !== undefined && (
          <View style={styles.badge}>
            <Ionicons name={SKILLS[legend.skill].icon} size={14} color={Colors.black} />
            <Text style={styles.badgeText}>
              {SKILLS[legend.skill].label} {legend.levelUp}
            </Text>
          </View>
        )}
      </View>
      {legend.photoUrl !== null && (
        <Image source={{ uri: legend.photoUrl }} style={styles.photo} contentFit="cover" />
      )}
      <Text style={styles.title}>{legend.title}</Text>
      {legend.quote !== undefined && legend.quote.length > 0 && <Text style={styles.quote}>“{legend.quote}”</Text>}
    </Card>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  header: {
    gap: Spacing.three,
  },
  card: {
    padding: Spacing.three,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.one,
  },
  day: {
    color: Colors.gray,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.green,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: Colors.black,
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '900',
  },
  photo: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: Radius.tile,
    backgroundColor: Colors.soft,
  },
  title: {
    color: Colors.black,
    fontFamily: Fonts.sans,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
    paddingHorizontal: Spacing.one,
  },
  quote: {
    color: Colors.black,
    fontFamily: Fonts.serif,
    fontSize: 21,
    lineHeight: 29,
    fontStyle: 'italic',
    paddingHorizontal: Spacing.one,
  },
});
