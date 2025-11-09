import React from 'react';
import type { GameState } from './types';
import { Rank } from './types';

export const INITIAL_GAME_STATE: GameState = {
  level: 1,
  xp: { body: 0, mind: 0, soul: 0 },
  totalXp: 0,
  rank: Rank.Seed,
  streak: 0,
  aura: 50,
  lotusBloomPower: 50,
  petals: 0,
  dailyReflection: '',
  mood: '😐',
  dailyRituals: [
      { id: 'm1', type: 'soul', name: 'Meditate', xp: 25, completed: false },
      { id: 'b1', type: 'body', name: 'Light Exercise', xp: 20, completed: false },
      { id: 'd1', type: 'mind', name: 'Play', xp: 15, completed: false }
  ],
  lastPlayed: new Date().toISOString(),
};

export const XP_PER_LEVEL = 1000;

export const RANK_THRESHOLDS: Record<Rank, number> = {
  [Rank.Seed]: 0,
  [Rank.Sprout]: 500,
  [Rank.Bud]: 2000,
  [Rank.Bloom]: 5000,
  [Rank.RadiantLotus]: 10000,
  [Rank.GoldenLotus]: 25000,
};

export const MOODS = ['😄', '😊', '😐', '😔', '😠'];

// --- SVG Icons ---

export const HomeIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 transition-colors ${active ? 'text-lotus-black' : 'text-stone-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);

export const LotusGrowthIcon = ({ active }: { active: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 transition-colors ${active ? 'text-lotus-black' : 'text-stone-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25c-2.488 0-4.525 2.037-4.5 4.525 0 2.488 2.037 4.525 4.5 4.525s4.525-2.037 4.525-4.5c0-2.488-2.037-4.525-4.525-4.525z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-2.488 0-4.5 2.037-4.5 4.525v0c0 2.488 2.037 4.525 4.5 4.525s4.5-2.037 4.5-4.525v0c0-2.488-2.037-4.525-4.5-4.525z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75c2.488 0 4.5-2.037 4.5-4.525v0c0-2.488-2.037-4.525-4.5-4.525s-4.5 2.037-4.5 4.525v0c0 2.488 2.037 4.525 4.5 4.525z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12c0-2.488 2.037-4.5 4.525-4.5h0c2.488 0 4.525 2.037 4.525 4.5s-2.037 4.525-4.525 4.525h0c-2.488 0-4.525-2.037-4.525-4.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 12c0 2.488-2.037 4.525-4.5 4.525h0c-2.488 0-4.525-2.037-4.525-4.5s2.037-4.5 4.525-4.5h0c2.488 0 4.5 2.037 4.5 4.5z" />
    </svg>
);


export const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

export const RitualsIcon = ({ active }: { active: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 transition-colors ${active ? 'text-lotus-black' : 'text-stone-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);


export const SettingsIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 transition-colors ${active ? 'text-lotus-black' : 'text-stone-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const DumbbellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
    </svg>
);

export const GamepadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h.01M12 12h.01M18 12h.01M7 16h10a2 2 0 002-2V9a2 2 0 00-2-2H7a2 2 0 00-2 2v5a2 2 0 002 2z" />
    </svg>
);

export const LeafIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.177 17.622a.75.75 0 01-1.06 0l-3-3a.75.75 0 011.06-1.06l3 3a.75.75 0 010 1.06z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.728 21.378a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06l7.5 7.5a.75.75 0 010 1.06z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 8.625c0-4.02-3.255-7.275-7.275-7.275-4.02 0-7.275 3.255-7.275 7.275 0 4.02 3.255 7.275 7.275 7.275s7.275-3.255 7.275-7.275z" />
    </svg>
);

export const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

export const SkullIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);

export const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);

export const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
);

export const AuraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);