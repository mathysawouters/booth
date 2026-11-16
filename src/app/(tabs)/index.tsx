import { useAction, useMutation, useQuery } from 'convex/react';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { ScrollView, type ScrollViewInstance, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { KidSwitcher } from '@/components/kid-switcher';
import { Leggy, LeggySays } from '@/components/leggy';
import { LegendView } from '@/components/legend-view';
import { Picker } from '@/components/picker';
import { SkillPanel } from '@/components/skill-panel';
import { StreakSign } from '@/components/streak-sign';
import { TonightCard } from '@/components/tonight-card';
import { Body, Button, Hero, Loading, Screen } from '@/components/ui';
import { BottomTabInset, Colors, Fonts, MaxContentWidth, Spacing } from '@/constants/theme';
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
  return (
    <Screen style={styles.welcome}>
      <LeggySays side="top" size={240} pose="waving">
        Hi, I&apos;m Leggy! Who&apos;s playing today?
      </LeggySays>
      <Button label="Add your kid" icon="add" variant="accent" onPress={() => router.push('/add-kid')} />
    </Screen>
  );
}

function KidToday({ kid, kids, onSelect }: { kid: Kid; kids: Kid[]; onSelect: (id: KidId) => void }) {
  const insets = useSafeAreaInsets();
  const column = Math.min(useWindowDimensions().width, MaxContentWidth);
  const day = localDay(new Date());
  const legend = useQuery(api.legends.legendToday, { kid: kid._id, day }) as Legend | null | undefined;
  const todaysLegend = useAction(api.legends.todaysLegend);
  const skipLegend = useMutation(api.legends.skipLegend);
  const [mode, setMode] = useState<Mode>('real');
  const [started, setStarted] = useState(false);
  const [fresh, setFresh] = useState<Legend | null>(null);
  const [waiting, setWaiting] = useState(false);
  const [rerolling, setRerolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scroll = useRef<ScrollViewInstance>(null);

  const current = fresh !== null && legend?._id !== fresh._id ? fresh : legend;

  async function generate(choice: { mode: Mode; category: Category; minutes: number }) {
    setError(null);
    setWaiting(true);
    setStarted(false);
    scroll.current?.scrollTo({ y: 0, animated: true });
    try {
      setFresh((await todaysLegend({ kid: kid._id, day, ...choice })) as Legend);
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
      setStarted(false);
    } catch (e) {
      setError(errorMessage(e));
    }
  }

  if (current === undefined) {
    return <Loading />;
  }

  const open = current?.status === 'open' ? current : null;
  const params = { kid: kid._id, day };

  return (
    <ScrollView
      ref={scroll}
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + BottomTabInset + Spacing.five }]}>
      <Hero style={[styles.hero, { minHeight: column * 0.84 + 28 }]}>
        <Text style={styles.title}>Today with {kid.name}</Text>
        <View style={[styles.scene, { paddingLeft: column * 0.13 }]}>
          <Leggy size={column * 0.42} pose={waiting ? 'thinking' : current?.status === 'done' ? 'cheering' : 'waving'} />
          <StreakSign kid={kid._id} day={day} width={column * 0.27} />
        </View>
      </Hero>
      <View style={styles.body}>
        <KidSwitcher kids={kids} selected={kid._id} onSelect={onSelect} />
        {error !== null && <Body style={styles.error}>{error}</Body>}
        {open !== null && started && !waiting ? (
          <Animated.View entering={ZoomIn.springify().damping(14)}>
            <LegendView
              legend={open}
              name={kid.name}
              rerolling={rerolling}
              onRead={() => router.push({ pathname: '/story', params })}
              onDone={() => router.push({ pathname: '/done', params })}
              onReroll={() => reroll(open)}
              onPicker={() => setStarted(false)}
              onSkip={() => skip(open)}
            />
          </Animated.View>
        ) : (
          <>
            <TonightCard
              legend={waiting ? null : open}
              waiting={waiting}
              onUnwrap={() => generate({ mode, category: 'surprise', minutes: 15 })}
              onStart={() => setStarted(true)}
            />
            {!waiting && (
              <Picker doneToday={current?.status === 'done'} mode={mode} onMode={setMode} onPick={generate} />
            )}
          </>
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
  hero: {
    justifyContent: 'space-between',
    paddingBottom: 28 + Spacing.two,
  },
  title: {
    marginTop: Spacing.four,
    color: Colors.white,
    fontFamily: Fonts.displayBold,
    fontSize: 36,
    lineHeight: 42,
    textAlign: 'center',
    textShadowColor: 'rgba(27, 42, 18, 0.28)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  scene: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  body: {
    paddingHorizontal: Spacing.four,
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
