import { AbsoluteFill, Img, useCurrentFrame } from 'remotion';

import { KID, WEEK } from '../../lib/data';
import { photo } from '../../lib/assets';
import { GhostNumeral, Hairline } from './Backdrop';
import { Carousel } from './Carousel';
import { KineticLine, Label, PullQuote, toWords } from './KineticText';
import { FloatingLeggy } from './Leggy';
import { EXPO_OUT, GLIDE, SOFT, clamp, mix, ramp, sway } from './motion';
import { COLOR, FONT, SAFE } from './theme';

export type WeekStop = { index: number; at: number };

type WeekSceneProps = { stops: WeekStop[]; exitAt: number; finaleAt?: number };

const MOVE = 18;
const dayNumber = (date: string) => date.split(' ').slice(-1)[0];

export function WeekScene({ stops, exitAt, finaleAt }: WeekSceneProps) {
  const frame = useCurrentFrame();
  const closeAt = finaleAt ?? exitAt;
  const close = ramp(frame, closeAt, closeAt + 20, GLIDE);
  const exit = ramp(frame, exitAt, exitAt + 10, SOFT);
  const position = stops.reduce((value, stop, order) => {
    if (order === 0) {
      return mix(ramp(frame, 0, stop.at, EXPO_OUT), stop.index - 2.6, stop.index);
    }
    return mix(ramp(frame, stop.at - MOVE, stop.at, GLIDE), value, stop.index);
  }, 0) + frame * 0.0012;
  const columnWidth = (1080 - SAFE.x * 2) / WEEK.length;
  const strip = ramp(frame, 4, 34);
  const activeStop = Math.max(0, stops.filter((stop) => frame >= stop.at - MOVE / 2).length - 1);
  return (
    <AbsoluteFill>
      {stops.map((stop, order) => {
        const end = stops[order + 1]?.at ?? closeAt + MOVE;
        const show = ramp(frame, stop.at - MOVE, stop.at + 6) * (1 - ramp(frame, end - MOVE, end - 4));
        if (show <= 0) {
          return null;
        }
        return (
          <GhostNumeral
            key={order}
            text={dayNumber(WEEK[stop.index].date)}
            size={760}
            color="rgba(12, 13, 11, 0.05)"
            x={1040 - show * 40 + sway(frame, 'week-ghost', 200, 20)}
            y={470}
            align="right"
            style={{ opacity: show * (1 - close) }}
          />
        );
      })}
      <div style={{ position: 'absolute', left: SAFE.x, right: SAFE.x, top: 216 }}>
        <KineticLine
          words={toWords(`${KID.name}'s week.`, 1)}
          at={2}
          out={closeAt - 4}
          size={148}
          color={COLOR.ink}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: SAFE.x,
          right: SAFE.x,
          top: 420,
          height: 110,
          opacity: 1 - close,
          transform: `translateY(${-close * 60}px)`,
        }}
      >
        {WEEK.map((day, index) => {
          const enter = ramp(frame, 6 + index * 2, 28 + index * 2);
          const active = clamp(1 - Math.abs(index - position), 0, 1);
          return (
            <div
              key={day.date}
              style={{
                position: 'absolute',
                left: index * columnWidth,
                width: columnWidth,
                top: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                fontFamily: FONT.display,
                opacity: enter * mix(active, 0.42, 1),
                transform: `translateY(${mix(enter, 30, 0)}px)`,
              }}
            >
              <Label color={COLOR.ink} size={26}>{day.weekday}</Label>
              <div style={{ fontWeight: 800, fontSize: 48, letterSpacing: '-0.04em', color: COLOR.ink, lineHeight: 1 }}>
                {dayNumber(day.date)}
              </div>
            </div>
          );
        })}
        <Hairline progress={strip} color={COLOR.inkFaint} style={{ left: 0, right: 0, top: 104 }} />
        <div
          style={{
            position: 'absolute',
            left: clamp(position, 0, WEEK.length - 1) * columnWidth + columnWidth * 0.18,
            width: columnWidth * 0.64,
            top: 100,
            height: 10,
            borderRadius: 5,
            backgroundColor: COLOR.accent,
            opacity: strip,
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 560,
          height: 620,
          opacity: 1 - close,
          transform: `translateY(${-close * 120 + sway(frame, 'carousel-y', 150, 8)}px) scale(${1 + (frame / closeAt) * 0.03 - close * 0.25})`,
        }}
      >
        <Carousel photos={WEEK.map((day) => photo(day.photo))} position={position} size={590} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 800,
          top: 900,
          opacity: ramp(frame, stops[0].at - 6, stops[0].at + 14) * (1 - close),
          transform: `translateX(${mix(ramp(frame, stops[0].at - 6, stops[0].at + 18), 140, 0)}px)`,
        }}
      >
        <FloatingLeggy pose={activeStop % 2 === 0 ? 'cheering' : 'proud'} height={330} seed="week-leggy" tilt={4} softShadow />
      </div>
      {stops.map((stop, order) => {
        const day = WEEK[stop.index];
        const end = (stops[order + 1]?.at ?? closeAt + MOVE) - MOVE + 2;
        if (frame < stop.at - 10 || frame > end + 14) {
          return null;
        }
        const enter = ramp(frame, stop.at - 8, stop.at + 14);
        const leave = ramp(frame, end, end + 10, SOFT);
        return (
          <div key={order} style={{ position: 'absolute', left: SAFE.x, right: SAFE.x, top: 1212 }}>
            <div style={{ opacity: enter * (1 - leave), transform: `translateY(${mix(enter, 24, 0)}px)` }}>
              <Label color={COLOR.inkSoft} size={28}>
                {`${day.weekday} · ${day.date} · ${day.skill}${day.level ? ` level ${day.level}` : ''}`}
              </Label>
              <div
                style={{
                  marginTop: 14,
                  fontFamily: FONT.display,
                  fontWeight: 800,
                  fontSize: 50,
                  lineHeight: 1.04,
                  letterSpacing: '-0.035em',
                  color: COLOR.ink,
                }}
              >
                {day.title}
              </div>
            </div>
            <PullQuote text={day.quote} at={stop.at - 4} out={end} size={70} style={{ marginTop: 6 }} />
          </div>
        );
      })}
      {finaleAt === undefined ? null : (
        <div style={{ position: 'absolute', left: SAFE.x, right: SAFE.x, top: 640, opacity: 1 - exit }}>
          <KineticLine words={toWords(`${WEEK.length} days.`)} at={finaleAt + 6} out={exitAt - 2} size={210} color={COLOR.ink} />
          <KineticLine
            words={toWords(`${WEEK.length} little legends.`, 1)}
            at={finaleAt + 16}
            out={exitAt}
            size={210}
            color={COLOR.ink}
            style={{ marginTop: 20, rowGap: '0.04em' }}
          />
          <div style={{ position: 'absolute', left: 600, top: 716, opacity: ramp(frame, finaleAt + 20, finaleAt + 40) }}>
            <FloatingLeggy pose="cheering" height={410} seed="finale-leggy" softShadow />
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: -230, display: 'flex', justifyContent: 'space-between' }}>
            {WEEK.map((day, index) => {
              const pop = ramp(frame, finaleAt + 4 + index * 3, finaleAt + 26 + index * 3);
              return (
                <Img
                  key={day.date}
                  src={photo(day.photo)}
                  style={{
                    width: 120,
                    height: 150,
                    objectFit: 'cover',
                    borderRadius: 28,
                    opacity: pop,
                    boxShadow: '0 18px 30px rgba(18, 22, 10, 0.2)',
                    transform: `translateY(${mix(pop, 60, 0) + sway(frame, `thumb-${index}`, 90, 8)}px) rotate(${sway(frame, `thumb-rot-${index}`, 120, 3)}deg)`,
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
}
