import { UserProfile, MatchItem, ChatMessage, DiscoveryFilter } from '../types';
import rawData from '../data/dummyUsers.json';

const STORAGE_KEYS = {
  CURRENT_USER: 'mm_current_user',
  ACTIVE_ROLE: 'mm_active_role',
  CANDIDATES: 'mm_candidates',
  SWIPED_IDS: 'mm_swiped_ids',
  LIKED_IDS: 'mm_liked_ids',
  PASSED_IDS: 'mm_passed_ids',
  MATCHES: 'mm_matches',
  MESSAGES: 'mm_messages',
  LIKES_RECEIVED: 'mm_likes_received',
  FILTER: 'mm_filter',
  CURRENT_SCREEN: 'mm_current_screen'
};

// Map raw json initial matches to MatchItem objects with user reference
export function getInitialMatchesFromData(profilesList: UserProfile[]): MatchItem[] {
  return rawData.initialMatches.map((item) => {
    const matchedUser = profilesList.find((p) => p.id === item.userId) || profilesList[0];
    return {
      id: item.id,
      user: matchedUser,
      matchedAt: item.matchedAt,
      lastMessage: item.lastMessage,
      lastMessageTime: item.lastMessageTime,
      unreadCount: item.unreadCount,
      isNewMatch: item.isNewMatch,
      workoutSessionProposed: item.workoutSessionProposed
    };
  });
}

export function loadStoredData() {
  try {
    const profiles: UserProfile[] = rawData.profiles as unknown as UserProfile[];
    const defaultUser: UserProfile = rawData.currentUser as unknown as UserProfile;

    // Current User
    const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    const currentUser: UserProfile = savedUser ? JSON.parse(savedUser) : defaultUser;

    // Active Role
    const savedRole = localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE) as 'trainee' | 'muscle_lover' | null;
    const activeRole: 'trainee' | 'muscle_lover' = savedRole || 'trainee';

    // Candidates
    const savedCandidates = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
    const candidates: UserProfile[] = savedCandidates ? JSON.parse(savedCandidates) : profiles;

    // Swiped IDs
    const savedSwiped = localStorage.getItem(STORAGE_KEYS.SWIPED_IDS);
    const swipedIds: string[] = savedSwiped ? JSON.parse(savedSwiped) : [];

    // Liked IDs
    const savedLiked = localStorage.getItem(STORAGE_KEYS.LIKED_IDS);
    const likedIds: string[] = savedLiked ? JSON.parse(savedLiked) : [];

    // Passed IDs
    const savedPassed = localStorage.getItem(STORAGE_KEYS.PASSED_IDS);
    const passedIds: string[] = savedPassed ? JSON.parse(savedPassed) : [];

    // Matches
    const savedMatches = localStorage.getItem(STORAGE_KEYS.MATCHES);
    const matches: MatchItem[] = savedMatches
      ? JSON.parse(savedMatches)
      : getInitialMatchesFromData(profiles);

    // Messages
    const savedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    const messagesMap: Record<string, ChatMessage[]> = savedMessages
      ? JSON.parse(savedMessages)
      : (rawData.initialMessages as unknown as Record<string, ChatMessage[]>);

    // Likes Received (users who liked current user but haven't matched yet)
    const savedLikesReceived = localStorage.getItem(STORAGE_KEYS.LIKES_RECEIVED);
    const likesReceived: UserProfile[] = savedLikesReceived
      ? JSON.parse(savedLikesReceived)
      : profiles.filter((p) => p.likesCurrentUser && !matches.some((m) => m.user.id === p.id));

    // Filter
    const savedFilter = localStorage.getItem(STORAGE_KEYS.FILTER);
    const filter: DiscoveryFilter = savedFilter
      ? JSON.parse(savedFilter)
      : {
          roleFilter: 'all',
          minAge: 18,
          maxAge: 45,
          maxDistanceKm: 15,
          minBenchPressKg: 60,
          verifiedOnly: false
        };

    return {
      currentUser,
      activeRole,
      candidates,
      swipedIds,
      likedIds,
      passedIds,
      matches,
      messagesMap,
      likesReceived,
      filter
    };
  } catch (error) {
    console.error('Error loading from LocalStorage:', error);
    const profiles: UserProfile[] = rawData.profiles as unknown as UserProfile[];
    return {
      currentUser: rawData.currentUser as unknown as UserProfile,
      activeRole: 'trainee' as const,
      candidates: profiles,
      swipedIds: [],
      likedIds: [],
      passedIds: [],
      matches: getInitialMatchesFromData(profiles),
      messagesMap: rawData.initialMessages as unknown as Record<string, ChatMessage[]>,
      likesReceived: profiles.filter((p) => p.likesCurrentUser),
      filter: {
        roleFilter: 'all' as const,
        minAge: 18,
        maxAge: 45,
        maxDistanceKm: 15,
        minBenchPressKg: 60,
        verifiedOnly: false
      }
    };
  }
}

export function saveStateToStorage(state: {
  currentUser?: UserProfile;
  activeRole?: 'trainee' | 'muscle_lover';
  candidates?: UserProfile[];
  swipedIds?: string[];
  likedIds?: string[];
  passedIds?: string[];
  matches?: MatchItem[];
  messagesMap?: Record<string, ChatMessage[]>;
  likesReceived?: UserProfile[];
  filter?: DiscoveryFilter;
}) {
  try {
    if (state.currentUser) localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(state.currentUser));
    if (state.activeRole) localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, state.activeRole);
    if (state.candidates) localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(state.candidates));
    if (state.swipedIds) localStorage.setItem(STORAGE_KEYS.SWIPED_IDS, JSON.stringify(state.swipedIds));
    if (state.likedIds) localStorage.setItem(STORAGE_KEYS.LIKED_IDS, JSON.stringify(state.likedIds));
    if (state.passedIds) localStorage.setItem(STORAGE_KEYS.PASSED_IDS, JSON.stringify(state.passedIds));
    if (state.matches) localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(state.matches));
    if (state.messagesMap) localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(state.messagesMap));
    if (state.likesReceived) localStorage.setItem(STORAGE_KEYS.LIKES_RECEIVED, JSON.stringify(state.likesReceived));
    if (state.filter) localStorage.setItem(STORAGE_KEYS.FILTER, JSON.stringify(state.filter));
  } catch (error) {
    console.error('Error saving to LocalStorage:', error);
  }
}

export function clearLocalStorage() {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error clearing LocalStorage:', error);
  }
}
