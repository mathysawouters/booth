import { useAuthActions } from '@convex-dev/auth/react';
import { useMutation, useQuery } from 'convex/react';
import { Image } from 'expo-image';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LeggySays } from '@/components/leggy';
import { Body, Button, Card, Chip, Field, Title } from '@/components/ui';
import { BottomTabInset, Colors, Fonts, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { formatDay } from '@/lib/day';
import { errorMessage } from '@/lib/errors';
import { SKILLS } from '@/lib/legends';
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
              onPress={invite}
              loading={inviting}
              disabled={username.trim().length === 0}
            />
            {message !== null && <Body style={styles.bold}>{message}</Body>}
            {family !== undefined && family.length > 0 && (
              <View style={styles.members}>
                {family.map((member) => (
                  <Chip key={member._id} label={`@${member.username ?? 'unknown'}`} />
                ))}
              </View>
            )}
          </Card>
        </View>
      }
      ListEmptyComponent={
        feed === undefined ? undefined : (
          <LeggySays>Finished legends from your family show up here. Go do one!</LeggySays>
        )
      }
      renderItem={({ item }) => (
        <FeedCard item={item} myName={me?.username ?? null} onCheer={(emoji) => sendCheer(item._id, emoji)} />
      )}
      ListFooterComponent={
        <View style={styles.footer}>
          <Body muted>Signed in as @{me?.username ?? '…'}</Body>
          <Button label="Sign out" variant="outline" onPress={() => void signOut()} />
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
        <Text style={styles.kid}>{item.kidName}</Text>
        <Text style={styles.meta}>
          {item.parentName !== null ? `with @${item.parentName} · ` : ''}
          {formatDay(item.day)}
        </Text>
      </View>
      {item.levelUp !== undefined && (
        <View style={styles.levelUp}>
          <Text style={styles.levelUpText}>
            {SKILLS[item.skill].label} level {item.levelUp}!
          </Text>
        </View>
      )}
      {item.photoUrl !== null && <Image source={{ uri: item.photoUrl }} style={styles.photo} contentFit="cover" />}
      <Text style={styles.title}>{item.title}</Text>
      {item.quote !== undefined && item.quote.length > 0 && <Text style={styles.quote}>“{item.quote}”</Text>}
      <View style={styles.cheers}>
        {CHEERS.map((emoji) => (
          <Pressable
            key={emoji}
            accessibilityRole="button"
            accessibilityLabel={`Cheer ${emoji}`}
            onPress={() => onCheer(emoji)}
            style={({ pressed }) => [styles.cheer, mine.has(emoji) && styles.cheerMine, pressed && styles.pressed]}>
            <Text style={styles.emoji}>{emoji}</Text>
            {(counts.get(emoji) ?? 0) > 0 && <Text style={styles.count}>{counts.get(emoji)}</Text>}
          </Pressable>
        ))}
      </View>
      {names.length > 0 && <Body muted>Cheered by {names.map((n) => `@${n}`).join(', ')}</Body>}
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
    gap: Spacing.four,
  },
  cardTitle: {
    color: Colors.black,
    fontFamily: Fonts.sans,
    fontSize: 24,
    fontWeight: '900',
  },
  bold: {
    fontWeight: '700',
  },
  members: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  card: {
    padding: Spacing.three,
  },
  cardHead: {
    gap: 2,
    paddingHorizontal: Spacing.one,
  },
  kid: {
    color: Colors.black,
    fontFamily: Fonts.sans,
    fontSize: 26,
    fontWeight: '900',
  },
  meta: {
    color: Colors.gray,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '700',
  },
  levelUp: {
    backgroundColor: Colors.green,
    borderRadius: Radius.tile,
    padding: Spacing.three,
  },
  levelUpText: {
    color: Colors.black,
    fontFamily: Fonts.sans,
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
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
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '900',
    paddingHorizontal: Spacing.one,
  },
  quote: {
    color: Colors.black,
    fontFamily: Fonts.serif,
    fontSize: 20,
    lineHeight: 28,
    fontStyle: 'italic',
    paddingHorizontal: Spacing.one,
  },
  cheers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.one,
  },
  cheer: {
    flex: 1,
    minHeight: 60,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: Colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  cheerMine: {
    borderColor: Colors.green,
    backgroundColor: Colors.greenSoft,
  },
  pressed: {
    transform: [{ scale: 0.92 }],
  },
  emoji: {
    fontSize: 30,
  },
  count: {
    color: Colors.black,
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '900',
  },
  footer: {
    gap: Spacing.three,
    paddingTop: Spacing.five,
  },
});
