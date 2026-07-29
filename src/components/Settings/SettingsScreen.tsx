import React, { useState } from 'react';
import { UserProfile, DiscoveryFilter, AppScreen } from '../../types';
import { Settings as SettingsIcon, Bell, Sparkles, UserCheck, LogOut, RotateCcw, SlidersHorizontal, ChevronRight, Crown } from 'lucide-react';

interface SettingsScreenProps {
  currentUser: UserProfile;
  filter: DiscoveryFilter;
  onApplyFilter: (newFilter: DiscoveryFilter) => void;
  onRoleToggle: () => void;
  onResetData: () => void;
  onNavigate: (screen: AppScreen) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  currentUser,
  filter,
  onApplyFilter,
  onRoleToggle,
  onResetData,
  onNavigate
}) => {
  const [notifyMatches, setNotifyMatches] = useState(true);
  const [notifyMessages, setNotifyMessages] = useState(true);
  const [notifyGymInvites, setNotifyGymInvites] = useState(true);

  return (
    <div className="h-full overflow-y-auto bg-zinc-950 text-zinc-100 p-4 max-w-md mx-auto pb-28 space-y-4">
      
      {/* Top Header */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xl font-black italic uppercase text-white flex items-center gap-2">
          <span>SETTINGS & ACCOUNT</span>
          <SettingsIcon className="w-5 h-5 text-orange-500" />
        </h1>
        <span className="text-[10px] font-mono font-bold text-orange-500 bg-orange-500/10 border border-orange-500/30 px-3 py-1 rounded-full uppercase">
          BLACK VIP
        </span>
      </div>

      {/* Membership VIP Card Banner */}
      <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-1.5 font-black text-sm text-white uppercase italic tracking-wider">
              <Crown className="w-4 h-4 text-orange-500" />
              <span>MUSCLE MATCH BLACK VIP</span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium mt-1">
              無制限スワイプ ＆ BIG3最高記録優先ブーストアクティブ
            </p>
          </div>
        </div>
        <div className="mt-4 text-[10px] text-zinc-500 font-mono font-bold flex justify-between items-center border-t border-zinc-800 pt-3 uppercase">
          <span>STATUS: VERIFIED (18+)</span>
          <span>EXPIRES: 2026/12/31</span>
        </div>
      </div>

      {/* Perspective / Demo Switcher */}
      <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
        <div className="flex items-center space-x-1.5 text-xs font-black uppercase italic text-orange-500">
          <Sparkles className="w-4 h-4" />
          <span>DEMO PERSPECTIVE SWITCH</span>
        </div>
        <p className="text-xs text-zinc-400 font-medium">
          現在 <span className="font-bold text-white">{currentUser.name}</span> ({currentUser.role === 'trainee' ? 'TRAINEE 男子' : 'MUSCLE LOVER'}) 視点です。
        </p>

        <button
          onClick={onRoleToggle}
          className="w-full py-3 px-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-200 font-bold text-xs hover:text-white transition flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-orange-500" />
            <span>視点を切り替える ({currentUser.role === 'trainee' ? 'MUSCLE LOVER 視点へ' : 'TRAINEE 男子視点へ'})</span>
          </span>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </button>
      </div>

      {/* Notifications Preferences */}
      <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3 text-xs">
        <h3 className="font-black italic uppercase text-zinc-200 flex items-center gap-2">
          <Bell className="w-4 h-4 text-orange-500" /> NOTIFICATIONS
        </h3>

        <div className="space-y-2">
          <label className="flex items-center justify-between py-1 cursor-pointer">
            <span className="text-zinc-300 font-medium">新しいマッチング通知</span>
            <input
              type="checkbox"
              checked={notifyMatches}
              onChange={(e) => setNotifyMatches(e.target.checked)}
              className="accent-orange-500 w-4 h-4 rounded"
            />
          </label>

          <label className="flex items-center justify-between py-1 cursor-pointer">
            <span className="text-zinc-300 font-medium">メッセージ受信通知</span>
            <input
              type="checkbox"
              checked={notifyMessages}
              onChange={(e) => setNotifyMessages(e.target.checked)}
              className="accent-orange-500 w-4 h-4 rounded"
            />
          </label>

          <label className="flex items-center justify-between py-1 cursor-pointer">
            <span className="text-zinc-300 font-medium">合同トレーニングお誘い通知</span>
            <input
              type="checkbox"
              checked={notifyGymInvites}
              onChange={(e) => setNotifyGymInvites(e.target.checked)}
              className="accent-orange-500 w-4 h-4 rounded"
            />
          </label>
        </div>
      </div>

      {/* Search Preferences Summary */}
      <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3 text-xs">
        <h3 className="font-black italic uppercase text-zinc-200 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-orange-500" /> ACTIVE SEARCH FILTER
        </h3>
        
        <div className="p-3.5 bg-zinc-950 rounded-2xl space-y-1 text-[11px] text-zinc-400 font-mono font-medium">
          <div className="flex justify-between">
            <span>ROLE:</span>
            <span className="text-orange-500 font-bold">
              {filter.roleFilter === 'all' ? 'ALL' : filter.roleFilter === 'trainee' ? 'TRAINEE' : 'MUSCLE LOVER'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>AGE RANGE:</span>
            <span className="text-white">{filter.minAge} - {filter.maxAge} 歳</span>
          </div>
          <div className="flex justify-between">
            <span>BENCH PRESS MIN:</span>
            <span className="text-orange-500 font-bold">{filter.minBenchPressKg || 0} kg+</span>
          </div>
          <div className="flex justify-between">
            <span>MAX DISTANCE:</span>
            <span className="text-white">{filter.maxDistanceKm} km</span>
          </div>
        </div>

        <button
          onClick={() => onNavigate('discovery')}
          className="w-full py-2 text-center text-orange-500 hover:underline font-bold"
        >
          探索画面で条件を変更する →
        </button>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-2">
        <button
          onClick={() => {
            onResetData();
            alert("デモデータを初期状態にリセットしました！");
          }}
          className="w-full py-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white font-bold text-xs transition flex items-center justify-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>デモデータを初期リセット</span>
        </button>

        <button
          onClick={() => onNavigate('landing')}
          className="w-full py-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold text-xs hover:text-white transition flex items-center justify-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>ログアウト（LPへ戻る）</span>
        </button>
      </div>

    </div>
  );
};
