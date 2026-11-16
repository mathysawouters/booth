import Ionicons from '@expo/vector-icons/Ionicons';
import { useAction, useMutation, useQuery } from 'convex/react';
import { Asset } from 'expo-asset';
import * as Device from 'expo-device';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, type ScrollViewInstance, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Burst, Confetti } from '@/components/confetti';
import { LeggySays } from '@/components/leggy';
import { LeggyWaiting } from '@/components/leggy-waiting';
import { LevelUp } from '@/components/level-up';
import { SkillPanel } from '@/components/skill-panel';
import { Body, Button, Field, IconButton, Loading } from '@/components/ui';
import { VoiceClip } from '@/components/voice-clip';
import { Colors, Fonts, MaxContentWidth, Radius, SKILL_TONE, Spacing, Tones } from '@/constants/theme';
import { errorMessage } from '@/lib/errors';
import { successHaptic } from '@/lib/haptics';
import { useScrollToEndOnKeyboard } from '@/lib/keyboard';
import { useKids } from '@/lib/kids';
import { CATEGORY_ART, SKILLS } from '@/lib/legends';
import type { CompleteResult, KidId, Legend, SkillName } from '@/lib/types';
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
  const scroll = useRef<ScrollViewInstance>(null);
  const scrollToEndOnKeyboard = useScrollToEndOnKeyboard(scroll);

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
        setReaction(`Wow, ${name}! Way better than my try.`);
      }
      if (completed.leveledUp) {
        setTimeout(() => setLevelUpOpen(true), 2400);
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
        <Button label="Back" variant="soft" onPress={() => router.back()} />
      </View>
    );
  }

  const padding = { paddingTop: insets.top + Spacing.three, paddingBottom: insets.bottom + Spacing.five };

  if (result !== null || legend.status === 'done') {
    const yourPhoto = legend.photoUrl ?? photo;
    const reactionText = reaction ?? legend.reaction ?? null;
    const quoteText = legend.quote ?? (quote.trim() || null);
    return (
      <View style={[styles.screen, styles.party]}>
        <ScrollView contentContainerStyle={[styles.content, padding]}>
          <View style={styles.stage}>
            <Burst radius={150} bursts={3} />
            <LeggySays side="top" pose="cheering" size={170} bouncy>
              {reactionText ?? 'Let me see, let me see…'}
            </LeggySays>
          </View>
          <XpCounter xp={result?.xp ?? legend.xp} skill={result?.skill ?? legend.skill} />
          <View style={styles.photos}>
            <Polaroid uri={yourPhoto} label={name} tilt="-3deg" />
            <Polaroid uri={legend.challengeImageUrl} fallback={CATEGORY_ART[legend.category]} label="Leggy" tilt="3deg" />
          </View>
          {quoteText !== null && <Text style={styles.quote}>“{quoteText}”</Text>}
          <SkillPanel kid={kid} name={name} highlight={result?.skill ?? legend.skill} />
          <Button label="Back to today" variant="accent" onPress={() => router.back()} />
        </ScrollView>
        <Confetti waves={2} />
        {levelUpOpen && result !== null && (
          <LevelUp skill={result.skill} level={result.level} name={name} onClose={() => setLevelUpOpen(false)} />
        )}
      </View>
    );
  }

  return (
    <ScrollView
      ref={scroll}
      style={styles.screen}
      automaticallyAdjustKeyboardInsets
      keyboardDismissMode="interactive"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[styles.content, padding]}>
      <View style={styles.top}>
        <View style={styles.flex}>
          <LeggySays pose="cheering" size={96}>{`Show me, ${name}!`}</LeggySays>
        </View>
        <IconButton icon="close" label="Close" onPress={() => router.back()} />
      </View>

      {photo !== null ? (
        <Image source={{ uri: photo }} style={styles.preview} contentFit="cover" />
      ) : (
        <View style={[styles.preview, styles.previewEmpty]}>
          <Ionicons name="camera" size={56} color={Colors.pinkDark} />
          <Text style={styles.label}>Snap a photo</Text>
        </View>
      )}
      <View style={styles.row}>
        {HAS_CAMERA ? (
          <View style={styles.flex}>
            <Button label="Camera" icon="camera" variant="solid" onPress={takePhoto} />
          </View>
        ) : (
          <View style={styles.flex}>
            <Button label="Sample" icon="image" variant="solid" onPress={samplePhoto} />
          </View>
        )}
        <View style={styles.flex}>
          <Button label="Library" icon="images" variant="soft" onPress={pickPhoto} />
        </View>
      </View>

      <Text style={styles.label}>What did {name} say?</Text>
      <Field
        placeholder="“Again! Again!”"
        value={quote}
        onChangeText={setQuote}
        onFocus={scrollToEndOnKeyboard}
        autoCapitalize="sentences"
        autoCorrect
        multiline
        style={styles.quoteField}
      />
      <VoiceClip uri={voice} onChange={setVoice} />

      {error !== null && <Body style={styles.error}>{error}</Body>}
      <Button label="Save the legend" icon="checkmark-circle" variant="accent" onPress={() => save(legend)} />
    </ScrollView>
  );
}

function XpCounter({ xp, skill }: { xp: number; skill: SkillName }) {
  const [shown, setShown] = useState(0);
  const pop = useSharedValue(1);

  useEffect(() => {
    const start = Date.now() + 400;
    let frame = requestAnimationFrame(function tick() {
      const progress = Math.min(1, Math.max(0, (Date.now() - start) / 1100));
      setShown(Math.round(xp * progress));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }
      successHaptic();
      pop.set(withSequence(withSpring(1.25, { damping: 8, stiffness: 300 }), withSpring(1, { damping: 8, stiffness: 300 })));
    });
    return () => cancelAnimationFrame(frame);
  }, [xp, pop]);

  const bump = useAnimatedStyle(() => ({ transform: [{ scale: pop.get() }, { rotate: '-3deg' }] }));
  const tone = Tones[SKILL_TONE[skill]];

  return (
    <Animated.View entering={ZoomIn.delay(200).springify().damping(10)} style={styles.reward}>
      <Animated.View style={[styles.xp, bump]}>
        <Text style={styles.xpText}>+{shown} XP</Text>
      </Animated.View>
      <View style={[styles.skill, { backgroundColor: tone.face, borderColor: tone.edge }]}>
        <Ionicons name={SKILLS[skill].icon} size={18} color={Colors.black} />
        <Text style={styles.skillText}>{SKILLS[skill].label}</Text>
      </View>
    </Animated.View>
  );
}

function Polaroid({ uri, fallback, label, tilt }: { uri: string | null; fallback?: number; label: string; tilt: string }) {
  return (
    <View style={[styles.polaroid, { transform: [{ rotate: tilt }] }]}>
      {uri !== null ? (
        <Image source={{ uri }} style={styles.polaroidImage} contentFit="cover" transition={200} />
      ) : fallback !== undefined ? (
        <Image source={fallback} style={[styles.polaroidImage, styles.empty]} contentFit="contain" />
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
    backgroundColor: Colors.paper,
  },
  party: {
    backgroundColor: Colors.pink,
    overflow: 'hidden',
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
    alignItems: 'flex-start',
    gap: Spacing.three,
  },
  flex: {
    flex: 1,
  },
  label: {
    color: Colors.black,
    fontFamily: Fonts.display,
    fontSize: 20,
  },
  preview: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: Radius.card,
    overflow: 'hidden',
  },
  previewEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    backgroundColor: Colors.pinkSoft,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: Colors.pink,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lemon,
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
    fontFamily: Fonts.sansBold,
  },
  stage: {
    paddingTop: Spacing.two,
    overflow: 'hidden',
  },
  reward: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  xp: {
    backgroundColor: Colors.lemon,
    borderRadius: Radius.card,
    borderBottomWidth: 8,
    borderColor: Colors.lemonDark,
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.two,
  },
  xpText: {
    color: Colors.black,
    fontFamily: Fonts.displayBold,
    fontSize: 56,
    lineHeight: 64,
    fontVariant: ['tabular-nums'],
  },
  skill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: Radius.pill,
    borderBottomWidth: 4,
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
  },
  skillText: {
    color: Colors.black,
    fontFamily: Fonts.display,
    fontSize: 18,
  },
  photos: {
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.two,
  },
  polaroid: {
    flex: 1,
    borderRadius: Radius.tile,
    borderBottomWidth: 6,
    borderColor: 'rgba(27, 42, 18, 0.16)',
    padding: 10,
    gap: Spacing.two,
    backgroundColor: Colors.white,
  },
  polaroidImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
  },
  polaroidLabel: {
    color: Colors.black,
    fontFamily: Fonts.display,
    fontSize: 17,
    textAlign: 'center',
  },
  quote: {
    color: Colors.black,
    fontFamily: Fonts.serifItalic,
    fontSize: 22,
    lineHeight: 32,
    textAlign: 'center',
  },
});
