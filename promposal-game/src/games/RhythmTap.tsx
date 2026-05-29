import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: (score: number) => void;
}

interface Beat {
  id: number;
  color: string;
  targetTime: number;
  result?: 'perfect' | 'good' | 'miss';
}

const BEAT_COLORS = ['#ff2d78', '#8b5cf6', '#06b6d4', '#ffd700', '#00ff88'];
const BEAT_INTERVAL = 1400;
const TOTAL_BEATS = 12;

export function RhythmTap({ onComplete }: Props) {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<string[]>([]);
  const [tapFeedback, setTapFeedback] = useState<{ text: string; color: string } | null>(null);
  const [phase, setPhase] = useState<'countdown' | 'playing' | 'done'>('countdown');
  const [countdown, setCountdown] = useState(3);
  const [progress, setProgress] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(0);

  useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 800);
      return () => clearTimeout(t);
    } else {
      setPhase('playing');
      setGameStartTime(Date.now());
    }
  }, [phase, countdown]);

  useEffect(() => {
    if (phase !== 'playing') return;
    const newBeats: Beat[] = Array.from({ length: TOTAL_BEATS }, (_, i) => ({
      id: i,
      color: BEAT_COLORS[i % BEAT_COLORS.length],
      targetTime: (i + 1) * BEAT_INTERVAL,
    }));
    setBeats(newBeats);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'playing') return;
    const t = setInterval(() => {
      const elapsed = Date.now() - gameStartTime;
      const beatIndex = Math.floor(elapsed / BEAT_INTERVAL);
      setCurrentBeat(beatIndex);
      setProgress((elapsed % BEAT_INTERVAL) / BEAT_INTERVAL);

      if (beatIndex >= TOTAL_BEATS) {
        setPhase('done');
        clearInterval(t);
        setTimeout(() => onComplete(score), 1000);
      }
    }, 30);
    return () => clearInterval(t);
  }, [phase, gameStartTime, score, onComplete]);

  const handleTap = useCallback(() => {
    if (phase !== 'playing') return;

    const elapsed = Date.now() - gameStartTime;
    const beatProgress = (elapsed % BEAT_INTERVAL) / BEAT_INTERVAL;

    let feedback: { text: string; color: string };
    let points = 0;

    if (beatProgress > 0.75 || beatProgress < 0.12) {
      feedback = { text: '🔥 PERFECT!', color: '#00ff88' };
      points = 30;
    } else if (beatProgress > 0.6 || beatProgress < 0.25) {
      feedback = { text: '✨ GOOD', color: '#ffd700' };
      points = 20;
    } else {
      feedback = { text: '😬 EARLY', color: '#ff6b35' };
      points = 5;
    }

    setScore(s => s + points);
    setResults(r => [...r, feedback.text]);
    setTapFeedback(feedback);
    setTimeout(() => setTapFeedback(null), 400);
  }, [phase, gameStartTime]);

  const activeBeat = beats[currentBeat];

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* HUD */}
      <div style={{
        padding: '12px 20px',
        background: 'rgba(0,0,0,0.3)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexShrink: 0,
      }}>
        <div>
          <div style={{ fontSize: '10px', color: '#8b5cf6', letterSpacing: '2px' }}>SCORE</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#ffd700' }}>{score}</div>
        </div>
        <div style={{ fontSize: '13px', color: '#666' }}>
          Beat {Math.min(currentBeat + 1, TOTAL_BEATS)}/{TOTAL_BEATS}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px', color: '#8b5cf6', letterSpacing: '2px' }}>HITS</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#00ff88' }}>{results.length}</div>
        </div>
      </div>

      {/* Game area */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '30px', padding: '20px',
        position: 'relative',
      }}>
        {phase === 'countdown' && (
          <motion.div
            key={countdown}
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            style={{
              fontSize: '80px', fontWeight: '900',
              color: '#ff2d78',
              textShadow: '0 0 30px rgba(255,45,120,0.8)',
            }}
          >
            {countdown > 0 ? countdown : 'GO!'}
          </motion.div>
        )}

        {phase === 'playing' && (
          <>
            <div style={{ fontSize: '14px', color: '#555', textAlign: 'center' }}>
              Tap when the ring hits the center!
            </div>

            {/* Beat circle */}
            <div style={{ position: 'relative', width: '180px', height: '180px' }}>
              {/* Expanding ring */}
              <div style={{
                position: 'absolute', inset: 0,
                borderRadius: '50%',
                border: `3px solid ${activeBeat?.color || '#8b5cf6'}`,
                transform: `scale(${1.8 - progress * 0.8})`,
                opacity: 0.6,
                transition: 'transform 0.03s linear',
                boxShadow: `0 0 20px ${activeBeat?.color || '#8b5cf6'}`,
              }} />

              {/* Target ring */}
              <div style={{
                position: 'absolute', inset: '20px',
                borderRadius: '50%',
                border: `3px solid rgba(255,255,255,0.3)`,
              }} />

              {/* Center button */}
              <button
                onClick={handleTap}
                style={{
                  position: 'absolute', inset: '30px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${activeBeat?.color || '#8b5cf6'}, ${activeBeat?.color || '#8b5cf6'}88)`,
                  border: 'none', cursor: 'pointer',
                  boxShadow: `0 0 30px ${activeBeat?.color || '#8b5cf6'}`,
                  transition: 'transform 0.1s',
                  fontSize: '30px',
                }}
              >
                🎵
              </button>
            </div>

            {/* Tap feedback */}
            <AnimatePresence>
              {tapFeedback && (
                <motion.div
                  key={Date.now()}
                  initial={{ scale: 0.5, opacity: 1, y: 0 }}
                  animate={{ scale: 1.5, opacity: 0, y: -30 }}
                  exit={{}}
                  transition={{ duration: 0.4 }}
                  style={{
                    fontSize: '22px', fontWeight: '900',
                    color: tapFeedback.color,
                    textShadow: `0 0 15px ${tapFeedback.color}`,
                    position: 'absolute',
                    top: '40%',
                  }}
                >
                  {tapFeedback.text}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Beat history */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {results.slice(-8).map((r, i) => (
                <span key={i} style={{
                  fontSize: '11px', padding: '3px 8px',
                  borderRadius: '6px',
                  background: r.includes('PERFECT') ? 'rgba(0,255,136,0.2)' :
                    r.includes('GOOD') ? 'rgba(255,215,0,0.2)' : 'rgba(255,107,53,0.2)',
                  color: r.includes('PERFECT') ? '#00ff88' :
                    r.includes('GOOD') ? '#ffd700' : '#ff6b35',
                  border: `1px solid ${r.includes('PERFECT') ? '#00ff88' : r.includes('GOOD') ? '#ffd700' : '#ff6b35'}44`,
                }}>
                  {r.includes('PERFECT') ? '✓' : r.includes('GOOD') ? '~' : '✗'}
                </span>
              ))}
            </div>
          </>
        )}

        {phase === 'done' && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🎵</div>
            <div style={{ fontSize: '24px', fontWeight: '800' }}>RHYTHM LOCKED!</div>
            <div style={{ fontSize: '32px', fontWeight: '900', color: '#ffd700', marginTop: '8px' }}>
              {score} pts
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
