import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { GamePhase, CharacterConfig, Achievement } from './types';
import { DEFAULT_MALE, DEFAULT_FEMALE } from './types';
import { IntroScreen } from './screens/IntroScreen';
import { Level1Screen } from './screens/Level1Screen';
import { Level2Screen } from './screens/Level2Screen';
import { Level3Screen } from './screens/Level3Screen';
import { FinalReveal } from './screens/FinalReveal';
import { YesScreen } from './screens/YesScreen';
import { NoScreen } from './screens/NoScreen';
import { AchievementPopup } from './components/AchievementPopup';

const ACHIEVEMENTS: Record<string, Achievement> = {
  started: { id: 'started', title: 'First Boot', desc: 'You turned it on. Groundbreaking.', icon: '🎮' },
  level1: { id: 'level1', title: 'Fashion Icon', desc: 'Both fits locked in. Slay.', icon: '👑' },
  level2: { id: 'level2', title: 'Chaos Survived', desc: 'You made it through the gauntlet.', icon: '🔥' },
  level3: { id: 'level3', title: 'Suspicious...', desc: 'Something is definitely off.', icon: '🤔' },
  yes: { id: 'yes', title: 'PROM SECURED', desc: 'The W of all Ws.', icon: '💖' },
  no: { id: 'no', title: 'Rejected in 4K', desc: 'Touch grass. Get back up.', icon: '💔' },
};

function ProgressBar({ phase }: { phase: GamePhase }) {
  const steps: GamePhase[] = ['intro', 'level1', 'level2', 'level3', 'reveal'];
  const currentIndex = steps.indexOf(phase);
  if (currentIndex < 0) return null;

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
      height: '3px',
      background: 'rgba(255,255,255,0.05)',
    }}>
      <motion.div
        style={{
          height: '100%',
          background: 'linear-gradient(90deg, #ff2d78, #8b5cf6, #06b6d4)',
          boxShadow: '0 0 8px rgba(255,45,120,0.6)',
        }}
        initial={{ width: '0%' }}
        animate={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [male, setMale] = useState<CharacterConfig>(DEFAULT_MALE);
  const [female, setFemale] = useState<CharacterConfig>(DEFAULT_FEMALE);
  const [totalScore, setTotalScore] = useState(0);
  const [achievement, setAchievement] = useState<Achievement | null>(null);

  const showAchievement = (id: string) => {
    setAchievement(ACHIEVEMENTS[id] || null);
    setTimeout(() => setAchievement(null), 3500);
  };

  const handleIntroComplete = () => {
    showAchievement('started');
    setPhase('level1');
  };

  const handleLevel1Complete = () => {
    showAchievement('level1');
    setPhase('level2');
  };

  const handleLevel2Complete = (score: number) => {
    setTotalScore(score);
    showAchievement('level2');
    setPhase('level3');
  };

  const handleLevel3Complete = () => {
    showAchievement('level3');
    setPhase('reveal');
  };

  const handleYes = () => {
    showAchievement('yes');
    setPhase('yes');
  };

  const handleNo = () => {
    showAchievement('no');
    setPhase('no');
  };

  const handleRestart = () => {
    setPhase('intro');
    setMale(DEFAULT_MALE);
    setFemale(DEFAULT_FEMALE);
    setTotalScore(0);
  };

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const transition = { duration: 0.4 };

  return (
    <div className="game-container">
      <ProgressBar phase={phase} />
      <AchievementPopup achievement={achievement} />

      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div key="intro" {...pageVariants} transition={transition} style={{ position: 'absolute', inset: 0 }}>
            <IntroScreen onComplete={handleIntroComplete} />
          </motion.div>
        )}

        {phase === 'level1' && (
          <motion.div key="level1" {...pageVariants} transition={transition} style={{ position: 'absolute', inset: 0 }}>
            <Level1Screen
              male={male}
              female={female}
              onMaleChange={setMale}
              onFemaleChange={setFemale}
              onComplete={handleLevel1Complete}
            />
          </motion.div>
        )}

        {phase === 'level2' && (
          <motion.div key="level2" {...pageVariants} transition={transition} style={{ position: 'absolute', inset: 0 }}>
            <Level2Screen onComplete={handleLevel2Complete} />
          </motion.div>
        )}

        {phase === 'level3' && (
          <motion.div key="level3" {...pageVariants} transition={transition} style={{ position: 'absolute', inset: 0 }}>
            <Level3Screen totalScore={totalScore} onComplete={handleLevel3Complete} />
          </motion.div>
        )}

        {phase === 'reveal' && (
          <motion.div key="reveal" {...pageVariants} transition={transition} style={{ position: 'absolute', inset: 0 }}>
            <FinalReveal
              maleConfig={male}
              femaleConfig={female}
              onYes={handleYes}
              onNo={handleNo}
            />
          </motion.div>
        )}

        {phase === 'yes' && (
          <motion.div key="yes" {...pageVariants} transition={transition} style={{ position: 'absolute', inset: 0 }}>
            <YesScreen
              maleConfig={male}
              femaleConfig={female}
              totalScore={totalScore}
              onRestart={handleRestart}
            />
          </motion.div>
        )}

        {phase === 'no' && (
          <motion.div key="no" {...pageVariants} transition={transition} style={{ position: 'absolute', inset: 0 }}>
            <NoScreen maleConfig={male} onRestart={handleRestart} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
