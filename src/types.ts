/**
 * Types definition for Flag Color Challenge!
 */

export type FlagRenderType =
  | 'vertical-3-stripes'
  | 'horizontal-3-stripes'
  | 'horizontal-2-stripes'
  | 'horizontal-5-stripes'
  | 'circle-center'
  | 'nordic-cross'
  | 'swiss-cross'
  | 'spain-stripes';

export interface FlagVariation {
  id: string;
  colors: string[];
  isCorrect: boolean;
  label?: string; // Optional Thai description of this variation (for learning)
}

export interface CountryFlagData {
  id: string;
  nameTh: string;
  nameEn: string;
  renderType: FlagRenderType;
  description: string; // Educational explanation of the flag's colors & meaning
  ratio?: string; // e.g. "3:2", "2:1"
  correctColors: string[];
  variations: FlagVariation[]; // Pre-defined distractors + correct variation
}

export interface Question {
  questionNumber: number;
  country: CountryFlagData;
  options: FlagVariation[];
  correctOptionId: string;
}

export interface AnswerResult {
  questionNumber: number;
  country: CountryFlagData;
  selectedOption: FlagVariation;
  correctOption: FlagVariation;
  isCorrect: boolean;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  timeSeconds: number;
  timestamp: number;
}

export type GamePhase = 'intro' | 'playing' | 'answered' | 'result' | 'leaderboard';
