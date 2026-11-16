import { SCREENS } from '../lib/assets';
import { WEEK } from '../lib/data';
import { Doodle, burst } from '../samples/scrapbook/Doodles';
import { Book, bookFrames, type BookPage } from '../samples/scrapbook/PageTurn';
import { AppPage, DayPage, HookPage, OutroPage, WeekCollage } from '../samples/scrapbook/Scenes';
import { RubberStamp } from '../samples/scrapbook/Text';
import { EmojiBurst } from '../samples/scrapbook/Bits';
import { C } from '../samples/scrapbook/theme';
import { Handwriting } from '../samples/scrapbook/Text';

const DAY = 58;

const PAGES: BookPage[] = [
  { length: 150, node: <HookPage step={40} />, backColor: '#F6E9C8' },
  {
    length: 130,
    backColor: '#FFF1A8',
    node: (
      <AppPage
        length={130}
        color={C.yellow}
        pattern="dots"
        accent={C.mint}
        pose="cheering"
        confettiAt={86}
        slides={[
          { src: SCREENS.todaySurprise, at: 0 },
          { src: SCREENS.surpriseShake, at: 44 },
          { src: SCREENS.surpriseOpen, at: 82 },
        ]}
        captions={[{ text: 'One surprise every night', from: 0 }]}
      />
    ),
  },
  {
    length: 90,
    backColor: '#BFF2E2',
    node: (
      <AppPage
        length={90}
        slides={[{ src: SCREENS.legendLong, at: 0, scroll: 1400, scrollFrames: 80 }]}
        captions={[{ text: 'A 10-minute idea made for your kid', from: 0 }]}
      />
    ),
  },
  {
    length: 80,
    backColor: '#FFC9E1',
    node: (
      <AppPage
        length={80}
        color={C.pink}
        pattern="confetti"
        accent={C.yellow}
        pose="thinking"
        slides={[{ src: SCREENS.legend, at: 0 }]}
        captions={[{ text: 'Leggy goes first. Badly.', from: 0 }]}
        extra={
          <>
            <Handwriting lines={['Oops!']} size={130} at={14} color="#C2183F" rotate={-10} style={{ left: 110, top: 1560 }} />
            <Doodle {...burst()} width={200} progress={0.9} color="#C2183F" weight={9} style={{ left: 380, top: 1560 }} />
          </>
        }
      />
    ),
  },
  {
    length: 90,
    backColor: '#D3F5A6',
    node: (
      <AppPage
        length={90}
        color={C.lime}
        pattern="dots"
        accent={C.yellow}
        pose="cheering"
        confettiAt={46}
        slides={[
          { src: SCREENS.weDidIt, at: 0 },
          { src: SCREENS.celebration, at: 44 },
        ]}
        captions={[{ text: 'Snap it. Save what they said.', from: 0 }]}
      />
    ),
  },
  {
    length: 70,
    backColor: '#FFF1A8',
    node: (
      <AppPage
        length={70}
        color={C.yellow}
        pattern="confetti"
        accent={C.pink}
        pose="proud"
        confettiAt={10}
        slides={[{ src: SCREENS.levelUp, at: 0 }]}
        captions={[{ text: 'Skills level up', from: 0 }]}
        extra={<RubberStamp text="Brave level 2!" at={22} size={52} rotate={-10} style={{ left: 100, top: 1480 }} />}
      />
    ),
  },
  {
    length: 100,
    backColor: '#FFC9E1',
    node: (
      <AppPage
        length={100}
        color={C.pink}
        pattern="dots"
        accent={C.mint}
        pose="reading"
        slides={[{ src: SCREENS.bookLong, at: 0, scroll: 1500, scrollFrames: 86 }]}
        captions={[{ text: 'Every memory lands in the Book', from: 0 }]}
      />
    ),
  },
  {
    length: 100,
    backColor: '#BFF2E2',
    node: (
      <AppPage
        length={100}
        pose="waving"
        accent={C.yellow}
        slides={[
          { src: SCREENS.familyFeed, at: 0 },
          { src: SCREENS.familyCheer, at: 40 },
        ]}
        captions={[{ text: 'Grandma cheers live', from: 0 }]}
        extra={<EmojiBurst emojis={['\u2764\uFE0F', '\uD83C\uDF89', '\uD83D\uDC4F', '\uD83C\uDF1F', '\uD83D\uDE02']} at={46} origin={[600, 900]} count={9} size={130} />}
      />
    ),
  },
  ...WEEK.map(
    (day, index): BookPage => ({
      length: DAY,
      backColor: '#FFF1C2',
      node: <DayPage day={day} index={index} length={DAY} />,
    }),
  ),
  { length: 90, node: <WeekCollage step={6} />, backColor: '#FFF1A8' },
  { length: 150, node: <OutroPage /> },
];

export const SCRAPBOOK_FULL_FRAMES = bookFrames(PAGES);

export function ScrapbookFull() {
  return <Book pages={PAGES} turn={18} />;
}
