import { useMutation } from 'convex/react';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Body, Button, Chip, Field, IconButton, Title } from '@/components/ui';
import { Colors, Fonts, MaxContentWidth, Spacing } from '@/constants/theme';
import { errorMessage } from '@/lib/errors';
import { useKids } from '@/lib/kids';
import type { KidId } from '@/lib/types';
import { api } from '../../convex/_generated/api';

const INTERESTS = [
  'Dinosaurs',
  'Animals',
  'Space',
  'Cars',
  'Princesses',
  'Lego',
  'Drawing',
  'Music',
  'Football',
  'Cooking',
  'Nature',
  'Robots',
];

const AGES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function AddKidScreen() {
  const insets = useSafeAreaInsets();
  const addKid = useMutation(api.kids.addKid);
  const { select } = useKids();
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [custom, setCustom] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(interest: string) {
    setInterests((list) => (list.includes(interest) ? list.filter((i) => i !== interest) : [...list, interest]));
  }

  function addCustom() {
    const value = custom.trim();
    if (value.length > 0 && !interests.includes(value)) {
      setInterests([...interests, value]);
    }
    setCustom('');
  }

  async function save() {
    if (age === null) return;
    setError(null);
    setSaving(true);
    try {
      const extra = custom.trim();
      const id = (await addKid({
        name: name.trim(),
        age,
        interests: extra.length > 0 && !interests.includes(extra) ? [...interests, extra] : interests,
        note: note.trim().length > 0 ? note.trim() : undefined,
      })) as KidId;
      select(id);
      router.back();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  const customInterests = interests.filter((i) => !INTERESTS.includes(i));

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + Spacing.three, paddingBottom: insets.bottom + Spacing.five },
        ]}>
        <View style={styles.top}>
          <Title>Add a kid</Title>
          <IconButton icon="close" label="Close" onPress={() => router.back()} />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Name</Text>
          <Field placeholder="Their name" value={name} onChangeText={setName} autoCapitalize="words" />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Age</Text>
          <View style={styles.wrap}>
            {AGES.map((a) => (
              <Chip key={a} label={String(a)} selected={age === a} onPress={() => setAge(a)} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Loves</Text>
          <View style={styles.wrap}>
            {[...INTERESTS, ...customInterests].map((interest) => (
              <Chip
                key={interest}
                label={interest}
                selected={interests.includes(interest)}
                onPress={() => toggle(interest)}
              />
            ))}
          </View>
          <Field
            placeholder="Something else? Type and press enter"
            value={custom}
            onChangeText={setCustom}
            onSubmitEditing={addCustom}
            returnKeyType="done"
            submitBehavior="submit"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Anything Leggy should know? (optional)</Text>
          <Field
            placeholder="Shy with new people, scared of the dark…"
            value={note}
            onChangeText={setNote}
            autoCapitalize="sentences"
            autoCorrect
            multiline
            style={styles.note}
          />
        </View>

        {error !== null && <Body style={styles.error}>{error}</Body>}
        <Button
          label="Save"
          variant="accent"
          onPress={save}
          loading={saving}
          disabled={name.trim().length === 0 || age === null}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  section: {
    gap: Spacing.three,
  },
  label: {
    color: Colors.black,
    fontFamily: Fonts.display,
    fontSize: 20,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  note: {
    minHeight: 100,
    paddingTop: Spacing.three,
    textAlignVertical: 'top',
  },
  error: {
    fontFamily: Fonts.sansBold,
  },
});
