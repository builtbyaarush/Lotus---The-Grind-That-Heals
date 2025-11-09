
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { User, GameState, Ritual, ChatMessage, XP } from './types';
import { Page, Rank } from './types';
import { 
    INITIAL_GAME_STATE, XP_PER_LEVEL, RANK_THRESHOLDS, MOODS, 
    DumbbellIcon, GamepadIcon, LeafIcon, SendIcon, SkullIcon, ArrowRightIcon, AuraIcon,
    ArrowLeftIcon, RitualsIcon
} from './constants';
import * as GeminiService from './services/geminiService';
import BottomNav from './components/BottomNav';
import Mandala from './components/Mandala';

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

// --- SCREENS ---

const AuthScreen = ({ onLogin }: { onLogin: (user: User) => void }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [showGuestForm, setShowGuestForm] = useState(false);

    const handleGuestLogin = () => {
        if (name.trim() && parseInt(age) > 0) {
            onLogin({ name: name.trim(), age: parseInt(age) });
        }
    };

    return (
        <div className="flex flex-col items-center justify-between min-h-screen p-8 text-center text-lotus-text-dark animate-fadeIn">
            <div className="w-full">
                <div className="flex justify-center mt-8">
                    <Mandala progress={20} petals={3} aura={75} isPulsing />
                </div>
                <h1 className="text-4xl font-bold mt-4">Yoo! I'm Lotus</h1>
                <p className="mt-2 text-lotus-text">A method to Know. Rise. Shine. Grow.</p>
            </div>
            
            {showGuestForm ? (
                <div className="w-full max-w-sm transition-opacity duration-300">
                    <h2 className="text-xl font-semibold mb-4">Your info.</h2>
                    <input type="text" placeholder="Name.." value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 mb-3 bg-lotus-beige-light border border-lotus-beige rounded-xl text-center placeholder-lotus-text/50 focus:outline-none focus:ring-2 focus:ring-lotus-beige" />
                    <input type="number" placeholder="Age.." value={age} onChange={(e) => setAge(e.target.value)} className="w-full p-3 mb-6 bg-lotus-beige-light border border-lotus-beige rounded-xl text-center placeholder-lotus-text/50 focus:outline-none focus:ring-2 focus:ring-lotus-beige" />
                    <button onClick={handleGuestLogin} disabled={!name || !age} className="w-full py-3 bg-lotus-beige text-lotus-text-dark rounded-xl shadow-md font-semibold border border-amber-800/20 transition-transform transform active:scale-95 disabled:opacity-50">
                       Go ahead!
                   </button>
                </div>
            ) : (
                <div className="w-full max-w-sm space-y-3">
                     <p className="font-semibold text-lotus-text mb-2">Sign up with</p>
                    <button className="w-full py-3 bg-lotus-beige-light text-lotus-text-dark rounded-xl shadow-sm font-semibold border border-lotus-beige transition-transform transform active:scale-95 flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.657-3.657-11.303-8.524l-6.571,4.819C9.656,39.663,16.318,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.904,36.213,44,30.561,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
                        Google
                    </button>
                    <button className="w-full py-3 bg-lotus-beige-light text-lotus-text-dark rounded-xl shadow-sm font-semibold border border-lotus-beige transition-transform transform active:scale-95 flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path></svg>
                        Email
                    </button>
                    <button onClick={() => setShowGuestForm(true)} className="w-full py-3 bg-lotus-beige-light text-lotus-text-dark rounded-xl shadow-sm font-semibold border border-lotus-beige transition-transform transform active:scale-95 flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd"></path></svg>
                        Guest
                    </button>
                </div>
            )}
             <p className="text-sm text-lotus-text/70 mt-4">Already have an account? <a href="#" className="font-semibold text-lotus-text">Login</a></p>
        </div>
    );
};

const HomeScreen = ({ user, gameState, updateReflection, updateMood, generateRituals }: { user: User, gameState: GameState, updateReflection: (text: string) => void, updateMood: (mood: string) => void, generateRituals: () => void }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateRituals = async () => {
        setIsLoading(true);
        await generateRituals();
        setIsLoading(false);
    };

    const ritualIcons: Record<string, React.ReactNode> = {
        'Light Exercise': <DumbbellIcon />,
        'Play': <GamepadIcon />,
        'Meditate': <LeafIcon />,
    };

    return (
        <div className="p-4 pb-24">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-4xl text-lotus-text-dark" style={{marginTop: "1ch",}}>Hello, {user.name} 👋</h1>
                    <p className="text-lotus-text">How are you feeling?</p>
                </div>
                {gameState.streak > 0 && (
                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-orange-100 rounded-full text-orange-600 font-bold shadow-sm border border-orange-200">
                        <span className="text-lg" role="img" aria-label="Fire emoji">🔥</span>
                        <span className="text-sm">{gameState.streak} Day Streak</span>
                    </div>
                )}
            </div>

            <div className="mt-4 p-3 bg-lotus-beige rounded-2xl shadow-sm">
                <div className="flex items-end">
                    <textarea 
                        value={gameState.dailyReflection}
                        onChange={(e) => updateReflection(e.target.value)}
                        placeholder="Your daily reflection..." 
                        className="flex-1 h-20 p-2 bg-transparent rounded-lg resize-none focus:outline-none text-lotus-text-dark placeholder:text-lotus-text/60"
                        aria-label="Daily reflection input"
                    />
                     <button onClick={handleGenerateRituals} disabled={!gameState.dailyReflection || isLoading} className="p-2 mb-1 mr-1 bg-lotus-beige-light rounded-full transition-all transform active:scale-90 disabled:opacity-50 disabled:scale-100" aria-label="Generate new rituals">
                        {isLoading ? <div className="w-5 h-5 border-2 border-lotus-text-dark border-t-transparent rounded-full animate-spin"></div> : <SendIcon />}
                    </button>
                </div>
                <div className="flex justify-between items-center mt-2 border-t border-amber-800/10 pt-3">
                    <p className="text-sm font-semibold text-lotus-text-dark ml-2">Daily Mood</p>
                    <div className="flex space-x-2">
                        {MOODS.map(m => (
                            <button key={m} onClick={() => updateMood(m)} className={`text-2xl p-1 rounded-full transition-all transform hover:scale-110 active:scale-100 ${gameState.mood === m ? 'bg-amber-800/20 scale-110' : 'opacity-50 hover:opacity-100'}`} aria-label={`Set mood to ${m}`}>
                                {m}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <h2 className="text-xl text-lotus-text-dark">Today's Rituals</h2>
                <div className="grid grid-cols-3 gap-3 mt-3">
                    {gameState.dailyRituals.map((ritual, index) => (
                        <div key={ritual.id} className="p-4 rounded-2xl flex flex-col items-center justify-center text-center bg-lotus-beige-light border border-lotus-beige/50 transition-all duration-300" style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s forwards`, opacity: 0}}>
                            <div className="text-lotus-text-dark">
                                {ritualIcons[ritual.name] || <LeafIcon />}
                            </div>
                            <p className="font-semibold text-sm mt-2 text-lotus-text-dark">{ritual.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const ProgressScreen = ({ gameState, onNavigateBack }: { gameState: GameState, onNavigateBack: () => void }) => {
    const [insight, setInsight] = useState('');
    
    useEffect(() => {
        setInsight('');
        GeminiService.getProgressInsight(gameState.rank, gameState.aura).then(setInsight);
    }, [gameState.rank, gameState.aura]);

    const levelProgress = ((gameState.totalXp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100;

    return (
        <div className="p-4 pb-24">
            <header className="relative flex items-center justify-center mb-6">
                <button onClick={onNavigateBack} className="absolute left-0 p-2 rounded-full hover:bg-lotus-beige-light transition-colors" aria-label="Go back">
                    <ArrowLeftIcon />
                </button>
                <h1 className="text-3xl text-lotus-text-dark">Your Growth</h1>
            </header>

            <div className="relative flex justify-center my-6">
                <Mandala progress={levelProgress} petals={gameState.petals} aura={gameState.aura} />
            </div>
            
             <div className="mt-6 p-4 bg-lotus-beige rounded-2xl shadow-sm text-left">
                <h2 className="text-xl font-bold text-lotus-text-dark">Overview</h2>
                 {insight ? <p className="text-lotus-text mt-1">{insight}</p> : <div className="h-5 w-3/4 bg-lotus-beige-light rounded mt-2 animate-pulse"></div>}

                <div className="flex items-center justify-between mt-4 border-t border-amber-800/10 pt-3">
                    <div className="text-lg font-semibold text-lotus-text-dark">
                        <span>Level {gameState.level}</span> &bull; <span className="font-lora">{gameState.rank}</span>
                        <p className="text-sm text-lotus-text/80">{gameState.totalXp} XP</p>
                    </div>
                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full font-bold">
                        <AuraIcon />
                        <span>{gameState.aura} Aura</span>
                    </div>
                </div>
            </div>
        </div>
    )
};


const ChatScreen = ({ onNavigateBack }: { onNavigateBack: () => void }) => {
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);
    
    const handleSend = async () => {
        if (!message.trim() || isLoading) return;
        
        const userMessage: ChatMessage = { role: 'user', text: message };
        setHistory(prev => [...prev, userMessage]);
        setMessage('');
        setIsLoading(true);

        const responseText = await GeminiService.getChatResponse(history, message);
        const modelMessage: ChatMessage = { role: 'model', text: responseText };
        setHistory(prev => [...prev, modelMessage]);
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col h-screen bg-lotus-background">
            <header className="relative flex items-center justify-center p-4 border-b border-lotus-beige">
                <button onClick={onNavigateBack} className="absolute left-4 p-2 rounded-full hover:bg-lotus-beige-light transition-colors" aria-label="Go back">
                    <ArrowLeftIcon />
                </button>
                <h1 className="text-2xl font-bold text-center text-lotus-text-dark">Lotus AI</h1>
            </header>
            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {history.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                        <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.role === 'user' ? 'bg-lotus-beige text-lotus-text-dark' : 'bg-white text-lotus-text-dark shadow-sm'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                 {isLoading && <div className="flex justify-start"><div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-white text-lotus-text shadow-sm animate-pulse">...</div></div>}
                <div ref={chatEndRef} />
            </main>
            <footer className="p-2 border-t border-lotus-beige bg-white/70 backdrop-blur-md">
                <div className="flex items-center p-2 bg-white rounded-full shadow-sm">
                    <input 
                        type="text" 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Reflect with Lotus..."
                        className="flex-1 bg-transparent px-3 focus:outline-none text-lotus-text-dark"
                    />
                    <button onClick={handleSend} disabled={isLoading} className="w-10 h-10 flex items-center justify-center bg-lotus-black text-white rounded-full transition-transform transform active:scale-90 disabled:bg-stone-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009.894 15V4.106A1 1 0 0010.894 2.553z" /></svg>
                    </button>
                </div>
            </footer>
        </div>
    );
};

const RitualsScreen = ({gameState, completeRitual, onNavigateBack}: {gameState: GameState, completeRitual: (id: string) => void, onNavigateBack: () => void}) => {
    return (
        <div className="p-4 pb-24">
            <header className="relative flex items-center justify-center mb-6">
                <button onClick={onNavigateBack} className="absolute left-0 p-2 rounded-full hover:bg-lotus-beige-light transition-colors" aria-label="Go back">
                    <ArrowLeftIcon />
                </button>
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-lotus-beige-light rounded-full text-lotus-text-dark">
                        <RitualsIcon active={true} />
                    </div>
                    <h1 className="text-3xl text-lotus-text-dark">Daily Rituals</h1>
                </div>
            </header>
            <div className="space-y-3">
                {gameState.dailyRituals.map(ritual => (
                    <button key={ritual.id} onClick={() => !ritual.completed && completeRitual(ritual.id)} 
                    className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all duration-300 text-left disabled:opacity-70 ${ritual.completed ? 'bg-lotus-beige-light' : 'bg-white shadow-sm'}`}
                    disabled={ritual.completed}
                    >
                        <div>
                            <p className={`font-semibold ${ritual.completed ? 'text-lotus-text/50 line-through' : 'text-lotus-text-dark'}`}>{ritual.xp} XP &bull; {ritual.name}</p>
                        </div>
                        <div className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${ritual.completed ? 'bg-green-200 text-green-700' : 'bg-lotus-black text-white'}`}>
                           {ritual.completed ? '✓' : <ArrowRightIcon />}
                        </div>
                    </button>
                ))}
            </div>
             <p className="text-center text-sm text-lotus-text/70 mt-4">Complete all rituals to boost your Aura.</p>
        </div>
    )
}

const SettingsScreen = ({ user, onLogout, onClearData, onNavigateBack }: { user: User, onLogout: () => void, onClearData: () => void, onNavigateBack: () => void }) => {
    return (
        <div className="p-4 pb-24 bg-white min-h-screen">
            <header className="relative flex items-center justify-center mb-6">
                 <button onClick={onNavigateBack} className="absolute left-0 p-2 rounded-full hover:bg-lotus-beige-light transition-colors" aria-label="Go back">
                    <ArrowLeftIcon />
                </button>
                <h1 className="text-3xl text-lotus-text-dark">Settings</h1>
            </header>
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-lg text-lotus-text">{user.email || 'abc@gmail.com'}</p>
                    <button onClick={onLogout} className="px-5 py-2 bg-lotus-black text-white rounded-full font-semibold text-sm">Log out</button>
                </div>
                <div className="flex items-center justify-between">
                     <p className="text-lg text-lotus-text">{user.name}</p>
                    <button className="px-5 py-2 bg-lotus-black text-white rounded-full font-semibold text-sm">Edit</button>
                </div>
                <button onClick={onClearData} className="w-full flex items-center justify-center py-3 bg-lotus-black text-white rounded-full font-semibold space-x-2">
                    <span>Clear all data</span>
                    <SkullIcon />
                </button>
             </div>
        </div>
    );
};


// --- MAIN APP COMPONENT ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);

  useEffect(() => {
    const savedUser = localStorage.getItem('lotus_user');
    const savedGameState = localStorage.getItem('lotus_gameState');
    if (savedUser && savedGameState) {
      const userFromFile = JSON.parse(savedUser);
      const gameStateFromFile = JSON.parse(savedGameState);

      // --- Streak Check & Daily Reset Logic ---
      const now = new Date();
      const lastPlayedDate = new Date(gameStateFromFile.lastPlayed);
      let finalGameState = { ...gameStateFromFile };

      if (now.toDateString() !== lastPlayedDate.toDateString()) {
          // It's a new day.
          const yesterday = new Date();
          yesterday.setDate(now.getDate() - 1);
          const wasLastPlayedYesterday = lastPlayedDate.toDateString() === yesterday.toDateString();

          const missedRituals = finalGameState.dailyRituals.filter(r => !r.completed).length;
          finalGameState.aura = clamp(finalGameState.aura - (missedRituals * 5), 0, 100);

          // Reset daily progress for any new day
          finalGameState.dailyRituals = finalGameState.dailyRituals.map(r => ({ ...r, completed: false }));
          finalGameState.petals = 0;

          // Reset streak if a day was missed
          if (!wasLastPlayedYesterday) {
              finalGameState.streak = 0;
          }
      }
      
      setUser(userFromFile);
      setGameState(finalGameState);
    }
  }, []);

  useEffect(() => {
    if (user && gameState) {
      localStorage.setItem('lotus_user', JSON.stringify(user));
      localStorage.setItem('lotus_gameState', JSON.stringify(gameState));
    }
  }, [user, gameState]);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setGameState(INITIAL_GAME_STATE);
  };

  const handleLogout = () => {
    localStorage.removeItem('lotus_user');
    localStorage.removeItem('lotus_gameState');
    setUser(null);
    GeminiService.clearChat();
  };

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all your progress? This cannot be undone.")) {
        setGameState(INITIAL_GAME_STATE);
        handleLogout();
    }
  };
  
  const updateGameState = useCallback((updater: (prevState: GameState) => GameState) => {
      setGameState(prevState => {
          let newState = updater(prevState);
          
          const newLevel = Math.floor(newState.totalXp / XP_PER_LEVEL) + 1;
          newState.level = newLevel;

          let newRank = newState.rank;
          for (const rank in RANK_THRESHOLDS) {
              if (newState.totalXp >= RANK_THRESHOLDS[rank as Rank]) {
                  newRank = rank as Rank;
              }
          }
          newState.rank = newRank;

          // Clamp Aura here to ensure it's always within bounds
          newState.aura = clamp(newState.aura, 0, 100);

          return newState;
      });
  }, []);

  const completeRitual = useCallback((ritualId: string) => {
      updateGameState(prev => {
          const ritual = prev.dailyRituals.find(r => r.id === ritualId);
          if (!ritual || ritual.completed) return prev;

          const now = new Date();
          const lastPlayedDate = new Date(prev.lastPlayed);
          let newStreak = prev.streak;

          // Increment streak on the first action of a new day
          if (now.toDateString() !== lastPlayedDate.toDateString()) {
              const yesterday = new Date();
              yesterday.setDate(now.getDate() - 1);
              const wasLastPlayedYesterday = lastPlayedDate.toDateString() === yesterday.toDateString();

              if (wasLastPlayedYesterday) {
                  newStreak += 1;
              } else {
                  newStreak = 1;
              }
          }
          
          return {
              ...prev,
              dailyRituals: prev.dailyRituals.map(r => r.id === ritualId ? { ...r, completed: true } : r),
              xp: { ...prev.xp, [ritual.type]: prev.xp[ritual.type] + ritual.xp },
              totalXp: prev.totalXp + ritual.xp,
              petals: Math.min(8, prev.petals + 1),
              streak: newStreak,
              lastPlayed: now.toISOString(),
              aura: prev.aura + 5,
          }
      });
  }, [updateGameState]);

  const generateNewRituals = useCallback(async () => {
      if (!gameState.dailyReflection) return;
      const { rituals } = await GeminiService.getDailyRituals(gameState.dailyReflection, gameState.mood);
      updateGameState(prev => ({
          ...prev,
          dailyRituals: rituals,
          petals: 0
      }));
  }, [gameState.dailyReflection, gameState.mood, updateGameState]);

  const handleUpdateMood = (mood: string) => {
    updateGameState(p => {
        let auraChange = 0;
        if (mood === '😄') auraChange = 5;
        else if (mood === '😊') auraChange = 2;
        else if (mood === '😔') auraChange = -2;
        else if (mood === '😠') auraChange = -5;
        return {...p, mood, aura: p.aura + auraChange};
    })
  };

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <HomeScreen user={user} gameState={gameState} 
            updateReflection={(text) => updateGameState(p => ({...p, dailyReflection: text}))} 
            updateMood={handleUpdateMood}
            generateRituals={generateNewRituals}
        />;
      case Page.Growth:
        return <ProgressScreen gameState={gameState} onNavigateBack={() => setCurrentPage(Page.Home)} />;
      case Page.Chat:
        return <ChatScreen onNavigateBack={() => setCurrentPage(Page.Home)}/>;
      case Page.Rituals:
        return <RitualsScreen gameState={gameState} completeRitual={completeRitual} onNavigateBack={() => setCurrentPage(Page.Home)} />;
      case Page.Settings:
        return <SettingsScreen user={user} onLogout={handleLogout} onClearData={handleClearData} onNavigateBack={() => setCurrentPage(Page.Home)} />;
      default:
        return <HomeScreen user={user} gameState={gameState} 
            updateReflection={(text) => updateGameState(p => ({...p, dailyReflection: text}))} 
            updateMood={handleUpdateMood}
            generateRituals={generateNewRituals}
        />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-lotus-background min-h-screen">
      <main className={currentPage === Page.Chat ? '' : 'pb-20'}>
        <div key={currentPage} className="animate-fadeIn">
         {renderPage()}
        </div>
      </main>
       {currentPage !== Page.Chat && <BottomNav activePage={currentPage} onNavigate={setCurrentPage} />}
    </div>
  );
}