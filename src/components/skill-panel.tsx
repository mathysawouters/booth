import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from 'convex/react';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { SKILLS } from '@/lib/legends';
import type { KidId, SkillName, SkillProgress } from '@/lib/types';
import { api } from '../../convex/_generated/api';

export function SkillPanel({ kid, name, highlight }: { kid: KidId; name: string; highlight?: SkillName }) {
  const skills = useQuery(api.kids.kidSkills, { kid }) as SkillProgress[] | undefined;
  if (skills === undefined) {
    return null;
  }
  return (
    <Card>
      <Text style={styles.heading}>{name}&apos;s skills</Text>
      {skills.map((s) => {
        const progress = s.nextLevelXp > 0 ? Math.min(1, s.levelXp / s.nextLevelXp) : 0;
        const active = s.skill === highlight;
        return (
          <View key={s.skill} style={styles.row}>
            <View style={[styles.icon, active && styles.iconActive]}>
              <Ionicons name={SKILLS[s.skill].icon} size={20} color={Colors.black} />
            </View>
            <View style={styles.info}>
              <View style={styles.labels}>
                <Text style={styles.name}>{SKILLS[s.skill].label}</Text>
                <Text style={styles.level}>Level {s.level}</Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${progress * 100}%` }]} />
              </View>
            </View>
          </View>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  heading: {
    color: Colors.black,
    fontFamily: Fonts.sans,
    fontSize: 24,
    fontWeight: '900',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconActive: {
    backgroundColor: Colors.green,
    borderColor: Colors.green,
  },
  info: {
    flex: 1,
    gap: 6,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    color: Colors.black,
    fontFamily: Fonts.sans,
    fontSize: 17,
    fontWeight: '800',
  },
  level: {
    color: Colors.gray,
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '700',
  },
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.soft,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: Colors.green,
  },
});
