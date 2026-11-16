import { Img } from 'remotion';

import { clamp } from './motion';
import { COLOR, shade } from './theme';

type CarouselProps = {
  photos: string[];
  position: number;
  size: number;
  spacing?: number;
};

export function Carousel({ photos, position, size, spacing = 500 }: CarouselProps) {
  return (
    <div style={{ position: 'absolute', inset: 0, perspective: 1900 }}>
      {photos.map((src, index) => {
        const d = index - position;
        const distance = Math.abs(d);
        if (distance > 3.4) {
          return null;
        }
        const direction = Math.sign(d);
        const x = direction * (Math.min(distance, 1) * spacing + Math.max(distance - 1, 0) * spacing * 0.56);
        const z = -Math.min(distance, 3) * 300;
        const rotateY = -clamp(d, -1.5, 1.5) * 30;
        const fog = clamp(distance * 0.3, 0, 0.72);
        return (
          <div
            key={src}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2,
              borderRadius: size * 0.085,
              overflow: 'hidden',
              zIndex: 100 - Math.round(distance * 10),
              transform: `translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg)`,
              boxShadow: `0 ${size * 0.09}px ${size * 0.14}px ${-size * 0.04}px ${shade(0.4)}, 0 ${size * 0.02}px ${size * 0.04}px ${shade(0.18)}`,
              opacity: 1 - clamp(distance - 2.4, 0, 1),
              backgroundColor: COLOR.card,
            }}
          >
            <Img
              src={src}
              style={{
                position: 'absolute',
                left: '-7%',
                top: '-7%',
                width: '114%',
                height: '114%',
                objectFit: 'cover',
                transform: `translateX(${clamp(d, -2, 2) * -3}%)`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: size * 0.085,
                boxShadow: 'inset 0 0 0 2px rgba(255, 255, 255, 0.35)',
                background: 'linear-gradient(140deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 32%)',
              }}
            />
            <div style={{ position: 'absolute', inset: 0, backgroundColor: COLOR.paper, opacity: fog }} />
          </div>
        );
      })}
    </div>
  );
}
