import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import type { Kid, KidId } from '@/lib/types';

export function KidSwitcher({
  kids,
  selected,
  onSelect,
}: {
  kids: Kid[];
  selected: KidId;
  onSelect: (id: KidId) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {kids.length > 1 &&
        kids.map((kid) => {
          const active = kid._id === selected;
          return (
            <Pressable
              key={kid._id}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => onSelect(kid._id)}
              style={[styles.pill, active && styles.active]}>
              <Text style={styles.label}>{kid.name}</Text>
            </Pressable>
          );
        })}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add a kid"
        onPress={() => router.push('/add-kid')}
        style={[styles.pill, styles.add]}>
        <Ionicons name="add" size={18} color={Colors.black} />
        {kids.length <= 1 && <Text style={styles.label}>Add kid</Text>}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: Spacing.two,
    alignItems: 'center',
  },
  pill: {
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
  },
  active: {
    backgroundColor: Colors.green,
    borderColor: Colors.green,
  },
  add: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 10,
    borderStyle: 'dashed',
  },
  label: {
    color: Colors.black,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '800',
  },
});
