import React from 'react';
import { AppScreen } from '../../types';
import { Flame, Heart, Sparkles, MessageSquare, User } from 'lucide-react';

interface BottomNavProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen, subTab?: 'all' | 'new' | 'likes') => void;
  unreadMatchesCount: number;
  newLikesCount?: number;
  activeMatchesTab?: 'all' | 'new' | 'likes';
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  unreadMatchesCount,
  newLikesCount = 0,
  activeMatchesTab
}) => {
  const isAppView = ['discovery', 'matches', 'chat', 'my_profile', 'settings'].includes(currentScreen);

  if (!isAppView) return null;

  const navItems = [
    {
      id: 'discovery' as AppScreen,
      subTab: undefined,
      label: '探す',
      icon: <Flame className="w-5 h-5" />
    },
    {
      id: 'matches' as AppScreen,
      subTab: 'likes' as const,
      label: 'LIKE',
      icon: <Heart className="w-5 h-5" />,
      badge: newLikesCount
    },
    {
      id: 'matches' as AppScreen,
      subTab: 'new' as const,
      label: 'MATCH',
      icon: <Sparkles className="w-5 h-5" />
    },
    {
      id: 'matches' as AppScreen,
      subTab: 'all' as const,
      label: 'メッセージ',
      icon: <MessageSquare className="w-5 h-5" />,
      badge: unreadMatchesCount
    },
    {
      id: 'my_profile' as AppScreen,
      subTab: undefined,
      label: 'プロフィール',
      icon: <User className="w-5 h-5" />
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/80 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      <div className="max-w-md mx-auto flex items-center justify-between h-16 px-0.5">
        {navItems.map((item, index) => {
          let isActive = false;
          if (item.id === 'discovery' && currentScreen === 'discovery') {
            isActive = true;
          } else if (item.id === 'my_profile' && (currentScreen === 'my_profile' || currentScreen === 'settings')) {
            isActive = true;
          } else if (item.id === 'matches') {
            if (item.subTab === 'likes' && currentScreen === 'matches' && activeMatchesTab === 'likes') {
              isActive = true;
            } else if (item.subTab === 'new' && currentScreen === 'matches' && activeMatchesTab === 'new') {
              isActive = true;
            } else if (item.subTab === 'all' && (currentScreen === 'chat' || (currentScreen === 'matches' && (activeMatchesTab === 'all' || !activeMatchesTab)))) {
              isActive = true;
            }
          }

          return (
            <button
              key={`${item.id}-${index}`}
              onClick={() => onNavigate(item.id, item.subTab)}
              className={`flex-1 flex flex-col items-center justify-center h-full relative transition duration-150 active:scale-95 ${
                isActive ? 'text-orange-500 font-bold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-orange-500 text-zinc-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-1 tracking-tight font-extrabold whitespace-nowrap">
                {item.label}
              </span>

              {isActive && (
                <div className="absolute top-0 w-8 h-0.5 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
