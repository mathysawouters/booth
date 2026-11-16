import { SCREENS } from '../lib/assets';
import { WEEK } from '../lib/data';
import { AppPage, DayPage, HookPage, OutroPage, WeekCollage } from './scrapbook/Scenes';
import { Book, bookFrames, type BookPage } from './scrapbook/PageTurn';

const PAGES: BookPage[] = [
  { length: 64, node: <HookPage step={14} />, backColor: '#F6E9C8' },
  {
    length: 78,
    backColor: '#BFF2E2',
    node: (
      <AppPage
        length={78}
        confettiAt={30}
        slides={[
          { src: SCREENS.legend, at: 0 },
          { src: SCREENS.bookLong, at: 40, scroll: 520, scrollFrames: 36 },
        ]}
        captions={[
          { text: 'Tonight: one fun idea', from: 0, to: 40 },
          { text: 'Every memory, saved', from: 40 },
        ]}
      />
    ),
  },
  { length: 40, node: <DayPage day={WEEK[2]} index={2} length={40} />, backColor: '#FFF1C2' },
  { length: 58, node: <WeekCollage step={4} />, backColor: '#FFF1A8' },
  { length: 45, node: <OutroPage /> },
];

export const SCRAPBOOK_FRAMES = bookFrames(PAGES);

export function Scrapbook() {
  return <Book pages={PAGES} turn={18} />;
}
