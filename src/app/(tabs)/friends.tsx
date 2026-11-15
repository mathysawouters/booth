import { useAuthActions } from '@convex-dev/auth/react';
import { useMutation, useQuery } from 'convex/react';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Body, Button, Field, Title } from '@/components/ui';
import { BottomTabInset, Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { errorMessage } from '@/lib/errors';
import { api } from '../../../convex/_generated/api';

export default function FriendsScreen() {
  const insets = useSafeAreaInsets();
  const friends = useQuery(api.friends.listFriends);
  const me = useQuery(api.users.me);
  const addFriend = useMutation(api.friends.addFriend);
  const { signOut } = useAuthActions();
  const [username, setUsername] = useState('');
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function add() {
    const name = username.trim();
    setMessage(null);
    setAdding(true);
    try {
      await addFriend({ username: name });
      setUsername('');
      setMessage(`Added @${name}.`);
    } catch (e) {
      setMessage(errorMessage(e));
    } finally {
      setAdding(false);
    }
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={friends ?? []}
        keyExtractor={(friend) => friend._id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + Spacing.three, paddingBottom: insets.bottom + BottomTabInset + Spacing.five },
        ]}
        ListHeaderComponent={
          <View style={styles.header}>
            <Title>Friends</Title>
            <View style={styles.form}>
              <Field
                placeholder="Add by username"
                value={username}
                onChangeText={setUsername}
                onSubmitEditing={add}
                returnKeyType="done"
                editable={!adding}
              />
              <Button label="Add friend" onPress={add} loading={adding} disabled={username.trim().length === 0} />
              {message !== null && <Body style={styles.bold}>{message}</Body>}
            </View>
            <Body muted>{friends === undefined ? 'Loading…' : `${friends.length} ${friends.length === 1 ? 'friend' : 'friends'}`}</Body>
          </View>
        }
        renderItem={({ item }) => <Text style={styles.friend}>@{item.username ?? 'unknown'}</Text>}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={
          <View style={styles.footer}>
            <Body muted>Signed in as @{me?.username ?? '…'}</Body>
            <Button label="Sign out" variant="outline" onPress={() => void signOut()} />
          </View>
        }
      />
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
  },
  header: {
    gap: Spacing.four,
    paddingBottom: Spacing.three,
  },
  form: {
    gap: Spacing.three,
  },
  bold: {
    fontWeight: '700',
  },
  friend: {
    color: Colors.white,
    fontSize: 26,
    fontWeight: '800',
    paddingVertical: Spacing.three,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.line,
  },
  footer: {
    gap: Spacing.three,
    paddingTop: Spacing.six,
  },
});
