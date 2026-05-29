import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CharacterConfig } from '../types';
import { Character } from '../components/Character';
import { Confetti } from '../components/Confetti';

interface Props {
  maleConfig: CharacterConfig;
  femaleConfig: CharacterConfig;
  onYes: () => void;
  onNo: () => void;
}

const POSTER_JOKES = [
  "I made an entire game instead of acting normal.",
  "You carried the game… now carry my prom season too?",
  "Prom without you would actually be tragic.",
  "Roses are red, prom is near —\nplease say yes so I can sleep this year.",
];

const FINAL_QUESTION = "Will you go to prom with me?";

type RevealPhase = 'dark' | 'spotlight' | 'walkin' | 'poster' | 'jokes' | 'question' | 'buttons';

export function FinalReveal({ maleConfig, femaleConfig: _femaleConfig, onYes, onNo }: Props) {
  const [phase, setPhase] = useState<RevealPhase>('dark');
  const [visibleJokes, setVisibleJokes] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timeline = [
      { phase: 'spotlight', delay: 1200 },
      { phase: 'walkin', delay: 2400 },
      { phase: 'poster', delay: 4200 },
      { phase: 'jokes', delay: 5400 },
    ];
    const timers = timeline.map(({ phase: p, delay }) =>
      setTimeout(() => setPhase(p as RevealPhase), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase !== 'jokes') return;
    const timers = POSTER_JOKES.map((_, i) => {
      const t = setTimeout(() => {
        setVisibleJokes(prev => [...prev, i]);
      }, i * 1600);
      return t;
    });
    const questionTimer = setTimeout(() => setPhase('question'), POSTER_JOKES.length * 1600 + 400);
    return () => { timers.forEach(clearTimeout); clearTimeout(questionTimer); };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'question') return;
    const t = setTimeout(() => setPhase('buttons'), 2400);
    const conf = setTimeout(() => setShowConfetti(true), 800);
    return () => { clearTimeout(t); clearTimeout(conf); };
  }, [phase]);

  const handleNo = () => {
    const next = noCount + 1;
    setNoCount(next);
    setNoPos({ x: Math.random() * 160 - 80, y: Math.random() * 100 - 50 });
    if (next >= 4) setTimeout(onNo, 1200);
  };

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'black',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Spotlight bg */}
      {phase !== 'dark' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 60% 80% at 50% 60%, rgba(139,92,246,0.25) 0%, rgba(255,45,120,0.15) 40%, black 80%)',
            animation: 'spotlight-sweep 4s ease-in-out infinite',
          }}
        />
      )}

      {/* Stars */}
      {phase !== 'dark' && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: '2px', height: '2px', borderRadius: '50%',
              background: 'white', opacity: 0.3 + Math.random() * 0.5,
              animation: `neon-pulse ${1 + Math.random() * 2}s infinite`,
            }} />
          ))}
        </div>
      )}

      {showConfetti && <Confetti count={60} />}

      {/* CINEMATIC TEXT */}
      {phase === 'dark' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            style={{
              fontSize: '14px', letterSpacing: '6px',
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'monospace', textAlign: 'center',
            }}
          >
            ◆ FINAL LEVEL ◆
          </motion.div>
        </motion.div>
      )}

      {/* Main content */}
      {(phase === 'walkin' || phase === 'poster' || phase === 'jokes' || phase === 'question' || phase === 'buttons' || phase === 'spotlight') && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingBottom: '20px',
          zIndex: 5,
        }}>
          {/* Character walk-in */}
          {(phase === 'walkin' || phase === 'poster' || phase === 'jokes' || phase === 'question' || phase === 'buttons') && (
            <motion.div
              initial={{ x: '120%', opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
              style={{
                position: 'absolute',
                bottom: '0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Character config={maleConfig} gender="male" size={160} animate />
            </motion.div>
          )}

          {/* POSTER */}
          {(phase === 'poster' || phase === 'jokes' || phase === 'question' || phase === 'buttons') && (
            <motion.div
              initial={{ y: 100, scale: 0.7, rotate: 5, opacity: 0 }}
              animate={{ y: 0, scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}
              style={{
                position: 'absolute',
                top: '15%',
                left: '8%',
                right: '8%',
                zIndex: 20,
                animation: 'float 3s ease-in-out infinite',
              }}
            >
              <div style={{
                background: 'linear-gradient(135deg, #1a0030, #2d0050)',
                border: '3px solid #ff2d78',
                borderRadius: '20px',
                padding: '18px 16px',
                position: 'relative',
                boxShadow: '0 0 40px rgba(255,45,120,0.6), 0 0 80px rgba(139,92,246,0.4), inset 0 0 30px rgba(255,45,120,0.1)',
              }}>
                {/* Flashing bulbs */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', gap: '4px' }}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} style={{
                      width: '12px', height: '12px', borderRadius: '50%',
                      background: ['#ff2d78', '#ffd700', '#00ff88', '#06b6d4', '#8b5cf6', '#ff2d78', '#ffd700', '#00ff88'][i],
                      boxShadow: `0 0 8px ${['#ff2d78', '#ffd700', '#00ff88', '#06b6d4', '#8b5cf6', '#ff2d78', '#ffd700', '#00ff88'][i]}`,
                      animation: `neon-pulse ${0.8 + i * 0.1}s ease-in-out infinite`,
                      animationDelay: `${i * 0.15}s`,
                    }} />
                  ))}
                </div>

                {/* Poster title */}
                <div style={{
                  fontSize: '11px', letterSpacing: '4px',
                  color: '#8b5cf6', textAlign: 'center',
                  marginBottom: '10px', fontFamily: 'monospace',
                }}>
                  ✦ OFFICIAL ANNOUNCEMENT ✦
                </div>

                {/* Jokes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '100px' }}>
                  <AnimatePresence>
                    {visibleJokes.map(i => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        style={{
                          fontSize: '12px', color: '#e2d4ff',
                          lineHeight: '1.5',
                          paddingLeft: '6px',
                          borderLeft: `2px solid rgba(255,45,120,0.4)`,
                          whiteSpace: 'pre-line',
                        }}
                      >
                        {POSTER_JOKES[i]}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* The question */}
                {(phase === 'question' || phase === 'buttons') && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    style={{
                      marginTop: '14px',
                      padding: '14px 10px',
                      background: 'linear-gradient(135deg, rgba(255,45,120,0.2), rgba(139,92,246,0.2))',
                      borderRadius: '12px',
                      border: '2px solid rgba(255,45,120,0.6)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{
                      fontSize: '20px', fontWeight: '900',
                      background: 'linear-gradient(135deg, #ff2d78, #ffd700)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      lineHeight: '1.3',
                      animation: 'text-glow 1.5s ease-in-out infinite',
                    }}>
                      {FINAL_QUESTION}
                    </div>
                    <div style={{ fontSize: '18px', marginTop: '6px' }}>✨ 💖 ✨</div>
                  </motion.div>
                )}

                {/* Bottom bulbs */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', gap: '4px' }}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} style={{
                      width: '12px', height: '12px', borderRadius: '50%',
                      background: ['#8b5cf6', '#ff2d78', '#ffd700', '#00ff88', '#06b6d4', '#8b5cf6', '#ff2d78', '#ffd700'][i],
                      boxShadow: `0 0 8px ${['#8b5cf6', '#ff2d78', '#ffd700', '#00ff88', '#06b6d4', '#8b5cf6', '#ff2d78', '#ffd700'][i]}`,
                      animation: `neon-pulse ${0.9 + i * 0.12}s ease-in-out infinite`,
                      animationDelay: `${(7 - i) * 0.15}s`,
                    }} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* YES / NO Buttons */}
          {phase === 'buttons' && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.5 }}
              style={{
                position: 'absolute',
                bottom: '270px',
                left: '16px',
                right: '16px',
                display: 'flex', gap: '12px', zIndex: 30,
              }}
            >
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.92 }}
                onClick={onYes}
                style={{
                  flex: 1, padding: '20px 0',
                  background: 'linear-gradient(135deg, #ff2d78, #ff6b9d)',
                  border: 'none', borderRadius: '18px',
                  fontSize: '22px', fontWeight: '900',
                  cursor: 'pointer', color: 'white',
                  boxShadow: '0 0 30px rgba(255,45,120,0.6)',
                  animation: 'neon-pulse 1.2s ease-in-out infinite',
                  letterSpacing: '1px',
                }}
              >
                YES 💖
              </motion.button>

              <motion.button
                whileHover={noCount < 4 ? { scale: 1.03 } : {}}
                whileTap={noCount < 4 ? { scale: 0.95 } : {}}
                onClick={handleNo}
                animate={noCount > 0 ? { x: noPos.x, y: noPos.y } : {}}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                style={{
                  flex: noCount >= 3 ? 0.5 : 1,
                  padding: '20px 0',
                  background: noCount >= 4
                    ? 'rgba(50,50,50,0.3)'
                    : 'rgba(50,50,50,0.6)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '18px',
                  fontSize: noCount >= 3 ? '14px' : '22px',
                  fontWeight: '900',
                  cursor: noCount >= 4 ? 'not-allowed' : 'pointer',
                  color: noCount >= 4 ? '#333' : '#666',
                  transition: 'all 0.3s',
                  letterSpacing: '1px',
                }}
              >
                {noCount === 0 ? 'NO 💀' :
                  noCount === 1 ? 'no..? 😅' :
                    noCount === 2 ? 'noo 😭' :
                      noCount === 3 ? 'bro stop 🙏' :
                        '(gone)'}
              </motion.button>
            </motion.div>
          )}

          {/* NO button running away hint */}
          {phase === 'buttons' && noCount > 0 && noCount < 4 && (
            <motion.div
              key={noCount}
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              style={{
                position: 'absolute', bottom: '240px', right: '20px',
                fontSize: '10px', color: '#444',
              }}
            >
              {noCount === 1 ? "Nice try lol" : noCount === 2 ? "It keeps moving 😂" : "Almost gone..."}
            </motion.div>
          )}
        </div>
      )}

      {/* FINAL LEVEL title */}
      {phase === 'spotlight' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute', top: '60px', left: 0, right: 0,
            textAlign: 'center', zIndex: 10,
          }}
        >
          <div style={{
            fontSize: '11px', letterSpacing: '5px',
            color: '#ff2d78', marginBottom: '4px',
          }}>◆ ◆ ◆</div>
          <div style={{
            fontSize: '36px', fontWeight: '900',
            background: 'linear-gradient(135deg, #ff2d78, #ffd700)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            FINAL LEVEL
          </div>
          <div style={{ fontSize: '13px', color: '#555', marginTop: '4px' }}>
            This is it. No going back.
          </div>
        </motion.div>
      )}
    </div>
  );
}
