import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: (score: number) => void;
}

const EMOJIS = ['💍', '👑', '🎀', '💎', '🌹', '⭐'];

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

export function AccessoryMatch({ onComplete }: Props) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matchCount, setMatchCount] = useState(0);
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);
  const [, setCelebrating] = useState<number | null>(null);

  useEffect(() => {
    const shuffled = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
    setCards(shuffled);
  }, []);

  const handleFlip = useCallback((id: number) => {
    if (flipped.length >= 2) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.flipped || card.matched) return;

    const newFlipped = [...flipped, id];
    setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c));
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = newFlipped.map(fid => cards.find(c => c.id === fid)!);

      if (a.emoji === b.emoji) {
        setCelebrating(id);
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            newFlipped.includes(c.id) ? { ...c, matched: true, flipped: true } : c
          ));
          setFlipped([]);
          setMatchCount(mc => {
            const newCount = mc + 1;
            const pts = Math.max(10, 30 - moves * 2);
            setScore(s => s + pts);
            setCelebrating(null);
            if (newCount === EMOJIS.length) {
              setDone(true);
              setTimeout(() => onComplete(score + pts), 1000);
            }
            return newCount;
          });
        }, 600);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            newFlipped.includes(c.id) ? { ...c, flipped: false } : c
          ));
          setFlipped([]);
        }, 900);
      }
    }
  }, [cards, flipped, moves, score, onComplete]);

  if (done) {
    const rating = moves <= 8 ? 'GALAXY BRAIN' : moves <= 12 ? 'SMART' : moves <= 16 ? 'AVERAGE' : 'NEEDS WORK';
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          height: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '14px',
          padding: '20px',
        }}
      >
        <div style={{ fontSize: '50px' }}>🧠</div>
        <div style={{ fontSize: '22px', fontWeight: '800' }}>{rating}</div>
        <div style={{ fontSize: '14px', color: '#666' }}>{moves} moves to complete</div>
        <div style={{ fontSize: '32px', fontWeight: '900', color: '#ffd700' }}>{score} pts</div>
      </motion.div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* HUD */}
      <div style={{
        padding: '10px 20px',
        background: 'rgba(0,0,0,0.3)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexShrink: 0,
      }}>
        <div>
          <div style={{ fontSize: '9px', color: '#8b5cf6', letterSpacing: '2px' }}>SCORE</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#ffd700' }}>{score}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#555' }}>Match the accessories!</div>
          <div style={{ fontSize: '13px', color: '#8b5cf6' }}>{matchCount}/{EMOJIS.length} matched</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '9px', color: '#8b5cf6', letterSpacing: '2px' }}>MOVES</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#ff2d78' }}>{moves}</div>
        </div>
      </div>

      {/* Cards grid */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '10px',
          width: '100%',
          maxWidth: '340px',
        }}>
          {cards.map(card => (
            <motion.button
              key={card.id}
              whileHover={!card.flipped && !card.matched ? { scale: 1.05 } : {}}
              whileTap={!card.flipped && !card.matched ? { scale: 0.92 } : {}}
              onClick={() => handleFlip(card.id)}
              style={{
                aspectRatio: '1',
                borderRadius: '12px',
                border: card.matched
                  ? '2px solid rgba(0,255,136,0.5)'
                  : card.flipped
                    ? '2px solid rgba(255,45,120,0.5)'
                    : '2px solid rgba(255,255,255,0.1)',
                background: card.matched
                  ? 'rgba(0,255,136,0.1)'
                  : card.flipped
                    ? 'rgba(139,92,246,0.2)'
                    : 'linear-gradient(135deg, rgba(30,10,50,0.8), rgba(20,5,40,0.9))',
                cursor: card.flipped || card.matched ? 'default' : 'pointer',
                fontSize: '28px',
                transition: 'all 0.15s',
                boxShadow: card.matched ? '0 0 15px rgba(0,255,136,0.3)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <AnimatePresence mode="wait">
                {card.flipped || card.matched ? (
                  <motion.span
                    key="front"
                    initial={{ rotateY: -90, scale: 0.5 }}
                    animate={{ rotateY: 0, scale: 1 }}
                    transition={{ duration: 0.15 }}
                  >
                    {card.emoji}
                  </motion.span>
                ) : (
                  <motion.span
                    key="back"
                    initial={{ rotateY: 90, scale: 0.5 }}
                    animate={{ rotateY: 0, scale: 1 }}
                    transition={{ duration: 0.15 }}
                    style={{ opacity: 0.4, fontSize: '20px' }}
                  >
                    ?
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
