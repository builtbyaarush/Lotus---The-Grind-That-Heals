
export enum Page {
  Home = 'Home',
  Growth = 'Growth',
  Chat = 'Chat',
  Rituals = 'Rituals',
  Settings = 'Settings',
}

export enum Rank {
  Seed = 'Seed',
  Sprout = 'Sprout',
  Bud = 'Bud',
  Bloom = 'Bloom',
  RadiantLotus = 'Radiant Lotus',
  GoldenLotus = 'Golden Lotus',
}

export interface User {
  name: string;
  age: number;
  email?: string;
}

export interface XP {
  body: number;
  mind: number;
  soul: number;
}

export interface Ritual {
  id: string;
  type: keyof XP;
  name: string;
  xp: number;
  completed: boolean;
}

export interface GameState {
  level: number;
  xp: XP;
  totalXp: number;
  rank: Rank;
  streak: number;
  aura: number; // 0-100
  lotusBloomPower: number; // 0-100
  petals: number;
  dailyReflection: string;
  mood: string;
  dailyRituals: Ritual[];
  lastPlayed: string; // ISO date string
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}