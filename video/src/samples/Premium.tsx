import { SCREENS } from '../lib/assets';
import { WEEK } from '../lib/data';
import { type FilmPlan, PremiumFilm } from './premium/Film';

export const PREMIUM_FRAMES = 300;

const PLAN: FilmPlan = {
  frames: PREMIUM_FRAMES,
  hook: { beat: 20, exitAt: 66 },
  phone: {
    from: 72,
    exitAt: 86,
    beats: [
      {
        at: 0,
        caption: 'One legend a day.',
        chip: '10 min a day',
        ghost: '10',
        leggy: 'proud',
        screens: [
          { src: SCREENS.legend, at: 0 },
          { src: SCREENS.levelUp, at: 28 },
        ],
      },
      {
        at: 50,
        caption: 'All kept in your Book.',
        chip: `${WEEK.length} legends kept`,
        ghost: String(WEEK.length),
        leggy: 'reading',
        screens: [{ src: SCREENS.bookLong, at: 0, long: true }],
      },
    ],
  },
  week: {
    from: 158,
    exitAt: 86,
    stops: [
      { index: 2, at: 18 },
      { index: 5, at: 60 },
    ],
  },
  outro: { from: 244, builtWithAt: 30 },
};

export function Premium() {
  return <PremiumFilm plan={PLAN} />;
}
