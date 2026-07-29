import React, { useState, useRef } from 'react';
import { UserProfile, AppScreen } from '../../types';
import { Dumbbell, Trophy, Edit3, ShieldCheck, MapPin, Sparkles, Plus, Settings, Award, Upload } from 'lucide-react';
import { convertFileToBase64 } from '../../services/firebaseService';

interface MyProfileScreenProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onNavigate: (screen: AppScreen) => void;
}

export const MyProfileScreen: React.FC<MyProfileScreenProps> = ({
  user,
  onUpdateUser,
  onNavigate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Edit form state
  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(user.age || 26);
  const [job, setJob] = useState(user.job || 'ITコンサルタント');
  const [benchPress, setBenchPress] = useState(user.benchPressMaxKg || 120);
  const [squat, setSquat] = useState(user.squatMaxKg || 150);
  const [deadlift, setDeadlift] = useState(user.deadliftMaxKg || 180);
  const [gymLocation, setGymLocation] = useState(user.gymLocation || "ゴールドジム 渋谷東京");
  const [bio, setBio] = useState(user.bio);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await convertFileToBase64(e.target.files[0]);
      onUpdateUser({
        ...user,
        avatar: base64,
        photos: [base64, ...user.photos.slice(1)]
      });
    }
  };

  const handleAddPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await convertFileToBase64(e.target.files[0]);
      onUpdateUser({
        ...user,
        photos: [...user.photos, base64]
      });
    }
  };

  const handleSave = () => {
    onUpdateUser({
      ...user,
      name,
      age,
      job,
      benchPressMaxKg: benchPress,
      squatMaxKg: squat,
      deadliftMaxKg: deadlift,
      gymLocation,
      bio
    });
    setIsEditing(false);
  };

  return (
    <div className="h-full overflow-y-auto bg-zinc-950 text-zinc-100 p-4 max-w-md mx-auto pb-28">
      
      {/* Top Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-black italic uppercase text-white flex items-center gap-2">
          <span>MY PROFILE</span>
          <Dumbbell className="w-5 h-5 text-orange-500" />
        </h1>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold hover:bg-orange-500/20 transition flex items-center gap-1"
          >
            <Edit3 className="w-3.5 h-3.5" /> 編集
          </button>
          
          <button
            onClick={() => onNavigate('settings')}
            className="p-2 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Profile Identity Card */}
      <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-4 relative overflow-hidden mb-5">
        
        <div className="flex items-center space-x-4">
          <input
            type="file"
            ref={avatarInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            className="hidden"
          />

          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-orange-500 shrink-0 shadow-lg group">
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="absolute bottom-0 inset-x-0 bg-zinc-950/80 text-[9px] text-orange-500 text-center py-0.5 font-bold uppercase hover:bg-orange-500 hover:text-zinc-950 transition"
            >
              CHANGE
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline space-x-2">
              <h2 className="text-2xl font-black italic text-white truncate">{user.name}</h2>
              <span className="text-xl font-bold text-orange-500 font-mono">{user.age}</span>
              {user.verified && <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />}
            </div>

            <p className="text-xs text-zinc-300 font-medium flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-orange-500" /> {user.gymLocation || user.location}
            </p>

            <div className="inline-flex items-center gap-1 mt-2 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30">
              <Sparkles className="w-3 h-3" />
              <span>{user.role === 'trainee' ? 'TRAINEE 男子' : 'MUSCLE LOVER'}</span>
            </div>
          </div>
        </div>

        {/* Muscle Badges */}
        <div>
          <h3 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-1.5 font-mono flex items-center gap-1">
            <Award className="w-3.5 h-3.5" /> MUSCLE BADGES
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {user.badges.map((b) => (
              <span key={b.id} className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-950 border border-zinc-800 text-zinc-200">
                {b.icon} {b.name}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* BIG3 Record Dashboard */}
      <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 mb-5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-black italic uppercase tracking-wider text-orange-500 flex items-center gap-1.5">
            <Trophy className="w-4 h-4" /> BIG3 MAX RECORDS
          </span>
          <span className="text-[10px] font-mono text-zinc-500 font-bold">
            TOTAL: {(user.benchPressMaxKg || 0) + (user.squatMaxKg || 0) + (user.deadliftMaxKg || 0)}kg
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800">
            <div className="text-[9px] uppercase font-bold text-zinc-500">BENCH</div>
            <div className="text-lg font-black text-white font-mono">
              {user.benchPressMaxKg ? `${user.benchPressMaxKg}kg` : '-'}
            </div>
          </div>

          <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800">
            <div className="text-[9px] uppercase font-bold text-zinc-500">SQUAT</div>
            <div className="text-lg font-black text-white font-mono">
              {user.squatMaxKg ? `${user.squatMaxKg}kg` : '-'}
            </div>
          </div>

          <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800">
            <div className="text-[9px] uppercase font-bold text-zinc-500">DEADLIFT</div>
            <div className="text-lg font-black text-white font-mono">
              {user.deadliftMaxKg ? `${user.deadliftMaxKg}kg` : '-'}
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 mb-5">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 font-mono">ABOUT ME</h3>
        <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line font-medium">
          {user.bio}
        </p>
      </div>

      {/* Photo Gallery */}
      <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800">
        <input
          type="file"
          ref={photoInputRef}
          onChange={handleAddPhoto}
          accept="image/*"
          className="hidden"
        />

        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono">PHOTO GALLERY ({user.photos.length})</h3>
          <button
            onClick={() => photoInputRef.current?.click()}
            className="text-[11px] text-orange-500 font-bold hover:underline flex items-center gap-0.5"
          >
            <Plus className="w-3.5 h-3.5" /> 写真追加
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {user.photos.map((photo, i) => (
            <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-zinc-800">
              <img src={photo} alt={`photo-${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-zinc-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-5 text-zinc-100 space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <h3 className="font-black italic uppercase text-xs text-white">PROFILE EDIT</h3>
              <button onClick={() => setIsEditing(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-bold">ニックネーム</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-400 mb-1 font-bold">年齢</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-bold">職業</label>
                  <input
                    type="text"
                    value={job}
                    onChange={(e) => setJob(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-bold">メインGym名</label>
                <input
                  type="text"
                  value={gymLocation}
                  onChange={(e) => setGymLocation(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-orange-500 mb-1 font-bold text-[10px]">ベンチ(kg)</label>
                  <input
                    type="number"
                    value={benchPress}
                    onChange={(e) => setBenchPress(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-2 text-white font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-orange-500 mb-1 font-bold text-[10px]">スクワット(kg)</label>
                  <input
                    type="number"
                    value={squat}
                    onChange={(e) => setSquat(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-2 text-white font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-orange-500 mb-1 font-bold text-[10px]">デッドリフト(kg)</label>
                  <input
                    type="number"
                    value={deadlift}
                    onChange={(e) => setDeadlift(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-2 text-white font-mono text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-bold">自己紹介文</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-2.5 text-white"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full py-3.5 rounded-2xl bg-orange-500 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-lg hover:bg-orange-400 transition"
            >
              保存する 💪
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
