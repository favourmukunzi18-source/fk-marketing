import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { CharacterConfig } from '../types';
import { Character } from '../components/Character';
import { RainEffect } from '../components/Confetti';

interface Props {
  maleConfig: CharacterConfig;
  onRestart: () => void;
}

const NARRATOR_LINES = [
  "Rejected in 4K Ultra HD.",
  "This is not a drill.",
  "The villain arc has officially started.",
  "Game Over. For real this time.",
];

export function NoScreen({ maleConfig, onRestart }: Props) {
  const [phase, setPhase] = useState<'initial' | 'grey' | 'rain' | 'lines' | 'gameover'>('initial');
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [greyLevel, setGreyLevel] = useState(0);

  useEffect(() => {
    setTimeout(() => setPhase('grey'), 300);
    setTimeout(() => setPhase('rain'), 1000);
    setTimeout(() => setPhase('lines'), 1800);
    NARRATOR_LINES.forEach((_, i) => {
      setTimeout(() => setVisibleLines(prev => [...prev, i]), 2200 + i * 1200);
    });
    setTimeout(() => setPhase('gameover'), 2200 + NARRATOR_LINES.length * 1200 + 600);
  }, []);

  useEffect(() => {
    if (phase === 'grey') {
      const t = setInterval(() => {
        setGreyLevel(g => {
          if (g >= 100) { clearInterval(t); return 100; }
          return g + 5;
        });
      }, 30);
      return () => clearInterval(t);
    }
  }, [phase]);

  const greyStyle = greyLevel > 0 ? `grayscale(${greyLevel}%)` : 'none';

  const sadMale: CharacterConfig = {
    ...maleConfig,
    outfitColor: '#2a2a2a',
    hairColor: '#1a1a1a',
  };

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, #060606, #0a0a0a)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      filter: greyStyle,
      transition: 'filter 0.5s',
    }}>
      {phase !== 'initial' && <RainEffect />}

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)',
        zIndex: 2,
      }} />

      {/* Character */}
      <motion.div
        animate={phase === 'grey' ? { y: 0, opacity: 0.5 } : { y: 0, opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{
          position: 'absolute', bottom: 0, left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          filter: phase !== 'initial' ? 'saturate(0)' : 'none',
          transition: 'filter 2s',
        }}
      >
        <div style={{ animation: 'float 4s ease-in-out infinite', animationDelay: '0.5s' }}>
          <Character config={sadMale} gender="male" size={140} />
        </div>
      </motion.div>

      {/* Content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '80px',
        zIndex: 10, padding: '80px 24px 320px',
      }}>
        {phase !== 'initial' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', marginBottom: '24px' }}
          >
            <div style={{
              fontSize: '64px',
              animation: 'float 2s ease-in-out infinite',
              filter: 'drop-shadow(0 0 20px rgba(100,150,255,0.5))',
            }}>💔</div>
          </motion.div>
        )}

        {phase === 'gameover' && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 2 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              style={{
                textAlign: 'center', marginBottom: '20px',
                padding: '20px',
                background: 'rgba(0,0,0,0.6)',
                border: '2px solid rgba(255,255,255,0.1)',
                borderRadius: '20px',
                width: '100%',
              }}
            >
              <div style={{
                fontSize: '12px', color: '#ff2d78',
                letterSpacing: '4px', marginBottom: '6px',
              }}>
                ▶ GAME OVER ◀
              </div>
              <div style={{
                fontSize: '38px', fontWeight: '900',
                color: '#aaa',
                lineHeight: '1.2',
              }}>
                REJECTED
              </div>
              <div style={{
                fontSize: '14px', color: '#555',
                marginTop: '4px',
              }}>
                4K · Ultra HD · Dolby Sadness™
              </div>
            </motion.div>

            {/* Narrator lines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
              {visibleLines.map(i => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    color: i === 0 ? '#aaa' : '#555',
                    fontStyle: 'italic',
                    fontWeight: i === 0 ? '700' : '400',
                  }}
                >
                  🎮 {NARRATOR_LINES[i]}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              style={{ width: '100%', marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}
            >
              <div style={{
                textAlign: 'center', fontSize: '12px', color: '#333',
                fontFamily: 'monospace',
              }}>
                * * * END SCREEN * * *
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRestart}
                style={{
                  width: '100%', padding: '16px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '14px', color: '#666',
                  fontSize: '16px', fontWeight: '700',
                  cursor: 'pointer', letterSpacing: '1px',
                }}
              >
                Try Again 🔄
              </motion.button>

              <div style={{
                textAlign: 'center', fontSize: '11px', color: '#222',
                fontStyle: 'italic',
              }}>
                "The real game over was the nos we collected along the way."
              </div>
            </motion.div>
          </>
        )}

        {phase === 'lines' && !visibleLines.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ fontSize: '40px' }}
          >
            ⏳
          </motion.div>
        )}

        {/* Progressive narrator lines before gameover */}
        {phase === 'lines' && visibleLines.map(i => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 2 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              fontSize: i === 0 ? '24px' : '16px',
              color: '#555', textAlign: 'center',
              fontWeight: i === 0 ? '800' : '400',
              marginBottom: '8px',
            }}
          >
            {NARRATOR_LINES[i]}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
