import React from 'react';
import { Page } from '../types';
import { HomeIcon, LotusGrowthIcon, ChatIcon, RitualsIcon, SettingsIcon } from '../constants';

interface BottomNavProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const NavItem = ({ icon, label, isActive, onClick }: { icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }) => (
  <button onClick={onClick} className="flex flex-col items-center justify-center w-1/5 h-full text-xs font-medium transition-transform transform active:scale-95 focus:outline-none">
    {icon}
    <span className={`mt-1 font-semibold ${isActive ? 'text-lotus-black' : 'text-stone-400'}`}>{label}</span>
  </button>
);

const BottomNav = ({ activePage, onNavigate }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/70 backdrop-blur-md border-t border-stone-200/50 flex justify-around items-center z-50 max-w-md mx-auto">
      <NavItem icon={<HomeIcon active={activePage === Page.Home} />} label="Home" isActive={activePage === Page.Home} onClick={() => onNavigate(Page.Home)} />
      <NavItem icon={<LotusGrowthIcon active={activePage === Page.Growth} />} label="Growth" isActive={activePage === Page.Growth} onClick={() => onNavigate(Page.Growth)} />
      
      <button onClick={() => onNavigate(Page.Chat)} className="relative -top-6 flex items-center justify-center w-16 h-16 bg-lotus-black rounded-full shadow-lg text-amber-50 transform transition-transform active:scale-95 hover:bg-lotus-text-dark focus:outline-none animate-pulse-glow">
        <ChatIcon />
      </button>

      <NavItem icon={<RitualsIcon active={activePage === Page.Rituals} />} label="Rituals" isActive={activePage === Page.Rituals} onClick={() => onNavigate(Page.Rituals)} />
      <NavItem icon={<SettingsIcon active={activePage === Page.Settings} />} label="Settings" isActive={activePage === Page.Settings} onClick={() => onNavigate(Page.Settings)} />
    </nav>
  );
};

export default BottomNav;