import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CharacterConfig } from '../types';
import { SKIN_TONES, HAIR_COLORS, OUTFIT_COLORS_MALE, OUTFIT_COLORS_FEMALE } from '../types';
import { Character } from '../components/Character';
import { NarratorBox } from '../components/NarratorBox';

interface Props {
  male: CharacterConfig;
  female: CharacterConfig;
  onMaleChange: (c: CharacterConfig) => void;
  onFemaleChange: (c: CharacterConfig) => void;
  onComplete: () => void;
}

const HAIR_STYLE_NAMES = ['Clean Cut', 'Wild', 'Flowing', 'Fade'];
const ACCESSORY_NAMES = ['None', 'Top Hat', 'Shades', 'Crown'];
const ACCESSORY_ICONS = ['✕', '🎩', '😎', '👑'];

const MALE_NARRATOR_LINES = [
  "That fit is dangerously clean.",
  "Okay wait… this combo kinda goes hard.",
  "That outfit deserves its own soundtrack.",
  "Either this is fashion… or a public safety issue.",
  "Bro is dressed for a different dimension.",
  "We're not ready for this level of drip.",
  "Certified sauce. No notes.",
  "The crown? Really? Respect.",
];

const FEMALE_NARRATOR_LINES = [
  "Okay she ate and left no crumbs.",
  "That dress color is not it. Just kidding it absolutely is.",
  "She's serving looks on a Tuesday. Iconic.",
  "The accessories are giving main character energy.",
  "Ma'am, the fit is violating several laws.",
  "That hair is government property now.",
  "Certified 10/10. Math is mathing.",
  "She's going to walk in and everyone is going to cry.",
];

export function Level1Screen({ male, female, onMaleChange, onFemaleChange, onComplete }: Props) {
  const [activeChar, setActiveChar] = useState<'male' | 'female'>('male');
  const [narratorText, setNarratorText] = useState('');
  const [showNarrator, setShowNarrator] = useState(false);
  const [fitScore, setFitScore] = useState({ male: 0, female: 0 });
  const [savedMale, setSavedMale] = useState(false);
  const [savedFemale, setSavedFemale] = useState(false);
  const [changeCount, setChangeCount] = useState(0);

  const config = activeChar === 'male' ? male : female;
  const outfitColors = activeChar === 'male' ? OUTFIT_COLORS_MALE : OUTFIT_COLORS_FEMALE;

  const setConfig = (c: CharacterConfig) => {
    if (activeChar === 'male') onMaleChange(c);
    else onFemaleChange(c);
    setChangeCount(n => n + 1);
  };

  useEffect(() => {
    if (changeCount === 0) return;
    const lines = activeChar === 'male' ? MALE_NARRATOR_LINES : FEMALE_NARRATOR_LINES;
    const line = lines[Math.floor(Math.random() * lines.length)];
    setNarratorText(line);
    setShowNarrator(true);
    const t = setTimeout(() => setShowNarrator(false), 2500);
    return () => clearTimeout(t);
  }, [changeCount]);

  const saveFit = () => {
    if (activeChar === 'male') {
      setSavedMale(true);
      setFitScore(s => ({ ...s, male: 7 + Math.floor(Math.random() * 4) }));
    } else {
      setSavedFemale(true);
      setFitScore(s => ({ ...s, female: 7 + Math.floor(Math.random() * 4) }));
    }
  };

  const canContinue = savedMale && savedFemale;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, #0a0015 0%, #150025 50%, #0a001a 100%)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 8px', flexShrink: 0 }}>
        <div style={{ fontSize: '10px', color: '#8b5cf6', letterSpacing: '3px', marginBottom: '4px' }}>
          LEVEL 1
        </div>
        <div style={{
          fontSize: '22px', fontWeight: '800',
          background: 'linear-gradient(135deg, #ff2d78, #8b5cf6)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          SQUAD CUSTOMIZATION
        </div>
        <div style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>
          Build their fits. No pressure. (Some pressure.)
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{
        display: 'flex', margin: '0 20px 8px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '12px', padding: '4px',
        flexShrink: 0,
      }}>
        {(['male', 'female'] as const).map(g => (
          <button
            key={g}
            onClick={() => setActiveChar(g)}
            style={{
              flex: 1, padding: '10px',
              background: activeChar === g
                ? 'linear-gradient(135deg, #8b5cf6, #ff2d78)'
                : 'transparent',
              border: 'none', borderRadius: '10px',
              color: activeChar === g ? 'white' : '#555',
              fontWeight: '700', fontSize: '13px',
              cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}
          >
            {g === 'male' ? '🤵' : '👗'}
            {g === 'male' ? 'His Fit' : 'Her Fit'}
            {g === 'male' && savedMale && <span style={{ color: '#00ff88' }}>✓</span>}
            {g === 'female' && savedFemale && <span style={{ color: '#00ff88' }}>✓</span>}
          </button>
        ))}
      </div>

      {/* Character preview */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeChar}
          initial={{ opacity: 0, scale: 0.85, x: activeChar === 'male' ? -50 : 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            display: 'flex', justifyContent: 'center',
            alignItems: 'center', flexShrink: 0, height: '160px',
            position: 'relative',
          }}
        >
          {/* Glow behind character */}
          <div style={{
            position: 'absolute',
            width: '120px', height: '120px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${activeChar === 'male' ? 'rgba(139,92,246,0.3)' : 'rgba(255,45,120,0.3)'} 0%, transparent 70%)`,
            animation: 'neon-pulse 2s ease-in-out infinite',
          }} />
          <Character config={config} gender={activeChar} size={100} animate />

          {/* Fit score badge */}
          {(activeChar === 'male' ? savedMale : savedFemale) && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                position: 'absolute', top: '10px', right: '60px',
                background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
                borderRadius: '20px', padding: '4px 12px',
                fontSize: '12px', fontWeight: '800',
                boxShadow: '0 0 15px rgba(255,215,0,0.5)',
              }}
            >
              {fitScore[activeChar]}/10 🔥
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Customization options */}
      <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
        {/* Skin tone */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '11px', color: '#8b5cf6', letterSpacing: '2px', marginBottom: '8px' }}>
            SKIN TONE
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {SKIN_TONES.map((tone) => (
              <button
                key={tone}
                onClick={() => setConfig({ ...config, skinTone: tone })}
                style={{
                  width: '36px', height: '36px',
                  borderRadius: '50%', background: tone, border: 'none',
                  cursor: 'pointer',
                  outline: config.skinTone === tone ? '3px solid #ff2d78' : '2px solid transparent',
                  outlineOffset: '2px',
                  transition: 'all 0.2s',
                  boxShadow: config.skinTone === tone ? '0 0 12px rgba(255,45,120,0.6)' : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Hair style */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '11px', color: '#8b5cf6', letterSpacing: '2px', marginBottom: '8px' }}>
            HAIR STYLE
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {HAIR_STYLE_NAMES.map((name, i) => (
              <button
                key={i}
                onClick={() => setConfig({ ...config, hairStyle: i })}
                style={{
                  flex: 1, padding: '8px 4px',
                  background: config.hairStyle === i
                    ? 'linear-gradient(135deg, #8b5cf6, #ff2d78)'
                    : 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(139,92,246,0.3)',
                  borderRadius: '10px', color: 'white',
                  fontSize: '10px', fontWeight: '600',
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: config.hairStyle === i ? '0 0 10px rgba(255,45,120,0.4)' : 'none',
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Hair color */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '11px', color: '#8b5cf6', letterSpacing: '2px', marginBottom: '8px' }}>
            HAIR COLOR
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {HAIR_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setConfig({ ...config, hairColor: color })}
                style={{
                  width: '36px', height: '36px',
                  borderRadius: '50%', background: color, border: 'none',
                  cursor: 'pointer',
                  outline: config.hairColor === color ? '3px solid #ff2d78' : '2px solid transparent',
                  outlineOffset: '2px',
                  transition: 'all 0.2s',
                  boxShadow: config.hairColor === color ? '0 0 12px rgba(255,45,120,0.6)' : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Outfit color */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '11px', color: '#8b5cf6', letterSpacing: '2px', marginBottom: '8px' }}>
            {activeChar === 'male' ? 'SUIT COLOR' : 'DRESS COLOR'}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {outfitColors.map((color) => (
              <button
                key={color}
                onClick={() => setConfig({ ...config, outfitColor: color })}
                style={{
                  width: '36px', height: '36px',
                  borderRadius: '10px', background: color, border: 'none',
                  cursor: 'pointer',
                  outline: config.outfitColor === color ? '3px solid #ffd700' : '2px solid transparent',
                  outlineOffset: '2px',
                  transition: 'all 0.2s',
                  boxShadow: config.outfitColor === color ? '0 0 12px rgba(255,215,0,0.6)' : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Accessories */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '11px', color: '#8b5cf6', letterSpacing: '2px', marginBottom: '8px' }}>
            ACCESSORIES
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {ACCESSORY_NAMES.map((name, i) => (
              <button
                key={i}
                onClick={() => setConfig({ ...config, accessory: i })}
                style={{
                  flex: 1, padding: '10px 4px',
                  background: config.accessory === i
                    ? 'linear-gradient(135deg, #ffd700, #ff8c00)'
                    : 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,215,0,0.2)',
                  borderRadius: '10px', color: 'white',
                  fontSize: '16px',
                  cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: '2px',
                  boxShadow: config.accessory === i ? '0 0 10px rgba(255,215,0,0.4)' : 'none',
                }}
              >
                <span>{ACCESSORY_ICONS[i]}</span>
                <span style={{ fontSize: '9px' }}>{name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Save fit button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={saveFit}
          style={{
            width: '100%', padding: '14px',
            background: (activeChar === 'male' ? savedMale : savedFemale)
              ? 'rgba(0,255,136,0.2)'
              : 'linear-gradient(135deg, #ff2d78, #8b5cf6)',
            border: (activeChar === 'male' ? savedMale : savedFemale)
              ? '1px solid #00ff88'
              : 'none',
            borderRadius: '14px', color: 'white',
            fontSize: '16px', fontWeight: '800',
            cursor: 'pointer', marginBottom: '12px',
            letterSpacing: '1px',
            transition: 'all 0.3s',
          }}
        >
          {(activeChar === 'male' ? savedMale : savedFemale) ? '✓ FIT LOCKED IN' : '🔒 LOCK IN FIT'}
        </motion.button>

        {/* Continue button */}
        {canContinue && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={onComplete}
              style={{
                width: '100%', padding: '16px',
                background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
                border: 'none', borderRadius: '14px', color: '#1a0a00',
                fontSize: '18px', fontWeight: '900',
                cursor: 'pointer', marginBottom: '20px',
                boxShadow: '0 0 30px rgba(255,215,0,0.4)',
                letterSpacing: '1px',
              }}
            >
              BOTH FITS SECURED → LEVEL 2 🎮
            </motion.button>
          </motion.div>
        )}
        {!canContinue && (
          <div style={{
            textAlign: 'center', fontSize: '12px',
            color: '#444', marginBottom: '20px',
          }}>
            {!savedMale && !savedFemale ? 'Lock in both fits to continue' :
              !savedMale ? 'Still need: His Fit' : 'Still need: Her Fit'}
          </div>
        )}
      </div>

      <NarratorBox text={narratorText} visible={showNarrator} />
    </div>
  );
}
