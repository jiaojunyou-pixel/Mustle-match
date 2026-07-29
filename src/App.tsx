import React, { useState, useEffect } from 'react';
import {
  AppScreen,
  UserProfile,
  MatchItem,
  ChatMessage,
  DiscoveryFilter,
  GymInvite
} from './types';
import rawData from './data/dummyUsers.json';

import {
  seedInitialDataIfEmpty,
  subscribeToAuth,
  loginWithEmail,
  registerWithEmail,
  loginAsDemo,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  fetchCandidatesForUser,
  fetchLikesReceivedForUser,
  swipeRightUser,
  swipeLeftUser,
  subscribeToUserMatches,
  subscribeToMessages,
  sendMessage,
  blockUserInFirebase,
  reportUserInFirebase,
  isDummyUser
} from './services/firebaseService';

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

export default function App() {
  // Screen Router
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('landing');
  const [activeMatchesTab, setActiveMatchesTab] = useState<'all' | 'new' | 'likes'>('all');

  const handleNavigate = (screen: AppScreen, subTab?: 'all' | 'likes') => {
    setCurrentScreen(screen);
    if (subTab) {
      setActiveMatchesTab(subTab);
    }
  };

  // User & Role state
  const [currentUser, setCurrentUser] = useState<UserProfile>(rawData.currentUser as unknown as UserProfile);
  const [activeRole, setActiveRole] = useState<'trainee' | 'muscle_lover'>('trainee');

  // Discovery State
  const [candidates, setCandidates] = useState<UserProfile[]>([]);
  const [filter, setFilter] = useState<DiscoveryFilter>({
    roleFilter: 'all',
    minAge: 18,
    maxAge: 50,
    maxDistanceKm: 100,
    minBenchPressKg: 0,
    verifiedOnly: false
  });

  // Matches & Chat State
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>({});
  const [selectedMatch, setSelectedMatch] = useState<MatchItem | null>(null);
  const [likesReceived, setLikesReceived] = useState<UserProfile[]>([]);

  // 1. Initialize Firebase & Seed database on mount
  useEffect(() => {
    const initApp = async () => {
      await seedInitialDataIfEmpty();
    };
    initApp();

    const unsubscribeAuth = subscribeToAuth(async (firebaseUser) => {
      if (firebaseUser) {
        let profile = await getUserProfile(firebaseUser.uid);
        if (!profile) {
          profile = {
            id: firebaseUser.uid,
            name: 'NEW USER',
            age: 26,
            gender: 'male',
            role: 'trainee',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
            photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'],
            bio: 'MUSCLE MATCHへようこそ！理想のパートナーを探しています💪',
            location: '東京都 渋谷区',
            gymLocation: 'ゴールドジム 渋谷東京',
            distanceKm: 2,
            heightCm: 175,
            weightKg: 70,
            bodyType: 'physique',
            trainingYears: 1,
            weeklyFrequency: 4,
            benchPressMaxKg: 80,
            squatMaxKg: 100,
            deadliftMaxKg: 120,
            favoriteMuscles: ['大胸筋', '肩（三角筋）'],
            purpose: ['合同トレーニング'],
            badges: [],
            verified: true,
            isOnline: true,
            lastActive: '今アクティブ',
            isDummy: false
          };
          await updateUserProfile(firebaseUser.uid, profile);
        }
        setCurrentUser(profile);
        setActiveRole(profile.role);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 2. Fetch candidates whenever current user or filter changes
  useEffect(() => {
    if (!currentUser?.id) return;
    const isDemo = isDummyUser(currentUser);
    fetchCandidatesForUser(currentUser.id, filter, isDemo).then((list) => {
      setCandidates(list);
    });
    fetchLikesReceivedForUser(currentUser.id).then((likers) => {
      setLikesReceived(likers);
    });
  }, [currentUser?.id, filter]);

  // 3. Real-time Firebase Subscription for Matches
  useEffect(() => {
    if (!currentUser?.id) return;

    const unsubscribeMatches = subscribeToUserMatches(currentUser.id, (userMatches) => {
      setMatches((prev) => {
        const map = new Map<string, MatchItem>();
        prev.forEach((m) => map.set(m.id, m));
        userMatches.forEach((m) => map.set(m.id, m));
        return Array.from(map.values());
      });
      if (!selectedMatch && userMatches.length > 0) {
        setSelectedMatch(userMatches[0]);
      }
    });

    return () => unsubscribeMatches();
  }, [currentUser?.id]);

  // 4. Real-time Firebase Subscription for Messages in active match
  useEffect(() => {
    if (!selectedMatch?.id) return;

    const unsubscribeMsgs = subscribeToMessages(selectedMatch.id, (msgs) => {
      if (msgs && msgs.length > 0) {
        setMessagesMap((prev) => ({
          ...prev,
          [selectedMatch.id]: msgs
        }));
      }
    });

    return () => unsubscribeMsgs();
  }, [selectedMatch?.id]);

  // Real Auth Handlers
  const handleEmailLogin = async (email: string, pass: string) => {
    const profile = await loginWithEmail(email, pass);
    setCurrentUser(profile);
    setActiveRole(profile.role);
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
  };

  // Role perspective toggle
  const handleRoleToggle = async () => {
    const targetRole = activeRole === 'trainee' ? 'muscle_lover' : 'trainee';
    if (currentUser && !isDummyUser(currentUser)) {
      setActiveRole(targetRole);
      setFilter((prev) => ({ ...prev, roleFilter: targetRole }));
    } else {
      const profile = await loginAsDemo(targetRole);
      setCurrentUser(profile);
      setActiveRole(targetRole);
    }
  };

  // Demo Login Handler
  const handleLoginAs = async (role: 'trainee' | 'muscle_lover') => {
    const profile = await loginAsDemo(role);
    setCurrentUser(profile);
    setActiveRole(role);
    setCurrentScreen('discovery');
  };

  // Swipe Handlers
  const handleSwipeRight = (candidate: UserProfile): boolean => {
    // Filter candidate locally from deck
    setCandidates((prev) => prev.filter((c) => c.id !== candidate.id));

    // Determine match state
    const isDummy = isDummyUser(candidate);
    const isMatch = candidate.likesCurrentUser === true || (isDummy && candidate.role !== currentUser.role);

    // Record in Firebase Firestore & handle mutual check
    swipeRightUser(currentUser.id, candidate, false).then((mutual) => {
      if (mutual) {
        const userIds = [currentUser.id, candidate.id].sort();
        const matchId = `match_${userIds[0]}_${userIds[1]}`;
        const newMatch: MatchItem = {
          id: matchId,
          user: candidate,
          matchedAt: '今',
          lastMessage: 'マッチが成立しました！メッセージを送信しましょう💪',
          lastMessageTime: '今',
          unreadCount: 0,
          isNewMatch: true
        };

        setMatches((prev) => {
          if (prev.some((m) => m.user.id === candidate.id || m.id === matchId)) return prev;
          return [newMatch, ...prev];
        });
      }
    });

    return isMatch;
  };

  const handleSwipeLeft = (candidate: UserProfile) => {
    swipeLeftUser(currentUser.id, candidate.id);
    setCandidates((prev) => prev.filter((c) => c.id !== candidate.id));
  };

  const handleSuperLike = (candidate: UserProfile): boolean => {
    setCandidates((prev) => prev.filter((c) => c.id !== candidate.id));

    swipeRightUser(currentUser.id, candidate, true).then(() => {
      const userIds = [currentUser.id, candidate.id].sort();
      const matchId = `match_${userIds[0]}_${userIds[1]}`;
      const newMatch: MatchItem = {
        id: matchId,
        user: candidate,
        matchedAt: '今',
        lastMessage: 'SUPER LIKEでマッチングが成立しました！★',
        lastMessageTime: '今',
        unreadCount: 0,
        isNewMatch: true
      };

      setMatches((prev) => {
        if (prev.some((m) => m.user.id === candidate.id || m.id === matchId)) return prev;
        return [newMatch, ...prev];
      });
    });

    return true;
  };

  const handleLikeBack = async (targetUser: UserProfile) => {
    await swipeRightUser(currentUser.id, targetUser, true);
    setLikesReceived((prev) => prev.filter((u) => u.id !== targetUser.id));

    const userIds = [currentUser.id, targetUser.id].sort();
    const matchId = `match_${userIds[0]}_${userIds[1]}`;
    const newMatch: MatchItem = {
      id: matchId,
      user: targetUser,
      matchedAt: '今',
      lastMessage: '相互いいねが成立しました！よろしくおねがいします！',
      lastMessageTime: '今',
      unreadCount: 0,
      isNewMatch: true
    };

    setMatches((prev) => {
      if (prev.some((m) => m.user.id === targetUser.id || m.id === matchId)) {
        return prev.map((m) => m.user.id === targetUser.id ? newMatch : m);
      }
      return [newMatch, ...prev];
    });

    setSelectedMatch(newMatch);
    setCurrentScreen('chat');
  };

  // Select match & navigate to chat
  const handleSelectMatch = (matchItem: MatchItem) => {
    setSelectedMatch(matchItem);
    setCurrentScreen('chat');
  };

  // Start chat directly
  const handleStartChatWithUser = (user: UserProfile) => {
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
  const handleUpdateUser = (updatedProfile: UserProfile) => {
    setCurrentUser(updatedProfile);
    updateUserProfile(updatedProfile.id, updatedProfile);
  };

  // Block User Handler
  const handleBlockUser = (blockedUserId: string) => {
    blockUserInFirebase(currentUser.id, blockedUserId, 'User blocked from UI');
    setCandidates((prev) => prev.filter((c) => c.id !== blockedUserId));
    setMatches((prev) => prev.filter((m) => m.user.id !== blockedUserId));
  };

  // Reset Data / Sign Out
  const handleResetData = async () => {
    await logoutUser();
    setCurrentScreen('landing');
  };

  const totalUnreadCount = matches.reduce((sum, m) => sum + m.unreadCount, 0);
  const isAppView = ['discovery', 'matches', 'chat', 'my_profile', 'settings'].includes(currentScreen);

  return (
    <div className={`bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-orange-500 selection:text-zinc-950 ${
      isAppView ? 'h-[100dvh] overflow-hidden' : 'min-h-screen'
    }`}>
      
      {/* Universal Header */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        activeRole={activeRole}
        onRoleToggle={handleRoleToggle}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-md w-full mx-auto relative overflow-hidden flex flex-col">
        {currentScreen === 'landing' && (
          <LandingPage onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'login' && (
          <LoginScreen
            onNavigate={setCurrentScreen}
            onLoginAs={handleLoginAs}
            onEmailLogin={handleEmailLogin}
          />
        )}

        {currentScreen === 'signup' && (
          <SignUpScreen
            onNavigate={setCurrentScreen}
            onSignUpComplete={(role) => handleLoginAs(role)}
            onSignUpWithEmail={handleEmailSignUp}
          />
        )}

        {currentScreen === 'profile_creation' && (
          <ProfileCreationScreen
            onNavigate={setCurrentScreen}
            userRole={currentUser.role}
            currentUser={currentUser}
            onUpdateUser={handleUpdateUser}
          />
        )}

        {currentScreen === 'discovery' && (
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

        {currentScreen === 'matches' && (
          <MatchesListScreen
            matches={matches}
            likesReceived={likesReceived}
            onSelectMatch={handleSelectMatch}
            onLikeBack={handleLikeBack}
            onNavigate={setCurrentScreen}
            activeTab={activeMatchesTab}
            onTabChange={setActiveMatchesTab}
          />
        )}

        {currentScreen === 'chat' && selectedMatch && (
          <MessageScreen
            match={selectedMatch}
            currentUser={currentUser}
            messages={messagesMap[selectedMatch.id] || []}
            onSendMessage={handleSendMessage}
            onBack={() => setCurrentScreen('matches')}
            onBlockUser={handleBlockUser}
          />
        )}

        {currentScreen === 'my_profile' && (
          <MyProfileScreen
            user={currentUser}
            onUpdateUser={handleUpdateUser}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen
            currentUser={currentUser}
            filter={filter}
            onApplyFilter={setFilter}
            onRoleToggle={handleRoleToggle}
            onResetData={handleResetData}
            onNavigate={setCurrentScreen}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        unreadMatchesCount={totalUnreadCount}
        newLikesCount={likesReceived.length}
        activeMatchesTab={activeMatchesTab}
      />

    </div>
  );
}
