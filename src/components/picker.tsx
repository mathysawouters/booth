import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Body, Tappable, TextButton } from '@/components/ui';
import { Colors, Fonts, Radius, Shadow, Spacing } from '@/constants/theme';
import { formatTime } from '@/lib/day';
import { findFreeSlot, type Slot } from '@/lib/free-slot';
import { CATEGORY_ART, orderedCategories } from '@/lib/legends';
import type { Category, Mode } from '@/lib/types';

export function Picker({
  doneToday,
  onBack,
  onPick,
}: {
  doneToday: boolean;
  onBack?: () => void;
  onPick: (choice: { mode: Mode; category: Category; minutes: number }) => void;
}) {
  const [mode, setMode] = useState<Mode>('real');
  const [slot, setSlot] = useState<Slot | null>(null);
  const [slotMessage, setSlotMessage] = useState<string | null>(null);
  const [finding, setFinding] = useState(false);

  async function find() {
    setFinding(true);
    setSlotMessage(null);
    try {
      const found = await findFreeSlot();
      setSlot(found);
      if (found === null) {
        setSlotMessage('No free 15 minutes left in your calendar today. Tomorrow, then!');
      }
    } catch {
      setSlotMessage('Could not read your calendar. Pick something anyway!');
    } finally {
      setFinding(false);
    }
  }

  return (
    <View style={styles.container}>
      {doneToday && (
        <View style={styles.note}>
          <Ionicons name="checkmark-circle" size={24} color={Colors.greenDeep} />
          <Body style={styles.noteText}>Today&apos;s legend is done. Up for another one?</Body>
        </View>
      )}

      <Text style={styles.heading}>What do you want to do?</Text>

      <View style={styles.switch}>
        {(
          [
            { id: 'real', label: 'In real life', icon: 'walk' },
            { id: 'phone', label: 'On the phone', icon: 'phone-portrait' },
          ] as const
        ).map((option) => {
          const active = mode === option.id;
          return (
            <Tappable
              key={option.id}
              accessibilityState={{ selected: active }}
              onPress={() => setMode(option.id)}
              style={[styles.switchHalf, active && styles.switchActive]}>
              <Ionicons name={option.icon} size={20} color={active ? Colors.black : Colors.gray} />
              <Text style={[styles.switchLabel, active && styles.switchLabelActive]}>{option.label}</Text>
            </Tappable>
          );
        })}
      </View>

      <Tappable accessibilityLabel="Find my 15 minutes" onPress={find} disabled={finding} style={styles.find}>
        {finding ? (
          <ActivityIndicator color={Colors.black} />
        ) : (
          <>
            <Ionicons name="calendar-outline" size={18} color={Colors.black} />
            <Text style={styles.findLabel}>Find my 15 minutes</Text>
          </>
        )}
      </Tappable>
      {slot !== null && (
        <View style={styles.slot}>
          <Text style={styles.slotTitle}>
            {slot.note === null ? `Free at ${formatTime(slot.start)}` : 'Right now'} · {slot.minutes} min
          </Text>
          {slot.note !== null && <Body muted>{slot.note}</Body>}
          <Body muted>Pick a tile and Leggy makes it fit.</Body>
        </View>
      )}
      {slotMessage !== null && <Body muted>{slotMessage}</Body>}

      <View style={styles.grid}>
        {orderedCategories(new Date()).map((category) => (
          <Tappable
            key={category.id}
            accessibilityLabel={category.label}
            onPress={() => onPick({ mode, category: category.id, minutes: slot?.minutes ?? 15 })}
            style={[styles.tile, category.id === 'surprise' && styles.surprise]}>
            <Image source={CATEGORY_ART[category.id]} style={styles.tileArt} contentFit="contain" />
            <Text style={styles.tileLabel}>{category.label}</Text>
          </Tappable>
        ))}
      </View>

      {onBack !== undefined && <TextButton label="Back to today's legend" onPress={onBack} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: Colors.greenSoft,
    borderRadius: Radius.tile,
    padding: Spacing.three,
  },
  noteText: {
    flex: 1,
    fontFamily: Fonts.sansBold,
    fontSize: 16,
    lineHeight: 22,
  },
  heading: {
    color: Colors.black,
    fontFamily: Fonts.display,
    fontSize: 22,
    lineHeight: 28,
    marginTop: Spacing.two,
  },
  switch: {
    flexDirection: 'row',
    backgroundColor: Colors.soft,
    borderRadius: Radius.pill,
    padding: 4,
  },
  switchHalf: {
    flex: 1,
    minHeight: 48,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  switchActive: {
    backgroundColor: Colors.white,
    ...Shadow.raised,
  },
  switchLabel: {
    color: Colors.gray,
    fontFamily: Fonts.sansBold,
    fontSize: 16,
  },
  switchLabelActive: {
    color: Colors.black,
  },
  find: {
    alignSelf: 'center',
    minHeight: 44,
    minWidth: 216,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
    backgroundColor: Colors.soft,
  },
  findLabel: {
    color: Colors.black,
    fontFamily: Fonts.sansBold,
    fontSize: 16,
  },
  slot: {
    gap: Spacing.one,
    backgroundColor: Colors.greenSoft,
    borderRadius: Radius.tile,
    padding: Spacing.three,
  },
  slotTitle: {
    color: Colors.black,
    fontFamily: Fonts.display,
    fontSize: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  tile: {
    flexBasis: '46%',
    flexGrow: 1,
    borderRadius: Radius.tile,
    padding: Spacing.three,
    paddingBottom: 14,
    gap: Spacing.two,
    alignItems: 'center',
    backgroundColor: Colors.soft,
  },
  surprise: {
    backgroundColor: Colors.greenSoft,
  },
  tileArt: {
    width: '100%',
    aspectRatio: 1.15,
  },
  tileLabel: {
    color: Colors.black,
    fontFamily: Fonts.display,
    fontSize: 19,
  },
});
