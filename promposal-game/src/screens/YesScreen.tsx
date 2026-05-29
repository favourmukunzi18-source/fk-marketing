import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { CharacterConfig } from '../types';
import { Character } from '../components/Character';
import { Confetti, FloatingHearts } from '../components/Confetti';

interface Props {
  maleConfig: CharacterConfig;
  femaleConfig: CharacterConfig;
  totalScore: number;
  onRestart: () => void;
}

export function YesScreen({ maleConfig, femaleConfig, totalScore, onRestart }: Props) {
  const [phase, setPhase] = useState<'flash' | 'reveal' | 'text' | 'full'>('flash');

  useEffect(() => {
    setTimeout(() => setPhase('reveal'), 600);
    setTimeout(() => setPhase('text'), 1400);
    setTimeout(() => setPhase('full'), 2800);
  }, []);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: phase === 'flash'
        ? 'white'
        : 'linear-gradient(180deg, #0a0015 0%, #1a0030 50%, #0a0015 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      overflow: 'hidden',
      transition: 'background 0.4s',
    }}>
      <Confetti count={80} active={phase !== 'flash'} />
      {phase !== 'flash' && <FloatingHearts />}

      {/* Background hearts */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${20 + Math.random() * 30}px`,
            opacity: 0.05 + Math.random() * 0.1,
            animation: `float ${3 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}>❤️</div>
        ))}
      </div>

      {/* Characters */}
      {phase !== 'flash' && (
        <div style={{
          position: 'absolute', bottom: 0,
          display: 'flex', alignItems: 'flex-end',
          justifyContent: 'center',
          width: '100%',
        }}>
          <motion.div
            initial={{ x: '-80%', opacity: 0 }}
            animate={{ x: '0%', opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.3 }}
          >
            <Character config={maleConfig} gender="male" size={140} animate />
          </motion.div>
          <motion.div
            initial={{ x: '80%', opacity: 0 }}
            animate={{ x: '0%', opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.3 }}
          >
            <Character config={femaleConfig} gender="female" size={140} animate />
          </motion.div>
        </div>
      )}

      {/* Main text */}
      {(phase === 'text' || phase === 'full') && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{
            marginTop: '60px', textAlign: 'center', padding: '0 20px', zIndex: 10,
          }}
        >
          <div style={{ fontSize: '14px', letterSpacing: '4px', color: '#8b5cf6', marginBottom: '8px' }}>
            🎉 ACHIEVEMENT UNLOCKED 🎉
          </div>
          <div style={{
            fontSize: '52px', fontWeight: '900',
            background: 'linear-gradient(135deg, #ff2d78, #ffd700, #ff2d78)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: '1.1',
            animation: 'text-glow 1.5s ease-in-out infinite',
          }}>
            PROM<br />SECURED.
          </div>
          <div style={{ fontSize: '40px', marginTop: '8px' }}>💖</div>
        </motion.div>
      )}

      {phase === 'full' && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              background: 'linear-gradient(135deg, rgba(255,45,120,0.15), rgba(139,92,246,0.15))',
              border: '1px solid rgba(255,45,120,0.4)',
              borderRadius: '16px', padding: '14px 20px',
              margin: '16px 20px 0', textAlign: 'center', zIndex: 10,
            }}
          >
            <div style={{ fontSize: '13px', color: '#e2d4ff', lineHeight: '1.6' }}>
              "I made an entire game just to ask you.<br />
              You literally carried the whole vibe.<br />
              Now please carry my prom season too. 💕"
            </div>
            <div style={{ marginTop: '10px', fontSize: '13px', color: '#666' }}>
              🏆 Final Score: <span style={{ color: '#ffd700', fontWeight: '700' }}>{totalScore} pts</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            style={{
              position: 'absolute', bottom: '310px',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '8px', zIndex: 20,
            }}
          >
            <div style={{ fontSize: '28px', animation: 'heart-beat 0.8s ease-in-out infinite' }}>💖</div>
            <div style={{ fontSize: '11px', color: '#555', letterSpacing: '2px' }}>
              IT'S GIVING PROM ROYALTY
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRestart}
            style={{
              position: 'absolute', bottom: '270px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '12px', padding: '10px 24px',
              color: '#666', fontSize: '12px',
              cursor: 'pointer', zIndex: 20,
            }}
          >
            Play Again 🔄
          </motion.button>
        </>
      )}
    </div>
  );
}
