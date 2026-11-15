import Ionicons from '@expo/vector-icons/Ionicons';
import { useAction, useMutation, useQuery } from 'convex/react';
import { Asset } from 'expo-asset';
import * as Device from 'expo-device';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LeggySays } from '@/components/leggy';
import { LeggyWaiting } from '@/components/leggy-waiting';
import { LevelUp } from '@/components/level-up';
import { SkillPanel } from '@/components/skill-panel';
import { Body, Button, Field, Loading, Title } from '@/components/ui';
import { VoiceClip } from '@/components/voice-clip';
import { Colors, Fonts, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { errorMessage } from '@/lib/errors';
import { useKids } from '@/lib/kids';
import type { CompleteResult, KidId, Legend } from '@/lib/types';
import { upload } from '@/lib/upload';
import { api } from '../../convex/_generated/api';

const PLACEHOLDERS = [
  require('@/assets/images/placeholders/1.jpg'),
  require('@/assets/images/placeholders/2.jpg'),
  require('@/assets/images/placeholders/3.jpg'),
  require('@/assets/images/placeholders/4.jpg'),
];

const SAVING_LINES = [
  'Leggy is gluing this into the memory book…',
  'Leggy is hanging your photo on the fridge…',
  'Leggy is doing a happy wobble…',
];

const HAS_CAMERA = Platform.OS !== 'web' && Device.isDevice;

export default function DoneScreen() {
  const insets = useSafeAreaInsets();
  const { kid, day } = useLocalSearchParams<{ kid: KidId; day: string }>();
  const { kids } = useKids();
  const name = kids?.find((k) => k._id === kid)?.name ?? 'Your kid';
  const legend = useQuery(api.legends.legendToday, { kid, day }) as Legend | null | undefined;
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const completeLegend = useMutation(api.legends.completeLegend);
  const reactToProof = useAction(api.legends.reactToProof);
  const [photo, setPhoto] = useState<string | null>(null);
  const [quote, setQuote] = useState('');
  const [voice, setVoice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<CompleteResult | null>(null);
  const [reaction, setReaction] = useState<string | null>(null);
  const [levelUpOpen, setLevelUpOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function takePhoto() {
    setError(null);
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setError('Allow the camera to snap your legend.');
      return;
    }
    const picked = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.6 });
    if (!picked.canceled) setPhoto(picked.assets[0].uri);
  }

  async function pickPhoto() {
    setError(null);
    const picked = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.6 });
    if (!picked.canceled) setPhoto(picked.assets[0].uri);
  }

  async function samplePhoto() {
    const asset = await Asset.fromModule(PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]).downloadAsync();
    setPhoto(asset.localUri ?? asset.uri);
  }

  async function save(open: Legend) {
    setError(null);
    setSaving(true);
    try {
      const [photoId, voiceId] = await Promise.all([
        photo === null ? undefined : upload(await generateUploadUrl(), photo, 'image/jpeg'),
        voice === null ? undefined : upload(await generateUploadUrl(), voice, 'audio/mp4'),
      ]);
      const completed = (await completeLegend({
        legend: open._id,
        photo: photoId,
        quote: quote.trim().length > 0 ? quote.trim() : undefined,
        voice: voiceId,
      })) as CompleteResult;
      setResult(completed);
      setSaving(false);
      try {
        setReaction((await reactToProof({ legend: open._id })) as string);
      } catch {
        setReaction(`Wow, ${name}! That was way better than my try.`);
      }
      if (completed.leveledUp) {
        setTimeout(() => setLevelUpOpen(true), 1200);
      }
    } catch (e) {
      setError(errorMessage(e));
      setSaving(false);
    }
  }

  if (saving) {
    return <LeggyWaiting lines={SAVING_LINES} />;
  }
  if (legend === undefined) {
    return <Loading />;
  }
  if (legend === null) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Body>No legend today yet.</Body>
        <Button label="Back" variant="outline" onPress={() => router.back()} />
      </View>
    );
  }

  const padding = { paddingTop: insets.top + Spacing.three, paddingBottom: insets.bottom + Spacing.five };

  if (result !== null || legend.status === 'done') {
    const yourPhoto = legend.photoUrl ?? photo;
    const reactionText = reaction ?? legend.reaction ?? null;
    const quoteText = legend.quote ?? (quote.trim() || null);
    return (
      <ScrollView style={styles.screen} contentContainerStyle={[styles.content, padding]}>
        <Title>Legend done!</Title>
        <View style={styles.photos}>
          <Polaroid uri={yourPhoto} label={name} />
          <Polaroid uri={legend.challengeImageUrl} label="Leggy" />
        </View>
        <LeggySays mood={reactionText === null ? 'thinking' : 'happy'}>
          {reactionText ?? 'Leggy is looking at your photo…'}
        </LeggySays>
        {quoteText !== null && <Text style={styles.quote}>“{quoteText}”</Text>}
        <SkillPanel kid={kid} name={name} highlight={result?.skill ?? legend.skill} />
        <Button label="Back to today" onPress={() => router.back()} />
        {levelUpOpen && result !== null && (
          <LevelUp skill={result.skill} level={result.level} name={name} onClose={() => setLevelUpOpen(false)} />
        )}
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.content, padding]}>
        <View style={styles.top}>
          <Title style={styles.flex}>We did it!</Title>
          <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => router.back()} hitSlop={16}>
            <Ionicons name="close" size={32} color={Colors.black} />
          </Pressable>
        </View>
        <Body muted>{legend.title}</Body>

        <Text style={styles.label}>Snap a photo</Text>
        {photo !== null ? (
          <Image source={{ uri: photo }} style={styles.preview} contentFit="cover" />
        ) : (
          <View style={[styles.preview, styles.empty]}>
            <Ionicons name="camera" size={48} color={Colors.gray} />
          </View>
        )}
        <View style={styles.row}>
          {HAS_CAMERA ? (
            <View style={styles.flex}>
              <Button label="Camera" icon="camera" variant="outline" onPress={takePhoto} />
            </View>
          ) : (
            <View style={styles.flex}>
              <Button label="Sample" icon="image" variant="outline" onPress={samplePhoto} />
            </View>
          )}
          <View style={styles.flex}>
            <Button label="Library" icon="images" variant="outline" onPress={pickPhoto} />
          </View>
        </View>

        <Text style={styles.label}>What did {name} say?</Text>
        <Field
          placeholder="“Again! Again!”"
          value={quote}
          onChangeText={setQuote}
          autoCapitalize="sentences"
          autoCorrect
          multiline
          style={styles.quoteField}
        />
        <VoiceClip uri={voice} onChange={setVoice} />

        {error !== null && <Body style={styles.error}>{error}</Body>}
        <Button label="Save the legend" icon="checkmark-circle" variant="accent" onPress={() => save(legend)} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Polaroid({ uri, label }: { uri: string | null; label: string }) {
  return (
    <View style={styles.polaroid}>
      {uri !== null ? (
        <Image source={{ uri }} style={styles.polaroidImage} contentFit="cover" />
      ) : (
        <View style={[styles.polaroidImage, styles.empty]}>
          <Ionicons name="image" size={32} color={Colors.gray} />
        </View>
      )}
      <Text style={styles.polaroidLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.four,
    padding: Spacing.four,
  },
  content: {
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
  flex: {
    flex: 1,
  },
  label: {
    color: Colors.black,
    fontFamily: Fonts.sans,
    fontSize: 22,
    fontWeight: '900',
    marginTop: Spacing.three,
  },
  preview: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: Radius.card,
    borderWidth: 2,
    borderColor: Colors.black,
    overflow: 'hidden',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.soft,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  quoteField: {
    minHeight: 90,
    paddingTop: Spacing.three,
    textAlignVertical: 'top',
  },
  error: {
    fontWeight: '700',
  },
  photos: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  polaroid: {
    flex: 1,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: Radius.tile,
    padding: Spacing.two,
    gap: Spacing.two,
    backgroundColor: Colors.white,
  },
  polaroidImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 14,
  },
  polaroidLabel: {
    color: Colors.black,
    fontFamily: Fonts.sans,
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
  },
  quote: {
    color: Colors.black,
    fontFamily: Fonts.serif,
    fontSize: 26,
    lineHeight: 34,
    fontStyle: 'italic',
  },
});
