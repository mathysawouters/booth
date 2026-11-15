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
import { CATEGORY_ART, SKILLS } from '@/lib/legends';
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
        <LeggySays pose="waving">
          {kid === null
            ? 'Add your kid on Today and your legends will land here.'
            : `Finish your first legend with ${kid.name} and it lands right here.`}
        </LeggySays>
      }
      renderItem={({ item, index }) => <Page legend={item} tilt={index % 2 === 0 ? '-1deg' : '1deg'} />}
    />
  );
}

function Page({ legend, tilt }: { legend: Legend; tilt: string }) {
  return (
    <Card style={[styles.card, { transform: [{ rotate: tilt }] }]}>
      <View style={styles.frame}>
        {legend.photoUrl !== null ? (
          <Image source={{ uri: legend.photoUrl }} style={styles.photo} contentFit="cover" transition={200} />
        ) : (
          <Image source={CATEGORY_ART[legend.category]} style={styles.photo} contentFit="contain" />
        )}
        {legend.levelUp !== undefined && (
          <View style={styles.badge}>
            <Ionicons name={SKILLS[legend.skill].icon} size={14} color={Colors.black} />
            <Text style={styles.badgeText}>
              {SKILLS[legend.skill].label} {legend.levelUp}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.tape} />
      <View style={styles.caption}>
        <Text style={styles.day}>{formatDay(legend.day)}</Text>
        <Text style={styles.title}>{legend.title}</Text>
        {legend.quote !== undefined && legend.quote.length > 0 && <Text style={styles.quote}>“{legend.quote}”</Text>}
      </View>
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
    padding: 12,
    gap: 0,
  },
  frame: {
    borderRadius: Radius.field,
    backgroundColor: Colors.soft,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  tape: {
    position: 'absolute',
    top: 2,
    alignSelf: 'center',
    width: 92,
    height: 24,
    borderRadius: 4,
    backgroundColor: Colors.green,
    opacity: 0.7,
    transform: [{ rotate: '-3deg' }],
  },
  badge: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.green,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    color: Colors.black,
    fontFamily: Fonts.sansHeavy,
    fontSize: 13,
  },
  caption: {
    gap: 6,
    paddingHorizontal: Spacing.two,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  day: {
    color: Colors.gray,
    fontFamily: Fonts.sansHeavy,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    color: Colors.black,
    fontFamily: Fonts.display,
    fontSize: 24,
    lineHeight: 30,
  },
  quote: {
    color: Colors.black,
    fontFamily: Fonts.serifItalic,
    fontSize: 18,
    lineHeight: 27,
  },
});
