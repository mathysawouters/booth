import type { GenericId } from 'convex/values';

export type KidId = GenericId<'kids'>;
export type LegendId = GenericId<'legends'>;
export type StorageId = GenericId<'_storage'>;

export type SkillName = 'brave' | 'kind' | 'curious' | 'money' | 'helper' | 'reader';
export type Mode = 'phone' | 'real';
export type Category =
  | 'bedtime'
  | 'build'
  | 'story'
  | 'outside'
  | 'kitchen'
  | 'art'
  | 'music'
  | 'skills'
  | 'calm'
  | 'surprise';
export type LegendKind = 'story' | 'adventure' | 'skill' | 'draw' | 'quiz' | 'sound';

export type Kid = {
  _id: KidId;
  name: string;
  age: number;
  interests: string[];
  note?: string;
};

export type SkillProgress = {
  skill: SkillName;
  xp: number;
  level: number;
  levelXp: number;
  nextLevelXp: number;
};

export type Legend = {
  _id: LegendId;
  _creationTime: number;
  kid: KidId;
  day: string;
  mode: Mode;
  category: Category;
  minutes: number;
  kind: LegendKind;
  title: string;
  steps: string[];
  story?: string[];
  question?: string;
  skill: SkillName;
  xp: number;
  challenge?: string;
  status: 'open' | 'done' | 'skipped';
  quote?: string;
  reaction?: string;
  levelUp?: number;
  completedAt?: number;
  photoUrl: string | null;
  challengeImageUrl: string | null;
  voiceUrl: string | null;
};

export type Cheer = { emoji: string; userName: string | null };

export type FeedLegend = Legend & {
  kidName: string;
  parentName: string | null;
  cheers: Cheer[];
};

export type CompleteResult = {
  skill: SkillName;
  xp: number;
  level: number;
  leveledUp: boolean;
};
