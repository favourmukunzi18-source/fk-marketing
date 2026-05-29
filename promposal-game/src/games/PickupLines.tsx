import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: (score: number) => void;
}

const ROUNDS = [
  {
    question: "Pick the smoothest opener:",
    options: [
      "Hey, are you a parking ticket? Because you've got 'fine' written all over you.",
      "Did it hurt when you fell from heaven? Because your outfit is divine.",
      "Are you a Wi-Fi signal? Because I'm feeling a connection.",
      "Hey. 👋",
    ],
    correct: 3,
    roast: [
      "A parking ticket? Really? We're going to jail.",
      "Divine? Are we in church rn?",
      "A Wi-Fi signal. They said tech bro energy.",
      "CORRECT. Confidence is the sauce. Less is more.",
    ],
  },
  {
    question: "Best response when they say 'I'm busy':",
    options: [
      "I can wait. I've waited my whole life for this moment.",
      "Busy doing what? Fighting your feelings?",
      "No worries! Maybe another time 😊",
      "That's okay — my schedule is free. All of it. Every single day.",
    ],
    correct: 2,
    roast: [
      "You've waited your WHOLE life? Slow down bestie.",
      "Fighting their feelings? You're a menace.",
      "CORRECT. Chill, confident, door open. Masterclass.",
      "Every single day?? That's... a lot of information.",
    ],
  },
  {
    question: "Perfect prom proposal opener:",
    options: [
      "Knock knock... Who's there? Prom... Prom who? Prom me, obviously.",
      "I made you this entire game. You're basically obligated now.",
      "I calculated the probability of us going together and it's 100%.",
      "Roses are red, prom is near — please say yes so I can sleep this year.",
    ],
    correct: 3,
    roast: [
      "A knock knock? This is a felony.",
      "Manipulation via video game?? Iconic. Unethical. We stan.",
      "Calculated the probability? Sir this is a Wendy's.",
      "CORRECT. Rhymes, honesty, desperation — perfect combination.",
    ],
  },
  {
    question: "The dance floor situation:",
    options: [
      "I don't dance. I vibe.",
      "I watched 3 YouTube tutorials. I'm basically a professional.",
      "I might step on your feet but only because I'm nervous.",
      "I've been practicing in my room for 2 weeks.",
    ],
    correct: 0,
    roast: [
      "CORRECT. 'I vibe' is undefeated. No notes.",
      "3 YouTube tutorials = professional? That math is mathing.",
      "Stepping on feet is romantic in an awkward way. Respectable.",
      "2 weeks of bedroom practice?? The dedication. The commitment.",
    ],
  },
  {
    question: "After prom ends, the right move is:",
    options: [
      "Ghost everyone and go home to eat cereal.",
      "After-party? We're going to Waffle House.",
      "\"This was the best night of my life.\" (Cry single tear.)",
      "Just vibe and see where the night goes.",
    ],
    correct: 1,
    roast: [
      "Cereal and solitude. Respectable but chaotic.",
      "CORRECT. Waffle House at 2am after prom? That's cinema.",
      "The single tear is TOO much. Your emotions need a PR manager.",
      "'See where it goes' is a red flag wrapped in mystery.",
    ],
  },
];

export function PickupLines({ onComplete }: Props) {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = ROUNDS[round];

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correct) setScore(s => s + 20);
    setTimeout(() => {
      if (round + 1 >= ROUNDS.length) {
        setDone(true);
        setTimeout(() => onComplete(score + (i === q.correct ? 20 : 0)), 1200);
      } else {
        setRound(r => r + 1);
        setSelected(null);
      }
    }, 1600);
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          height: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '16px',
          padding: '20px',
        }}
      >
        <div style={{ fontSize: '50px' }}>😂</div>
        <div style={{ fontSize: '22px', fontWeight: '800', textAlign: 'center' }}>
          Rizz Level: {score >= 80 ? 'ELITE' : score >= 60 ? 'DECENT' : score >= 40 ? 'WORK ON IT' : 'NEED HELP'}
        </div>
        <div style={{ fontSize: '32px', fontWeight: '900', color: '#ffd700' }}>{score} pts</div>
      </motion.div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Progress */}
      <div style={{
        padding: '12px 20px',
        background: 'rgba(0,0,0,0.3)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', gap: '12px',
        flexShrink: 0,
      }}>
        <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
          <div style={{
            height: '100%', borderRadius: '3px',
            background: 'linear-gradient(90deg, #8b5cf6, #ff2d78)',
            width: `${(round / ROUNDS.length) * 100}%`,
            transition: 'width 0.3s',
          }} />
        </div>
        <div style={{ fontSize: '13px', color: '#666' }}>{round + 1}/{ROUNDS.length}</div>
        <div style={{ fontSize: '16px', fontWeight: '700', color: '#ffd700' }}>{score}pts</div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={round}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.25 }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', gap: '14px', overflowY: 'auto' }}
        >
          <div style={{
            background: 'rgba(139,92,246,0.1)',
            border: '1px solid rgba(139,92,246,0.3)',
            borderRadius: '14px', padding: '16px',
            fontSize: '16px', fontWeight: '700', color: 'white',
            textAlign: 'center',
          }}>
            {q.question}
          </div>

          {q.options.map((opt, i) => {
            const isSelected = selected === i;
            const isCorrect = i === q.correct;
            let bg = 'rgba(255,255,255,0.05)';
            let border = 'rgba(255,255,255,0.1)';
            let textColor = '#ccc';

            if (selected !== null) {
              if (isCorrect) { bg = 'rgba(0,255,136,0.15)'; border = '#00ff88'; textColor = '#00ff88'; }
              else if (isSelected) { bg = 'rgba(255,45,120,0.15)'; border = '#ff2d78'; textColor = '#ff2d78'; }
            }

            return (
              <motion.button
                key={i}
                whileHover={selected === null ? { scale: 1.01 } : {}}
                whileTap={selected === null ? { scale: 0.98 } : {}}
                onClick={() => handleAnswer(i)}
                style={{
                  padding: '14px 16px',
                  background: bg, border: `1px solid ${border}`,
                  borderRadius: '12px', color: textColor,
                  fontSize: '13px', textAlign: 'left',
                  cursor: selected === null ? 'pointer' : 'default',
                  lineHeight: '1.5',
                  transition: 'all 0.2s',
                  fontWeight: isSelected || isCorrect ? '700' : '400',
                }}
              >
                <span style={{ opacity: 0.5, marginRight: '8px' }}>{['A', 'B', 'C', 'D'][i]}.</span>
                {opt}
              </motion.button>
            );
          })}

          {selected !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: selected === q.correct ? 'rgba(0,255,136,0.1)' : 'rgba(255,45,120,0.1)',
                border: `1px solid ${selected === q.correct ? '#00ff88' : '#ff2d78'}44`,
                borderRadius: '12px', padding: '12px 14px',
                fontSize: '13px', color: selected === q.correct ? '#00ff88' : '#ff8c8c',
                fontStyle: 'italic',
              }}
            >
              🎮 {q.roast[selected]}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
