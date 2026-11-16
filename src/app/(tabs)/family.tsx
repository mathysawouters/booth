import { useMutation, useQuery } from 'convex/react';
import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { FlatList, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LeggySays } from '@/components/leggy';
import { Avatar, Body, Button, Card, Field, Hero, Tappable } from '@/components/ui';
import { BottomTabInset, Colors, Fonts, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { formatDay } from '@/lib/day';
import { errorMessage } from '@/lib/errors';
import { useWhenKeyboardShown } from '@/lib/keyboard';
import { CATEGORY_ART, SKILLS } from '@/lib/legends';
import type { Cheer, FeedLegend, LegendId } from '@/lib/types';
import { api } from '../../../convex/_generated/api';

const CHEERS = ['🎉', '❤️', '👏', '🌟', '😂'];

export default function FamilyScreen() {
  const insets = useSafeAreaInsets();
  const feed = useQuery(api.family.familyFeed) as FeedLegend[] | undefined;
  const family = useQuery(api.friends.listFriends);
  const me = useQuery(api.users.me);
  const ensureFamilyCode = useMutation(api.users.ensureFamilyCode);
  const joinFamily = useMutation(api.friends.joinFamily);
  const cheer = useMutation(api.family.cheer);
  const [code, setCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const list = useRef<FlatList<FeedLegend>>(null);
  const joinY = useRef(0);
  const whenKeyboardShown = useWhenKeyboardShown();
  const familyCode = me?.familyCode ?? null;
  const needsCode = me !== undefined && me !== null && familyCode === null;

  useEffect(() => {
    if (needsCode) {
      ensureFamilyCode().catch((e) => setMessage(errorMessage(e)));
    }
  }, [needsCode, ensureFamilyCode]);

  function share() {
    if (familyCode === null) return;
    void Share.share({
      message: `Come follow our little legends! Get the Little Legends app, open the Family tab, and join our family with the code ${familyCode}. You'll see every adventure the moment it happens and can send cheers.`,
    });
  }

  async function join() {
    setMessage(null);
    setJoining(true);
    try {
      const name = await joinFamily({ code });
      setCode('');
      setMessage(name !== null ? `You and ${name} are family now.` : "You're family now.");
    } catch (e) {
      setMessage(errorMessage(e));
    } finally {
      setJoining(false);
    }
  }

  async function sendCheer(legend: LegendId, emoji: string) {
    try {
      await cheer({ legend, emoji });
    } catch (e) {
      setMessage(errorMessage(e));
    }
  }

  return (
    <FlatList
      style={styles.screen}
      data={feed ?? []}
      keyExtractor={(item) => item._id}
      ref={list}
      automaticallyAdjustKeyboardInsets
      keyboardDismissMode="interactive"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + BottomTabInset + Spacing.five }]}
      ListHeaderComponent={
        <View style={styles.header}>
          <Hero color={Colors.mint} style={styles.hero}>
            <LeggySays pose="proud" size={112}>
              {feed !== undefined && feed.length === 0 ? 'Finished legends show up here!' : 'Bring the whole gang!'}
            </LeggySays>
          </Hero>
          <Card>
            <Text style={styles.cardTitle}>Your family code</Text>
            <Text style={styles.code} selectable accessibilityLabel={familyCode ?? 'Loading family code'}>
              {familyCode ?? '…'}
            </Text>
            <Button label="Share with family" icon="share-outline" variant="accent" onPress={share} disabled={familyCode === null} />
          </Card>
          <View
            onLayout={(event) => {
              joinY.current = event.nativeEvent.layout.y;
            }}>
            <Card>
              <Text style={styles.cardTitle}>Got a code?</Text>
              <Field
                placeholder="STAR-4821"
                value={code}
                onChangeText={setCode}
                onFocus={() =>
                  whenKeyboardShown(() => list.current?.scrollToOffset({ offset: joinY.current, animated: true }))
                }
                onSubmitEditing={join}
                autoCapitalize="characters"
                returnKeyType="done"
                editable={!joining}
              />
              <Button
                label="Join"
                icon="people"
                variant="soft"
                onPress={join}
                loading={joining}
                disabled={code.trim().length === 0}
              />
              {message !== null && <Body style={styles.bold}>{message}</Body>}
            </Card>
          </View>
          {family !== undefined && family.length > 0 && (
            <Card>
              <Text style={styles.cardTitle}>In your family</Text>
              <View style={styles.members}>
                {family.map((member) => (
                  <View key={member._id} style={styles.member}>
                    <Avatar name={member.name ?? '?'} size={56} />
                    <Text style={styles.memberName} numberOfLines={2}>
                      {member.name ?? 'Family'}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>
          )}
        </View>
      }
      renderItem={({ item }) => (
        <FeedCard item={item} onCheer={(emoji) => sendCheer(item._id, emoji)} />
      )}
    />
  );
}

function FeedCard({ item, onCheer }: { item: FeedLegend; onCheer: (emoji: string) => void }) {
  const counts = new Map<string, number>();
  for (const { emoji } of item.cheers) {
    counts.set(emoji, (counts.get(emoji) ?? 0) + 1);
  }
  const names = [...new Set(item.cheers.map((c: Cheer) => c.userName).filter((n): n is string => n !== null))];
  const mine = new Set(item.cheers.filter((c) => c.mine).map((c) => c.emoji));

  return (
    <Card style={styles.card}>
      <View style={styles.cardHead}>
        <Avatar name={item.kidName} size={48} />
        <View style={styles.cardHeadText}>
          <Text style={styles.kid}>{item.kidName}</Text>
          <Text style={styles.meta}>
            {item.parentName !== null ? `with ${item.parentName} · ` : ''}
            {formatDay(item.day)}
          </Text>
        </View>
      </View>
      <View style={styles.frame}>
        {item.photoUrl !== null ? (
          <Image source={{ uri: item.photoUrl }} style={styles.photo} contentFit="cover" transition={200} />
        ) : (
          <Image source={CATEGORY_ART[item.category]} style={styles.photo} contentFit="contain" />
        )}
        {item.levelUp !== undefined && (
          <View style={styles.levelUp}>
            <Text style={styles.levelUpText}>
              {SKILLS[item.skill].label} level {item.levelUp}!
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.title}>{item.title}</Text>
      {item.quote !== undefined && item.quote.length > 0 && <Text style={styles.quote}>“{item.quote}”</Text>}
      <View style={styles.cheers}>
        {CHEERS.map((emoji) => (
          <Tappable
            key={emoji}
            accessibilityLabel={`Cheer ${emoji}`}
            onPress={() => onCheer(emoji)}
            scaleTo={0.85}
            style={[styles.cheer, mine.has(emoji) && styles.cheerMine]}>
            <Text style={styles.emoji}>{emoji}</Text>
            {(counts.get(emoji) ?? 0) > 0 && <Text style={styles.count}>{counts.get(emoji)}</Text>}
          </Tappable>
        ))}
      </View>
      {names.length > 0 && <Body muted style={styles.cheeredBy}>Cheered by {names.join(', ')}</Body>}
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
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  header: {
    gap: Spacing.three,
  },
  hero: {
    marginHorizontal: -Spacing.four,
  },
  cardTitle: {
    color: Colors.black,
    fontFamily: Fonts.display,
    fontSize: 22,
  },
  code: {
    color: Colors.black,
    fontFamily: Fonts.displayBold,
    fontSize: 44,
    lineHeight: 52,
    letterSpacing: 2,
    textAlign: 'center',
    paddingVertical: Spacing.two,
    backgroundColor: Colors.lemon,
    borderRadius: Radius.field,
    overflow: 'hidden',
  },
  bold: {
    fontFamily: Fonts.sansBold,
  },
  members: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  member: {
    width: 72,
    alignItems: 'center',
    gap: 6,
  },
  memberName: {
    color: Colors.gray,
    fontFamily: Fonts.sansBold,
    fontSize: 13,
    textAlign: 'center',
  },
  card: {
    padding: Spacing.three,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardHeadText: {
    flex: 1,
  },
  kid: {
    color: Colors.black,
    fontFamily: Fonts.display,
    fontSize: 22,
    lineHeight: 26,
  },
  meta: {
    color: Colors.gray,
    fontFamily: Fonts.sansSemi,
    fontSize: 14,
  },
  frame: {
    borderRadius: Radius.field,
    backgroundColor: Colors.lemon,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  levelUp: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    backgroundColor: Colors.pink,
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  levelUpText: {
    color: Colors.black,
    fontFamily: Fonts.display,
    fontSize: 16,
  },
  title: {
    color: Colors.black,
    fontFamily: Fonts.display,
    fontSize: 22,
    lineHeight: 28,
    paddingHorizontal: Spacing.one,
  },
  quote: {
    color: Colors.black,
    fontFamily: Fonts.serifItalic,
    fontSize: 18,
    lineHeight: 27,
    paddingHorizontal: Spacing.one,
  },
  cheers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  cheer: {
    flex: 1,
    minHeight: 64,
    borderRadius: 20,
    backgroundColor: Colors.soft,
    borderBottomWidth: 4,
    borderColor: Colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  cheerMine: {
    backgroundColor: Colors.green,
    borderColor: Colors.greenDark,
  },
  emoji: {
    fontSize: 30,
  },
  count: {
    color: Colors.black,
    fontFamily: Fonts.sansHeavy,
    fontSize: 14,
  },
  cheeredBy: {
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: Spacing.one,
  },
});
