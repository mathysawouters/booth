import { useCurrentFrame } from 'remotion';

import { COLOR } from './theme';

type ClockProps = {
  size: number;
  hour: number;
  draw: number;
};

export function Clock({ size, hour, draw }: ClockProps) {
  const frame = useCurrentFrame();
  const r = size / 2;
  const circumference = 2 * Math.PI * (r - 2);
  const minuteAngle = frame * 0.12;
  const hourAngle = hour * 30 + minuteAngle / 12;
  const secondAngle = frame * 1.6 - 40;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
      <circle
        cx={r}
        cy={r}
        r={r - 2}
        fill="none"
        stroke={COLOR.snowFaint}
        strokeWidth={2}
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - draw)}
        transform={`rotate(-90 ${r} ${r})`}
      />
      {new Array(60).fill(0).map((_, index) => {
        const major = index % 5 === 0;
        const visible = draw * 60 > index ? 1 : 0;
        return (
          <line
            key={index}
            x1={r}
            y1={major ? 26 : 30}
            x2={r}
            y2={major ? 58 : 40}
            stroke={COLOR.snow}
            strokeOpacity={(major ? 0.42 : 0.16) * visible}
            strokeWidth={major ? 3 : 2}
            strokeLinecap="round"
            transform={`rotate(${index * 6} ${r} ${r})`}
          />
        );
      })}
      <g opacity={draw}>
        <line
          x1={r}
          y1={r + r * 0.08}
          x2={r}
          y2={r - r * 0.46}
          stroke={COLOR.snow}
          strokeOpacity={0.7}
          strokeWidth={9}
          strokeLinecap="round"
          transform={`rotate(${hourAngle} ${r} ${r})`}
        />
        <line
          x1={r}
          y1={r + r * 0.1}
          x2={r}
          y2={r - r * 0.72}
          stroke={COLOR.snow}
          strokeOpacity={0.7}
          strokeWidth={6}
          strokeLinecap="round"
          transform={`rotate(${minuteAngle} ${r} ${r})`}
        />
        <line
          x1={r}
          y1={r + r * 0.16}
          x2={r}
          y2={r - r * 0.8}
          stroke={COLOR.accent}
          strokeWidth={3}
          strokeLinecap="round"
          transform={`rotate(${secondAngle} ${r} ${r})`}
        />
        <circle cx={r} cy={r} r={10} fill={COLOR.accent} />
      </g>
    </svg>
  );
}
