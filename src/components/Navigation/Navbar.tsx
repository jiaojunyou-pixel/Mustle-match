import React, { useState } from 'react';
import { AppScreen } from '../../types';
import { Dumbbell, ArrowLeft, Menu, X, ChevronRight, UserCheck, Flame } from 'lucide-react';

interface NavbarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  activeRole: 'trainee' | 'muscle_lover';
  onRoleToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  activeRole,
  onRoleToggle
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const screensList: { id: AppScreen; label: string; shortLabel: string; num: number; icon: string }[] = [
    { id: 'landing', label: '1. ランディング', shortLabel: 'ランディング', num: 1, icon: '⚡' },
    { id: 'login', label: '2. ログイン', shortLabel: 'ログイン', num: 2, icon: '🔑' },
    { id: 'signup', label: '3. 新規登録', shortLabel: '新規登録', num: 3, icon: '📝' },
    { id: 'profile_creation', label: '4. プロフィール設定', shortLabel: 'プロフ設定', num: 4, icon: '💪' },
    { id: 'discovery', label: '5. ユーザー探索', shortLabel: 'ユーザー探索', num: 5, icon: '🔥' },
    { id: 'matches', label: '6. マッチ一覧', shortLabel: 'マッチ一覧', num: 6, icon: '💬' },
    { id: 'chat', label: '7. メッセージ', shortLabel: 'メッセージ', num: 7, icon: '✉️' },
    { id: 'my_profile', label: '8. マイページ', shortLabel: 'マイページ', num: 8, icon: '👤' },
    { id: 'settings', label: '9. 設定・検索条件', shortLabel: '設定・検索', num: 9, icon: '⚙️' }
  ];

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'landing': return 'MUSCLE MATCH';
      case 'login': return 'ログイン';
      case 'signup': return '新規登録';
      case 'profile_creation': return 'プロフィール設定';
      case 'discovery': return 'ユーザー探索';
      case 'matches': return 'マッチ一覧';
      case 'chat': return 'メッセージ';
      case 'my_profile': return 'マイページ';
      case 'settings': return '設定';
      default: return 'MUSCLE MATCH';
    }
  };

  const showBackButton = ['chat', 'login', 'signup', 'profile_creation'].includes(currentScreen);

  return (
    <header className="sticky top-0 z-40 glass-header px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        
        {/* Left Action / Brand */}
        <div className="flex items-center space-x-2">
          {showBackButton ? (
            <button
              onClick={() => onNavigate(currentScreen === 'chat' ? 'matches' : 'discovery')}
              className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition"
              aria-label="戻る"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => onNavigate('discovery')}
              className="flex items-center space-x-2 group text-left"
            >
              <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-zinc-950 shadow-md">
                <Dumbbell className="w-4 h-4 text-zinc-950 transform -rotate-12 group-hover:rotate-0 transition duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="font-black italic uppercase tracking-tighter text-base text-white leading-none">
                  MUSCLE<span className="text-orange-500 ml-1">MATCH</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold mt-0.5">
                  Pro Fitness
                </span>
              </div>
            </button>
          )}
        </div>

        {/* Center Title for inner screens */}
        {showBackButton && (
          <h1 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            {getScreenTitle()}
          </h1>
        )}

        {/* Right Action Menu */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onRoleToggle}
            className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-tight bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-orange-500 hover:border-orange-500/40 transition flex items-center space-x-1"
            title="視点を切替"
          >
            <UserCheck className="w-3.5 h-3.5 text-orange-500" />
            <span>あなた：{activeRole === 'trainee' ? '筋トレ男子' : '筋肉好き'}</span>
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition"
            aria-label="画面切替"
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Screen Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-md pt-14 px-3 flex items-start justify-center">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-2.5 border-b border-zinc-800">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-orange-500 flex items-center gap-1">
                  <Flame className="w-4 h-4" /> 画面ナビゲーション
                </h3>
                <p className="text-[10px] text-zinc-400 mt-0.5">全9画面へ1タップで直接移動できます</p>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
                aria-label="閉じる"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              {screensList.map((screen) => {
                const isActive = currentScreen === screen.id;
                return (
                  <button
                    key={screen.id}
                    onClick={() => {
                      onNavigate(screen.id);
                      setMenuOpen(false);
                    }}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl text-center transition border relative group ${
                      isActive
                        ? 'bg-orange-500/20 border-orange-500 text-orange-400 font-black shadow-[0_0_12px_rgba(249,115,22,0.2)]'
                        : 'bg-zinc-950/80 border-zinc-800/80 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700 hover:text-white'
                    }`}
                  >
                    <span className="text-xl mb-1">{screen.icon}</span>
                    <span className="text-[11px] font-bold tracking-tight leading-tight line-clamp-1">
                      {screen.shortLabel}
                    </span>
                    <span className={`text-[9px] font-mono mt-0.5 ${isActive ? 'text-orange-400' : 'text-zinc-500'}`}>
                      {screen.num}. {screen.id}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
