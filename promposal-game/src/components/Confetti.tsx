import { useEffect, useState } from 'react';

interface Piece {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  shape: 'rect' | 'circle' | 'heart';
  rotation: number;
}

const COLORS = ['#ff2d78', '#8b5cf6', '#06b6d4', '#ffd700', '#00ff88', '#ff6b35', '#fff'];

interface Props {
  count?: number;
  active?: boolean;
}

export function Confetti({ count = 50, active = true }: Props) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (!active) return;
    const shapes: Piece['shape'][] = ['rect', 'circle', 'heart'];
    const newPieces = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 10,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * 360,
    }));
    setPieces(newPieces);
  }, [count, active]);

  if (!active) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 60 }}>
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: '-20px',
            width: p.shape === 'rect' ? p.size : p.size,
            height: p.shape === 'rect' ? p.size * 0.5 : p.size,
            background: p.shape === 'heart' ? 'transparent' : p.color,
            borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'rect' ? '2px' : undefined,
            fontSize: p.shape === 'heart' ? `${p.size * 1.5}px` : undefined,
            color: p.shape === 'heart' ? p.color : undefined,
            animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in forwards`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        >
          {p.shape === 'heart' ? '❤' : ''}
        </div>
      ))}
    </div>
  );
}

export function RainEffect() {
  const drops = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 0.8 + Math.random() * 0.6,
    opacity: 0.3 + Math.random() * 0.4,
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 5 }}>
      {drops.map((d) => (
        <div
          key={d.id}
          style={{
            position: 'absolute',
            left: `${d.x}%`,
            top: '-20px',
            width: '2px',
            height: '20px',
            background: `rgba(100,150,255,${d.opacity})`,
            borderRadius: '1px',
            animation: `rain-fall ${d.duration}s ${d.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
}

export function FloatingHearts() {
  const hearts = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * 80,
    delay: Math.random() * 1.5,
    size: 16 + Math.random() * 24,
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 20 }}>
      {hearts.map((h) => (
        <div
          key={h.id}
          style={{
            position: 'absolute',
            left: `${h.x}%`,
            bottom: '20%',
            fontSize: `${h.size}px`,
            animation: `heart-pop 1.5s ${h.delay}s ease-out forwards`,
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
}
