import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { Tappable } from '@/components/ui';
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
            <Tappable
              key={kid._id}
              accessibilityState={{ selected: active }}
              onPress={() => onSelect(kid._id)}
              style={[styles.pill, active && styles.active]}>
              <Text style={styles.label}>{kid.name}</Text>
            </Tappable>
          );
        })}
      <Tappable accessibilityLabel="Add a kid" onPress={() => router.push('/add-kid')} style={[styles.pill, styles.add]}>
        <Ionicons name="add" size={18} color={Colors.gray} />
        {kids.length <= 1 && <Text style={[styles.label, styles.addLabel]}>Add kid</Text>}
      </Tappable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: Spacing.two,
    alignItems: 'center',
  },
  pill: {
    backgroundColor: Colors.soft,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  active: {
    backgroundColor: Colors.green,
  },
  add: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 12,
  },
  label: {
    color: Colors.black,
    fontFamily: Fonts.sansBold,
    fontSize: 15,
  },
  addLabel: {
    color: Colors.gray,
  },
});
