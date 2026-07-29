import React, { useState } from 'react';
import { AppScreen, TargetMusclePart, BodyType, UserProfile } from '../../types';
import { Dumbbell, Trophy, Camera, Check, ArrowRight, ArrowLeft, Sparkles, Plus, Award, Briefcase, Wine, Heart, User, Loader2 } from 'lucide-react';

interface ProfileCreationScreenProps {
  onNavigate: (screen: AppScreen) => void;
  userRole: 'trainee' | 'muscle_lover';
  currentUser?: UserProfile | null;
  onUpdateUser?: (updatedProfile: UserProfile) => Promise<void> | void;
}

export const ProfileCreationScreen: React.FC<ProfileCreationScreenProps> = ({
  onNavigate,
  userRole,
  currentUser,
  onUpdateUser
}) => {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // 1. Basic Info
  const [name, setName] = useState(currentUser?.name || (userRole === 'trainee' ? 'TAKUMI' : 'MISAKI'));
  const [age, setAge] = useState(currentUser?.age || 26);
  const [gender, setGender] = useState<'male' | 'female'>(currentUser?.gender || (userRole === 'trainee' ? 'male' : 'female'));
  const [location, setLocation] = useState(currentUser?.location || '東京都 港区');
  const [heightCm, setHeightCm] = useState(currentUser?.heightCm || 177);

  // 2. Fitness Info
  const [trainingYears, setTrainingYears] = useState(currentUser?.trainingYears || 3);
  const [weeklyFrequency, setWeeklyFrequency] = useState('週4〜5回');
  const [bodyType, setBodyType] = useState<BodyType>(currentUser?.bodyType || 'physique');
  const [benchPress, setBenchPress] = useState(currentUser?.benchPressMaxKg || 115);
  const [squat, setSquat] = useState(currentUser?.squatMaxKg || 145);
  const [deadlift, setDeadlift] = useState(currentUser?.deadliftMaxKg || 175);
  const [gymBrand, setGymBrand] = useState(currentUser?.preferredGymBrand || "Gold's Gym");
  const [competitionExperience, setCompetitionExperience] = useState(currentUser?.competitionExperience || 'コンテスト挑戦準備中');

  // 3. Favorite Muscles & Exercises
  const [selectedMuscles, setSelectedMuscles] = useState<TargetMusclePart[]>(
    currentUser?.favoriteMuscles?.length ? (currentUser.favoriteMuscles as TargetMusclePart[]) : ['大胸筋', '肩（三角筋）']
  );
  const [favoriteExercise, setFavoriteExercise] = useState(currentUser?.favoriteExercise || 'インクラインベンチプレス / サイドレイズ');

  // 4. Lifestyle & Purpose
  const [job, setJob] = useState(currentUser?.job || 'ITコンサルタント');
  const [holidayActivity, setHolidayActivity] = useState(currentUser?.holidayActivity || 'ジムで筋トレ & 高タンパクカフェ巡り');
  const [hobbies, setHobbies] = useState(currentUser?.hobbies || 'ボディメイク、サウナ、赤身肉デート');
  const [drinking, setDrinking] = useState(currentUser?.drinking || '時々飲む（減量期は控えめ）');
  const [smoking, setSmoking] = useState(currentUser?.smoking || '吸わない');
  const [purpose, setPurpose] = useState<'恋人探し' | '真剣な交際' | '筋トレ仲間' | '気軽な出会い'>('恋人探し');

  // 5. Bio
  const [bio, setBio] = useState(
    currentUser?.bio ||
    (userRole === 'trainee'
      ? '週5でボディメイク実施中！大胸筋と肩のメロン肩作りに注力してます。モチベーションの高い合同トレ仲間や、高タンパクな赤身肉デートを一緒に楽しめる方と繋がりたいです！'
      : 'ピラティスとジムに通い始めて健康的なボディラインを目指してます✨ 筋トレをストイックに頑張っている健康的な男性が大好きです！')
  );

  const musclePartsList: TargetMusclePart[] = [
    '大胸筋',
    '広背筋・背中',
    '肩（三角筋）',
    '腹筋・シックスパック',
    '上腕二頭筋・三頭筋',
    '脚・大腿四頭筋',
    '全身バランス'
  ];

  const toggleMuscle = (muscle: TargetMusclePart) => {
    if (selectedMuscles.includes(muscle)) {
      setSelectedMuscles(selectedMuscles.filter((m) => m !== muscle));
    } else {
      if (selectedMuscles.length < 3) {
        setSelectedMuscles([...selectedMuscles, muscle]);
      }
    }
  };

  const handleNext = async () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      setSaving(true);
      try {
        if (onUpdateUser && currentUser) {
          const updated: UserProfile = {
            ...currentUser,
            name,
            age,
            gender,
            role: userRole,
            location,
            gymLocation: `${gymBrand} (${location})`,
            heightCm,
            trainingYears,
            bodyType,
            benchPressMaxKg: benchPress,
            squatMaxKg: squat,
            deadliftMaxKg: deadlift,
            preferredGymBrand: gymBrand,
            competitionExperience,
            favoriteMuscles: selectedMuscles,
            favoriteExercise,
            job,
            holidayActivity,
            hobbies,
            drinking,
            smoking,
            purpose: [purpose],
            bio
          };
          await onUpdateUser(updated);
        }
        onNavigate('discovery');
      } catch (e) {
        console.error('Error completing profile creation:', e);
        onNavigate('discovery');
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-zinc-950 text-zinc-100 px-4 py-6 max-w-md mx-auto pb-28">
      
      {/* Wizard Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center text-xs text-zinc-400 mb-2">
          <button
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className={`flex items-center gap-1 ${step === 1 ? 'opacity-0' : 'text-zinc-300 hover:text-white'}`}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> 戻る
          </button>
          <span className="font-mono font-bold text-orange-500">
            STEP {step} / 5
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
          <div
            className="bg-orange-500 h-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: 基本情報 */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <User className="w-5 h-5 text-orange-500" />
              <span>基本情報の設定</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              プロフィールに表示される基本プロフィールを入力します
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                ニックネーム
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-orange-500"
                placeholder="タカヒロ"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  年齢
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-3.5 text-sm text-white text-center font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  性別
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-3.5 text-sm text-white"
                >
                  <option value="male">男性</option>
                  <option value="female">女性</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                居住地・主な活動エリア
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-orange-500"
              >
                <option value="東京都 港区">東京都 港区 (六本木・赤坂)</option>
                <option value="東京都 渋谷区">東京都 渋谷区 (原宿・恵比寿)</option>
                <option value="東京都 新宿区">東京都 新宿区</option>
                <option value="東京都 千代田区">東京都 千代田区 (丸の内)</option>
                <option value="神奈川県 横浜市">神奈川県 横浜市</option>
                <option value="大阪府 大阪市">大阪府 大阪市</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                身長 (cm)
              </label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-3.5 text-sm text-white font-mono font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: フィットネス情報 & BIG3 */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-orange-500" />
              <span>フィットネス情報 & BIG3</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              トレーニングの熱量や経験、所属ジムを入力します
            </p>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  筋トレ歴 (年)
                </label>
                <input
                  type="number"
                  value={trainingYears}
                  onChange={(e) => setTrainingYears(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-3.5 text-sm text-white text-center font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  トレーニング頻度
                </label>
                <select
                  value={weeklyFrequency}
                  onChange={(e) => setWeeklyFrequency(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-3.5 text-sm text-white"
                >
                  <option value="週1〜2回">週1〜2回</option>
                  <option value="週3〜4回">週3〜4回</option>
                  <option value="週4〜5回">週4〜5回</option>
                  <option value="週6回以上">週6回以上（ガチ勢）</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                所属メインジム
              </label>
              <select
                value={gymBrand}
                onChange={(e) => setGymBrand(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-3.5 text-sm text-white"
              >
                <option value="Gold's Gym">Gold's Gym (ゴールドジム)</option>
                <option value="Anytime Fitness">Anytime Fitness (エニタイム)</option>
                <option value="Joyfit">JOYFIT24</option>
                <option value="ChocoZAP">chocoZAP</option>
                <option value="Home Gym">ホームジム / パーソナルジム</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                大会・コンテスト経験
              </label>
              <select
                value={competitionExperience}
                onChange={(e) => setCompetitionExperience(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-3.5 text-sm text-white"
              >
                <option value="なし（ボディメイク目的）">なし（健康・ボディメイク目的）</option>
                <option value="コンテスト挑戦準備中">コンテスト挑戦準備中</option>
                <option value="コンテスト出場経験あり">コンテスト出場経験あり</option>
                <option value="コンテスト入賞歴あり">コンテスト入賞歴あり 🏆</option>
              </select>
            </div>

            {/* BIG3 SLIDERS */}
            <div className="pt-2 space-y-2">
              <div className="p-3 bg-zinc-900 border border-orange-500/30 rounded-2xl">
                <label className="block text-xs font-bold text-orange-400 mb-1 flex justify-between">
                  <span>💪 ベンチプレス MAX</span>
                  <span className="font-mono text-orange-400 font-extrabold">{benchPress} kg</span>
                </label>
                <input
                  type="range"
                  min="30"
                  max="200"
                  step="5"
                  value={benchPress}
                  onChange={(e) => setBenchPress(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl">
                <label className="block text-xs font-bold text-zinc-200 mb-1 flex justify-between">
                  <span>🏋️‍♂️ スクワット MAX</span>
                  <span className="font-mono text-orange-400 font-extrabold">{squat} kg</span>
                </label>
                <input
                  type="range"
                  min="40"
                  max="250"
                  step="5"
                  value={squat}
                  onChange={(e) => setSquat(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl">
                <label className="block text-xs font-bold text-zinc-200 mb-1 flex justify-between">
                  <span>💥 デッドリフト MAX</span>
                  <span className="font-mono text-orange-400 font-extrabold">{deadlift} kg</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="280"
                  step="5"
                  value={deadlift}
                  onChange={(e) => setDeadlift(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: 部位 & 種目 */}
      {step === 3 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-orange-500" />
              <span>自慢部位 & 得意種目</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              アピールしたい部位（最大3個）と得意な種目を設定します
            </p>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {musclePartsList.map((muscle) => {
                const isSelected = selectedMuscles.includes(muscle);
                return (
                  <button
                    key={muscle}
                    type="button"
                    onClick={() => toggleMuscle(muscle)}
                    className={`p-3 rounded-xl text-left border text-xs font-bold transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <span>{muscle}</span>
                    {isSelected && <Check className="w-4 h-4 text-orange-500" />}
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                得意種目・こだわりトレーニング
              </label>
              <input
                type="text"
                value={favoriteExercise}
                onChange={(e) => setFavoriteExercise(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-orange-500"
                placeholder="例: インクラインダンベルプレス、ラットプローダウン"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: ライフスタイル & 目的 */}
      {step === 4 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-orange-500" />
              <span>ライフスタイル & 目的</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              お仕事や休日の過ごし方、出会いの目的を設定します
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                職業・お仕事
              </label>
              <input
                type="text"
                value={job}
                onChange={(e) => setJob(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                休日の過ごし方
              </label>
              <input
                type="text"
                value={holidayActivity}
                onChange={(e) => setHolidayActivity(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  お酒
                </label>
                <select
                  value={drinking}
                  onChange={(e) => setDrinking(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-3.5 text-sm text-white"
                >
                  <option value="飲まない（完全禁酒）">飲まない（完全禁酒）</option>
                  <option value="時々飲む（減量期は控えめ）">時々飲む（減量期は控えめ）</option>
                  <option value="よく飲む">よく飲む</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  喫煙
                </label>
                <select
                  value={smoking}
                  onChange={(e) => setSmoking(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-3.5 text-sm text-white"
                >
                  <option value="吸わない">吸わない</option>
                  <option value="加熱式タバコ">加熱式タバコ</option>
                  <option value="吸う">吸う</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                MUSCLE MATCHでの出会いの目的
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['恋人探し', '真剣な交際', '筋トレ仲間', '気軽な出会い'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPurpose(p)}
                    className={`p-3 rounded-xl border text-xs font-bold transition text-center ${
                      purpose === p
                        ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: 写真 & 自己紹介 */}
      {step === 5 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-orange-500" />
              <span>写真登録 & 自己紹介文</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              身体の仕上がりやトレーニング時の躍動感が伝わる写真を登録します
            </p>
          </div>

          {/* Photo Placeholders */}
          <div className="grid grid-cols-3 gap-2">
            <div className="relative rounded-xl overflow-hidden border-2 border-orange-500 aspect-3/4 bg-zinc-900">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                alt="Main"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-1 left-1 bg-orange-500 text-zinc-950 font-black text-[9px] px-1.5 py-0.5 rounded">
                メイン写真
              </span>
            </div>

            <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/60 aspect-3/4 flex flex-col items-center justify-center text-zinc-500 hover:text-orange-400 hover:border-orange-500/50 cursor-pointer transition">
              <Camera className="w-5 h-5 mb-1" />
              <span className="text-[10px]">サブ写真</span>
            </div>

            <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/60 aspect-3/4 flex flex-col items-center justify-center text-zinc-500 hover:text-orange-400 hover:border-orange-500/50 cursor-pointer transition">
              <Plus className="w-5 h-5 mb-1" />
              <span className="text-[10px]">サブ写真</span>
            </div>
          </div>

          {/* Bio Text */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              自己紹介文
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>
      )}

      {/* Navigation Button */}
      <div className="mt-8">
        <button
          onClick={handleNext}
          disabled={saving}
          className="w-full py-4 rounded-2xl bg-orange-500 text-zinc-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-orange-500/20 hover:bg-orange-400 active:scale-[0.99] transition flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
              <span>保存中...</span>
            </>
          ) : (
            <>
              <span>{step === 5 ? 'プロフィールを完成して探索へ 💪' : '次のステップへ'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

    </div>
  );
};
