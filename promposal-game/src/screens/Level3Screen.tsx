import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Props {
  totalScore: number;
  onComplete: () => void;
}

const NARRATOR_LINES = [
  { text: "Okay wait… why is this getting wholesome?", delay: 800, color: '#8b5cf6' },
  { text: "This is starting to feel intentional.", delay: 2400, color: '#8b5cf6' },
  { text: "Bro might actually like somebody.", delay: 4200, color: '#ff2d78' },
  { text: "Uh oh.", delay: 5800, color: '#ff2d78' },
  { text: "Hold on. The fit customization. The flower catching.", delay: 7200, color: '#ffd700' },
  { text: "Wait. This game was made for someone specific?", delay: 9000, color: '#ffd700' },
  { text: "This may actually be cinema.", delay: 10800, color: '#06b6d4' },
  { text: "I can't believe I'm saying this but…", delay: 12400, color: '#06b6d4' },
  { text: "I think we're not playing a game anymore.", delay: 14000, color: '#ff2d78' },
];

export function Level3Screen({ totalScore, onComplete }: Props) {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [glitching, setGlitching] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [cinematicMode, setCinematicMode] = useState(false);

  useEffect(() => {
    NARRATOR_LINES.forEach(({ delay }, i) => {
      const t = setTimeout(() => setVisibleLines(prev => [...prev, i]), delay);
      return () => clearTimeout(t);
    });

    const glitchTimes = [3000, 6500, 10500];
    const glitchTimers = glitchTimes.map(delay =>
      setTimeout(() => {
        setGlitching(true);
        setTimeout(() => setGlitching(false), 400);
      }, delay)
    );

    const cinematic = setTimeout(() => setCinematicMode(true), 11000);
    const cont = setTimeout(() => setShowContinue(true), 15500);

    return () => {
      glitchTimers.forEach(clearTimeout);
      clearTimeout(cinematic);
      clearTimeout(cont);
    };
  }, []);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: cinematicMode
        ? 'linear-gradient(180deg, #000005 0%, #080010 50%, #000005 100%)'
        : 'linear-gradient(180deg, #0a0015 0%, #150025 100%)',
      transition: 'background 2s',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Cinematic letterbox bars */}
      {cinematicMode && (
        <>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: '50px' }}
            transition={{ duration: 0.8 }}
            style={{ background: 'black', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20 }}
          />
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: '50px' }}
            transition={{ duration: 0.8 }}
            style={{ background: 'black', position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20 }}
          />
        </>
      )}

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
        zIndex: 1,
      }} />

      {/* Scanlines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)',
        opacity: glitching ? 0.8 : 0,
        transition: 'opacity 0.1s',
      }} />

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        padding: '70px 24px 70px',
        zIndex: 5, overflowY: 'auto',
        position: 'relative',
      }}>
        {/* Title */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: '32px' }}
          animate={glitching ? {
            x: [0, -4, 4, -2, 0],
            filter: ['none', 'hue-rotate(180deg)', 'hue-rotate(90deg)', 'none'],
          } : {}}
          transition={{ duration: 0.3 }}
        >
          <div style={{
            fontSize: '10px', color: '#555', letterSpacing: '4px',
            fontFamily: 'monospace', marginBottom: '6px',
          }}>
            LEVEL 3 — CLASSIFIED
          </div>
          <div style={{
            fontSize: '28px', fontWeight: '900',
            background: 'linear-gradient(135deg, #ff2d78, #8b5cf6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            SOMETHING'S OFF
          </div>

          {/* Score display */}
          <div style={{
            marginTop: '12px', display: 'inline-flex',
            alignItems: 'center', gap: '8px',
            background: 'rgba(255,215,0,0.1)',
            border: '1px solid rgba(255,215,0,0.3)',
            borderRadius: '20px', padding: '4px 14px',
          }}>
            <span style={{ fontSize: '14px' }}>⭐</span>
            <span style={{ fontSize: '14px', color: '#ffd700', fontWeight: '700' }}>
              Total Score: {totalScore}
            </span>
          </div>
        </motion.div>

        {/* Narrator lines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {visibleLines.map(i => {
            const line = NARRATOR_LINES[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={{
                  background: `linear-gradient(135deg, ${line.color}15, rgba(0,0,0,0.3))`,
                  border: `1px solid ${line.color}44`,
                  borderRadius: '14px',
                  padding: '12px 16px',
                  display: 'flex', alignItems: 'flex-start', gap: '10px',
                }}
              >
                <span style={{
                  fontSize: '18px', flexShrink: 0,
                  filter: `drop-shadow(0 0 8px ${line.color})`,
                }}>
                  {i < 3 ? '🎮' : i < 5 ? '🤔' : i < 7 ? '👀' : '❗'}
                </span>
                <p style={{
                  margin: 0,
                  fontSize: i === 3 ? '22px' : '14px',
                  color: line.color, fontStyle: 'italic',
                  fontWeight: i === 3 || i === 8 ? '800' : '500',
                  lineHeight: '1.5',
                  letterSpacing: i === 3 ? '2px' : '0',
                }}>
                  {line.text}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Suspicious emoji sequence */}
        {visibleLines.length >= 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', delay: 0.3 }}
            style={{
              display: 'flex', justifyContent: 'center', gap: '12px',
              marginTop: '20px',
            }}
          >
            {['🎮', '→', '💐', '→', '🤵', '→', '👗', '→', '❓'].map((e, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                style={{
                  fontSize: e === '→' ? '14px' : '20px',
                  color: e === '→' ? '#333' : 'white',
                  animation: e !== '→' ? 'float 2s ease-in-out infinite' : 'none',
                  animationDelay: `${i * 0.2}s`,
                }}
              >
                {e}
              </motion.span>
            ))}
          </motion.div>
        )}

        {/* Continue button */}
        {showContinue && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
            style={{ marginTop: '28px', textAlign: 'center' }}
          >
            <div style={{ fontSize: '12px', color: '#333', marginBottom: '12px', letterSpacing: '2px' }}>
              Something big is about to happen...
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={onComplete}
              style={{
                width: '100%', maxWidth: '300px',
                padding: '16px',
                background: 'linear-gradient(135deg, #ff2d78, #8b5cf6, #06b6d4)',
                border: 'none', borderRadius: '16px', color: 'white',
                fontSize: '18px', fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 0 40px rgba(255,45,120,0.5)',
                letterSpacing: '2px',
                animation: 'neon-pulse 1.5s ease-in-out infinite',
              }}
            >
              FINAL LEVEL →
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
