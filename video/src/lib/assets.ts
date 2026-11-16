import { staticFile } from 'remotion';

import categoryArt from '../../../assets/illustrations/category-art.png';
import categoryBedtime from '../../../assets/illustrations/category-bedtime.png';
import categoryBuild from '../../../assets/illustrations/category-build.png';
import categoryCalm from '../../../assets/illustrations/category-calm.png';
import categoryKitchen from '../../../assets/illustrations/category-kitchen.png';
import categoryMusic from '../../../assets/illustrations/category-music.png';
import categoryOutside from '../../../assets/illustrations/category-outside.png';
import categorySkills from '../../../assets/illustrations/category-skills.png';
import categoryStory from '../../../assets/illustrations/category-story.png';
import categorySurprise from '../../../assets/illustrations/category-surprise.png';
import leggyCheering from '../../../assets/illustrations/leggy-cheering.png';
import leggyProud from '../../../assets/illustrations/leggy-proud.png';
import leggyReading from '../../../assets/illustrations/leggy-reading.png';
import leggySleeping from '../../../assets/illustrations/leggy-sleeping.png';
import leggyThinking from '../../../assets/illustrations/leggy-thinking.png';
import leggyWaving from '../../../assets/illustrations/leggy-waving.png';

export const LEGGY = {
  waving: { src: leggyWaving, width: 452, height: 768 },
  thinking: { src: leggyThinking, width: 356, height: 768 },
  reading: { src: leggyReading, width: 469, height: 768 },
  sleeping: { src: leggySleeping, width: 621, height: 768 },
  cheering: { src: leggyCheering, width: 533, height: 768 },
  proud: { src: leggyProud, width: 457, height: 768 },
} as const;

export type LeggyPose = keyof typeof LEGGY;

export const CATEGORY_ART = {
  art: categoryArt,
  bedtime: categoryBedtime,
  build: categoryBuild,
  calm: categoryCalm,
  kitchen: categoryKitchen,
  music: categoryMusic,
  outside: categoryOutside,
  skills: categorySkills,
  story: categoryStory,
  surprise: categorySurprise,
} as const;

export const SCREEN_WIDTH = 1170;
export const SCREEN_HEIGHT = 2532;

export const SCREENS = {
  welcome: staticFile('screens/welcome.webp'),
  todaySurprise: staticFile('screens/today-surprise.webp'),
  surpriseShake: staticFile('screens/surprise-shake.webp'),
  surpriseOpen: staticFile('screens/surprise-open.webp'),
  revealed: staticFile('screens/revealed.webp'),
  tonight: staticFile('screens/tonight.webp'),
  tonightLong: staticFile('screens/tonight-long.webp'),
  legend: staticFile('screens/legend.webp'),
  legendLong: staticFile('screens/legend-long.webp'),
  weDidIt: staticFile('screens/we-did-it.webp'),
  celebration: staticFile('screens/celebration.webp'),
  levelUp: staticFile('screens/level-up.webp'),
  today: staticFile('screens/today.webp'),
  book: staticFile('screens/book.webp'),
  bookLong: staticFile('screens/book-long.webp'),
  family: staticFile('screens/family.webp'),
  familyFeed: staticFile('screens/family-feed.webp'),
  familyCheer: staticFile('screens/family-cheer.webp'),
  familyLong: staticFile('screens/family-long.webp'),
} as const;

export const photo = (name: string) => staticFile(`photos/${name}.jpg`);
