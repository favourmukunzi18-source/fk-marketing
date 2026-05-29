import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  text: string;
  visible: boolean;
  position?: 'top' | 'bottom';
}

export function NarratorBox({ text, visible, position = 'bottom' }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: position === 'bottom' ? 20 : -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: position === 'bottom' ? 20 : -20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{
            position: 'absolute',
            [position]: position === 'bottom' ? '80px' : '70px',
            left: '16px',
            right: '16px',
            zIndex: 50,
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, rgba(20,10,30,0.95), rgba(40,10,60,0.95))',
            border: '1px solid rgba(139,92,246,0.5)',
            borderRadius: '16px',
            padding: '14px 18px',
            boxShadow: '0 0 20px rgba(139,92,246,0.3), inset 0 0 20px rgba(139,92,246,0.05)',
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{
                fontSize: '22px',
                flexShrink: 0,
                filter: 'drop-shadow(0 0 8px rgba(139,92,246,0.8))',
              }}>🎮</div>
              <p style={{
                margin: 0,
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#e2d4ff',
                fontStyle: 'italic',
              }}>
                {text}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
