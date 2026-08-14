import React, { useState } from 'react';
import { MatchItem, UserProfile, AppScreen } from '../../types';
import { Dumbbell, ChevronRight, Heart, Sparkles, Flame, MessageSquare, Info } from 'lucide-react';
import { CardDetailModal } from '../Discovery/CardDetailModal';

interface MatchesListScreenProps {
  matches: MatchItem[];
  likesReceived: UserProfile[];
  onSelectMatch: (match: MatchItem) => void;
  onLikeBack: (user: UserProfile) => Promise<void>;
  onNavigate: (screen: AppScreen) => void;
  activeTab?: 'all' | 'new' | 'likes';
  onTabChange?: (tab: 'all' | 'new' | 'likes') => void;
}

export const MatchesListScreen: React.FC<MatchesListScreenProps> = ({
  matches,
  likesReceived,
  onSelectMatch,
  onLikeBack,
  onNavigate,
  activeTab: externalActiveTab,
  onTabChange
}) => {
  const [internalTab, setInternalTab] = useState<'all' | 'new' | 'likes'>('all');
  const [detailUser, setDetailUser] = useState<UserProfile | null>(null);
  const [likeBackError, setLikeBackError] = useState<string | null>(null);
  const [processingLikeBackId, setProcessingLikeBackId] = useState<string | null>(null);
  const activeTab = externalActiveTab || internalTab;

  const handleSetTab = (tab: 'all' | 'new' | 'likes') => {
    setInternalTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  const newMatches = matches.filter((m) => m.isNewMatch);

  const handleLikeBack = async (user: UserProfile) => {
    if (processingLikeBackId) return;
    setProcessingLikeBackId(user.id);
    setLikeBackError(null);
    try {
      await onLikeBack(user);
      setDetailUser(null);
    } catch (error) {
      console.error('Like back failed:', error);
      setLikeBackError('LIKE返しに失敗しました。通信状態を確認して、もう一度お試しください。');
    } finally {
      setProcessingLikeBackId(null);
    }
  };

  const getScreenHeaderTitle = () => {
    switch (activeTab) {
      case 'likes':
        return { title: 'LIKE', subtitle: 'あなたにLIKEを送ったユーザー' };
      case 'new':
        return { title: 'MATCH', subtitle: '成立したマッチング一覧' };
      case 'all':
      default:
        return { title: 'メッセージ', subtitle: 'やり取り中のマッチパートナー' };
    }
  };

  const headerInfo = getScreenHeaderTitle();

  return (
    <div className="h-[calc(100vh-8rem)] bg-zinc-950 text-zinc-100 flex flex-col p-4 max-w-md mx-auto pb-20 overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-3 shrink-0">
        <div>
          <h1 className="text-xl font-black italic uppercase tracking-wider text-white flex items-center gap-2">
            <span>{headerInfo.title}</span>
            {activeTab === 'likes' ? (
              <Heart className="w-5 h-5 text-orange-500 fill-orange-500" />
            ) : activeTab === 'new' ? (
              <Sparkles className="w-5 h-5 text-orange-500" />
            ) : (
              <MessageSquare className="w-5 h-5 text-orange-500" />
            )}
          </h1>
          <p className="text-xs text-zinc-400 font-medium">{headerInfo.subtitle}</p>
        </div>
        <button
          onClick={() => onNavigate('discovery')}
          className="px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold hover:bg-orange-500/20 transition flex items-center gap-1"
        >
          <Dumbbell className="w-3.5 h-3.5" /> 探す
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-zinc-800 mb-4 shrink-0">
        <button
          onClick={() => handleSetTab('all')}
          className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition ${
            activeTab === 'all'
              ? 'border-orange-500 text-orange-500 font-black'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          メッセージ ({matches.length})
        </button>

        <button
          onClick={() => handleSetTab('new')}
          className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition relative ${
            activeTab === 'new'
              ? 'border-orange-500 text-orange-500 font-black'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          MATCH ({newMatches.length})
          {newMatches.length > 0 && (
            <span className="ml-1 w-2 h-2 rounded-full bg-orange-500 inline-block animate-ping" />
          )}
        </button>

        <button
          onClick={() => handleSetTab('likes')}
          className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition ${
            activeTab === 'likes'
              ? 'border-orange-500 text-orange-500 font-black'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          LIKE ({likesReceived.length})
        </button>
      </div>

      {/* Main Content Scrollable Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar pr-0.5">

        {/* TAB CONTENT 1: MESSAGES LIST */}
        {activeTab === 'all' && (
          <div className="space-y-2.5">
            {matches.length === 0 ? (
              <div className="p-8 text-center bg-zinc-900/80 rounded-3xl border border-zinc-800 my-4">
                <MessageSquare className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-xs text-zinc-400 font-bold">まだメッセージのやり取りはありません</p>
                <p className="text-[11px] text-zinc-500 mt-1">「探す」タブから気になる人にLIKEを送ってみましょう！</p>
              </div>
            ) : (
              matches.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectMatch(item)}
                  className="w-full p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 hover:border-orange-500/50 transition flex items-center space-x-3 text-left group"
                >
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-zinc-800">
                    <img
                      src={item.user.avatar}
                      alt={item.user.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {item.user.isOnline && (
                      <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-zinc-900" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-sm text-white group-hover:text-orange-400 transition flex items-center gap-1.5">
                        <span>{item.user.name} ({item.user.age})</span>
                        {item.user.benchPressMaxKg ? (
                          <span className="text-[9px] font-mono font-bold bg-zinc-950 text-orange-500 px-1.5 py-0.5 rounded border border-zinc-800">
                            {item.user.benchPressMaxKg}kg
                          </span>
                        ) : null}
                      </h3>
                      <span className="text-[10px] text-zinc-500 font-mono">{item.lastMessageTime}</span>
                    </div>

                    <p className="text-xs text-zinc-400 truncate font-medium">
                      {item.lastMessage || 'マッチが成立しました！メッセージを送信しましょう'}
                    </p>

                    {item.workoutSessionProposed && (
                      <div className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                        <Dumbbell className="w-3 h-3" /> 合同トレ提案中
                      </div>
                    )}
                  </div>

                  {item.unreadCount > 0 ? (
                    <span className="w-5 h-5 rounded-full bg-orange-500 text-zinc-950 font-black text-[11px] flex items-center justify-center shrink-0">
                      {item.unreadCount}
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-orange-500 shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        )}

        {/* TAB CONTENT 2: NEW MATCHES */}
        {activeTab === 'new' && (
          <div className="space-y-3">
            {matches.length === 0 ? (
              <div className="p-8 text-center bg-zinc-900/80 rounded-3xl border border-zinc-800 my-4">
                <Sparkles className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-xs text-zinc-400 font-bold">まだマッチしたお相手はいません</p>
                <p className="text-[11px] text-zinc-500 mt-1">「探す」画面で積極的にLIKEしましょう！</p>
              </div>
            ) : (
              matches.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between hover:border-zinc-700 transition"
                >
                  <div
                    onClick={() => setDetailUser(item.user)}
                    className="flex items-center space-x-3 cursor-pointer flex-1 min-w-0"
                  >
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border border-orange-500/60 shrink-0">
                      <img src={item.user.avatar} alt={item.user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-white truncate flex items-center gap-1.5">
                        <span>{item.user.name} ({item.user.age})</span>
                        <Info className="w-3.5 h-3.5 text-zinc-500 hover:text-orange-400" />
                      </h4>
                      <p className="text-xs text-orange-500 font-mono truncate">{item.user.gymLocation || item.user.location}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectMatch(item)}
                    className="px-3.5 py-2 rounded-xl bg-orange-500 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-md hover:bg-orange-400 transition ml-2 shrink-0 flex items-center gap-1"
                  >
                    <span>CHAT</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB CONTENT 3: LIKES RECEIVED */}
        {activeTab === 'likes' && (
          <div className="grid grid-cols-2 gap-3 pb-2">
            {likesReceived.length === 0 ? (
              <div className="col-span-2 p-8 text-center bg-zinc-900/80 rounded-3xl border border-zinc-800 my-4">
                <Heart className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-xs text-zinc-400 font-bold">まだ受け取ったLIKEはありません</p>
                <p className="text-[11px] text-zinc-500 mt-1">プロフィールを充実させるとLIKEをもらいやすくなります！</p>
              </div>
            ) : (
              likesReceived.map((user) => (
                <div
                  key={user.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-orange-500/40 transition"
                >
                  <div
                    onClick={() => setDetailUser(user)}
                    className="relative h-36 bg-zinc-950 cursor-pointer group"
                  >
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                    <div className="absolute top-2 right-2 p-1.5 rounded-full bg-zinc-950/70 text-zinc-300 group-hover:text-white border border-zinc-800">
                      <Info className="w-3.5 h-3.5" />
                    </div>
                    <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                      <div className="font-bold text-xs truncate">{user.name} ({user.age})</div>
                      <div className="text-[10px] text-zinc-400 font-mono truncate">{user.location}</div>
                    </div>
                  </div>

                  <div className="p-2.5 space-y-1.5">
                    {user.benchPressMaxKg ? (
                      <div className="text-[10px] text-orange-500 font-mono font-bold">
                        BENCH {user.benchPressMaxKg}kg
                      </div>
                    ) : null}
                    <p className="text-[10px] text-zinc-400 line-clamp-1 italic">
                      「{user.bio}」
                    </p>

                    <button
                      onClick={() => handleLikeBack(user)}
                      disabled={processingLikeBackId === user.id}
                      className="w-full py-2 rounded-xl bg-orange-500 text-zinc-950 font-black text-xs uppercase tracking-wider hover:bg-orange-400 transition flex items-center justify-center space-x-1 shadow-md active:scale-95"
                    >
                      <Heart className="w-3.5 h-3.5 fill-zinc-950" />
                      <span>{processingLikeBackId === user.id ? 'SAVING...' : 'LIKE BACK'}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {likeBackError && <p role="alert" className="text-xs text-red-400 text-center mb-2">{likeBackError}</p>}

      {/* Detail Modal */}
      {detailUser && (
        <CardDetailModal
          user={detailUser}
          onClose={() => setDetailUser(null)}
          onLike={(u) => {
            void handleLikeBack(u);
          }}
          onSuperLike={(u) => {
            void handleLikeBack(u);
          }}
        />
      )}

    </div>
  );
};
