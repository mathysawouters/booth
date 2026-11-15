import { useMutation, useQuery } from 'convex/react';
import { router } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Strip } from '@/components/strip';
import { Body, Button, Loading, Title } from '@/components/ui';
import { BottomTabInset, Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { formatDay, localDay } from '@/lib/day';
import { errorMessage } from '@/lib/errors';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

const EMOJIS = ['❤️', '😂', '😮', '🔥', '👏', '😭'];

type Reaction = { user: Id<'users'>; emoji: string };

function summarize(reactions: Reaction[]) {
  const counts = new Map<string, number>();
  for (const { emoji } of reactions) {
    counts.set(emoji, (counts.get(emoji) ?? 0) + 1);
  }
  return [...counts.entries()];
}

export default function TodayScreen() {
  const insets = useSafeAreaInsets();
  const day = localDay(new Date());
  const today = useQuery(api.strips.friendsStripsToday, { day });
  const me = useQuery(api.users.me);
  const react = useMutation(api.reactions.react);
  const [selected, setSelected] = useState<Id<'strips'> | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (today === undefined) {
    return <Loading />;
  }

  const selectedStrip = today.strips.find((strip) => strip._id === selected);
  const myReaction = selectedStrip?.reactions.find((r) => r.user === me?._id)?.emoji;

  async function choose(emoji: string) {
    if (selected === null) return;
    setSelected(null);
    try {
      await react({ strip: selected, emoji });
    } catch (e) {
      setError(errorMessage(e));
    }
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + Spacing.three, paddingBottom: insets.bottom + BottomTabInset + Spacing.five },
        ]}>
        <View style={styles.header}>
          <Title>Today</Title>
          <Body muted>{formatDay(day)}</Body>
        </View>

        {error !== null && <Body style={styles.bold}>{error}</Body>}

        {today.locked ? (
          <View style={styles.lockedCard}>
            <Text style={styles.lockedTitle}>Post yours first</Text>
            <Body muted>Your friends&apos; strips unlock once you post today&apos;s.</Body>
            <Button label="Open the booth" onPress={() => router.push('/booth')} />
          </View>
        ) : today.strips.length === 0 ? (
          <View style={styles.empty}>
            <Body style={styles.bold}>You posted today.</Body>
            <Body muted>No friends have posted yet. Check back later, or add more friends.</Body>
          </View>
        ) : (
          today.strips.map((strip) => (
            <View key={strip._id} style={styles.item}>
              <Text style={styles.author}>@{strip.authorUsername ?? 'unknown'}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`React to ${strip.authorUsername ?? 'this'} strip`}
                onPress={() => {
                  setError(null);
                  setSelected(strip._id);
                }}
                style={({ pressed }) => pressed && styles.pressed}>
                <Strip photos={strip.photoUrls} day={strip.day} width={260} />
              </Pressable>
              <View style={styles.reactions}>
                {summarize(strip.reactions).map(([emoji, count]) => (
                  <View key={emoji} style={styles.chip}>
                    <Text style={styles.chipText}>
                      {emoji} {count}
                    </Text>
                  </View>
                ))}
                {strip.reactions.length === 0 && <Body muted>Tap the strip to react</Body>}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal transparent animationType="fade" visible={selected !== null} onRequestClose={() => setSelected(null)}>
        <Pressable style={styles.backdrop} onPress={() => setSelected(null)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>React</Text>
            <View style={styles.emojiRow}>
              {EMOJIS.map((emoji) => (
                <Pressable
                  key={emoji}
                  accessibilityRole="button"
                  accessibilityLabel={`React with ${emoji}`}
                  onPress={() => choose(emoji)}
                  style={[styles.emojiButton, myReaction === emoji && styles.emojiSelected]}>
                  <Text style={styles.emoji}>{emoji}</Text>
                </Pressable>
              ))}
            </View>
            {myReaction !== undefined && <Body muted>Tap your reaction again to remove it.</Body>}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.five,
  },
  header: {
    gap: Spacing.one,
  },
  bold: {
    fontWeight: '700',
  },
  lockedCard: {
    borderWidth: 2,
    borderColor: Colors.white,
    borderRadius: 24,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  lockedTitle: {
    color: Colors.white,
    fontSize: 34,
    fontWeight: '900',
  },
  empty: {
    gap: Spacing.two,
  },
  item: {
    gap: Spacing.three,
    alignItems: 'center',
  },
  author: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: '800',
    alignSelf: 'flex-start',
  },
  pressed: {
    opacity: 0.8,
  },
  reactions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    justifyContent: 'center',
  },
  chip: {
    borderWidth: 1,
    borderColor: Colors.white,
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  chipText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.black,
    borderTopWidth: 2,
    borderColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.three,
  },
  sheetTitle: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: '900',
  },
  emojiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  emojiButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.black,
  },
  emojiSelected: {
    borderColor: Colors.white,
  },
  emoji: {
    fontSize: 30,
  },
});
