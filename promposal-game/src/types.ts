export type GamePhase = 'intro' | 'level1' | 'level2' | 'level3' | 'reveal' | 'yes' | 'no';

export interface CharacterConfig {
  skinTone: string;
  hairStyle: number;
  hairColor: string;
  outfitColor: string;
  accessory: number;
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

export const SKIN_TONES = ['#FDBCB4', '#F4C2A1', '#D4956A', '#B07040', '#8B5E3C', '#5C3317'];
export const HAIR_COLORS = ['#1a1a1a', '#4a3728', '#8B4513', '#d4a017', '#ff2d78', '#8b5cf6'];
export const OUTFIT_COLORS_MALE = ['#1a1a2e', '#2d3561', '#1a4a1a', '#3a0020', '#2d2d2d', '#1a3a4a'];
export const OUTFIT_COLORS_FEMALE = ['#FF69B4', '#9b59b6', '#e74c3c', '#2980b9', '#1abc9c', '#f39c12'];

export const DEFAULT_MALE: CharacterConfig = {
  skinTone: '#FDBCB4',
  hairStyle: 0,
  hairColor: '#1a1a1a',
  outfitColor: '#1a1a2e',
  accessory: 0,
};

export const DEFAULT_FEMALE: CharacterConfig = {
  skinTone: '#F4C2A1',
  hairStyle: 2,
  hairColor: '#8B4513',
  outfitColor: '#FF69B4',
  accessory: 0,
};
