import { router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { Button, Chip } from '@/components/ui';
import { Spacing } from '@/constants/theme';
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
        kids.map((kid) => (
          <Chip key={kid._id} label={kid.name} selected={kid._id === selected} onPress={() => onSelect(kid._id)} />
        ))}
      <Button label="Add a kid" icon="add" variant="soft" small onPress={() => router.push('/add-kid')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: Spacing.two,
    alignItems: 'center',
  },
});
