export type UserRole = 'trainee' | 'muscle_lover'; // 筋肉を磨く人 or 筋肉を愛する人
export type Gender = 'male' | 'female' | 'other';
export type BodyType = 'physique' | 'machissimo' | 'slim_muscular' | 'powerlifter' | 'fitness_model' | 'beginner';
export type TargetMusclePart = '大胸筋' | '広背筋・背中' | '上腕二頭筋・三頭筋' | '肩（三角筋）' | '腹筋・シックスパック' | '脚・大腿四頭筋' | '全身バランス';

export interface MuscleBadge {
  id: string;
  name: string;
  icon: string;
  category: 'record' | 'experience' | 'lifestyle' | 'verified';
  color: string;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  role: UserRole;
  avatar: string;
  photos: string[];
  bio: string;
  location: string;
  gymLocation?: string; // 例: ゴールドジム渋谷 / エニタイム秋葉原
  distanceKm: number;
  
  // Body & Workout Stats
  heightCm: number;
  weightKg: number;
  bodyFatPercentage?: number;
  bodyType: BodyType;
  trainingYears: number; // 筋トレ歴（年）
  weeklyFrequency: number; // 週のトレ回数
  
  // BIG3 Records (kg)
  benchPressMaxKg?: number;
  squatMaxKg?: number;
  deadliftMaxKg?: number;
  
  favoriteMuscles: TargetMusclePart[];
  preferredGymBrand?: string; // Gold's Gym, Anytime Fitness, Joyfit, etc.
  purpose: ('恋愛・デート' | '合同トレーニング' | '筋トレ仲間探し' | 'ボディメイク相談')[];
  
  badges: MuscleBadge[];
  verified: boolean;
  isOnline: boolean;
  lastActive: string;
  likesCurrentUser?: boolean;

  // Additional detail fields
  job?: string;
  holidayActivity?: string;
  hobbies?: string;
  drinking?: string;
  smoking?: string;
  favoriteExercise?: string;
  competitionExperience?: string;
  profileCompleted?: boolean;
  isDummy?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface MatchItem {
  id: string;
  user: UserProfile;
  matchedAt: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isNewMatch: boolean;
  workoutSessionProposed?: boolean;
}

export interface GymInvite {
  gymName: string;
  proposedDate: string;
  targetWorkout: string; // 例: 胸トレ・大胸筋デイ
  message: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface ChatMessage {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  timestamp: string;
  isPraiseSticker?: boolean;
  praiseCategory?: 'bulk' | 'cut' | 'style' | 'gym';
  gymInvite?: GymInvite;
}

export type AppScreen =
  | 'landing'
  | 'login'
  | 'signup'
  | 'profile_creation'
  | 'discovery'
  | 'matches'
  | 'chat'
  | 'my_profile'
  | 'settings';

export interface DiscoveryFilter {
  roleFilter: 'all' | 'trainee' | 'muscle_lover';
  minAge: number;
  maxAge: number;
  maxDistanceKm: number;
  minBenchPressKg?: number;
  musclePart?: string;
  minTrainingYears?: number;
  verifiedOnly: boolean;
}
