import { useAuthActions } from '@convex-dev/auth/react';
import { useMutation, useQuery } from 'convex/react';
import { Image } from 'expo-image';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LeggySays } from '@/components/leggy';
import { Avatar, Body, Button, Card, Field, Tappable, Title } from '@/components/ui';
import { BottomTabInset, Colors, Fonts, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { formatDay } from '@/lib/day';
import { errorMessage } from '@/lib/errors';
import { CATEGORY_ART, SKILLS } from '@/lib/legends';
import type { Cheer, FeedLegend, LegendId } from '@/lib/types';
import { api } from '../../../convex/_generated/api';

const CHEERS = ['🎉', '❤️', '👏', '🌟', '😂'];

export default function FamilyScreen() {
  const insets = useSafeAreaInsets();
  const feed = useQuery(api.family.familyFeed) as FeedLegend[] | undefined;
  const family = useQuery(api.friends.listFriends);
  const me = useQuery(api.users.me);
  const addFriend = useMutation(api.friends.addFriend);
  const cheer = useMutation(api.family.cheer);
  const { signOut } = useAuthActions();
  const [username, setUsername] = useState('');
  const [inviting, setInviting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function invite() {
    const name = username.trim().replace(/^@/, '');
    setMessage(null);
    setInviting(true);
    try {
      await addFriend({ username: name });
      setUsername('');
      setMessage(`@${name} is in your family now.`);
    } catch (e) {
      setMessage(errorMessage(e));
    } finally {
      setInviting(false);
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
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + Spacing.three, paddingBottom: insets.bottom + BottomTabInset + Spacing.five },
      ]}
      ListHeaderComponent={
        <View style={styles.header}>
          <Title>Family</Title>
          <Card>
            <Text style={styles.cardTitle}>Invite family</Text>
            <Body muted>Grandma, uncles, the other parent: they see your legends and cheer.</Body>
            <Field
              placeholder="Their username"
              value={username}
              onChangeText={setUsername}
              onSubmitEditing={invite}
              returnKeyType="done"
              editable={!inviting}
            />
            <Button
              label="Invite"
              icon="person-add"
              variant="accent"
              onPress={invite}
              loading={inviting}
              disabled={username.trim().length === 0}
            />
            {message !== null && <Body style={styles.bold}>{message}</Body>}
            {family !== undefined && family.length > 0 && (
              <View style={styles.members}>
                {family.map((member) => (
                  <View key={member._id} style={styles.member}>
                    <Avatar name={member.username ?? '?'} size={56} />
                    <Text style={styles.memberName} numberOfLines={1}>
                      @{member.username ?? 'unknown'}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </Card>
        </View>
      }
      ListEmptyComponent={
        feed === undefined ? undefined : (
          <LeggySays pose="waving">Finished legends from your family show up here. Go do one!</LeggySays>
        )
      }
      renderItem={({ item }) => (
        <FeedCard item={item} myName={me?.username ?? null} onCheer={(emoji) => sendCheer(item._id, emoji)} />
      )}
      ListFooterComponent={
        <View style={styles.footer}>
          <Body muted>Signed in as @{me?.username ?? '…'}</Body>
          <Button label="Sign out" variant="soft" onPress={() => void signOut()} />
        </View>
      }
    />
  );
}

function FeedCard({
  item,
  myName,
  onCheer,
}: {
  item: FeedLegend;
  myName: string | null;
  onCheer: (emoji: string) => void;
}) {
  const counts = new Map<string, number>();
  for (const { emoji } of item.cheers) {
    counts.set(emoji, (counts.get(emoji) ?? 0) + 1);
  }
  const names = [...new Set(item.cheers.map((c: Cheer) => c.userName).filter((n): n is string => n !== null))];
  const mine = new Set(item.cheers.filter((c) => c.userName !== null && c.userName === myName).map((c) => c.emoji));

  return (
    <Card style={styles.card}>
      <View style={styles.cardHead}>
        <Avatar name={item.kidName} size={48} />
        <View style={styles.cardHeadText}>
          <Text style={styles.kid}>{item.kidName}</Text>
          <Text style={styles.meta}>
            {item.parentName !== null ? `with @${item.parentName} · ` : ''}
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
      {names.length > 0 && <Body muted style={styles.cheeredBy}>Cheered by {names.map((n) => `@${n}`).join(', ')}</Body>}
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
  cardTitle: {
    color: Colors.black,
    fontFamily: Fonts.display,
    fontSize: 22,
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
    backgroundColor: Colors.soft,
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
    backgroundColor: Colors.green,
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
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  cheerMine: {
    backgroundColor: Colors.green,
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
  footer: {
    gap: Spacing.three,
    paddingTop: Spacing.four,
  },
});
