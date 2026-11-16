import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeInRight,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  ZoomIn,
} from 'react-native-reanimated';

import { Body, Button, Chunky, Tappable } from '@/components/ui';
import { CATEGORY_TONE, Colors, Fonts, Radius, Spacing, Tones } from '@/constants/theme';
import { formatTime } from '@/lib/day';
import { findFreeSlot, type Slot } from '@/lib/free-slot';
import { CATEGORY_ART, menuFor } from '@/lib/legends';
import type { Category, Mode } from '@/lib/types';

const MODES = [
  { id: 'real', label: 'In real life', icon: 'walk' },
  { id: 'phone', label: 'On the phone', icon: 'phone-portrait' },
] as const;

export function Picker({
  doneToday,
  mode,
  onMode,
  onPick,
}: {
  doneToday: boolean;
  mode: Mode;
  onMode: (mode: Mode) => void;
  onPick: (choice: { mode: Mode; category: Category; minutes: number }) => void;
}) {
  const [slot, setSlot] = useState<Slot | null>(null);
  const [slotMessage, setSlotMessage] = useState<string | null>(null);
  const [finding, setFinding] = useState(false);
  const shift = useSharedValue(mode === 'real' ? 0 : 1);

  useEffect(() => {
    shift.set(withSpring(mode === 'real' ? 0 : 1, { damping: 16, stiffness: 180 }));
  }, [mode, shift]);

  const thumb = useAnimatedStyle(() => ({
    left: `${shift.get() * 50}%`,
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

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Or pick something else</Text>
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
            onPress={() => onMode(option.id)}
            style={styles.switchHalf}>
            <Ionicons name={option.icon} size={20} color={Colors.black} />
            <Text style={styles.switchLabel}>{option.label}</Text>
          </Tappable>
        ))}
      </View>

      {finding ? (
        <ActivityIndicator color={Colors.greenDark} style={styles.finding} />
      ) : (
        <Button label="Find my 15 minutes" icon="calendar-outline" variant="soft" small onPress={find} />
      )}
      {slot !== null && (
        <View style={styles.note}>
          <Ionicons name="time" size={22} color={Colors.greenDeep} />
          <Text style={styles.noteText}>
            {slot.note === null ? `Free at ${formatTime(slot.start)}` : 'Right now'} · {slot.minutes} min
          </Text>
        </View>
      )}
      {slotMessage !== null && <Body muted>{slotMessage}</Body>}

      <Animated.View style={[styles.panel, panel]}>
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
  heading: {
    color: Colors.black,
    fontFamily: Fonts.displayBold,
    fontSize: 24,
    lineHeight: 30,
    marginTop: Spacing.two,
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
