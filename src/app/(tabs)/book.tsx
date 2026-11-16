import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from 'convex/react';
import { Image } from 'expo-image';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { KidSwitcher } from '@/components/kid-switcher';
import { LeggySays } from '@/components/leggy';
import { Card, Hero, Loading } from '@/components/ui';
import { BottomTabInset, BRIGHT_TONES, Colors, Fonts, MaxContentWidth, Radius, Spacing, Tones } from '@/constants/theme';
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
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + BottomTabInset + Spacing.five }]}
      ListHeaderComponent={
        <View style={styles.header}>
          <Hero color={Colors.pink}>
            <LeggySays pose="reading" size={112}>
              {kid === null
                ? 'Add your kid on Today first!'
                : legends === undefined || legends.length === 0
                  ? `Your first legend lands here, ${kid.name}!`
                  : `Look what we did, ${kid.name}!`}
            </LeggySays>
          </Hero>
          {kid !== null && (
            <View style={styles.padded}>
              <KidSwitcher kids={kids} selected={kid._id} onSelect={select} />
            </View>
          )}
        </View>
      }
      renderItem={({ item, index }) => <Page legend={item} index={index} />}
    />
  );
}

function Page({ legend, index }: { legend: Legend; index: number }) {
  const tone = Tones[BRIGHT_TONES[index % BRIGHT_TONES.length]];
  return (
    <Card style={[styles.card, { transform: [{ rotate: index % 2 === 0 ? '-1deg' : '1deg' }] }]}>
      <View style={[styles.frame, { backgroundColor: tone.face }]}>
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
      <View style={[styles.tape, { backgroundColor: tone.edge }]} />
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
    backgroundColor: Colors.paper,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: Spacing.four,
  },
  header: {
    gap: Spacing.three,
  },
  padded: {
    paddingHorizontal: Spacing.four,
  },
  card: {
    padding: 12,
    gap: 0,
    marginHorizontal: Spacing.four,
  },
  frame: {
    borderRadius: Radius.field,
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
    opacity: 0.85,
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
