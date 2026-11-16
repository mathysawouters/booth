import { SCREENS } from '../lib/assets';
import { WEEK } from '../lib/data';
import { type FilmPlan, PremiumFilm } from '../samples/premium/Film';

export const PREMIUM_FULL_FRAMES = 1560;

const LONG_HOLD = 84;
const SHORT_HOLD = 46;
const FIRST_STOP = 26;

const stops = WEEK.map((_, index) => ({
  index,
  at: FIRST_STOP + Math.ceil(index / 2) * LONG_HOLD + Math.floor(index / 2) * SHORT_HOLD,
}));
const finaleAt = stops[stops.length - 1].at + LONG_HOLD;
const weekExitAt = finaleAt + 84;
const WEEK_FROM = 800;

const PLAN: FilmPlan = {
  frames: PREMIUM_FULL_FRAMES,
  hook: { beat: 38, exitAt: 132 },
  phone: {
    from: 140,
    exitAt: 665,
    beats: [
      {
        at: 0,
        caption: 'One surprise every night',
        chip: 'Tonight\u2019s box',
        ghost: '1',
        confettiAt: 68,
        screens: [
          { src: SCREENS.todaySurprise, at: 0 },
          { src: SCREENS.surpriseShake, at: 38 },
          { src: SCREENS.surpriseOpen, at: 64 },
        ],
      },
      {
        at: 105,
        caption: 'A 10-minute idea made for your kid',
        chip: '10 minutes',
        ghost: '10',
        screens: [{ src: SCREENS.legendLong, at: 0, long: true }],
      },
      {
        at: 200,
        caption: 'Leggy goes first. Badly.',
        chip: 'Can you do better?',
        ghost: '?',
        leggy: 'thinking',
        screens: [{ src: SCREENS.legend, at: 0 }],
      },
      {
        at: 285,
        caption: 'Snap it. Save what they said.',
        chip: 'We did it!',
        ghost: '!',
        confettiAt: 54,
        screens: [
          { src: SCREENS.weDidIt, at: 0 },
          { src: SCREENS.celebration, at: 50 },
        ],
      },
      {
        at: 385,
        caption: 'Skills level up',
        chip: 'Level up',
        ghost: '+1',
        leggy: 'cheering',
        screens: [{ src: SCREENS.levelUp, at: 0 }],
      },
      {
        at: 455,
        caption: 'Every memory lands in the Book',
        chip: `${WEEK.length} legends kept`,
        ghost: String(WEEK.length),
        leggy: 'reading',
        screens: [{ src: SCREENS.bookLong, at: 0, long: true }],
      },
      {
        at: 560,
        caption: 'Grandma cheers live',
        chip: 'Family feed',
        ghost: 'xo',
        cheerAt: 36,
        cheer: ['🎉', '❤️', '👏', '🌟', '😂', '❤️'],
        screens: [
          { src: SCREENS.familyFeed, at: 0 },
          { src: SCREENS.familyCheer, at: 30 },
        ],
      },
    ],
  },
  week: { from: WEEK_FROM, stops, finaleAt, exitAt: weekExitAt },
  outro: { from: WEEK_FROM + weekExitAt, builtWithAt: 64 },
};

export function PremiumFull() {
  return <PremiumFilm plan={PLAN} />;
}
