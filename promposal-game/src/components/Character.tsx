import type { CharacterConfig } from '../types';

function lighten(hex: string, amount = 30): string {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `rgb(${r},${g},${b})`;
}

function darken(hex: string, amount = 30): string {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0xff) - amount);
  const b = Math.max(0, (num & 0xff) - amount);
  return `rgb(${r},${g},${b})`;
}

interface Props {
  config: CharacterConfig;
  gender: 'male' | 'female';
  size?: number;
  animate?: boolean;
}

export function Character({ config, gender, size = 160, animate = false }: Props) {
  const { skinTone, hairStyle, hairColor, outfitColor, accessory } = config;

  const floatStyle = animate ? {
    animation: 'float 3s ease-in-out infinite',
  } : {};

  if (gender === 'male') {
    return (
      <svg
        width={size}
        height={size * 1.6}
        viewBox="0 0 100 160"
        style={{ ...floatStyle, filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))' }}
      >
        {/* Hair base (behind head) */}
        {hairStyle === 0 && (
          <rect x="26" y="10" width="48" height="22" rx="5" fill={hairColor} />
        )}
        {hairStyle === 1 && (
          <ellipse cx="50" cy="18" rx="26" ry="14" fill={hairColor} />
        )}
        {hairStyle === 2 && (
          <>
            <rect x="24" y="12" width="52" height="20" rx="6" fill={hairColor} />
            <rect x="22" y="20" width="8" height="30" rx="4" fill={hairColor} />
            <rect x="70" y="20" width="8" height="30" rx="4" fill={hairColor} />
          </>
        )}
        {hairStyle === 3 && (
          <path d="M26 22 Q28 5 50 5 Q72 5 74 22 Q65 8 50 8 Q35 8 26 22Z" fill={hairColor} />
        )}

        {/* Head */}
        <ellipse cx="50" cy="30" rx="22" ry="24" fill={skinTone} />

        {/* Eyes */}
        <circle cx="41" cy="27" r="5" fill="white" />
        <circle cx="59" cy="27" r="5" fill="white" />
        <circle cx="42" cy="28" r="3" fill="#1a1a1a" />
        <circle cx="60" cy="28" r="3" fill="#1a1a1a" />
        <circle cx="43.5" cy="26.5" r="1" fill="white" />
        <circle cx="61.5" cy="26.5" r="1" fill="white" />
        {/* Eyebrows */}
        <path d="M37 22 Q41 20 45 22" stroke={hairColor} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M55 22 Q59 20 63 22" stroke={hairColor} strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Nose */}
        <circle cx="50" cy="33" r="2" fill={darken(skinTone, 20)} />

        {/* Mouth */}
        <path d="M44 40 Q50 45 56 40" stroke="#c45a4a" fill="none" strokeWidth="1.8" strokeLinecap="round" />

        {/* Neck */}
        <rect x="44" y="52" width="12" height="10" fill={skinTone} />

        {/* Suit jacket */}
        <rect x="28" y="61" width="44" height="50" rx="4" fill={outfitColor} />
        {/* White shirt */}
        <rect x="44" y="61" width="12" height="50" fill="#f0f0f0" />
        {/* Bow tie */}
        <polygon points="47,67 50,71 53,67 50,64" fill="#ff2d78" />
        {/* Left lapel */}
        <path d="M44 61 L32 76 L44 80Z" fill={lighten(outfitColor, 20)} />
        {/* Right lapel */}
        <path d="M56 61 L68 76 L56 80Z" fill={lighten(outfitColor, 20)} />
        {/* Jacket pocket */}
        <rect x="31" y="78" width="10" height="6" rx="1" fill={lighten(outfitColor, 10)} />
        {/* Pocket square */}
        <path d="M33 78 L35 75 L38 78" fill="#ff2d78" />

        {/* Left arm */}
        <rect x="11" y="62" width="18" height="44" rx="9" fill={outfitColor} />
        {/* Right arm */}
        <rect x="71" y="62" width="18" height="44" rx="9" fill={outfitColor} />
        {/* Left hand */}
        <circle cx="20" cy="110" r="9" fill={skinTone} />
        {/* Right hand */}
        <circle cx="80" cy="110" r="9" fill={skinTone} />

        {/* Pants */}
        <rect x="31" y="109" width="18" height="46" rx="4" fill={darken(outfitColor, 15)} />
        <rect x="51" y="109" width="18" height="46" rx="4" fill={darken(outfitColor, 15)} />

        {/* Shoes */}
        <ellipse cx="40" cy="157" rx="13" ry="7" fill="#1a1a1a" />
        <ellipse cx="60" cy="157" rx="13" ry="7" fill="#1a1a1a" />

        {/* Hair overlay (front) */}
        {hairStyle === 0 && (
          <rect x="27" y="8" width="46" height="12" rx="4" fill={hairColor} />
        )}

        {/* Accessory */}
        {accessory === 1 && (
          <g>
            <rect x="30" y="0" width="40" height="20" rx="2" fill="#1a1a1a" />
            <rect x="24" y="18" width="52" height="5" rx="2" fill="#1a1a1a" />
            <rect x="33" y="2" width="34" height="16" rx="1" fill="#2a2a2a" />
          </g>
        )}
        {accessory === 2 && (
          <g>
            <circle cx="41" cy="27" r="8" fill="none" stroke="#ffd700" strokeWidth="2" />
            <circle cx="59" cy="27" r="8" fill="none" stroke="#ffd700" strokeWidth="2" />
            <line x1="49" y1="27" x2="51" y2="27" stroke="#ffd700" strokeWidth="2" />
            <line x1="28" y1="27" x2="33" y2="27" stroke="#ffd700" strokeWidth="2" />
            <line x1="67" y1="27" x2="72" y2="27" stroke="#ffd700" strokeWidth="2" />
          </g>
        )}
        {accessory === 3 && (
          <g>
            <path d="M30 14 L35 3 L42 11 L50 1 L58 11 L65 3 L70 14Z" fill="#ffd700" />
            <rect x="30" y="14" width="40" height="5" rx="1" fill="#ffd700" />
            <circle cx="50" cy="5" r="2" fill="#ff2d78" />
            <circle cx="38" cy="8" r="1.5" fill="#00ff88" />
            <circle cx="62" cy="8" r="1.5" fill="#00ff88" />
          </g>
        )}
        {accessory === 0 && hairStyle !== 0 && hairStyle !== 1 && hairStyle !== 2 && hairStyle !== 3 && (
          <></>
        )}
      </svg>
    );
  }

  // Female character
  return (
    <svg
      width={size}
      height={size * 1.6}
      viewBox="0 0 100 160"
      style={{ ...floatStyle, filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))' }}
    >
      {/* Hair base */}
      {hairStyle === 0 && (
        <>
          <ellipse cx="50" cy="18" rx="25" ry="15" fill={hairColor} />
          <rect x="25" y="18" width="8" height="40" rx="4" fill={hairColor} />
          <rect x="67" y="18" width="8" height="40" rx="4" fill={hairColor} />
        </>
      )}
      {hairStyle === 1 && (
        <>
          <ellipse cx="50" cy="16" rx="26" ry="16" fill={hairColor} />
          <ellipse cx="28" cy="30" rx="10" ry="20" fill={hairColor} />
          <ellipse cx="72" cy="30" rx="10" ry="20" fill={hairColor} />
        </>
      )}
      {hairStyle === 2 && (
        <>
          <ellipse cx="50" cy="15" rx="25" ry="13" fill={hairColor} />
          <path d="M25 20 Q20 50 22 80 Q26 50 28 20Z" fill={hairColor} />
          <path d="M75 20 Q80 50 78 80 Q74 50 72 20Z" fill={hairColor} />
          <path d="M28 75 Q35 90 50 92 Q65 90 72 75" stroke={hairColor} strokeWidth="6" fill="none" />
        </>
      )}
      {hairStyle === 3 && (
        <>
          <ellipse cx="50" cy="14" rx="26" ry="14" fill={hairColor} />
          <circle cx="25" cy="24" r="12" fill={hairColor} />
          <circle cx="75" cy="24" r="12" fill={hairColor} />
        </>
      )}

      {/* Head */}
      <ellipse cx="50" cy="30" rx="22" ry="24" fill={skinTone} />

      {/* Eyes with lashes */}
      <circle cx="41" cy="27" r="5.5" fill="white" />
      <circle cx="59" cy="27" r="5.5" fill="white" />
      <circle cx="41.5" cy="28" r="3.5" fill="#1a1a1a" />
      <circle cx="59.5" cy="28" r="3.5" fill="#1a1a1a" />
      <circle cx="43" cy="26.5" r="1.2" fill="white" />
      <circle cx="61" cy="26.5" r="1.2" fill="white" />
      {/* Eyelashes */}
      <path d="M36 24 L37 20 M38 23 L38 19 M40 22 L41 18" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M54 22 L55 18 M57 23 L58 19 M60 24 L61 20" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" />
      {/* Eyebrows - arched */}
      <path d="M36 21 Q41 18 46 21" stroke={hairColor} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M54 21 Q59 18 64 21" stroke={hairColor} strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Blush */}
      <circle cx="36" cy="35" r="5" fill="rgba(255,100,120,0.25)" />
      <circle cx="64" cy="35" r="5" fill="rgba(255,100,120,0.25)" />

      {/* Nose */}
      <path d="M48 34 Q50 36 52 34" stroke={darken(skinTone, 20)} strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* Lips */}
      <path d="M44 40 Q47 43 50 41 Q53 43 56 40" stroke="#e75480" fill="none" strokeWidth="2" strokeLinecap="round" />
      <path d="M44 40 Q47 37 50 38 Q53 37 56 40" fill="#e75480" />

      {/* Neck */}
      <rect x="44" y="52" width="12" height="10" fill={skinTone} />

      {/* Dress - bodice */}
      <rect x="34" y="61" width="32" height="30" rx="3" fill={outfitColor} />
      {/* Neckline */}
      <path d="M44 61 Q50 70 56 61" fill={darken(outfitColor, 20)} />
      {/* Sparkles on dress */}
      <text x="37" y="85" fontSize="8" fill="rgba(255,255,255,0.6)">✦</text>
      <text x="52" y="80" fontSize="6" fill="rgba(255,255,255,0.5)">✦</text>
      {/* Dress skirt - A-line */}
      <path d="M34 90 L18 155 L82 155 L66 90Z" fill={outfitColor} />
      {/* Skirt layers */}
      <path d="M30 105 L16 155 L84 155 L70 105Z" fill={lighten(outfitColor, 15)} opacity="0.5" />
      <path d="M26 120 L14 155 L86 155 L74 120Z" fill={lighten(outfitColor, 25)} opacity="0.3" />

      {/* Left arm */}
      <rect x="17" y="62" width="16" height="36" rx="8" fill={skinTone} />
      {/* Right arm */}
      <rect x="67" y="62" width="16" height="36" rx="8" fill={skinTone} />
      {/* Hands */}
      <circle cx="25" cy="100" r="8" fill={skinTone} />
      <circle cx="75" cy="100" r="8" fill={skinTone} />

      {/* Shoes */}
      <ellipse cx="40" cy="157" rx="10" ry="5" fill={darken(outfitColor, 20)} />
      <rect x="37" y="148" width="6" height="12" rx="2" fill={darken(outfitColor, 20)} />
      <ellipse cx="60" cy="157" rx="10" ry="5" fill={darken(outfitColor, 20)} />
      <rect x="57" y="148" width="6" height="12" rx="2" fill={darken(outfitColor, 20)} />

      {/* Hair front overlay */}
      {(hairStyle === 0 || hairStyle === 3) && (
        <path d="M26 18 Q28 8 50 7 Q72 8 74 18 Q65 10 50 10 Q35 10 26 18Z" fill={hairColor} />
      )}

      {/* Accessories */}
      {accessory === 1 && (
        <g>
          <ellipse cx="50" cy="10" rx="20" ry="8" fill={lighten(outfitColor, 20)} />
          <ellipse cx="50" cy="10" rx="18" ry="6" fill={darken(outfitColor, 10)} />
        </g>
      )}
      {accessory === 2 && (
        <g>
          <circle cx="41" cy="27" r="8" fill="none" stroke="#ffd700" strokeWidth="1.5" />
          <circle cx="59" cy="27" r="8" fill="none" stroke="#ffd700" strokeWidth="1.5" />
          <line x1="49" y1="27" x2="51" y2="27" stroke="#ffd700" strokeWidth="1.5" />
        </g>
      )}
      {accessory === 3 && (
        <g>
          <path d="M30 16 L35 4 L42 12 L50 2 L58 12 L65 4 L70 16Z" fill="#ffd700" />
          <rect x="30" y="16" width="40" height="4" rx="1" fill="#ffd700" />
          <circle cx="50" cy="6" r="2" fill="#ff2d78" />
          <circle cx="38" cy="9" r="1.5" fill="#00ff88" />
          <circle cx="62" cy="9" r="1.5" fill="#8b5cf6" />
        </g>
      )}
    </svg>
  );
}
