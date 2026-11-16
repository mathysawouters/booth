import { useAction, useMutation, useQuery } from 'convex/react';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, type ScrollViewInstance, StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { KidSwitcher } from '@/components/kid-switcher';
import { LeggySays } from '@/components/leggy';
import { LegendView } from '@/components/legend-view';
import { Picker } from '@/components/picker';
import { SkillPanel } from '@/components/skill-panel';
import { StreakCard } from '@/components/streak-card';
import { Body, Button, Hero, Loading, Screen } from '@/components/ui';
import { BottomTabInset, Colors, Fonts, MaxContentWidth, Spacing } from '@/constants/theme';
import { localDay } from '@/lib/day';
import { errorMessage } from '@/lib/errors';
import { successHaptic } from '@/lib/haptics';
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
  return (
    <Screen color={Colors.lemon} style={styles.welcome}>
      <LeggySays side="top" size={240} pose="waving">
        Hi, I&apos;m Leggy! Who&apos;s playing today?
      </LeggySays>
      <Button label="Add your kid" icon="add" variant="accent" onPress={() => router.push('/add-kid')} />
    </Screen>
  );
}

function KidToday({ kid, kids, onSelect }: { kid: Kid; kids: Kid[]; onSelect: (id: KidId) => void }) {
  const insets = useSafeAreaInsets();
  const day = localDay(new Date());
  const legend = useQuery(api.legends.legendToday, { kid: kid._id, day }) as Legend | null | undefined;
  const todaysLegend = useAction(api.legends.todaysLegend);
  const skipLegend = useMutation(api.legends.skipLegend);
  const [picking, setPicking] = useState(false);
  const [fresh, setFresh] = useState<Legend | null>(null);
  const [waiting, setWaiting] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [rerolling, setRerolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scroll = useRef<ScrollViewInstance>(null);

  useEffect(() => {
    if (!revealing) return;
    const timer = setTimeout(() => setRevealing(false), 1400);
    return () => clearTimeout(timer);
  }, [revealing]);

  const current = fresh !== null && legend?._id !== fresh._id ? fresh : legend;

  async function generate(choice: { mode: Mode; category: Category; minutes: number }) {
    setError(null);
    setWaiting(true);
    scroll.current?.scrollTo({ y: 0, animated: true });
    try {
      setFresh((await todaysLegend({ kid: kid._id, day, ...choice })) as Legend);
      setPicking(false);
      setRevealing(true);
      successHaptic();
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

  if (current === undefined) {
    return <Loading />;
  }

  const open = current?.status === 'open' ? current : null;
  const params = { kid: kid._id, day };
  const busy = waiting ? 'waiting' : revealing ? 'open' : null;
  const showLegend = open !== null && !picking && busy === null;

  return (
    <ScrollView
      ref={scroll}
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + BottomTabInset + Spacing.five }]}>
      <Hero color={Colors.green}>
        <LeggySays size={112} sun={Colors.lemon} pose={busy !== null ? 'thinking' : 'waving'}>
          {busy !== null
            ? "Ooh, what's inside?"
            : showLegend
              ? `Ready, ${kid.name}? Let's go!`
              : current?.status === 'done'
                ? `We did it, ${kid.name}!`
                : `What are we doing tonight, ${kid.name}?`}
        </LeggySays>
      </Hero>
      <View style={styles.body}>
        <KidSwitcher kids={kids} selected={kid._id} onSelect={onSelect} />
        <StreakCard kid={kid._id} day={day} />
        {error !== null && <Body style={styles.error}>{error}</Body>}
        {showLegend ? (
          <Animated.View entering={ZoomIn.springify().damping(14)}>
            <LegendView
              legend={open}
              name={kid.name}
              rerolling={rerolling}
              onRead={() => router.push({ pathname: '/story', params })}
              onDone={() => router.push({ pathname: '/done', params })}
              onReroll={() => reroll(open)}
              onPicker={() => setPicking(true)}
              onSkip={() => skip(open)}
            />
          </Animated.View>
        ) : (
          <Picker
            doneToday={current?.status === 'done'}
            busy={busy}
            onBack={open !== null ? () => setPicking(false) : undefined}
            onPick={generate}
          />
        )}
        <SkillPanel kid={kid._id} name={kid.name} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.paper,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  body: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  welcome: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.five,
  },
  error: {
    fontFamily: Fonts.sansBold,
  },
});
