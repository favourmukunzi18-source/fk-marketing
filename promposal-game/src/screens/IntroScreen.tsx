import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: () => void;
}

const BOOT_LINES = [
  '> INITIALIZING CHAOS_ENGINE v3.14...',
  '> LOADING UNNECESSARY DRAMA...',
  '> IMPORTING QUESTIONABLE_DECISIONS.exe',
  '> CALIBRATING CRINGE LEVELS...',
  '> CRINGE LEVELS: TOO HIGH — REROUTING',
  '> INSTALLING EMOTIONAL_DAMAGE.pkg',
  '> CHECKING FOR CONSEQUENCES...',
  '> ZERO CONSEQUENCES FOUND — PROCEEDING',
  '> ALL SYSTEMS CHAOTIC — READY.',
];

const NARRATOR_LINES = [
  { text: "Welcome to the most unnecessary game ever created.", delay: 0 },
  { text: "Someone definitely spent too much time making this.", delay: 2000 },
  { text: "Your mission: survive the chaos.", delay: 4000 },
  { text: "This game has absolutely no emotional consequences.", delay: 6000 },
  { text: "Probably.", delay: 8000 },
  { text: "Level 1: Try not to embarrass yourself.", delay: 9500 },
];

export function IntroScreen({ onComplete }: Props) {
  const [phase, setPhase] = useState<'boot' | 'loading' | 'title' | 'narrator' | 'start'>('boot');
  const [bootLine, setBootLine] = useState(0);
  const [loadProgress, setLoadProgress] = useState(0);
  const [narLines, setNarLines] = useState<number[]>([]);
  const [titleGlitch, setTitleGlitch] = useState(false);

  useEffect(() => {
    if (phase !== 'boot') return;
    if (bootLine < BOOT_LINES.length) {
      const t = setTimeout(() => setBootLine(b => b + 1), 220);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setPhase('loading'), 400);
      return () => clearTimeout(t);
    }
  }, [phase, bootLine]);

  useEffect(() => {
    if (phase !== 'loading') return;
    if (loadProgress < 100) {
      const t = setTimeout(() => setLoadProgress(p => Math.min(100, p + Math.random() * 12 + 3)), 80);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setPhase('title'), 400);
      return () => clearTimeout(t);
    }
  }, [phase, loadProgress]);

  useEffect(() => {
    if (phase !== 'title') return;
    const glitchInterval = setInterval(() => {
      setTitleGlitch(true);
      setTimeout(() => setTitleGlitch(false), 150);
    }, 2500);
    const t = setTimeout(() => {
      clearInterval(glitchInterval);
      setPhase('narrator');
    }, 1800);
    return () => { clearInterval(glitchInterval); clearTimeout(t); };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'narrator') return;
    NARRATOR_LINES.forEach(({ delay }, i) => {
      const t = setTimeout(() => setNarLines(prev => [...prev, i]), delay);
      return () => clearTimeout(t);
    });
    const done = setTimeout(() => setPhase('start'), NARRATOR_LINES[NARRATOR_LINES.length - 1].delay + 1500);
    return () => clearTimeout(done);
  }, [phase]);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, #000005 0%, #0a0015 50%, #000005 100%)',
      display: 'flex', flexDirection: 'column',
      padding: '20px',
      overflow: 'hidden',
    }}>
      {/* Scanlines overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,100,0.02) 2px, rgba(0,255,100,0.02) 4px)',
      }} />

      {/* Stars */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: Math.random() > 0.7 ? '2px' : '1px',
          height: Math.random() > 0.7 ? '2px' : '1px',
          borderRadius: '50%',
          background: 'white',
          opacity: 0.2 + Math.random() * 0.6,
        }} />
      ))}

      <AnimatePresence mode="wait">
        {phase === 'boot' && (
          <motion.div
            key="boot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              flex: 1,
              fontFamily: 'monospace',
              fontSize: '12px',
              color: '#00ff88',
              lineHeight: '1.8',
              paddingTop: '60px',
              textShadow: '0 0 8px #00ff88',
            }}
          >
            <div style={{ marginBottom: '16px', opacity: 0.5 }}>
              {'> SYSTEM BOOT — fk.game/v1.0 — [UNAUTHORIZED ACCESS: OK]'}
            </div>
            {BOOT_LINES.slice(0, bootLine).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.1 }}
              >
                {line}
              </motion.div>
            ))}
            {bootLine < BOOT_LINES.length && (
              <span style={{ borderRight: '2px solid #00ff88', animation: 'blink-cursor 1s infinite' }}>&nbsp;</span>
            )}
          </motion.div>
        )}

        {phase === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'center', gap: '24px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '11px', letterSpacing: '4px',
                color: '#8b5cf6', marginBottom: '8px', fontFamily: 'monospace',
              }}>
                LOADING QUESTIONABLE DECISIONS
              </div>
              <div style={{
                width: '280px', height: '8px',
                background: 'rgba(139,92,246,0.2)',
                borderRadius: '4px', border: '1px solid rgba(139,92,246,0.4)',
                overflow: 'hidden',
              }}>
                <motion.div
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #8b5cf6, #ff2d78, #06b6d4)',
                    borderRadius: '4px',
                    width: `${loadProgress}%`,
                    boxShadow: '0 0 12px rgba(255,45,120,0.6)',
                  }}
                />
              </div>
              <div style={{
                fontSize: '11px', color: '#555', fontFamily: 'monospace', marginTop: '8px',
              }}>
                {loadProgress.toFixed(0)}% COMPLETE
              </div>
            </div>

            {loadProgress > 40 && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ fontSize: '11px', color: '#444', fontFamily: 'monospace', textAlign: 'center' }}
              >
                {loadProgress < 70 ? '> Importing: emotional_damage.pkg' :
                  loadProgress < 90 ? '> WARNING: High levels of chaos detected' :
                    '> Chaos levels acceptable. Probably.'}
              </motion.div>
            )}
          </motion.div>
        )}

        {(phase === 'title' || phase === 'narrator' || phase === 'start') && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            {/* Logo/Title */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{ textAlign: 'center', paddingTop: '60px', marginBottom: '20px' }}
            >
              <div style={{
                fontSize: '11px', letterSpacing: '6px',
                color: '#8b5cf6', marginBottom: '8px',
                fontFamily: 'monospace',
              }}>
                ◆ PRESENTS ◆
              </div>
              <div
                style={{
                  fontSize: '42px', fontWeight: '900',
                  background: 'linear-gradient(135deg, #ff2d78, #8b5cf6, #06b6d4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: '1.1',
                  filter: titleGlitch ? 'hue-rotate(90deg)' : 'none',
                  transform: titleGlitch ? 'translate(2px, -1px)' : 'none',
                  transition: 'none',
                  letterSpacing: '-1px',
                }}
              >
                CHAOS<br />QUEST
              </div>
              <div style={{
                fontSize: '13px', color: '#555',
                fontFamily: 'monospace', marginTop: '6px', letterSpacing: '2px',
              }}>
                v2.0 ★ MOBILE EDITION
              </div>
              <div style={{
                marginTop: '12px',
                display: 'flex', justifyContent: 'center', gap: '8px',
              }}>
                {['🎮', '💀', '🔥', '⚡', '👑'].map((e, i) => (
                  <span key={i} style={{
                    fontSize: '20px',
                    animation: `float ${2 + i * 0.3}s ${i * 0.2}s ease-in-out infinite`,
                  }}>{e}</span>
                ))}
              </div>
            </motion.div>

            {/* Fake achievement popup */}
            {(phase === 'narrator' || phase === 'start') && narLines.length > 0 && (
              <motion.div
                initial={{ x: 200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', delay: 0.5 }}
                style={{
                  position: 'absolute', top: '20px', right: '16px',
                  background: 'linear-gradient(135deg, #1a0a2e, #2d1040)',
                  border: '2px solid #ffd700',
                  borderRadius: '12px', padding: '10px 14px',
                  boxShadow: '0 0 20px rgba(255,215,0,0.3)',
                  maxWidth: '200px',
                }}
              >
                <div style={{ fontSize: '9px', color: '#ffd700', letterSpacing: '2px', marginBottom: '4px' }}>
                  🏆 ACHIEVEMENT
                </div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#ffd700' }}>First Boot</div>
                <div style={{ fontSize: '10px', color: '#9b8faf' }}>You turned it on. Groundbreaking.</div>
              </motion.div>
            )}

            {/* Narrator lines */}
            {phase === 'narrator' && (
              <div style={{
                padding: '0 20px',
                flex: 1, display: 'flex', flexDirection: 'column',
                justifyContent: 'center', gap: '10px',
              }}>
                {narLines.map(i => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{
                      background: 'rgba(139,92,246,0.1)',
                      border: '1px solid rgba(139,92,246,0.3)',
                      borderRadius: '12px',
                      padding: '10px 14px',
                      fontSize: '14px',
                      color: NARRATOR_LINES[i].text === 'Probably.' ? '#ff2d78' : '#e2d4ff',
                      fontStyle: 'italic',
                      fontWeight: NARRATOR_LINES[i].text === 'Probably.' ? '700' : '400',
                    }}
                  >
                    {i === 0 ? '🎮 ' : ''}
                    {NARRATOR_LINES[i].text}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Start button */}
            {phase === 'start' && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{
                  flex: 1, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: '20px',
                  padding: '0 20px',
                }}
              >
                <div style={{
                  fontSize: '15px', color: '#666', textAlign: 'center',
                  lineHeight: '1.5', fontStyle: 'italic',
                }}>
                  "This game has absolutely no emotional consequences."
                  <br /><span style={{ color: '#ff2d78' }}>Probably.</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onComplete}
                  style={{
                    width: '100%', maxWidth: '280px',
                    padding: '18px 32px',
                    background: 'linear-gradient(135deg, #ff2d78, #8b5cf6)',
                    border: 'none', borderRadius: '16px',
                    color: 'white', fontSize: '20px', fontWeight: '800',
                    cursor: 'pointer', letterSpacing: '2px',
                    boxShadow: '0 0 30px rgba(255,45,120,0.5)',
                    animation: 'neon-pulse 2s ease-in-out infinite',
                  }}
                >
                  PRESS START ▶
                </motion.button>

                <div style={{ fontSize: '11px', color: '#333', fontFamily: 'monospace' }}>
                  ⚠ WARNING: MAY CAUSE FEELINGS
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
