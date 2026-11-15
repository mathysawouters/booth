import { useAction, useMutation, useQuery } from 'convex/react';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { KidSwitcher } from '@/components/kid-switcher';
import { Leggy } from '@/components/leggy';
import { LeggyWaiting } from '@/components/leggy-waiting';
import { LegendView } from '@/components/legend-view';
import { Picker } from '@/components/picker';
import { Body, Button, Loading, Title } from '@/components/ui';
import { BottomTabInset, Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { localDay } from '@/lib/day';
import { errorMessage } from '@/lib/errors';
import { useKids } from '@/lib/kids';
import type { Category, Kid, KidId, Legend, Mode } from '@/lib/types';
import { api } from '../../../convex/_generated/api';

export default function TodayScreen() {
  const { kids, kid, select } = useKids();

  if (kids === undefined) {
    return <Loading />;
  }
  if (kid === null) {
    return <Welcome />;
  }
  return <KidToday key={kid._id} kid={kid} kids={kids} onSelect={select} />;
}

function Welcome() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, styles.welcome, { paddingTop: insets.top + Spacing.five }]}>
      <Leggy size={180} />
      <Title style={styles.centerText}>Hi, I&apos;m Leggy!</Title>
      <Body muted style={styles.centerText}>
        Tell me about your kid and I&apos;ll find one fun thing to do together every day.
      </Body>
      <Button label="Add your kid" icon="add" variant="accent" onPress={() => router.push('/add-kid')} />
    </View>
  );
}

function KidToday({ kid, kids, onSelect }: { kid: Kid; kids: Kid[]; onSelect: (id: KidId) => void }) {
  const insets = useSafeAreaInsets();
  const day = localDay(new Date());
  const legend = useQuery(api.legends.legendToday, { kid: kid._id, day }) as Legend | null | undefined;
  const streak = useQuery(api.kids.streak, { kid: kid._id, day }) as number | undefined;
  const todaysLegend = useAction(api.legends.todaysLegend);
  const skipLegend = useMutation(api.legends.skipLegend);
  const [picking, setPicking] = useState(false);
  const [fresh, setFresh] = useState<Legend | null>(null);
  const [waiting, setWaiting] = useState(false);
  const [rerolling, setRerolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const current = fresh !== null && legend?._id !== fresh._id ? fresh : legend;

  async function generate(choice: { mode: Mode; category: Category; minutes: number }) {
    setError(null);
    setWaiting(true);
    try {
      setFresh((await todaysLegend({ kid: kid._id, day, ...choice })) as Legend);
      setPicking(false);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setWaiting(false);
    }
  }

  async function reroll(open: Legend) {
    setError(null);
    setRerolling(true);
    try {
      setFresh(
        (await todaysLegend({
          kid: kid._id,
          day,
          mode: open.mode,
          category: open.category,
          minutes: open.minutes,
          reroll: true,
        })) as Legend,
      );
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setRerolling(false);
    }
  }

  async function skip(open: Legend) {
    setError(null);
    try {
      await skipLegend({ legend: open._id });
      setFresh(null);
    } catch (e) {
      setError(errorMessage(e));
    }
  }

  if (waiting) {
    return <LeggyWaiting />;
  }
  if (current === undefined) {
    return <Loading />;
  }

  const open = current?.status === 'open' ? current : null;
  const params = { kid: kid._id, day };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + Spacing.three, paddingBottom: insets.bottom + BottomTabInset + Spacing.five },
      ]}>
      <KidSwitcher kids={kids} selected={kid._id} onSelect={onSelect} />
      {error !== null && <Body style={styles.error}>{error}</Body>}
      {open !== null && !picking ? (
        <LegendView
          legend={open}
          rerolling={rerolling}
          onRead={() => router.push({ pathname: '/story', params })}
          onDone={() => router.push({ pathname: '/done', params })}
          onReroll={() => reroll(open)}
          onPicker={() => setPicking(true)}
          onSkip={() => skip(open)}
        />
      ) : (
        <Picker
          streak={streak}
          doneToday={current?.status === 'done'}
          onBack={open !== null ? () => setPicking(false) : undefined}
          onPick={generate}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  welcome: {
    alignItems: 'center',
    gap: Spacing.four,
    paddingHorizontal: Spacing.four,
  },
  centerText: {
    textAlign: 'center',
  },
  error: {
    fontWeight: '700',
  },
});
