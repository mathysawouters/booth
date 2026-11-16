import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInRight,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  ZoomIn,
} from 'react-native-reanimated';

import { Leggy } from '@/components/leggy';
import { MysteryBox } from '@/components/mystery-box';
import { Body, Button, Chunky, Tappable, TextButton } from '@/components/ui';
import { CATEGORY_TONE, Colors, Fonts, Radius, Spacing, Tones } from '@/constants/theme';
import { formatTime } from '@/lib/day';
import { findFreeSlot, type Slot } from '@/lib/free-slot';
import { CATEGORY_ART, menuFor, WAITING_LINES } from '@/lib/legends';
import type { Category, Mode } from '@/lib/types';

const MODES = [
  { id: 'real', label: 'In real life', icon: 'walk' },
  { id: 'phone', label: 'On the phone', icon: 'phone-portrait' },
] as const;

export function Picker({
  doneToday,
  busy,
  onBack,
  onPick,
}: {
  doneToday: boolean;
  busy: 'waiting' | 'open' | null;
  onBack?: () => void;
  onPick: (choice: { mode: Mode; category: Category; minutes: number }) => void;
}) {
  const [mode, setMode] = useState<Mode>('real');
  const [themes, setThemes] = useState(onBack !== undefined);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [slotMessage, setSlotMessage] = useState<string | null>(null);
  const [finding, setFinding] = useState(false);
  const [line, setLine] = useState(() => Math.floor(Math.random() * WAITING_LINES.length));
  const shift = useSharedValue(0);

  useEffect(() => {
    shift.set(withSpring(mode === 'real' ? 0 : 1, { damping: 16, stiffness: 180 }));
  }, [mode, shift]);

  useEffect(() => {
    if (busy !== 'waiting') return;
    const timer = setInterval(() => setLine((i) => (i + 1) % WAITING_LINES.length), 2400);
    return () => clearInterval(timer);
  }, [busy]);

  const thumb = useAnimatedStyle(() => ({
    left: `${shift.get() * 50}%`,
    backgroundColor: interpolateColor(shift.get(), [0, 1], [Colors.lemon, Colors.mint]),
    borderColor: interpolateColor(shift.get(), [0, 1], [Colors.lemonDark, Colors.mintDark]),
  }));
  const card = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(shift.get(), [0, 1], [Colors.lemon, Colors.mint]),
    borderColor: interpolateColor(shift.get(), [0, 1], [Colors.lemonDark, Colors.mintDark]),
  }));
  const panel = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(shift.get(), [0, 1], [Colors.greenSoft, Colors.mintSoft]),
  }));

  async function find() {
    setFinding(true);
    setSlotMessage(null);
    try {
      const found = await findFreeSlot();
      setSlot(found);
      if (found === null) {
        setSlotMessage('No free 15 minutes left today. Tomorrow, then!');
      }
    } catch {
      setSlotMessage("Couldn't read your calendar. Pick anyway!");
    } finally {
      setFinding(false);
    }
  }

  function pick(category: Category) {
    onPick({ mode, category, minutes: slot?.minutes ?? 15 });
  }

  const surprise = (
    <Tappable
      accessibilityLabel="Tonight's surprise"
      onPress={() => pick('surprise')}
      disabled={busy !== null}
      scaleTo={0.97}>
      <Animated.View style={[styles.card, card]}>
        <Text style={styles.cardTitle}>Tonight&apos;s surprise!</Text>
        <View style={styles.stage}>
          <Leggy size={132} pose="thinking" bouncy={busy === 'waiting'} />
          <MysteryBox state={busy === 'waiting' ? 'shaking' : busy === 'open' ? 'open' : 'idle'} />
        </View>
        <View style={styles.cta}>
          <Text style={styles.ctaLabel}>
            {busy === 'waiting' ? WAITING_LINES[line] : busy === 'open' ? 'Ta-da!' : 'Tap to open'}
          </Text>
        </View>
      </Animated.View>
    </Tappable>
  );

  if (busy !== null) {
    return surprise;
  }

  return (
    <View style={styles.container}>
      {doneToday && (
        <View style={styles.note}>
          <Ionicons name="checkmark-circle" size={24} color={Colors.greenDeep} />
          <Text style={styles.noteText}>Done for today! One more?</Text>
        </View>
      )}

      <View style={styles.switch}>
        <Animated.View style={[styles.thumb, thumb]} />
        {MODES.map((option) => (
          <Tappable
            key={option.id}
            accessibilityLabel={option.label}
            accessibilityState={{ selected: mode === option.id }}
            onPress={() => setMode(option.id)}
            style={styles.switchHalf}>
            <Ionicons name={option.icon} size={20} color={Colors.black} />
            <Text style={styles.switchLabel}>{option.label}</Text>
          </Tappable>
        ))}
      </View>

      {surprise}

      <View style={styles.row}>
        <View style={styles.flex}>
          <Button
            label="Pick a theme"
            icon={themes ? 'chevron-up' : 'chevron-down'}
            variant="soft"
            small
            onPress={() => setThemes(!themes)}
          />
        </View>
        <View style={styles.flex}>
          {finding ? (
            <ActivityIndicator color={Colors.greenDark} style={styles.finding} />
          ) : (
            <Button label="Find 15 min" icon="calendar-outline" variant="soft" small onPress={find} />
          )}
        </View>
      </View>
      {slot !== null && (
        <View style={styles.note}>
          <Ionicons name="time" size={22} color={Colors.greenDeep} />
          <Text style={styles.noteText}>
            {slot.note === null ? `Free at ${formatTime(slot.start)}` : 'Right now'} · {slot.minutes} min
          </Text>
        </View>
      )}
      {slotMessage !== null && <Body muted>{slotMessage}</Body>}

      {themes && (
        <Animated.View entering={FadeIn.duration(200)} style={[styles.panel, panel]}>
          {mode === 'real' ? (
            <View key="real" style={styles.grid}>
              {menuFor('real', new Date()).map((item, i) => (
                <Animated.View key={item.category} entering={ZoomIn.delay(i * 40).springify().damping(13)} style={styles.tile}>
                  <Chunky
                    accessibilityLabel={item.label}
                    onPress={() => pick(item.category)}
                    tone={CATEGORY_TONE[item.category]}
                    faceStyle={styles.tileFace}>
                    <Image source={CATEGORY_ART[item.category]} style={styles.tileArt} contentFit="contain" />
                    <Text style={styles.tileLabel}>{item.label}</Text>
                  </Chunky>
                </Animated.View>
              ))}
            </View>
          ) : (
            <View key="phone" style={styles.list}>
              {menuFor('phone', new Date()).map((item, i) => (
                <Animated.View key={item.category} entering={FadeInRight.delay(i * 60).springify().damping(15)}>
                  <Chunky accessibilityLabel={item.label} onPress={() => pick(item.category)} faceStyle={styles.rowFace}>
                    <View style={[styles.thumbnail, { backgroundColor: Tones[CATEGORY_TONE[item.category]].face }]}>
                      <Image source={CATEGORY_ART[item.category]} style={styles.thumbnailArt} contentFit="contain" />
                    </View>
                    <Text style={[styles.tileLabel, styles.flex]}>{item.label}</Text>
                    <Ionicons name="play-circle" size={30} color={Colors.mintDark} />
                  </Chunky>
                </Animated.View>
              ))}
            </View>
          )}
        </Animated.View>
      )}

      {onBack !== undefined && <TextButton label="Back to today's legend" onPress={onBack} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  flex: {
    flex: 1,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: Colors.greenSoft,
    borderRadius: Radius.field,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
  },
  noteText: {
    flex: 1,
    color: Colors.black,
    fontFamily: Fonts.display,
    fontSize: 17,
  },
  switch: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Radius.pill,
    borderWidth: 2,
    borderColor: Colors.line,
  },
  thumb: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '50%',
    borderRadius: Radius.pill,
    borderBottomWidth: 5,
  },
  switchHalf: {
    flex: 1,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingBottom: 3,
  },
  switchLabel: {
    color: Colors.black,
    fontFamily: Fonts.display,
    fontSize: 16,
  },
  card: {
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: 32,
    borderBottomWidth: 8,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.three,
    paddingHorizontal: Spacing.three,
    overflow: 'hidden',
  },
  cardTitle: {
    color: Colors.black,
    fontFamily: Fonts.displayBold,
    fontSize: 28,
    lineHeight: 34,
    textAlign: 'center',
  },
  stage: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingTop: Spacing.five,
  },
  cta: {
    backgroundColor: Colors.white,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.four,
    paddingVertical: 10,
    marginTop: Spacing.two,
  },
  ctaLabel: {
    color: Colors.black,
    fontFamily: Fonts.display,
    fontSize: 18,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  finding: {
    minHeight: 48,
  },
  panel: {
    borderRadius: 32,
    padding: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tile: {
    flexBasis: '46%',
    flexGrow: 1,
  },
  tileFace: {
    alignItems: 'center',
    gap: 2,
    padding: 12,
  },
  tileArt: {
    width: '100%',
    aspectRatio: 1.25,
  },
  tileLabel: {
    color: Colors.black,
    fontFamily: Fonts.display,
    fontSize: 19,
  },
  list: {
    gap: 10,
  },
  rowFace: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: 10,
    paddingRight: Spacing.three,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 18,
    padding: 4,
  },
  thumbnailArt: {
    width: '100%',
    height: '100%',
  },
});
