import React, { useState, useEffect } from 'react';
import {
  AppScreen,
  UserProfile,
  MatchItem,
  ChatMessage,
  DiscoveryFilter,
  GymInvite
} from './types';
import {
  seedInitialDataIfEmpty,
  subscribeToAuth,
  loginWithEmail,
  registerWithEmail,
  loginAsDemo,
  logoutUser,
  ensureUserProfile,
  updateUserProfile,
  fetchCandidatesForUser,
  fetchLikesReceivedForUser,
  swipeRightUser,
  swipeLeftUser,
  subscribeToUserMatches,
  subscribeToMessages,
  sendMessage,
  blockUserInFirebase,
  isDummyUser
} from './services/firebaseService';
import {
  AuthStatus,
  canStartAuthenticatedData,
  canAccessScreen,
  getPostAuthScreen,
  isProtectedScreen,
} from './auth/authFlow';

import { Navbar } from './components/Navigation/Navbar';
import { BottomNav } from './components/Navigation/BottomNav';
import { LandingPage } from './components/Landing/LandingPage';
import { LoginScreen } from './components/Auth/LoginScreen';
import { SignUpScreen } from './components/Auth/SignUpScreen';
import { ProfileCreationScreen } from './components/Profile/ProfileCreationScreen';
import { SwipeDiscovery } from './components/Discovery/SwipeDiscovery';
import { MatchesListScreen } from './components/Matches/MatchesListScreen';
import { MessageScreen } from './components/Chat/MessageScreen';
import { MyProfileScreen } from './components/Profile/MyProfileScreen';
import { SettingsScreen } from './components/Settings/SettingsScreen';

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';
const DEFAULT_FILTER: DiscoveryFilter = {
  roleFilter: 'all',
  minAge: 18,
  maxAge: 50,
  maxDistanceKm: 100,
  minBenchPressKg: 0,
  verifiedOnly: false,
};

export default function App() {
  // Screen Router
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('landing');
  const [activeMatchesTab, setActiveMatchesTab] = useState<'all' | 'new' | 'likes'>('all');

  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');
  const [authInitializationError, setAuthInitializationError] = useState<string | null>(null);

  const handleNavigate = (screen: AppScreen, subTab?: 'all' | 'likes') => {
    if (!canAccessScreen(screen, authStatus, Boolean(currentUser))) {
      setCurrentScreen('login');
      return;
    }
    setCurrentScreen(screen);
    if (subTab) {
      setActiveMatchesTab(subTab);
    }
  };

  // User & Role state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeRole, setActiveRole] = useState<'trainee' | 'muscle_lover'>('trainee');

  // Discovery State
  const [candidates, setCandidates] = useState<UserProfile[]>([]);
  const [filter, setFilter] = useState<DiscoveryFilter>(DEFAULT_FILTER);

  // Matches & Chat State
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>({});
  const [selectedMatch, setSelectedMatch] = useState<MatchItem | null>(null);
  const [likesReceived, setLikesReceived] = useState<UserProfile[]>([]);

  const clearAuthenticatedState = () => {
    setCurrentUser(null);
    setCandidates([]);
    setMatches([]);
    setMessagesMap({});
    setSelectedMatch(null);
    setLikesReceived([]);
    setActiveMatchesTab('all');
    setActiveRole('trainee');
    setFilter(DEFAULT_FILTER);
  };

  // 1. Wait for Firebase Auth before loading any authenticated Firestore data.
  useEffect(() => {
    let active = true;
    const unsubscribeAuth = subscribeToAuth(async (firebaseUser) => {
      if (!active) return;
      setAuthInitializationError(null);

      if (!firebaseUser) {
        clearAuthenticatedState();
        setAuthStatus('unauthenticated');
        setCurrentScreen((screen) => isProtectedScreen(screen) ? 'landing' : screen);
        return;
      }

      try {
        if (DEMO_MODE) {
          await seedInitialDataIfEmpty();
        }
        const profile = await ensureUserProfile(firebaseUser.uid);
        if (!active) return;
        setCurrentUser(profile);
        setActiveRole(profile.role);
        setAuthStatus('authenticated');
        setCurrentScreen(getPostAuthScreen(profile));
      } catch (error) {
        console.error('Failed to initialize authenticated user:', error);
        if (!active) return;
        clearAuthenticatedState();
        setAuthStatus('authenticated');
        setAuthInitializationError('アカウント情報を読み込めませんでした。通信状態を確認して再読み込みしてください。');
      }
    });

    return () => {
      active = false;
      unsubscribeAuth();
    };
  }, []);

  // 2. Fetch candidates whenever current user or filter changes
  useEffect(() => {
    if (!canStartAuthenticatedData(authStatus, currentUser)) return;
    let active = true;
    const isDemo = DEMO_MODE && isDummyUser(currentUser);
    fetchCandidatesForUser(currentUser.id, filter, isDemo).then((list) => {
      if (active) setCandidates(list);
    });
    fetchLikesReceivedForUser(currentUser.id).then((likers) => {
      if (active) setLikesReceived(likers);
    });
    return () => {
      active = false;
    };
  }, [authStatus, currentUser?.id, filter]);

  // 3. Real-time Firebase Subscription for Matches
  useEffect(() => {
    if (!canStartAuthenticatedData(authStatus, currentUser)) return;

    const unsubscribeMatches = subscribeToUserMatches(currentUser.id, (userMatches) => {
      setMatches(userMatches);
      if (!selectedMatch && userMatches.length > 0) {
        setSelectedMatch(userMatches[0]);
      }
    });

    return () => unsubscribeMatches();
  }, [authStatus, currentUser?.id]);

  // 4. Real-time Firebase Subscription for Messages in active match
  useEffect(() => {
    if (!canStartAuthenticatedData(authStatus, currentUser) || !selectedMatch?.id) return;

    const unsubscribeMsgs = subscribeToMessages(selectedMatch.id, (msgs) => {
      if (msgs && msgs.length > 0) {
        setMessagesMap((prev) => ({
          ...prev,
          [selectedMatch.id]: msgs
        }));
      }
    });

    return () => unsubscribeMsgs();
  }, [authStatus, currentUser?.id, selectedMatch?.id]);

  // Real Auth Handlers
  const handleEmailLogin = async (email: string, pass: string) => {
    const profile = await loginWithEmail(email, pass);
    setCurrentUser(profile);
    setActiveRole(profile.role);
    setAuthStatus('authenticated');
    setCurrentScreen(getPostAuthScreen(profile));
  };

  const handleEmailSignUp = async (
    email: string,
    pass: string,
    role: 'trainee' | 'muscle_lover',
    name: string,
    gender: 'male' | 'female'
  ) => {
    const profile = await registerWithEmail(email, pass, role, name, gender);
    setCurrentUser(profile);
    setActiveRole(profile.role);
    setAuthStatus('authenticated');
    setCurrentScreen('profile_creation');
  };

  // Role perspective toggle
  const handleRoleToggle = async () => {
    if (!currentUser) return;
    const targetRole = activeRole === 'trainee' ? 'muscle_lover' : 'trainee';
    if (!isDummyUser(currentUser)) {
      setActiveRole(targetRole);
      setFilter((prev) => ({ ...prev, roleFilter: targetRole }));
    } else if (DEMO_MODE) {
      const profile = await loginAsDemo(targetRole);
      setCurrentUser(profile);
      setActiveRole(targetRole);
    }
  };

  // Demo Login Handler
  const handleLoginAs = async (role: 'trainee' | 'muscle_lover') => {
    if (!DEMO_MODE) {
      throw new Error('Demo login is disabled in this environment.');
    }
    const profile = await loginAsDemo(role);
    setCurrentUser(profile);
    setActiveRole(role);
    setAuthStatus('authenticated');
    setCurrentScreen('discovery');
  };

  // Swipe Handlers
  const handleSwipeRight = async (candidate: UserProfile): Promise<boolean> => {
    if (!currentUser) return false;
    const mutual = await swipeRightUser(currentUser.id, candidate, false);
    return mutual;
  };

  const handleSwipeLeft = (candidate: UserProfile) => {
    if (!currentUser) return;
    swipeLeftUser(currentUser.id, candidate.id);
    setCandidates((prev) => prev.filter((c) => c.id !== candidate.id));
  };

  const handleSuperLike = async (candidate: UserProfile): Promise<boolean> => {
    if (!currentUser) return false;
    const mutual = await swipeRightUser(currentUser.id, candidate, true);
    return mutual;
  };

  const handleLikeBack = async (targetUser: UserProfile) => {
    if (!currentUser) return;
    const mutual = await swipeRightUser(currentUser.id, targetUser, false);
    if (!mutual) {
      throw new Error('相互Likeを確認できませんでした。');
    }
    setLikesReceived((prev) => prev.filter((u) => u.id !== targetUser.id));
    setActiveMatchesTab('new');
    setCurrentScreen('matches');
  };

  // Select match & navigate to chat
  const handleSelectMatch = (matchItem: MatchItem) => {
    setSelectedMatch(matchItem);
    setCurrentScreen('chat');
  };

  // Start chat directly
  const handleStartChatWithUser = (user: UserProfile) => {
    if (!currentUser) return;
    const matchId = `match_${currentUser.id}_${user.id}`;
    let existing = matches.find((m) => m.user.id === user.id || m.id === matchId);
    if (!existing) {
      existing = {
        id: matchId,
        user,
        matchedAt: '今',
        lastMessage: 'マッチが成立しました！メッセージを送信しましょう💪',
        lastMessageTime: '今',
        unreadCount: 0,
        isNewMatch: true
      };
      setMatches((prev) => [existing!, ...prev]);
    }
    setSelectedMatch(existing);
    setCurrentScreen('chat');
  };

  // Send message handler with Firebase sync and simulated reply
  const handleSendMessage = (
    matchId: string,
    text: string,
    praiseCategory?: 'bulk' | 'cut' | 'style' | 'gym',
    gymInvite?: GymInvite
  ) => {
    if (!currentUser) return;
    sendMessage(matchId, currentUser.id, text, praiseCategory, gymInvite);

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      matchId,
      senderId: currentUser.id,
      text,
      praiseCategory,
      gymInvite,
      timestamp: nowStr
    };

    setMessagesMap((prev) => ({
      ...prev,
      [matchId]: [...(prev[matchId] || []), newMsg]
    }));

    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? {
              ...m,
              lastMessage: text,
              lastMessageTime: nowStr
            }
          : m
      )
    );

    // Simulated response from match partner (only if partner is dummy user)
    if (selectedMatch && isDummyUser(selectedMatch.user)) {
      const partnerUser = selectedMatch.user;
      setTimeout(() => {
        const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        let replyText = `${currentUser.name}さん、メッセージありがとうございます！よろしくお願いします💪`;
        if (gymInvite) {
          replyText = `合同トレのお誘いありがとうございます！${gymInvite.proposedDate}、是非ご一緒しましょう！🔥`;
        } else if (praiseCategory === 'gym') {
          replyText = `ぜひ合同トレしましょう！普段はどのエリアのジムに行かれていますか？🏋️`;
        } else if (praiseCategory === 'bulk' || praiseCategory === 'cut') {
          replyText = `褒めていただきありがとうございます！日々のPFCバランス意識と筋トレの成果です✨`;
        } else {
          replyText = `メッセージありがとうございます！得意な種目や好きな部位はどこですか？🔥`;
        }

        const replyMsg: ChatMessage = {
          id: `reply_${Date.now()}`,
          matchId,
          senderId: partnerUser.id,
          text: replyText,
          timestamp: replyTime
        };

        setMessagesMap((prev) => ({
          ...prev,
          [matchId]: [...(prev[matchId] || []), replyMsg]
        }));

        setMatches((prev) =>
          prev.map((m) =>
            m.id === matchId
              ? {
                  ...m,
                  lastMessage: replyText,
                  lastMessageTime: replyTime
                }
              : m
          )
        );
      }, 1200);
    }
  };

  // Update user profile in Firebase
  const handleUpdateUser = async (updatedProfile: UserProfile) => {
    if (!currentUser || currentUser.id !== updatedProfile.id) {
      throw new Error('Authenticated profile is not available.');
    }
    await updateUserProfile(updatedProfile.id, updatedProfile);
    setCurrentUser(updatedProfile);
  };

  // Block User Handler
  const handleBlockUser = (blockedUserId: string) => {
    if (!currentUser) return;
    blockUserInFirebase(currentUser.id, blockedUserId, 'User blocked from UI');
    setCandidates((prev) => prev.filter((c) => c.id !== blockedUserId));
    setMatches((prev) => prev.filter((m) => m.user.id !== blockedUserId));
  };

  const handleLogout = async () => {
    await logoutUser();
    clearAuthenticatedState();
    setAuthStatus('unauthenticated');
    setCurrentScreen('landing');
  };

  const totalUnreadCount = matches.reduce((sum, m) => sum + m.unreadCount, 0);
  const guardedScreen = canAccessScreen(currentScreen, authStatus, Boolean(currentUser))
    ? currentScreen
    : 'login';
  const isAppView = ['discovery', 'matches', 'chat', 'my_profile', 'settings'].includes(guardedScreen);

  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-9 h-9 rounded-full border-2 border-zinc-700 border-t-orange-500 animate-spin mx-auto" />
          <p className="text-xs font-bold text-zinc-400 tracking-wider">認証状態を確認しています...</p>
        </div>
      </div>
    );
  }

  if (authInitializationError) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
        <div className="max-w-sm text-center space-y-4">
          <p className="text-sm font-bold text-red-400">{authInitializationError}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-5 py-3 rounded-2xl bg-orange-500 text-zinc-950 text-xs font-black"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-orange-500 selection:text-zinc-950 ${
      isAppView ? 'h-[100dvh] overflow-hidden' : 'min-h-screen'
    }`}>
      
      {/* Universal Header */}
      <Navbar
        currentScreen={guardedScreen}
        onNavigate={handleNavigate}
        activeRole={activeRole}
        onRoleToggle={handleRoleToggle}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-md w-full mx-auto relative overflow-hidden flex flex-col">
        {guardedScreen === 'landing' && (
          <LandingPage
            onNavigate={handleNavigate}
            demoMode={DEMO_MODE}
            onDemoLogin={() => handleLoginAs('trainee')}
          />
        )}

        {guardedScreen === 'login' && (
          <LoginScreen
            onNavigate={handleNavigate}
            onLoginAs={handleLoginAs}
            onEmailLogin={handleEmailLogin}
            demoMode={DEMO_MODE}
          />
        )}

        {guardedScreen === 'signup' && (
          <SignUpScreen
            onNavigate={handleNavigate}
            onSignUpWithEmail={handleEmailSignUp}
          />
        )}

        {guardedScreen === 'profile_creation' && currentUser && (
          <ProfileCreationScreen
            onNavigate={handleNavigate}
            userRole={currentUser.role}
            currentUser={currentUser}
            onUpdateUser={handleUpdateUser}
          />
        )}

        {guardedScreen === 'discovery' && currentUser && (
          <SwipeDiscovery
            candidates={candidates}
            currentUser={currentUser}
            filter={filter}
            onApplyFilter={setFilter}
            onSwipeRight={handleSwipeRight}
            onSwipeLeft={handleSwipeLeft}
            onSuperLike={handleSuperLike}
            onStartChat={handleStartChatWithUser}
            onBlockUser={handleBlockUser}
          />
        )}

        {guardedScreen === 'matches' && currentUser && (
          <MatchesListScreen
            matches={matches}
            likesReceived={likesReceived}
            onSelectMatch={handleSelectMatch}
            onLikeBack={handleLikeBack}
            onNavigate={handleNavigate}
            activeTab={activeMatchesTab}
            onTabChange={setActiveMatchesTab}
          />
        )}

        {guardedScreen === 'chat' && currentUser && selectedMatch && (
          <MessageScreen
            match={selectedMatch}
            currentUser={currentUser}
            messages={messagesMap[selectedMatch.id] || []}
            onSendMessage={handleSendMessage}
            onBack={() => setCurrentScreen('matches')}
            onBlockUser={handleBlockUser}
          />
        )}

        {guardedScreen === 'my_profile' && currentUser && (
          <MyProfileScreen
            user={currentUser}
            onUpdateUser={handleUpdateUser}
            onNavigate={handleNavigate}
          />
        )}

        {guardedScreen === 'settings' && currentUser && (
          <SettingsScreen
            currentUser={currentUser}
            filter={filter}
            onApplyFilter={setFilter}
            onRoleToggle={handleRoleToggle}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        currentScreen={guardedScreen}
        onNavigate={handleNavigate}
        unreadMatchesCount={totalUnreadCount}
        newLikesCount={likesReceived.length}
        activeMatchesTab={activeMatchesTab}
      />

    </div>
  );
}
