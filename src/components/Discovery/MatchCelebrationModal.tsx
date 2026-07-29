import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../../types';
import { MessageCircle, Sparkles, X } from 'lucide-react';

interface MatchCelebrationModalProps {
  matchedUser: UserProfile;
  currentUser: UserProfile;
  onClose: () => void;
  onStartChat: (user: UserProfile) => void;
}

export const MatchCelebrationModal: React.FC<MatchCelebrationModalProps> = ({
  matchedUser,
  currentUser,
  onClose,
  onStartChat
}) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4AF6A', '#F5F5F5', '#26262B']
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-xl flex items-center justify-center p-4">
      
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title Badge */}
        <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-[10px] font-black uppercase tracking-widest mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>MATCH ESTABLISHED</span>
        </div>

        <h2 className="text-2xl font-black italic uppercase text-white mb-1">
          IT'S A MATCH! 💪
        </h2>
        <p className="text-xs text-zinc-400 mb-6">
          <span className="font-bold text-white">{matchedUser.name}</span> さんとマッチングが成立しました！
        </p>

        {/* Overlapping Avatars */}
        <div className="flex items-center justify-center space-x-[-12px] mb-6">
          <div className="w-20 h-20 rounded-2xl border-2 border-orange-500 overflow-hidden shadow-xl z-10">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="w-9 h-9 rounded-full bg-orange-500 text-zinc-950 font-black text-sm flex items-center justify-center z-20 shadow-lg border-2 border-zinc-900">
            ⚡
          </div>
          <div className="w-20 h-20 rounded-2xl border-2 border-orange-500 overflow-hidden shadow-xl z-10">
            <img
              src={matchedUser.avatar}
              alt={matchedUser.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Match User Quick Specs */}
        <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-left text-xs mb-6 space-y-1">
          <div className="flex justify-between items-center font-bold text-white">
            <span>{matchedUser.name} ({matchedUser.age})</span>
            <span className="text-orange-500 font-mono">{matchedUser.gymLocation || matchedUser.location}</span>
          </div>
          {matchedUser.benchPressMaxKg && (
            <p className="text-zinc-400 font-mono text-[11px]">
              BENCH MAX: {matchedUser.benchPressMaxKg}kg
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => onStartChat(matchedUser)}
            className="w-full py-3.5 rounded-2xl bg-orange-500 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-lg hover:bg-orange-400 transition flex items-center justify-center space-x-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>メッセージを送る</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-zinc-800 text-zinc-300 font-bold text-xs hover:text-white transition"
          >
            探索を続ける
          </button>
        </div>

      </div>

    </div>
  );
};
