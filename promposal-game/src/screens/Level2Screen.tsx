import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlowerCatcher } from '../games/FlowerCatcher';
import { RhythmTap } from '../games/RhythmTap';
import { PickupLines } from '../games/PickupLines';
import { AccessoryMatch } from '../games/AccessoryMatch';

interface Props {
  onComplete: (totalScore: number) => void;
}

const GAMES = [
  { id: 'flowers', title: 'FLOWER CATCHER', emoji: '🌸', desc: 'Tap falling flowers — faster = more points', color: '#ff2d78' },
  { id: 'rhythm', title: 'RHYTHM MASTER', emoji: '🎵', desc: 'Tap in time with the beat', color: '#8b5cf6' },
  { id: 'rizz', title: 'RIZZ QUIZ', emoji: '😏', desc: 'Pick the smoothest moves', color: '#06b6d4' },
  { id: 'match', title: 'ACCESSORY MATCH', emoji: '💍', desc: 'Find the matching pairs', color: '#ffd700' },
];

export function Level2Screen({ onComplete }: Props) {
  const [gameIndex, setGameIndex] = useState(-1);
  const [scores, setScores] = useState<number[]>([]);
  const [showIntro, setShowIntro] = useState(true);
  const [showGameOver, setShowGameOver] = useState(false);
  const [lastScore, setLastScore] = useState(0);

  const startNextGame = () => {
    setShowGameOver(false);
    setGameIndex(gi => gi + 1);
  };

  const handleGameComplete = (score: number) => {
    setLastScore(score);
    const newScores = [...scores, score];
    setScores(newScores);
    if (gameIndex + 1 >= GAMES.length) {
      setTimeout(() => onComplete(newScores.reduce((a, b) => a + b, 0)), 1200);
    } else {
      setShowGameOver(true);
    }
  };

  if (showIntro) {
    return (
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #0a0015 0%, #150025 100%)',
        display: 'flex', flexDirection: 'column',
        padding: '20px',
      }}>
        <div style={{ paddingTop: '40px', marginBottom: '24px' }}>
          <div style={{ fontSize: '10px', color: '#8b5cf6', letterSpacing: '3px', marginBottom: '4px' }}>LEVEL 2</div>
          <div style={{
            fontSize: '28px', fontWeight: '900',
            background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            MINI GAME GAUNTLET
          </div>
          <div style={{ fontSize: '13px', color: '#555', marginTop: '4px' }}>
            4 games. One shot. Don't fumble.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {GAMES.map((g, i) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: `linear-gradient(135deg, ${g.color}15, rgba(0,0,0,0.3))`,
                border: `1px solid ${g.color}33`,
                borderRadius: '14px', padding: '14px 16px',
                display: 'flex', alignItems: 'center', gap: '14px',
              }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: `${g.color}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px', flexShrink: 0,
                border: `1px solid ${g.color}44`,
              }}>{g.emoji}</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'white' }}>{g.title}</div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>{g.desc}</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: '20px', opacity: 0.3 }}>→</div>
            </motion.div>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => { setShowIntro(false); setGameIndex(0); }}
          style={{
            width: '100%', padding: '18px',
            background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
            border: 'none', borderRadius: '16px', color: 'white',
            fontSize: '20px', fontWeight: '800',
            cursor: 'pointer',
            boxShadow: '0 0 30px rgba(6,182,212,0.4)',
            letterSpacing: '1px',
          }}
        >
          LET'S GO ⚡
        </motion.button>
      </div>
    );
  }

  if (showGameOver) {
    const game = GAMES[gameIndex];
    const nextGame = GAMES[gameIndex + 1];
    const isLast = gameIndex >= GAMES.length - 2;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, #0a0015, #150025)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '30px', gap: '20px',
        }}
      >
        <div style={{ fontSize: '60px', animation: 'bounce-in 0.5s ease-out forwards' }}>
          {lastScore >= 60 ? '🔥' : lastScore >= 40 ? '✨' : '😤'}
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: '#8b5cf6', letterSpacing: '2px' }}>GAME COMPLETE</div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: 'white', margin: '4px 0' }}>
            {game.title}
          </div>
          <div style={{ fontSize: '40px', fontWeight: '900', color: '#ffd700' }}>
            {lastScore} pts
          </div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '14px', padding: '14px 20px',
          display: 'flex', gap: '24px', alignItems: 'center',
        }}>
          {scores.concat(lastScore).map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: '#555' }}>{GAMES[i].emoji}</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#ffd700' }}>{s}</div>
            </div>
          ))}
        </div>

        {!isLast ? (
          <>
            <div style={{ fontSize: '14px', color: '#555' }}>
              Next up: <span style={{ color: 'white', fontWeight: '700' }}>{nextGame?.emoji} {nextGame?.title}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={startNextGame}
              style={{
                width: '100%', maxWidth: '280px', padding: '16px',
                background: `linear-gradient(135deg, ${nextGame?.color || '#8b5cf6'}, #8b5cf6)`,
                border: 'none', borderRadius: '14px', color: 'white',
                fontSize: '18px', fontWeight: '800',
                cursor: 'pointer', letterSpacing: '1px',
              }}
            >
              NEXT GAME →
            </motion.button>
          </>
        ) : (
          <div style={{ fontSize: '14px', color: '#00ff88', fontWeight: '700' }}>
            All games done! Loading results...
          </div>
        )}
      </motion.div>
    );
  }

  const currentGame = GAMES[gameIndex];

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0a0015', display: 'flex', flexDirection: 'column' }}>
      {/* Game header */}
      <div style={{
        padding: '10px 16px',
        background: `linear-gradient(135deg, ${currentGame.color}22, rgba(0,0,0,0.5))`,
        borderBottom: `1px solid ${currentGame.color}44`,
        display: 'flex', alignItems: 'center', gap: '10px',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '20px' }}>{currentGame.emoji}</span>
        <div>
          <div style={{ fontSize: '9px', color: currentGame.color, letterSpacing: '2px' }}>
            GAME {gameIndex + 1}/{GAMES.length}
          </div>
          <div style={{ fontSize: '15px', fontWeight: '800', color: 'white' }}>{currentGame.title}</div>
        </div>
        <div style={{
          marginLeft: 'auto',
          display: 'flex', gap: '4px',
        }}>
          {GAMES.map((_, i) => (
            <div key={i} style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: i < gameIndex ? '#00ff88' : i === gameIndex ? currentGame.color : 'rgba(255,255,255,0.2)',
            }} />
          ))}
        </div>
      </div>

      {/* Game content */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={gameIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            style={{ position: 'absolute', inset: 0 }}
          >
            {gameIndex === 0 && <FlowerCatcher onComplete={handleGameComplete} />}
            {gameIndex === 1 && <RhythmTap onComplete={handleGameComplete} />}
            {gameIndex === 2 && <PickupLines onComplete={handleGameComplete} />}
            {gameIndex === 3 && <AccessoryMatch onComplete={handleGameComplete} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
