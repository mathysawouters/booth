import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from 'convex/react';
import { StyleSheet, Text, View } from 'react-native';

import { Card, ProgressBar } from '@/components/ui';
import { Colors, Fonts, Radius, SKILL_TONE, Spacing, Tones } from '@/constants/theme';
import { SKILLS } from '@/lib/legends';
import type { KidId, SkillName, SkillProgress } from '@/lib/types';
import { api } from '../../convex/_generated/api';

export function SkillPanel({ kid, name, highlight }: { kid: KidId; name: string; highlight?: SkillName }) {
  const skills = useQuery(api.kids.kidSkills, { kid }) as SkillProgress[] | undefined;
  if (skills === undefined) {
    return null;
  }
  return (
    <Card style={styles.card}>
      <Text style={styles.heading}>{name}&apos;s skills</Text>
      {skills.map((s) => {
        const tone = Tones[SKILL_TONE[s.skill]];
        return (
          <View key={s.skill} style={[styles.row, s.skill === highlight && { backgroundColor: tone.soft }]}>
            <View style={[styles.icon, { backgroundColor: tone.face, borderColor: tone.edge }]}>
              <Ionicons name={SKILLS[s.skill].icon} size={20} color={Colors.black} />
            </View>
            <View style={styles.info}>
              <View style={styles.labels}>
                <Text style={styles.name}>{SKILLS[s.skill].label}</Text>
                <Text style={styles.level}>Level {s.level}</Text>
              </View>
              <ProgressBar
                progress={s.nextLevelXp > 0 ? s.levelXp / s.nextLevelXp : 0}
                color={tone.face}
                track={s.skill === highlight ? Colors.white : tone.soft}
                height={14}
              />
            </View>
          </View>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 6,
    padding: Spacing.three,
  },
  heading: {
    color: Colors.black,
    fontFamily: Fonts.display,
    fontSize: 22,
    paddingHorizontal: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: Spacing.two,
    borderRadius: Radius.field,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderBottomWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 5,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  name: {
    color: Colors.black,
    fontFamily: Fonts.display,
    fontSize: 17,
  },
  level: {
    color: Colors.gray,
    fontFamily: Fonts.sansHeavy,
    fontSize: 13,
  },
});
