import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onComplete: (score: number) => void;
}

interface Flower {
  id: number;
  x: number;
  y: number;
  speed: number;
  emoji: string;
  caught: boolean;
}

const EMOJIS = ['🌸', '🌺', '🌹', '🌼', '💐', '🌷'];

export function FlowerCatcher({ onComplete }: Props) {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [popEffects, setPopEffects] = useState<{ id: number; x: number; y: number }[]>([]);
  const [combo, setCombo] = useState(0);
  const [showCombo, setShowCombo] = useState(false);
  const nextId = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameActive = timeLeft > 0;

  useEffect(() => {
    if (!gameActive) return;
    const t = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(t);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive) return;
    const t = setInterval(() => {
      const id = nextId.current++;
      setFlowers(prev => [...prev.slice(-15), {
        id,
        x: 5 + Math.random() * 85,
        y: -8,
        speed: 3 + Math.random() * 4,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        caught: false,
      }]);
    }, 600);
    return () => clearInterval(t);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive) return;
    const t = setInterval(() => {
      setFlowers(prev => prev
        .map(f => ({ ...f, y: f.y + f.speed }))
        .filter(f => f.y < 110)
      );
    }, 50);
    return () => clearInterval(t);
  }, [gameActive]);

  const catchFlower = useCallback((id: number, x: number, y: number) => {
    setFlowers(prev => prev.filter(f => f.id !== id));
    setScore(s => s + 10);
    setCombo(c => c + 1);
    setShowCombo(true);
    setTimeout(() => setShowCombo(false), 600);
    const popId = Date.now();
    setPopEffects(prev => [...prev, { id: popId, x, y }]);
    setTimeout(() => setPopEffects(prev => prev.filter(p => p.id !== popId)), 500);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      setTimeout(() => onComplete(score), 800);
    }
  }, [timeLeft, score, onComplete]);

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      {/* HUD */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 20px',
        background: 'rgba(0,0,0,0.3)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div>
          <div style={{ fontSize: '10px', color: '#8b5cf6', letterSpacing: '2px' }}>SCORE</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#ffd700' }}>{score}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#555', marginBottom: '4px' }}>CATCH THE FLOWERS!</div>
          <div style={{
            fontSize: '26px', fontWeight: '900',
            color: timeLeft <= 5 ? '#ff2d78' : '#00ff88',
            animation: timeLeft <= 5 ? 'neon-pulse 0.5s ease-in-out infinite' : 'none',
          }}>
            {timeLeft}s
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px', color: '#8b5cf6', letterSpacing: '2px' }}>COMBO</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#ff2d78' }}>x{combo}</div>
        </div>
      </div>

      {/* Game area */}
      <div
        ref={containerRef}
        style={{
          position: 'relative', height: 'calc(100% - 70px)',
          background: 'linear-gradient(180deg, rgba(139,92,246,0.05), rgba(255,45,120,0.05))',
          overflow: 'hidden',
          cursor: 'crosshair',
        }}
      >
        {flowers.map(f => (
          <button
            key={f.id}
            onClick={() => catchFlower(f.id, f.x, f.y)}
            style={{
              position: 'absolute',
              left: `${f.x}%`,
              top: `${f.y}%`,
              fontSize: '32px',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 0, lineHeight: 1,
              transform: 'translate(-50%, -50%)',
              filter: 'drop-shadow(0 0 8px rgba(255,45,120,0.6))',
              transition: 'top 0.05s linear',
            }}
          >
            {f.emoji}
          </button>
        ))}

        {/* Pop effects */}
        {popEffects.map(p => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: 'translate(-50%, -50%)',
              fontSize: '18px', fontWeight: '800',
              color: '#ffd700', pointerEvents: 'none',
              animation: 'heart-pop 0.5s ease-out forwards',
            }}
          >
            +10
          </div>
        ))}

        {/* Combo display */}
        {showCombo && combo > 2 && (
          <motion.div
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: 'absolute', top: '40%', left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '28px', fontWeight: '900', color: '#ff2d78',
              pointerEvents: 'none',
              textShadow: '0 0 20px rgba(255,45,120,0.8)',
              zIndex: 10,
            }}
          >
            {combo > 5 ? '🔥 ON FIRE!' : combo > 3 ? '⚡ COMBO!' : '✨ NICE!'}
          </motion.div>
        )}

        {/* Time up overlay */}
        {!gameActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '12px',
            }}
          >
            <div style={{ fontSize: '40px' }}>⏱️</div>
            <div style={{ fontSize: '24px', fontWeight: '800' }}>TIME'S UP!</div>
            <div style={{ fontSize: '32px', fontWeight: '900', color: '#ffd700' }}>
              {score} pts
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        {gameActive && flowers.length === 0 && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', color: '#444',
          }}>
            Tap the flowers! 🌸
          </div>
        )}
      </div>
    </div>
  );
}
