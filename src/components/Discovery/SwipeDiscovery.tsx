import React, { useState, useRef } from 'react';
import { UserProfile, DiscoveryFilter } from '../../types';
import { CardDetailModal } from './CardDetailModal';
import { FilterDrawer } from './FilterDrawer';
import { MatchCelebrationModal } from './MatchCelebrationModal';
import { Dumbbell, Heart, X, RotateCcw, Info, SlidersHorizontal, ShieldCheck, MapPin, Star } from 'lucide-react';

interface SwipeDiscoveryProps {
  candidates: UserProfile[];
  currentUser: UserProfile;
  filter: DiscoveryFilter;
  onApplyFilter: (filter: DiscoveryFilter) => void;
  onSwipeRight: (user: UserProfile) => Promise<boolean>;
  onSwipeLeft: (user: UserProfile) => void;
  onSuperLike: (user: UserProfile) => Promise<boolean>;
  onStartChat: (user: UserProfile) => void;
  onBlockUser?: (userId: string) => void;
}

export const SwipeDiscovery: React.FC<SwipeDiscoveryProps> = ({
  candidates,
  currentUser,
  filter,
  onApplyFilter,
  onSwipeRight,
  onSwipeLeft,
  onSuperLike,
  onStartChat,
  onBlockUser
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [detailUser, setDetailUser] = useState<UserProfile | null>(null);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [matchedUserCelebration, setMatchedUserCelebration] = useState<UserProfile | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gesture state
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const currentCandidate = candidates[currentIndex];

  // Gesture handlers
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    touchStartRef.current = { x: clientX, y: clientY };
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || !touchStartRef.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const dx = clientX - touchStartRef.current.x;
    const dy = clientY - touchStartRef.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const SWIPE_THRESHOLD = 90;
    const { x, y } = dragOffset;

    if (x > SWIPE_THRESHOLD) {
      triggerLike();
    } else if (x < -SWIPE_THRESHOLD) {
      triggerPass();
    } else if (y < -SWIPE_THRESHOLD) {
      triggerSuperLike();
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Actions
  const triggerLike = async () => {
    if (!currentCandidate || isSubmitting) return;
    setIsSubmitting(true);
    setActionError(null);
    try {
      const isMatch = await onSwipeRight(currentCandidate);
      if (isMatch) setMatchedUserCelebration(currentCandidate);
      advanceCard();
    } catch (error) {
      console.error('Like failed:', error);
      setActionError('LIKEを保存できませんでした。通信状態を確認して、もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerPass = () => {
    if (!currentCandidate) return;
    onSwipeLeft(currentCandidate);
    advanceCard();
  };

  const triggerSuperLike = async () => {
    if (!currentCandidate || isSubmitting) return;
    setIsSubmitting(true);
    setActionError(null);
    try {
      const isMatch = await onSuperLike(currentCandidate);
      if (isMatch) setMatchedUserCelebration(currentCandidate);
      advanceCard();
    } catch (error) {
      console.error('Super Like failed:', error);
      setActionError('SUPER LIKEを保存できませんでした。通信状態を確認して、もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const advanceCard = () => {
    setDragOffset({ x: 0, y: 0 });
    setCurrentIndex((prev) => prev + 1);
  };

  const handleRewind = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Drag physics overlay calculation
  const rotation = dragOffset.x * 0.08;
  const opacityLike = Math.min(Math.max(dragOffset.x / 80, 0), 1);
  const opacityPass = Math.min(Math.max(-dragOffset.x / 80, 0), 1);

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-zinc-950 text-zinc-100 flex flex-col justify-between p-4 max-w-md mx-auto select-none relative pb-20">
      
      {/* Filter Header */}
      <div className="flex items-center justify-between py-1 mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full">
            {filter.roleFilter === 'all'
              ? 'ALL MEMBERS'
              : filter.roleFilter === 'trainee'
              ? 'TRAINEES'
              : 'MUSCLE LOVERS'}
          </span>
          {filter.minBenchPressKg && filter.minBenchPressKg > 0 ? (
            <span className="text-[10px] font-mono font-bold text-zinc-300 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full">
              BENCH {filter.minBenchPressKg}kg+
            </span>
          ) : null}
        </div>

        <button
          onClick={() => setShowFilterDrawer(true)}
          className="p-2 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-orange-500 transition shrink-0"
          aria-label="Filter"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Main Swipe Stage */}
      <div className="relative flex-1 flex items-center justify-center my-2 min-h-[480px]">
        {currentCandidate ? (
          <div
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease, opacity 0.3s ease'
            }}
            className="absolute inset-0 bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing flex flex-col justify-between touch-none"
          >
            {/* HERO PHOTO CONTAINER */}
            <div className="relative w-full h-full bg-zinc-950 overflow-hidden">
              <img
                src={currentCandidate.photos[0] || currentCandidate.avatar}
                alt={currentCandidate.name}
                className="w-full h-full object-cover pointer-events-none"
                referrerPolicy="no-referrer"
              />

              {/* High-Legibility Dark Bottom Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent pointer-events-none" />

              {/* LIKE OVERLAY STAMP */}
              <div
                style={{ opacity: opacityLike }}
                className="absolute top-8 left-8 border-4 border-orange-500 text-orange-500 font-black text-2xl px-5 py-1 rounded-2xl -rotate-12 pointer-events-none uppercase tracking-widest bg-zinc-950/70"
              >
                LIKE ♥
              </div>

              {/* PASS OVERLAY STAMP */}
              <div
                style={{ opacity: opacityPass }}
                className="absolute top-8 right-8 border-4 border-zinc-500 text-zinc-400 font-black text-2xl px-5 py-1 rounded-2xl rotate-12 pointer-events-none uppercase tracking-widest bg-zinc-950/70"
              >
                PASS ✕
              </div>

              {/* Top Right Badges */}
              <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5 z-10">
                {currentCandidate.benchPressMaxKg && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500 text-zinc-950 shadow-md">
                    BENCH {currentCandidate.benchPressMaxKg}kg
                  </span>
                )}
                {currentCandidate.badges.slice(0, 1).map((b) => (
                  <span
                    key={b.id}
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-900/90 border border-zinc-700 text-zinc-200 backdrop-blur-md"
                  >
                    {b.icon} {b.name}
                  </span>
                ))}
              </div>

              {/* Bottom Card Identity Info */}
              <div className="absolute bottom-4 left-5 right-5 text-white z-10 space-y-2">
                
                {/* Name & Age */}
                <div className="flex items-baseline space-x-2">
                  <h3 className="text-3xl font-black italic tracking-tight">{currentCandidate.name}</h3>
                  <span className="text-2xl font-bold text-orange-500 font-mono">{currentCandidate.age}</span>
                  {currentCandidate.verified && (
                    <ShieldCheck className="w-5 h-5 text-blue-400 inline ml-1" />
                  )}
                </div>

                {/* Gym & Location */}
                <div className="flex items-center space-x-2 text-xs text-zinc-300 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span>{currentCandidate.location}</span>
                  {currentCandidate.gymLocation && (
                    <span className="text-zinc-400">| {currentCandidate.gymLocation}</span>
                  )}
                </div>

                {/* Bio Line */}
                <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                  {currentCandidate.bio}
                </p>

                {/* Favorite Muscle Tags & Detail Button */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-1.5">
                    {currentCandidate.favoriteMuscles.slice(0, 2).map((m, i) => (
                      <span key={i} className="text-[10px] font-bold bg-zinc-900/90 text-zinc-300 px-2.5 py-1 rounded-full border border-zinc-800">
                        💪 {m}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDetailUser(currentCandidate);
                    }}
                    className="p-2 rounded-full bg-zinc-900/80 border border-zinc-700 text-zinc-200 hover:text-white hover:border-orange-500 transition"
                    title="詳細プロフィール"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          </div>
        ) : (
          /* Empty Card Deck */
          <div className="w-full h-96 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500">
              <Dumbbell className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase italic text-white">カードの探索が完了しました</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                条件を変更するか、最初からもう一度閲覧できます。
              </p>
            </div>

            <div className="space-y-2 w-full max-w-xs">
              <button
                onClick={() => setCurrentIndex(0)}
                className="w-full py-3.5 rounded-2xl bg-orange-500 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-lg"
              >
                最初からやり直す 🔄
              </button>
              <button
                onClick={() => setShowFilterDrawer(true)}
                className="w-full py-3 rounded-2xl bg-zinc-800 text-zinc-300 font-bold text-xs border border-zinc-700"
              >
                検索条件を変更する
              </button>
            </div>
          </div>
        )}
      </div>

      {/* One-Handed Smartphone Ergonomic Swipe Bar */}
      {currentCandidate && (
        <div className="flex flex-col items-center gap-2 py-2 max-w-xs mx-auto w-full">
          {actionError && <p role="alert" className="text-xs text-red-400 text-center">{actionError}</p>}
          <div className="flex items-center justify-center space-x-5 w-full">
          {/* Rewind */}
          <button
            onClick={handleRewind}
            disabled={currentIndex === 0}
            className="w-11 h-11 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed"
            title="Undo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* PASS (✕) */}
          <button
            onClick={triggerPass}
            className="w-14 h-14 rounded-full bg-zinc-900 border-2 border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 flex items-center justify-center transition active:scale-95"
            title="PASS"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* SUPER LIKE (★) */}
          <button
            onClick={triggerSuperLike}
            disabled={isSubmitting}
            className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white flex items-center justify-center transition active:scale-95"
            title="SUPER LIKE"
          >
            <Star className="w-5 h-5 fill-zinc-200" />
          </button>

          {/* LIKE (♥) */}
          <button
            onClick={triggerLike}
            disabled={isSubmitting}
            className="w-16 h-16 rounded-full bg-orange-500 text-zinc-950 shadow-lg shadow-orange-500/20 flex items-center justify-center hover:bg-orange-400 transition active:scale-95"
            title="LIKE"
          >
            <Heart className="w-7 h-7 fill-zinc-950 stroke-none" />
          </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {detailUser && (
        <CardDetailModal
          user={detailUser}
          currentUser={currentUser}
          onClose={() => setDetailUser(null)}
          onLike={triggerLike}
          onSuperLike={triggerSuperLike}
          onBlockUser={(blockedId) => {
            if (onBlockUser) onBlockUser(blockedId);
            advanceCard();
          }}
        />
      )}

      {showFilterDrawer && (
        <FilterDrawer
          filter={filter}
          onApplyFilter={onApplyFilter}
          onClose={() => setShowFilterDrawer(false)}
        />
      )}

      {matchedUserCelebration && (
        <MatchCelebrationModal
          matchedUser={matchedUserCelebration}
          currentUser={currentUser}
          onClose={() => setMatchedUserCelebration(null)}
          onStartChat={(user) => {
            setMatchedUserCelebration(null);
            onStartChat(user);
          }}
        />
      )}

    </div>
  );
};
