import React, { useState } from 'react';
import { AppScreen } from '../../types';
import { Dumbbell, ShieldCheck, Sparkles, ArrowRight, CheckCircle2, Trophy, Heart, Flame, MapPin, Zap, Award, ChevronLeft, ChevronRight } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (screen: AppScreen) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // 3~5 Sample profile preview cards for Section 2
  const sampleProfiles = [
    {
      id: 'p1',
      name: 'TAKUMI',
      age: 27,
      location: '東京都 港区',
      gymLocation: 'ゴールドジム 渋谷東京',
      heightCm: 178,
      weightKg: 82,
      trainingYears: 4,
      weeklyFrequency: '週5回',
      favoriteMuscle: '大胸筋・肩（三角筋）',
      benchPressMaxKg: 125,
      squatMaxKg: 160,
      deadliftMaxKg: 190,
      bio: 'フィジーク大会出場に向けて減量中！大胸筋と肩のメロン肩作りに注力してます。合同トレ仲間や高タンパクデートできるお相手募集中です！',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      badges: ['ベンチ125kg', '大会経験者', 'ゴールドジム会員']
    },
    {
      id: 'p2',
      name: 'ミサキ (Misaki)',
      age: 24,
      location: '東京都 六本木',
      gymLocation: 'エニタイム 麻布十番',
      heightCm: 165,
      weightKg: 52,
      trainingYears: 2,
      weeklyFrequency: '週3回',
      favoriteMuscle: '広背筋・大胸筋（フェチ）',
      benchPressMaxKg: null,
      squatMaxKg: 65,
      deadliftMaxKg: 80,
      bio: 'ピラティス＆お尻トレーニングに夢中🍑 ストイックに追い込む筋肉男子がとにかく大好きです！休日に赤身肉ステーキデート行きたいです🥩✨',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      badges: ['美ボディ目指し中', '背中フェチ', '高タンパク好き']
    },
    {
      id: 'p3',
      name: 'レン (Ren)',
      age: 26,
      location: '東京都 渋谷区',
      gymLocation: 'ゴールドジム 原宿東京',
      heightCm: 176,
      weightKg: 78,
      trainingYears: 5,
      weeklyFrequency: '週6回',
      favoriteMuscle: '大胸筋・広背筋・腹筋',
      benchPressMaxKg: 135,
      squatMaxKg: 175,
      deadliftMaxKg: 210,
      bio: 'フィジークコンテスト入賞歴あり🏆 Vシェイプにこだわり抜いてます。美味しい赤身肉デートや休日の合同トレーニング仲間募集中！',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
      badges: ['コンテスト入賞', 'BIG3 520kg', 'Vシェイプ']
    },
    {
      id: 'p4',
      name: 'ユキ (Yuki)',
      age: 27,
      location: '東京都 表参道',
      gymLocation: 'ゴールドジム 渋谷東京',
      heightCm: 168,
      weightKg: 53,
      trainingYears: 3,
      weeklyFrequency: '週4回',
      favoriteMuscle: '腹筋・シックスパック・脚',
      benchPressMaxKg: 55,
      squatMaxKg: 95,
      deadliftMaxKg: 110,
      bio: 'ベストボディ・ジャパン出場経験あり✨ 腹筋シックスパック女子です。お互いを高め合えるストイックな男性と出会いたいです！',
      avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=800&q=80',
      badges: ['BBJファイナリスト', 'シックスパック', '脚トレ追い込み']
    }
  ];

  const currentPreview = sampleProfiles[activeCardIndex];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-28 font-sans selection:bg-orange-500 selection:text-zinc-950">
      
      {/* 1. ファーストビュー (Hero Section) */}
      <section className="relative pt-6 pb-10 px-5 max-w-md mx-auto text-center flex flex-col items-center">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Eyebrow Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-orange-500 text-[10px] font-bold tracking-widest uppercase mb-5 shadow-lg">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Japan's #1 Premium Fitness Match</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl font-black tracking-tighter italic uppercase text-white leading-tight mb-3">
          鍛え上げたその体、<br />
          <span className="text-orange-500">最高のパートナーシップへ。</span>
        </h1>

        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xs mx-auto mb-6 font-medium">
          「筋肉を愛する人」と「筋肉を磨く人」をつなぐ。<br />
          ストイックな価値観で引き寄せあう、日本初のフィットネス特化型マッチング。
        </p>

        {/* Primary Action Buttons */}
        <div className="w-full space-y-3 mb-6">
          <button
            onClick={() => onNavigate('signup')}
            className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-400 text-zinc-950 font-black text-sm uppercase tracking-wider transition shadow-lg shadow-orange-500/25 flex items-center justify-center space-x-2"
          >
            <span>無料会員登録して始める</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('login')}
            className="w-full py-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white font-bold text-xs transition"
          >
            ログインはこちら
          </button>

          <button
            onClick={() => onNavigate('discovery')}
            className="text-[11px] text-zinc-500 hover:text-orange-400 font-bold tracking-wider pt-1 transition block mx-auto"
          >
            ログインなしでデモを試す →
          </button>
        </div>

      </section>

      {/* 2. 実際のプロフィールカードのプレビュー */}
      <section className="max-w-md mx-auto px-5 py-8 border-t border-zinc-900 space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-1">
              PROFILE PREVIEW
            </h2>
            <h3 className="text-lg font-black text-white italic uppercase">
              出会えるメンバーのプロフィール
            </h3>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setActiveCardIndex((prev) => (prev === 0 ? sampleProfiles.length - 1 : prev - 1))}
              className="p-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-zinc-500">
              {activeCardIndex + 1}/{sampleProfiles.length}
            </span>
            <button
              onClick={() => setActiveCardIndex((prev) => (prev === sampleProfiles.length - 1 ? 0 : prev + 1))}
              className="p-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Interactive Card Preview */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative transition duration-300">
          
          {/* Card Photo Header */}
          <div className="relative h-72 bg-zinc-950">
            <img
              src={currentPreview.avatar}
              alt={currentPreview.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent" />
            
            {/* Top Badge */}
            <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
              <span className="px-2.5 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md text-orange-500 text-[10px] font-bold border border-orange-500/30 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {currentPreview.location}
              </span>
            </div>

            {/* Bottom Photo Title Overlay */}
            <div className="absolute bottom-3 left-4 right-4">
              <div className="flex items-center space-x-2">
                <h4 className="text-xl font-black text-white">{currentPreview.name}</h4>
                <span className="text-base font-extrabold text-orange-400">({currentPreview.age})</span>
              </div>
              <p className="text-xs text-zinc-300 font-medium flex items-center gap-1 mt-0.5">
                <Dumbbell className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span>{currentPreview.gymLocation}</span>
              </p>
            </div>
          </div>

          {/* Card Body - Physical & Workout Specs */}
          <div className="p-4 space-y-3">
            
            {/* Specs Grid */}
            <div className="grid grid-cols-4 gap-1.5 text-center">
              <div className="bg-zinc-950/80 p-2 rounded-xl border border-zinc-800">
                <div className="text-[9px] text-zinc-500 font-bold uppercase">身長/体重</div>
                <div className="text-xs font-black text-white font-mono mt-0.5">
                  {currentPreview.heightCm}cm / {currentPreview.weightKg}kg
                </div>
              </div>

              <div className="bg-zinc-950/80 p-2 rounded-xl border border-zinc-800">
                <div className="text-[9px] text-zinc-500 font-bold uppercase">筋トレ歴</div>
                <div className="text-xs font-black text-white font-mono mt-0.5">
                  {currentPreview.trainingYears}年目
                </div>
              </div>

              <div className="bg-zinc-950/80 p-2 rounded-xl border border-zinc-800">
                <div className="text-[9px] text-zinc-500 font-bold uppercase">頻度</div>
                <div className="text-xs font-black text-white font-mono mt-0.5">
                  {currentPreview.weeklyFrequency}
                </div>
              </div>

              <div className="bg-zinc-950/80 p-2 rounded-xl border border-zinc-800">
                <div className="text-[9px] text-zinc-500 font-bold uppercase">ベンチMAX</div>
                <div className="text-xs font-black text-orange-500 font-mono mt-0.5">
                  {currentPreview.benchPressMaxKg ? `${currentPreview.benchPressMaxKg}kg` : '---'}
                </div>
              </div>
            </div>

            {/* Favorite Muscle Tag */}
            <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-xs">
              <span className="font-bold text-orange-400">🔥 重点・得意部位：</span>
              <span className="text-zinc-200 ml-1 font-semibold">{currentPreview.favoriteMuscle}</span>
            </div>

            {/* Bio */}
            <p className="text-xs text-zinc-300 leading-relaxed font-medium">
              「{currentPreview.bio}」
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {currentPreview.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full bg-zinc-950 border border-zinc-800 text-orange-400 text-[10px] font-bold"
                >
                  #{badge}
                </span>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 3. MUSCLE MATCH独自のプロフィール項目 */}
      <section className="max-w-md mx-auto px-5 py-8 border-t border-zinc-900 space-y-4">
        <div>
          <h2 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-1">
            SPECIAL ATTRIBUTES
          </h2>
          <h3 className="text-lg font-black text-white italic uppercase">
            MUSCLE MATCH 独自のプロフィール項目
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            一般的なマッチングアプリでは分からない「フィットネスの価値観」で直接マッチ。
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <Trophy className="w-5 h-5 text-orange-500 mb-2" />
            <h4 className="font-bold text-xs text-white">BIG3 MAX記録</h4>
            <p className="text-[10px] text-zinc-400 mt-1">ベンチプレス、スクワット、デッドリフトの実績数値を明確表示。</p>
          </div>

          <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <Flame className="w-5 h-5 text-orange-500 mb-2" />
            <h4 className="font-bold text-xs text-white">アピール・好きな部位</h4>
            <p className="text-[10px] text-zinc-400 mt-1">「大胸筋」「シックスパック」「広背筋」などピンポイント部位検索。</p>
          </div>

          <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <Dumbbell className="w-5 h-5 text-orange-500 mb-2" />
            <h4 className="font-bold text-xs text-white">メイン所属ジム</h4>
            <p className="text-[10px] text-zinc-400 mt-1">ゴールドジム、エニタイム等のホームジムや通う店舗を指定可能。</p>
          </div>

          <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <Award className="w-5 h-5 text-orange-500 mb-2" />
            <h4 className="font-bold text-xs text-white">大会・コンテスト経歴</h4>
            <p className="text-[10px] text-zinc-400 mt-1">フィジークやベストボディ等の大会経験バッジで実績をアピール。</p>
          </div>
        </div>
      </section>

      {/* 4. 筋肉・フィットネス特化のマッチング機能 */}
      <section className="max-w-md mx-auto px-5 py-8 border-t border-zinc-900 space-y-4">
        <div>
          <h2 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-1">
            CORE MATCHING FEATURES
          </h2>
          <h3 className="text-lg font-black text-white italic uppercase">
            フィットネス特化のインタラクション
          </h3>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 shrink-0 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white">「筋肉称賛ステッカー」付きLIKE</h4>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                「ナイスバルク！」「素晴らしいカット！」など筋トレ用語で即座に親近感アップ。
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 shrink-0 mt-0.5">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white">「合同トレーニング招待」カード</h4>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                チャットから指定店舗・日時の合トレカードを1タップでスマート送信。
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white">BIG3 & 筋トレスペック検索</h4>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                ベンチプレス100kg以上や「高タンパクデート希望」など目的別フィルタリング。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ユーザータイプ別の利用メリット */}
      <section className="max-w-md mx-auto px-5 py-8 border-t border-zinc-900 space-y-4">
        <div>
          <h2 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-1">
            USER BENEFITS
          </h2>
          <h3 className="text-lg font-black text-white italic uppercase">
            ユーザータイプ別のメリット
          </h3>
        </div>

        <div className="space-y-4">
          {/* Trainee Male */}
          <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 relative overflow-hidden">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">トレーニー男子 / 筋肉を磨く人</h4>
                <p className="text-[10px] text-orange-400 font-mono uppercase font-semibold">Trainee & Competitor</p>
              </div>
            </div>
            <ul className="text-xs text-zinc-300 space-y-2 font-medium">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                <span>PFCバランスや減量理解のあるお相手とストレスなく出会える</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                <span>ベンチプレス自慢や努力の成果を堂々と評価してもらえる</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                <span>切磋琢磨できる合トレ仲間や赤身肉ステーキデートの相手発見</span>
              </li>
            </ul>
          </div>

          {/* Muscle Lover */}
          <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 relative overflow-hidden">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
                <Heart className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">筋肉好き / フィットネス愛好家</h4>
                <p className="text-[10px] text-zinc-400 font-mono uppercase font-semibold">Muscle Admirer & Fitness Lover</p>
              </div>
            </div>
            <ul className="text-xs text-zinc-300 space-y-2 font-medium">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                <span>たくましい肉体美やストイックに打ち込む誠実な男性に出会える</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                <span>「大胸筋」「シックスパック」など部位指定で好みを追求可能</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                <span>健康的な食事やワークアウト文化を一緒に共有して楽しめる</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. 安心・安全への取り組み */}
      <section className="max-w-md mx-auto px-5 py-8 border-t border-zinc-900">
        <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 text-center space-y-3">
          <ShieldCheck className="w-8 h-8 text-orange-500 mx-auto" />
          <h4 className="font-bold text-sm text-white uppercase tracking-wider">安心・安全への徹底した取り組み</h4>
          
          <div className="grid grid-cols-2 gap-2 text-left pt-1">
            <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
              <div className="text-xs font-bold text-orange-400">18歳以上限定</div>
              <p className="text-[10px] text-zinc-400 mt-0.5">公的身分証による年齢確認手続きを導入。</p>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
              <div className="text-xs font-bold text-orange-400">通報・ブロック機能</div>
              <p className="text-[10px] text-zinc-400 mt-0.5">不快なユーザーやスパムを即時ブロック・通報可能。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. 会員登録CTA */}
      <section className="max-w-md mx-auto px-5 pt-4 text-center space-y-3">
        <button
          onClick={() => onNavigate('signup')}
          className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-400 text-zinc-950 font-black text-sm uppercase tracking-wider transition shadow-lg shadow-orange-500/20 flex items-center justify-center space-x-2"
        >
          <span>MUSCLE MATCH に無料登録する 💪</span>
        </button>
        <p className="text-[10px] text-zinc-500">登録は1分で完了します。クレジットカード不要。</p>
      </section>

    </div>
  );
};
