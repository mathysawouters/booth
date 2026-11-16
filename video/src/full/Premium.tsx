import { SCREENS } from '../lib/assets';
import { WEEK } from '../lib/data';
import { type FilmPlan, PremiumFilm } from '../samples/premium/Film';

const HOLD = 114;
const stops = [0, 2, 4, 6].map((index, order) => ({ index, at: 24 + order * HOLD }));
const finaleAt = stops[stops.length - 1].at + HOLD;
const weekExitAt = finaleAt + 100;
const PHONE_FROM = 282;
const WEEK_FROM = PHONE_FROM + 1080;
const OUTRO_FROM = WEEK_FROM + weekExitAt;

export const PREMIUM_FULL_FRAMES = OUTRO_FROM + 205;

const PLAN: FilmPlan = {
  frames: PREMIUM_FULL_FRAMES,
  hook: { beat: 84, exitAt: 282 },
  phone: {
    from: PHONE_FROM,
    exitAt: 1080,
    beats: [
      {
        at: 0,
        caption: "Tonight's legend: one surprise activity, made for your kid",
        chip: 'One a night',
        ghost: '1',
        confettiAt: 108,
        screens: [
          { src: SCREENS.todaySurprise, at: 0 },
          { src: SCREENS.legendPhoto, at: 104 },
        ],
      },
      {
        at: 180,
        caption: 'Do it together, phone down',
        chip: '10 minutes',
        ghost: '10',
        leggy: 'thinking',
        screens: [{ src: SCREENS.legendLong, at: 0, long: 5700 }],
      },
      {
        at: 360,
        caption: 'Snap a photo, Leggy cheers',
        chip: 'We did it!',
        ghost: '!',
        leggy: 'cheering',
        confettiAt: 96,
        screens: [
          { src: SCREENS.weDidIt, at: 0 },
          { src: SCREENS.celebration, at: 90 },
        ],
      },
      {
        at: 540,
        caption: 'A skill levels up',
        chip: 'Level up',
        ghost: '+1',
        leggy: 'proud',
        screens: [{ src: SCREENS.levelUp, at: 0 }],
      },
      {
        at: 720,
        caption: 'A book of your kid growing up',
        chip: `${WEEK.length} legends kept`,
        ghost: String(WEEK.length),
        leggy: 'reading',
        screens: [{ src: SCREENS.bookLong, at: 0, long: 6000 }],
      },
      {
        at: 900,
        caption: 'Grandma cheers live',
        chip: 'Family feed',
        ghost: 'xo',
        cheerAt: 84,
        cheer: ['🎉', '❤️', '👏', '🌟', '😂', '❤️'],
        screens: [
          { src: SCREENS.familyFeed, at: 0 },
          { src: SCREENS.familyCheer, at: 80 },
        ],
      },
    ],
  },
  week: { from: WEEK_FROM, stops, finaleAt, exitAt: weekExitAt },
  outro: { from: OUTRO_FROM, builtWithAt: 100 },
};

export function PremiumFull() {
  return <PremiumFilm plan={PLAN} />;
}
