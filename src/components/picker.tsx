import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Body, Button, Card, TextButton, Title } from '@/components/ui';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { formatTime } from '@/lib/day';
import { findFreeSlot, type Slot } from '@/lib/free-slot';
import { orderedCategories } from '@/lib/legends';
import type { Category, Mode } from '@/lib/types';

export function Picker({
  streak,
  doneToday,
  onBack,
  onPick,
}: {
  streak: number | undefined;
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
      <View style={styles.streak}>
        <Ionicons name="flame" size={26} color={Colors.green} />
        <Text style={styles.streakText}>
          {streak === undefined
            ? ' '
            : streak === 0
              ? 'Start a streak today'
              : `${streak} ${streak === 1 ? 'day' : 'days'} in a row`}
        </Text>
      </View>

      {doneToday && (
        <Card style={styles.doneCard}>
          <Body style={styles.bold}>Today&apos;s legend is done. Up for another one?</Body>
        </Card>
      )}

      <Title>What do you want to do?</Title>

      <View style={styles.switch}>
        {(
          [
            { id: 'real', label: 'In real life', icon: 'walk' },
            { id: 'phone', label: 'On the phone', icon: 'phone-portrait' },
          ] as const
        ).map((option) => {
          const active = mode === option.id;
          return (
            <Pressable
              key={option.id}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setMode(option.id)}
              style={[styles.switchHalf, active && styles.switchActive]}>
              <Ionicons name={option.icon} size={26} color={active ? Colors.white : Colors.black} />
              <Text style={[styles.switchLabel, active && styles.switchLabelActive]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Button label="Find my 15 minutes" icon="calendar" variant="outline" onPress={find} loading={finding} />
      {slot !== null && (
        <Card style={styles.slot}>
          <Text style={styles.slotTitle}>
            {slot.note === null ? `Free at ${formatTime(slot.start)}` : 'Right now'} · {slot.minutes} min
          </Text>
          {slot.note !== null && <Body muted>{slot.note}</Body>}
          <Body muted>Pick a tile and Leggy makes it fit.</Body>
        </Card>
      )}
      {slotMessage !== null && <Body muted>{slotMessage}</Body>}

      <View style={styles.grid}>
        {orderedCategories(new Date()).map((category) => (
          <Pressable
            key={category.id}
            accessibilityRole="button"
            accessibilityLabel={category.label}
            onPress={() => onPick({ mode, category: category.id, minutes: slot?.minutes ?? 15 })}
            style={({ pressed }) => [
              styles.tile,
              category.id === 'surprise' && styles.surprise,
              pressed && styles.pressed,
            ]}>
            <Ionicons name={category.icon} size={34} color={Colors.black} />
            <Text style={styles.tileLabel}>{category.label}</Text>
          </Pressable>
        ))}
      </View>

      {onBack !== undefined && <TextButton label="Back to today's legend" onPress={onBack} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.four,
  },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  streakText: {
    color: Colors.black,
    fontFamily: Fonts.sans,
    fontSize: 20,
    fontWeight: '800',
  },
  doneCard: {
    backgroundColor: Colors.greenSoft,
    borderColor: Colors.green,
  },
  bold: {
    fontWeight: '800',
  },
  switch: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: Radius.pill,
    padding: 4,
  },
  switchHalf: {
    flex: 1,
    minHeight: 64,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  switchActive: {
    backgroundColor: Colors.black,
  },
  switchLabel: {
    color: Colors.black,
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: '800',
  },
  switchLabelActive: {
    color: Colors.white,
  },
  slot: {
    gap: Spacing.one,
    borderColor: Colors.green,
  },
  slotTitle: {
    color: Colors.black,
    fontFamily: Fonts.sans,
    fontSize: 22,
    fontWeight: '900',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  tile: {
    flexBasis: '46%',
    flexGrow: 1,
    minHeight: 112,
    borderRadius: Radius.tile,
    borderWidth: 2,
    borderColor: Colors.black,
    padding: Spacing.three,
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
  },
  surprise: {
    backgroundColor: Colors.green,
    borderColor: Colors.green,
  },
  pressed: {
    opacity: 0.6,
  },
  tileLabel: {
    color: Colors.black,
    fontFamily: Fonts.sans,
    fontSize: 20,
    fontWeight: '900',
  },
});
