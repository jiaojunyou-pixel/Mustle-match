import React, { useState, useRef, useEffect } from 'react';
import { MatchItem, ChatMessage, UserProfile, GymInvite } from '../../types';
import { Dumbbell, Send, Sparkles, Trophy, Calendar, MapPin, CheckCircle2, ChevronLeft, Plus, ShieldAlert } from 'lucide-react';
import { BlockReportModal } from '../Common/BlockReportModal';

interface MessageScreenProps {
  match: MatchItem;
  currentUser: UserProfile;
  messages: ChatMessage[];
  onSendMessage: (matchId: string, text: string, praiseCategory?: 'bulk' | 'cut' | 'style' | 'gym', gymInvite?: GymInvite) => void;
  onBack: () => void;
  onBlockUser?: (userId: string) => void;
}

export const MessageScreen: React.FC<MessageScreenProps> = ({
  match,
  currentUser,
  messages,
  onSendMessage,
  onBack,
  onBlockUser
}) => {
  const [inputText, setInputText] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Invite Form State
  const [inviteGym, setInviteGym] = useState(match.user.gymLocation || "ゴールドジム 渋谷東京");
  const [inviteDate, setInviteDate] = useState("今週末 土曜日 14:00〜");
  const [inviteTarget, setInviteTarget] = useState("胸トレ＆大胸筋デイ合トレ");
  const [inviteNote, setInviteNote] = useState("トレ後に高タンパク赤身肉ステーキ行きましょう！");

  const quickPraiseStickers = [
    { label: 'ナイスカット！💪', category: 'cut' as const },
    { label: '仕上がってる！✨', category: 'style' as const },
    { label: '最高のバルク！🔥', category: 'bulk' as const },
    { label: '合同トレ行きましょう！🏋️‍♂️', category: 'gym' as const }
  ];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(match.id, inputText);
    setInputText('');
  };

  const handleSendPraise = (sticker: { label: string; category: 'bulk' | 'cut' | 'style' | 'gym' }) => {
    onSendMessage(match.id, sticker.label, sticker.category);
  };

  const handleSendGymInvite = () => {
    const invite: GymInvite = {
      gymName: inviteGym,
      proposedDate: inviteDate,
      targetWorkout: inviteTarget,
      message: inviteNote,
      status: 'pending'
    };
    onSendMessage(
      match.id,
      `🏋️‍♂️ 【合同トレのお誘い】 ${inviteGym} で一緒にトレーニングしませんか？`,
      'gym',
      invite
    );
    setShowInviteModal(false);
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-zinc-100 max-w-md w-full mx-auto pb-16 overflow-hidden">
      
      {/* Header Banner */}
      <div className="shrink-0 bg-zinc-900 border-b border-zinc-800 p-3 flex items-center justify-between z-20">
        <div className="flex items-center space-x-2.5">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-orange-500/50">
            <img src={match.user.avatar} alt={match.user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>

          <div>
            <h2 className="font-bold text-sm text-white flex items-center gap-1.5">
              <span>{match.user.name} ({match.user.age})</span>
              {match.user.benchPressMaxKg && (
                <span className="text-[9px] font-mono font-bold bg-zinc-950 text-orange-500 border border-zinc-800 px-1.5 py-0.5 rounded">
                  {match.user.benchPressMaxKg}kg
                </span>
              )}
            </h2>
            <p className="text-[10px] text-zinc-400 font-medium">
              {match.user.gymLocation || match.user.location} • {match.user.isOnline ? 'オンライン' : 'アクティブ'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-2.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-bold text-xs hover:bg-orange-500/20 transition flex items-center gap-1"
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">合トレ</span>招待
          </button>

          <button
            onClick={() => setShowSafetyModal(true)}
            className="p-1.5 rounded-full text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition"
            title="通報・ブロック"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto min-h-0 no-scrollbar">
        
        {/* Match Intro Notice */}
        <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 text-center text-xs space-y-1 my-2">
          <p className="text-orange-500 font-black italic uppercase flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4" /> MATCH ESTABLISHED
          </p>
          <p className="text-zinc-300 font-medium">
            マッチングが成立しました！筋肉スタンプや合同トレ招待を送ってみましょう。
          </p>
        </div>

        {/* Message Bubbles */}
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-end space-x-2 max-w-[85%]">
                {!isMe && (
                  <img
                    src={match.user.avatar}
                    alt={match.user.name}
                    className="w-7 h-7 rounded-full object-cover border border-zinc-800 shrink-0 mb-1"
                    referrerPolicy="no-referrer"
                  />
                )}

                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                    isMe
                      ? 'bg-orange-500 text-zinc-950 font-bold rounded-br-none'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-bl-none'
                  }`}
                >
                  {/* Gym Invitation Special Card Balloon */}
                  {msg.gymInvite ? (
                    <div className="p-3.5 bg-zinc-950 text-zinc-100 rounded-2xl border border-orange-500/40 space-y-2.5 font-sans my-1">
                      <div className="flex items-center space-x-1.5 text-orange-500 font-black text-xs uppercase italic">
                        <Dumbbell className="w-4 h-4" />
                        <span>WORKOUT SESSION PROPOSAL</span>
                      </div>
                      
                      <div className="text-[11px] space-y-1 text-zinc-300 font-mono font-medium">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                          <span>{msg.gymInvite.gymName}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                          <span>{msg.gymInvite.proposedDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-orange-400 font-bold">
                          <Trophy className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                          <span>メニュー: {msg.gymInvite.targetWorkout}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-zinc-300 border-t border-zinc-900 pt-2 font-medium">
                        「{msg.gymInvite.message}」
                      </p>

                      <button
                        onClick={() => alert("合同トレのお誘いを承諾しました！")}
                        className="w-full py-2 rounded-xl bg-orange-500 text-zinc-950 font-black text-xs hover:bg-orange-400 transition flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> 招待を承諾する
                      </button>
                    </div>
                  ) : (
                    <span>{msg.text}</span>
                  )}
                </div>
              </div>

              <span className="text-[9px] text-zinc-500 mt-1 font-mono px-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Praise Shortcuts Bar & Input Bar */}
      <div className="shrink-0 bg-zinc-900 border-t border-zinc-800 p-2.5 z-20">
        <div className="text-[10px] text-orange-500 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1 px-1">
          <Sparkles className="w-3 h-3" /> STICKER SHORTCUTS
        </div>
        <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-1">
          {quickPraiseStickers.map((st, i) => (
            <button
              key={i}
              onClick={() => handleSendPraise(st)}
              className="px-3 py-1 rounded-full bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-[11px] font-bold whitespace-nowrap transition"
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="flex items-center space-x-2 mt-2">
          <button
            type="button"
            onClick={() => setShowInviteModal(true)}
            className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-orange-500 hover:bg-zinc-800 transition"
            title="合同トレ招待を作成"
          >
            <Plus className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="メッセージを入力..."
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-orange-500"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 rounded-2xl bg-orange-500 text-zinc-950 font-black disabled:opacity-40 transition shadow-md hover:bg-orange-400"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Gym Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-zinc-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-5 text-zinc-100 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <h3 className="font-black italic uppercase text-xs text-white flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4 text-orange-500" />
                <span>合同トレ招待状を作成</span>
              </h3>
              <button onClick={() => setShowInviteModal(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-bold">候補ジム</label>
                <input
                  type="text"
                  value={inviteGym}
                  onChange={(e) => setInviteGym(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-bold">希望日時</label>
                <input
                  type="text"
                  value={inviteDate}
                  onChange={(e) => setInviteDate(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-bold">メニュー</label>
                <input
                  type="text"
                  value={inviteTarget}
                  onChange={(e) => setInviteTarget(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-bold">メッセージ</label>
                <textarea
                  value={inviteNote}
                  onChange={(e) => setInviteNote(e.target.value)}
                  rows={2}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-2.5 text-white"
                />
              </div>
            </div>

            <button
              onClick={handleSendGymInvite}
              className="w-full py-3.5 rounded-2xl bg-orange-500 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-lg hover:bg-orange-400 transition"
            >
              招待状を送信する 🏋️‍♂️
            </button>
          </div>
        </div>
      )}

      {/* Safety / Block / Report Modal */}
      {showSafetyModal && (
        <BlockReportModal
          currentUser={currentUser}
          targetUser={match.user}
          onClose={() => setShowSafetyModal(false)}
          onBlocked={() => {
            if (onBlockUser) onBlockUser(match.user.id);
            onBack();
          }}
        />
      )}

    </div>
  );
};
