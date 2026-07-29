import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { Trophy, MapPin, Heart, X, ShieldCheck, ChevronLeft, ChevronRight, Star, ShieldAlert } from 'lucide-react';
import { BlockReportModal } from '../Common/BlockReportModal';

interface CardDetailModalProps {
  user: UserProfile;
  currentUser?: UserProfile;
  onClose: () => void;
  onLike: (user: UserProfile) => void;
  onSuperLike: (user: UserProfile) => void;
  onBlockUser?: (userId: string) => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  user,
  currentUser,
  onClose,
  onLike,
  onSuperLike,
  onBlockUser
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [showSafetyModal, setShowSafetyModal] = useState(false);

  const nextPhoto = () => {
    if (user.photos && user.photos.length > 0) {
      setActivePhotoIdx((prev) => (prev + 1) % user.photos.length);
    }
  };

  const prevPhoto = () => {
    if (user.photos && user.photos.length > 0) {
      setActivePhotoIdx((prev) => (prev - 1 + user.photos.length) % user.photos.length);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl relative text-zinc-100">
        
        {/* Header Action Buttons */}
        <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
          {currentUser && (
            <button
              onClick={() => setShowSafetyModal(true)}
              className="w-8 h-8 rounded-full bg-zinc-950/80 text-zinc-300 hover:text-rose-400 flex items-center justify-center border border-zinc-700 hover:bg-zinc-900 transition"
              title="通報・ブロック"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-950/80 text-white flex items-center justify-center border border-zinc-700 hover:bg-zinc-900 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Photo Gallery Header */}
        <div className="relative h-96 w-full bg-zinc-950">
          <img
            src={user.photos[activePhotoIdx] || user.avatar}
            alt={user.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent" />

          {/* Photo Navigation Indicators */}
          {user.photos.length > 1 && (
            <>
              <div className="absolute top-3 left-4 right-4 flex space-x-1 z-10">
                {user.photos.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      idx === activePhotoIdx ? 'bg-orange-500' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={prevPhoto}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-zinc-950/60 text-white hover:bg-zinc-950 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={nextPhoto}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-zinc-950/60 text-white hover:bg-zinc-950 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Overlay Identity Title */}
          <div className="absolute bottom-4 left-5 right-5 z-10">
            <div className="flex items-baseline space-x-2">
              <h2 className="text-3xl font-black italic text-white">{user.name}</h2>
              <span className="text-2xl font-bold text-orange-500 font-mono">{user.age}</span>
              {user.verified && (
                <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 inline ml-1" />
              )}
            </div>

            <div className="flex items-center space-x-2 text-xs text-zinc-300 font-medium mt-1">
              <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span>{user.location} ({user.distanceKm}km)</span>
              {user.gymLocation && (
                <span className="text-zinc-400">| {user.gymLocation}</span>
              )}
            </div>
          </div>
        </div>

        {/* Details Body */}
        <div className="p-5 space-y-5">
          
          {/* Muscle Badges */}
          <div>
            <h3 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-2 font-mono">
              BADGES & SPECS
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {user.badges.map((badge) => (
                <span
                  key={badge.id}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-950 border border-zinc-800 text-zinc-200 flex items-center space-x-1"
                >
                  <span>{badge.icon}</span>
                  <span>{badge.name}</span>
                </span>
              ))}
            </div>
          </div>

          {/* BIG3 Performance Stats Table */}
          {(user.benchPressMaxKg || user.squatMaxKg || user.deadliftMaxKg) && (
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black italic uppercase tracking-wider text-orange-500 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4" /> BIG3 MAX RECORDS
                </span>
                <span className="text-[10px] text-zinc-500 font-mono font-bold">
                  TOTAL: {(user.benchPressMaxKg || 0) + (user.squatMaxKg || 0) + (user.deadliftMaxKg || 0)}kg
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800">
                  <div className="text-[9px] font-bold uppercase text-zinc-500">BENCH</div>
                  <div className="text-lg font-black text-white font-mono">
                    {user.benchPressMaxKg ? `${user.benchPressMaxKg}kg` : '-'}
                  </div>
                </div>

                <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800">
                  <div className="text-[9px] font-bold uppercase text-zinc-500">SQUAT</div>
                  <div className="text-lg font-black text-white font-mono">
                    {user.squatMaxKg ? `${user.squatMaxKg}kg` : '-'}
                  </div>
                </div>

                <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800">
                  <div className="text-[9px] font-bold uppercase text-zinc-500">DEADLIFT</div>
                  <div className="text-lg font-black text-white font-mono">
                    {user.deadliftMaxKg ? `${user.deadliftMaxKg}kg` : '-'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Physical Spec Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs font-medium">
            <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 flex justify-between items-center">
              <span className="text-zinc-400">身長 / 体重</span>
              <span className="font-bold text-white font-mono">{user.heightCm}cm / {user.weightKg}kg</span>
            </div>

            {user.bodyFatPercentage && (
              <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 flex justify-between items-center">
                <span className="text-zinc-400">体脂肪率</span>
                <span className="font-bold text-orange-500 font-mono">{user.bodyFatPercentage}%</span>
              </div>
            )}

            <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 flex justify-between items-center">
              <span className="text-zinc-400">筋トレ歴</span>
              <span className="font-bold text-white font-mono">{user.trainingYears}年</span>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 flex justify-between items-center">
              <span className="text-zinc-400">週のトレ回数</span>
              <span className="font-bold text-orange-500 font-mono">週{user.weeklyFrequency}回</span>
            </div>
          </div>

          {/* Favorite Muscles */}
          <div>
            <h3 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-2 font-mono">
              TARGET MUSCLES
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {user.favoriteMuscles.map((m, i) => (
                <span key={i} className="px-3 py-1 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-bold">
                  💪 {m}
                </span>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <h3 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-2 font-mono">
              ABOUT
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950 p-4 rounded-2xl border border-zinc-800 whitespace-pre-line">
              {user.bio}
            </p>
          </div>

          {/* Action Footer */}
          <div className="pt-2 grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                onSuperLike(user);
                onClose();
              }}
              className="py-3.5 rounded-2xl bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold text-xs hover:text-white flex items-center justify-center space-x-1.5 transition"
            >
              <Star className="w-4 h-4 fill-zinc-200" />
              <span>SUPER LIKE</span>
            </button>

            <button
              onClick={() => {
                onLike(user);
                onClose();
              }}
              className="py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-400 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center space-x-1.5 transition"
            >
              <Heart className="w-4 h-4 fill-zinc-950" />
              <span>LIKE</span>
            </button>
          </div>

        </div>

      </div>

      {showSafetyModal && currentUser && (
        <BlockReportModal
          currentUser={currentUser}
          targetUser={user}
          onClose={() => setShowSafetyModal(false)}
          onBlocked={() => {
            if (onBlockUser) onBlockUser(user.id);
            onClose();
          }}
        />
      )}

    </div>
  );
};
