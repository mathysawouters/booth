import { useMutation } from 'convex/react';
import { Image } from 'expo-image';
import { type ComponentProps, useRef, useState } from 'react';
import { Keyboard, ScrollView, type ScrollViewInstance, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LeggySays, type Pose } from '@/components/leggy';
import { Body, Button, Chunky, Field, IconButton, ProgressBar } from '@/components/ui';
import { Colors, Fonts, MaxContentWidth, Spacing } from '@/constants/theme';
import { errorMessage } from '@/lib/errors';
import { useScrollToEndOnKeyboard } from '@/lib/keyboard';
import { useKids } from '@/lib/kids';
import type { KidId } from '@/lib/types';
import { api } from '../../convex/_generated/api';

const INTERESTS: Record<string, string> = {
  Dinosaurs: '🦖',
  Animals: '🐶',
  Space: '🚀',
  Cars: '🚗',
  Princesses: '👑',
  Lego: '🧱',
  Drawing: '🎨',
  Music: '🎵',
  Football: '⚽',
  Cooking: '🍳',
  Nature: '🌳',
  Robots: '🤖',
};

const AGES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const STEP_POSES: Pose[] = ['waving', 'thinking', 'proud', 'reading'];
const LAST_STEP = STEP_POSES.length - 1;

export function KidForm({
  title,
  closeIcon,
  closeLabel,
  onClose,
  onSaved,
  askParentName,
}: {
  title: string;
  closeIcon: ComponentProps<typeof IconButton>['icon'];
  closeLabel: string;
  onClose: () => void;
  onSaved?: () => void;
  askParentName?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const addKid = useMutation(api.kids.addKid);
  const { select } = useKids();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [custom, setCustom] = useState('');
  const [note, setNote] = useState('');
  const [parentName, setParentName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scroll = useRef<ScrollViewInstance>(null);
  const scrollToEndOnKeyboard = useScrollToEndOnKeyboard(scroll);

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
        parentName: askParentName ? parentName.trim() || defaultParentName : undefined,
      })) as KidId;
      select(id);
      onSaved?.();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  function next() {
    Keyboard.dismiss();
    setStep(step + 1);
  }

  const kidName = name.trim() || 'your kid';
  const defaultParentName = `${name.trim() || 'Your kid'}'s parent`;
  const customInterests = interests.filter((i) => !(i in INTERESTS));
  const canContinue = step === 0 ? name.trim().length > 0 : step === 1 ? age !== null : true;
  const question = [
    title,
    `How old is ${kidName}?`,
    `What does ${kidName} love?`,
    `Anything I should know about ${kidName}?`,
  ][step];

  return (
    <Animated.View style={styles.screen}>
      <Image
        source={require('@/assets/illustrations/meadow-welcome.jpg')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      <ScrollView
        ref={scroll}
        automaticallyAdjustKeyboardInsets
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + Spacing.three, paddingBottom: insets.bottom + Spacing.four },
        ]}>
        <View style={styles.top}>
          <IconButton
            icon={step === 0 ? closeIcon : 'arrow-back'}
            label={step === 0 ? closeLabel : 'Back'}
            onPress={step === 0 ? onClose : () => setStep(step - 1)}
          />
          <View style={styles.progress}>
            <ProgressBar progress={(step + 1) / (LAST_STEP + 1)} />
          </View>
        </View>

        <LeggySays pose={STEP_POSES[step]} size={112}>
          {question}
        </LeggySays>

        <Animated.View key={step} entering={FadeInRight.duration(260)} style={styles.step}>
          {step === 0 && (
            <Field
              placeholder="Their name"
              value={name}
              onChangeText={setName}
              onSubmitEditing={() => canContinue && next()}
              autoCapitalize="words"
              returnKeyType="next"
              autoFocus
              style={styles.bigField}
            />
          )}

          {step === 1 && (
            <View style={styles.grid}>
              {AGES.map((a) => (
                <Chunky
                  key={a}
                  accessibilityLabel={String(a)}
                  accessibilityState={{ selected: age === a }}
                  onPress={() => setAge(a)}
                  tone={age === a ? 'green' : 'white'}
                  style={styles.ageTile}
                  faceStyle={styles.ageFace}>
                  <Text style={styles.ageLabel}>{a}</Text>
                </Chunky>
              ))}
            </View>
          )}

          {step === 2 && (
            <>
              <View style={styles.grid}>
                {[...Object.keys(INTERESTS), ...customInterests].map((interest) => (
                  <Chunky
                    key={interest}
                    accessibilityLabel={interest}
                    accessibilityState={{ selected: interests.includes(interest) }}
                    onPress={() => toggle(interest)}
                    tone={interests.includes(interest) ? 'green' : 'white'}
                    style={styles.loveTile}
                    faceStyle={styles.loveFace}>
                    <Text style={styles.loveEmoji}>{INTERESTS[interest] ?? '⭐'}</Text>
                    <Text style={styles.loveLabel} numberOfLines={1}>
                      {interest}
                    </Text>
                  </Chunky>
                ))}
              </View>
              <Field
                placeholder="Something else?"
                value={custom}
                onChangeText={setCustom}
                onSubmitEditing={addCustom}
                returnKeyType="done"
                submitBehavior="submit"
              />
            </>
          )}

          {step === LAST_STEP && (
            <>
              <Field
                placeholder="Shy, scared of the dark… (optional)"
                value={note}
                onChangeText={setNote}
                onFocus={scrollToEndOnKeyboard}
                autoCapitalize="sentences"
                autoCorrect
                multiline
                style={styles.note}
              />
              {askParentName && (
                <>
                  <Text style={styles.label}>And your name?</Text>
                  <Field
                    placeholder={defaultParentName}
                    value={parentName}
                    onChangeText={setParentName}
                    onFocus={scrollToEndOnKeyboard}
                    autoCapitalize="words"
                    returnKeyType="done"
                  />
                </>
              )}
            </>
          )}
        </Animated.View>

        <View style={styles.spacer} />
        {error !== null && <Body style={styles.error}>{error}</Body>}
        {step < LAST_STEP ? (
          <Button label="Next" icon="arrow-forward" variant="accent" onPress={next} disabled={!canContinue} />
        ) : (
          <Button label="Let's play!" icon="sparkles" variant="accent" onPress={save} loading={saving} />
        )}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  progress: {
    flex: 1,
  },
  step: {
    gap: Spacing.three,
  },
  bigField: {
    minHeight: 72,
    fontFamily: Fonts.display,
    fontSize: 26,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  ageTile: {
    width: '22%',
  },
  ageFace: {
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageLabel: {
    color: Colors.black,
    fontFamily: Fonts.displayBold,
    fontSize: 30,
  },
  loveTile: {
    width: '31%',
  },
  loveFace: {
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: 4,
  },
  loveEmoji: {
    fontSize: 34,
    lineHeight: 42,
  },
  loveLabel: {
    color: Colors.black,
    fontFamily: Fonts.sansHeavy,
    fontSize: 14,
  },
  label: {
    color: Colors.black,
    fontFamily: Fonts.display,
    fontSize: 20,
    marginTop: Spacing.two,
  },
  note: {
    minHeight: 100,
    paddingTop: Spacing.three,
    textAlignVertical: 'top',
  },
  spacer: {
    flex: 1,
  },
  error: {
    fontFamily: Fonts.sansBold,
  },
});
