import { motion, AnimatePresence } from 'framer-motion';
import type { Achievement } from '../types';

interface Props {
  achievement: Achievement | null;
}

export function AchievementPopup({ achievement }: Props) {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          key={achievement.id}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            position: 'absolute',
            top: '20px',
            right: '16px',
            zIndex: 100,
            maxWidth: '240px',
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #1a0a2e, #2d0a4e)',
            border: '2px solid #ffd700',
            borderRadius: '14px',
            padding: '12px 16px',
            boxShadow: '0 0 30px rgba(255,215,0,0.4)',
          }}>
            <div style={{ fontSize: '10px', color: '#ffd700', fontWeight: '700', letterSpacing: '2px', marginBottom: '4px' }}>
              🏆 ACHIEVEMENT UNLOCKED
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '28px' }}>{achievement.icon}</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffd700' }}>{achievement.title}</div>
                <div style={{ fontSize: '11px', color: '#c4b5d4' }}>{achievement.desc}</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
