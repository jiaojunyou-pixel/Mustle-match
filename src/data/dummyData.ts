import { UserProfile, MatchItem, ChatMessage, DiscoveryFilter } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'current_user_1',
  name: 'TAKUMI',
  age: 27,
  gender: 'male',
  role: 'trainee',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  photos: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80'
  ],
  bio: '大会出場に向けて現在減量中！胸トレと肩トレが得意です。モチベーションの高い合同トレ仲間や、筋肉＆ボディメイクに理解のある女性と繋がりたいです！プロテインはWPIホエイ愛用。',
  location: '東京都 港区',
  gymLocation: 'ゴールドジム 渋谷東京',
  distanceKm: 2,
  heightCm: 178,
  weightKg: 82,
  bodyFatPercentage: 11,
  bodyType: 'physique',
  trainingYears: 4,
  weeklyFrequency: 5,
  benchPressMaxKg: 125,
  squatMaxKg: 160,
  deadliftMaxKg: 190,
  favoriteMuscles: ['大胸筋', '肩（三角筋）', '腹筋・シックスパック'],
  preferredGymBrand: "Gold's Gym",
  purpose: ['恋愛・デート', '合同トレーニング', '筋トレ仲間探し'],
  badges: [
    { id: 'b1', name: 'ベンチ100kg超', icon: '🏋️‍♂️', category: 'record', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40' },
    { id: 'b2', name: '大会経験者', icon: '🏆', category: 'experience', color: 'bg-rose-500/20 text-rose-400 border-rose-500/40' },
    { id: 'b3', name: '週5トレーニー', icon: '🔥', category: 'lifestyle', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
    { id: 'b4', name: '本人確認済み', icon: '✅', category: 'verified', color: 'bg-blue-500/20 text-blue-400 border-blue-500/40' }
  ],
  verified: true,
  isOnline: true,
  lastActive: '今アクティブ'
};

export const DUMMY_PROFILES: UserProfile[] = [
  {
    id: 'user_ren',
    name: 'レン (Ren)',
    age: 26,
    gender: 'male',
    role: 'trainee',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80'
    ],
    bio: 'フィジークコンテスト入賞経験あり🏆大胸筋と広背筋のVシェイプにこだわり抜いてます。美味しい高タンパクな赤身肉デートや、休日の合トレ仲間募集中！お気軽に「ナイスバルク！」送ってください💪',
    location: '東京都 渋谷区',
    gymLocation: 'ゴールドジム 原宿東京',
    distanceKm: 1.5,
    heightCm: 176,
    weightKg: 78,
    bodyFatPercentage: 9.5,
    bodyType: 'physique',
    trainingYears: 5,
    weeklyFrequency: 6,
    benchPressMaxKg: 135,
    squatMaxKg: 175,
    deadliftMaxKg: 210,
    favoriteMuscles: ['大胸筋', '広背筋・背中', '肩（三角筋）'],
    preferredGymBrand: "Gold's Gym",
    purpose: ['恋愛・デート', '合同トレーニング'],
    badges: [
      { id: 'b_physique', name: 'フィジーカー', icon: '🥇', category: 'experience', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
      { id: 'b_bench130', name: 'MAX 135kg', icon: '⚡', category: 'record', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
      { id: 'b_pro', name: 'ゴールドジム会員', icon: '👑', category: 'lifestyle', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' }
    ],
    verified: true,
    isOnline: true,
    lastActive: '5分前'
  },
  {
    id: 'user_misaki',
    name: 'ミサキ (Misaki)',
    age: 24,
    gender: 'female',
    role: 'muscle_lover',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80'
    ],
    bio: '自身もピラティス＆尻トレにハマり中🍑 筋肉をストイックに鍛えている男性がとにかく大好きです！特にがっしりした背中と大胸筋フェチ。休日に高タンパクなステーキデート行きたいです🥩✨',
    location: '東京都 六本木',
    gymLocation: 'エニタイムフィットネス 麻布十番',
    distanceKm: 3.2,
    heightCm: 165,
    weightKg: 52,
    bodyFatPercentage: 18,
    bodyType: 'fitness_model',
    trainingYears: 2,
    weeklyFrequency: 3,
    favoriteMuscles: ['大胸筋', '広背筋・背中', '脚・大腿四頭筋'],
    preferredGymBrand: 'Anytime Fitness',
    purpose: ['恋愛・デート', '筋トレ仲間探し'],
    badges: [
      { id: 'b_pila', name: '美ボディ目指し中', icon: '✨', category: 'lifestyle', color: 'bg-pink-500/20 text-pink-300 border-pink-500/40' },
      { id: 'b_back', name: '背中フェチ', icon: '👀', category: 'experience', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' }
    ],
    verified: true,
    isOnline: true,
    lastActive: '今アクティブ'
  },
  {
    id: 'user_kenta',
    name: 'ケンタ (Kenta)',
    age: 29,
    gender: 'male',
    role: 'trainee',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=800&q=80'
    ],
    bio: 'パーソナルトレーナーをしています💪 BIG3総重量は550kgオーバー！初心者の方にも分かりやすくフォーム解説や食事アドバイスできます。筋トレを愛する方、一緒に理想の身体を作りましょう！',
    location: '東京都 新宿区',
    gymLocation: 'JOYFIT24 新宿御苑',
    distanceKm: 2.8,
    heightCm: 181,
    weightKg: 88,
    bodyFatPercentage: 12,
    bodyType: 'machissimo',
    trainingYears: 7,
    weeklyFrequency: 5,
    benchPressMaxKg: 145,
    squatMaxKg: 195,
    deadliftMaxKg: 220,
    favoriteMuscles: ['全身バランス', '肩（三角筋）', '大胸筋'],
    preferredGymBrand: 'Joyfit',
    purpose: ['合同トレーニング', 'ボディメイク相談', '恋愛・デート'],
    badges: [
      { id: 'b_pt', name: 'プロトレーナー', icon: '🎓', category: 'experience', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
      { id: 'b_big3500', name: 'BIG3 550kg', icon: '💥', category: 'record', color: 'bg-red-500/20 text-red-300 border-red-500/40' }
    ],
    verified: true,
    isOnline: false,
    lastActive: '30分前'
  },
  {
    id: 'user_aoi',
    name: 'アオイ (Aoi)',
    age: 25,
    gender: 'female',
    role: 'muscle_lover',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80'
    ],
    bio: '丸の内OL👩‍💼 細マッチョ〜フィジーク体型の男性に惹かれます！休日は一緒にジムで有酸素運動したり、プロテインカフェを巡りたいです。自慢のバルクを見せてくれる人マッチ待ってます！',
    location: '東京都 千代田区',
    gymLocation: 'エニタイムフィットネス 丸の内',
    distanceKm: 4.1,
    heightCm: 161,
    weightKg: 49,
    bodyType: 'slim_muscular',
    trainingYears: 1,
    weeklyFrequency: 2,
    favoriteMuscles: ['上腕二頭筋・三頭筋', '腹筋・シックスパック'],
    preferredGymBrand: 'Anytime Fitness',
    purpose: ['恋愛・デート', '筋トレ仲間探し'],
    badges: [
      { id: 'b_arm', name: '二頭筋マニア', icon: '💪', category: 'lifestyle', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
      { id: 'b_cafe', name: '高タンパクカフェ好き', icon: '🥗', category: 'lifestyle', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' }
    ],
    verified: true,
    isOnline: true,
    lastActive: '今アクティブ'
  },
  {
    id: 'user_shota',
    name: 'ショウタ (Shota)',
    age: 28,
    gender: 'male',
    role: 'trainee',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80'
    ],
    bio: 'パワーリフティング競技者🏋️‍♂️ ベンチプレス150kg挑戦中！見た目だけでなく本物の筋力を追求しています。筋トレ女子や一緒に限界を突破できる合トレ相手を募集中！',
    location: '東京都 目黒区',
    gymLocation: 'ANYTIME FITNESS 恵比寿',
    distanceKm: 2.1,
    heightCm: 173,
    weightKg: 83,
    bodyFatPercentage: 14,
    bodyType: 'powerlifter',
    trainingYears: 6,
    weeklyFrequency: 5,
    benchPressMaxKg: 148,
    squatMaxKg: 200,
    deadliftMaxKg: 230,
    favoriteMuscles: ['大胸筋', '脚・大腿四頭筋'],
    preferredGymBrand: 'Anytime Fitness',
    purpose: ['合同トレーニング', '恋愛・デート'],
    badges: [
      { id: 'b_power', name: 'パワーリフター', icon: '🏋️‍♂️', category: 'record', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' },
      { id: 'b_squat200', name: 'スクワット200kg', icon: '🔥', category: 'record', color: 'bg-red-500/20 text-red-300 border-red-500/40' }
    ],
    verified: true,
    isOnline: true,
    lastActive: '12分前'
  },
  {
    id: 'user_yuki',
    name: 'ユキ (Yuki)',
    age: 27,
    gender: 'female',
    role: 'trainee',
    avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80'
    ],
    bio: 'ベストボディ・ジャパン出場経験あり✨ 腹筋シックスパック女子です。お互いを高め合えるストイックな筋トレ男子と出会いたいです。脚トレ追い込みデートしましょう！',
    location: '東京都 表参道',
    gymLocation: 'ゴールドジム 渋谷東京',
    distanceKm: 1.8,
    heightCm: 168,
    weightKg: 53,
    bodyFatPercentage: 15,
    bodyType: 'fitness_model',
    trainingYears: 3,
    weeklyFrequency: 4,
    favoriteMuscles: ['腹筋・シックスパック', '脚・大腿四頭筋'],
    preferredGymBrand: "Gold's Gym",
    purpose: ['恋愛・デート', '合同トレーニング'],
    badges: [
      { id: 'b_bbj', name: 'BBJファイナリスト', icon: '👑', category: 'experience', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
      { id: 'b_abs', name: 'シックスパック女子', icon: '⚡', category: 'record', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' }
    ],
    verified: true,
    isOnline: true,
    lastActive: '今アクティブ'
  }
];

export const INITIAL_MATCHES: MatchItem[] = [
  {
    id: 'match_ren',
    user: DUMMY_PROFILES[0], // Ren
    matchedAt: '10分前',
    lastMessage: '最高のバルクですね！今度ゴールドジムで胸トレご一緒しませんか？💪',
    lastMessageTime: '10:42',
    unreadCount: 1,
    isNewMatch: false,
    workoutSessionProposed: true
  },
  {
    id: 'match_misaki',
    user: DUMMY_PROFILES[1], // Misaki
    matchedAt: '1時間前',
    lastMessage: 'マッチありがとうございます！プロフィールの大胸筋の写真、本当に素晴らしいです✨',
    lastMessageTime: '09:15',
    unreadCount: 2,
    isNewMatch: false
  },
  {
    id: 'match_yuki',
    user: DUMMY_PROFILES[5], // Yuki
    matchedAt: '3時間前',
    lastMessage: 'はじめまして！BBJ出場目指してトレーニング頑張ってます。',
    lastMessageTime: '昨日',
    unreadCount: 0,
    isNewMatch: true
  }
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  match_ren: [
    {
      id: 'm1',
      matchId: 'match_ren',
      senderId: 'user_ren',
      text: 'マッチありがとうございます！ベンチ125kgって凄すぎますね🔥',
      timestamp: '10:30'
    },
    {
      id: 'm2',
      matchId: 'match_ren',
      senderId: 'current_user_1',
      text: 'ありがとうございます！レンさんのVシェイプも仕上がり最高です！ナイスバルク！💪',
      timestamp: '10:35'
    },
    {
      id: 'm3',
      matchId: 'match_ren',
      senderId: 'user_ren',
      text: '最高のバルクですね！今度ゴールドジムで胸トレご一緒しませんか？💪',
      timestamp: '10:42',
      gymInvite: {
        gymName: "ゴールドジム 渋谷東京",
        proposedDate: "今週末 土曜日 14:00〜",
        targetWorkout: "大胸筋＆肩デイ合トレ",
        message: "トレーニング後に赤身肉ステーキ行きましょう！",
        status: "pending"
      }
    }
  ],
  match_misaki: [
    {
      id: 'm10',
      matchId: 'match_misaki',
      senderId: 'user_misaki',
      text: 'マッチありがとうございます！プロフィールの大胸筋の写真、本当に素晴らしいです✨',
      timestamp: '09:15',
      isPraiseSticker: true,
      praiseCategory: 'bulk'
    }
  ]
};

export const DEFAULT_FILTER: DiscoveryFilter = {
  roleFilter: 'all',
  minAge: 18,
  maxAge: 45,
  maxDistanceKm: 15,
  minBenchPressKg: 60,
  verifiedOnly: false
};
