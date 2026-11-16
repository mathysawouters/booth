import Ionicons from '@expo/vector-icons/Ionicons';
import { useAction, useQuery } from 'convex/react';
import { openBrowserAsync } from 'expo-web-browser';
import { useState, type ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Body, Button, Card } from '@/components/ui';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { errorMessage } from '@/lib/errors';
import { api } from '../../convex/_generated/api';

const PERKS: { icon: ComponentProps<typeof Ionicons>['name']; label: string }[] = [
  { icon: 'infinite', label: 'Unlimited legends and stories' },
  { icon: 'image', label: 'All the pictures' },
  { icon: 'people', label: 'Family sharing' },
  { icon: 'book', label: 'A printed book of the year' },
];

export function PlusCard() {
  const me = useQuery(api.users.me);
  const createCheckout = useAction(api.whop.createPlusCheckout);
  const [opening, setOpening] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (me === undefined || me === null) {
    return null;
  }

  if (me.plus) {
    return (
      <View style={styles.badge} accessibilityLabel="Little Legends Plus member">
        <Ionicons name="star" size={14} color={Colors.black} />
        <Text style={styles.badgeText}>Plus</Text>
      </View>
    );
  }

  async function upgrade() {
    setMessage(null);
    setOpening(true);
    try {
      await openBrowserAsync(await createCheckout());
    } catch (e) {
      setMessage(errorMessage(e));
    } finally {
      setOpening(false);
    }
  }

  return (
    <Card style={styles.card}>
      <View style={styles.head}>
        <Text style={styles.title}>Little Legends Plus</Text>
        <Text style={styles.price}>$49 a year</Text>
      </View>
      <View style={styles.perks}>
        {PERKS.map((perk) => (
          <View key={perk.label} style={styles.perk}>
            <View style={styles.perkIcon}>
              <Ionicons name={perk.icon} size={18} color={Colors.black} />
            </View>
            <Text style={styles.perkLabel}>{perk.label}</Text>
          </View>
        ))}
      </View>
      <Button label="Upgrade" icon="star" variant="lemon" onPress={upgrade} loading={opening} />
      {message !== null && <Body style={styles.message}>{message}</Body>}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.lemonSoft,
    borderColor: Colors.lemonDark,
  },
  head: {
    gap: 2,
  },
  title: {
    color: Colors.black,
    fontFamily: Fonts.displayBold,
    fontSize: 24,
  },
  price: {
    color: Colors.greenDeep,
    fontFamily: Fonts.sansHeavy,
    fontSize: 16,
  },
  perks: {
    gap: Spacing.two,
  },
  perk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  perkIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  perkLabel: {
    flex: 1,
    color: Colors.black,
    fontFamily: Fonts.sansBold,
    fontSize: 17,
  },
  message: {
    fontFamily: Fonts.sansBold,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.lemon,
    borderRadius: Radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeText: {
    color: Colors.black,
    fontFamily: Fonts.sansHeavy,
    fontSize: 14,
  },
});
