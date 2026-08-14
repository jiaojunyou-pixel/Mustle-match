import {
  auth,
  db,
  FirebaseUser
} from '../lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInAnonymously
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  onSnapshot,
  orderBy,
  serverTimestamp,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import { UserProfile, MatchItem, ChatMessage, DiscoveryFilter, GymInvite, UserRole, Gender } from '../types';
import rawData from '../data/dummyUsers.json';

const DUMMY_IDS = new Set(['user_takumi', 'user_misaki', 'user_kenji', 'user_yuki', 'user_ren', 'user_erika', 'user_tanaka', 'user_sato']);

function requireAuthenticatedUid(expectedUid?: string): string {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error('Firebase Authentication is required for this operation.');
  }
  if (expectedUid && uid !== expectedUid) {
    throw new Error('Authenticated user does not match the requested user ID.');
  }
  return uid;
}

export function isDummyUser(user: Partial<UserProfile> | null | undefined): boolean {
  if (!user) return false;
  if (user.isDummy === true) return true;
  if (user.id && DUMMY_IDS.has(user.id)) return true;
  return false;
}

// --- SEED INITIAL DATABASE ---
export async function seedInitialDataIfEmpty() {
  try {
    const usersSnap = await getDocs(collection(db, 'users'));
    if (!usersSnap.empty) {
      console.log('Firebase Firestore users collection already seeded.');
      return;
    }

    console.log('Seeding initial profiles to Firebase Firestore...');
    const defaultUser = rawData.currentUser as unknown as UserProfile;
    await setDoc(doc(db, 'users', defaultUser.id), {
      ...defaultUser,
      profileCompleted: true,
      isDummy: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const profiles = rawData.profiles as unknown as UserProfile[];
    for (const p of profiles) {
      await setDoc(doc(db, 'users', p.id), {
        ...p,
        profileCompleted: true,
        isDummy: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    console.log('Firebase seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding Firebase:', error);
  }
}

// --- AUTHENTICATION SERVICES ---
export function subscribeToAuth(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function registerWithEmail(
  email: string,
  pass: string,
  role: UserRole,
  name: string,
  gender: Gender
): Promise<UserProfile> {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  const uid = cred.user.uid;

  const newUserProfile: UserProfile = {
    id: uid,
    name: name || (role === 'trainee' ? 'NEW TRAINEE' : 'NEW MUSCLE LOVER'),
    age: 25,
    gender,
    role,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
    ],
    bio: 'MUSCLE MATCHへようこそ！理想の筋肉＆フィットネス仲間を探しています💪',
    location: '東京都 渋谷区',
    gymLocation: 'ゴールドジム 渋谷東京',
    distanceKm: 2,
    heightCm: 175,
    weightKg: 75,
    bodyFatPercentage: 12,
    bodyType: 'physique',
    trainingYears: 2,
    weeklyFrequency: 4,
    benchPressMaxKg: 100,
    squatMaxKg: 130,
    deadliftMaxKg: 150,
    favoriteMuscles: ['大胸筋', '肩（三角筋）'],
    preferredGymBrand: "Gold's Gym",
    purpose: ['恋愛・デート', '合同トレーニング'],
    badges: [
      { id: 'b_new', name: '新規トレーニー', icon: '🔥', category: 'lifestyle', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40' }
    ],
    verified: true,
    isOnline: true,
    profileCompleted: false,
    lastActive: '今アクティブ'
  };

  await setDoc(doc(db, 'users', uid), {
    ...newUserProfile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return newUserProfile;
}

export async function loginWithEmail(email: string, pass: string): Promise<UserProfile> {
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  const uid = cred.user.uid;

  const userDoc = await getDoc(doc(db, 'users', uid));
  if (userDoc.exists()) {
    return userDoc.data() as UserProfile;
  }

  // Fallback profile for real user if doc not found
  const fallback: UserProfile = {
    id: uid,
    name: 'USER_' + uid.substring(0, 5),
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
  fallback.profileCompleted = false;
  await setDoc(doc(db, 'users', uid), {
    ...fallback,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return fallback;
}

export async function loginAsDemo(role: 'trainee' | 'muscle_lover'): Promise<UserProfile> {
  let uid = auth.currentUser?.uid;
  if (!uid) {
    const cred = await signInAnonymously(auth);
    uid = cred.user.uid;
  }

  let baseProfile: UserProfile;
  if (role === 'muscle_lover') {
    const misaki = (rawData.profiles as unknown as UserProfile[]).find((p) => p.id === 'user_misaki');
    baseProfile = { ...(misaki || rawData.profiles[0] as unknown as UserProfile), id: uid, role: 'muscle_lover' };
  } else {
    baseProfile = { ...(rawData.currentUser as unknown as UserProfile), id: uid, role: 'trainee' };
  }

  await setDoc(doc(db, 'users', uid), {
    ...baseProfile,
    id: uid,
    profileCompleted: true,
    isOnline: true,
    lastActive: '今アクティブ'
  }, { merge: true });

  return baseProfile;
}

export async function logoutUser() {
  await signOut(auth);
}

// --- USER PROFILE CRUD ---
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile from Firestore:', error);
    return null;
  }
}

export async function ensureUserProfile(uid: string): Promise<UserProfile> {
  requireAuthenticatedUid(uid);
  const snap = await getDoc(doc(db, 'users', uid));
  if (snap.exists()) {
    return snap.data() as UserProfile;
  }

  const template = rawData.currentUser as unknown as UserProfile;
  const profile: UserProfile = {
    ...template,
    id: uid,
    name: 'NEW USER',
    isDummy: false,
    verified: false,
    profileCompleted: false,
  };
  await setDoc(doc(db, 'users', uid), {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return profile;
}

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>) {
  requireAuthenticatedUid(uid);
  try {
    await setDoc(doc(db, 'users', uid), {
      ...updates,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error updating user profile in Firestore:', error);
    throw error;
  }
}

// --- IMAGE UPLOAD HELPER ---
export function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

// --- DISCOVERY & SWIPE SERVICES ---
export async function fetchCandidatesForUser(
  currentUserId: string,
  filter: DiscoveryFilter,
  isDemoMode: boolean = false
): Promise<UserProfile[]> {
  try {
    const authUid = requireAuthenticatedUid(currentUserId);

    // Get user's swiped/passed/blocked IDs
    const swipedSnap = await getDocs(query(collection(db, 'likes'), where('fromUserId', '==', currentUserId)));
    const passesSnap = await getDocs(query(collection(db, 'passes'), where('fromUserId', '==', currentUserId)));
    const blocksSnap = await getDocs(query(collection(db, 'blocks'), where('fromUserId', '==', currentUserId)));

    const excludeIds = new Set<string>([currentUserId]);
    swipedSnap.forEach((d) => excludeIds.add(d.data().toUserId));
    passesSnap.forEach((d) => excludeIds.add(d.data().toUserId));
    blocksSnap.forEach((d) => excludeIds.add(d.data().blockedUserId));

    const usersSnap = await getDocs(collection(db, 'users'));
    const allFetchedUserIds: string[] = [];
    const realCandidates: UserProfile[] = [];
    const dummyCandidates: UserProfile[] = [];

    usersSnap.forEach((docSnap) => {
      const u = docSnap.data() as UserProfile;
      const userProfile: UserProfile = {
        ...u,
        id: u.id || docSnap.id
      };
      allFetchedUserIds.push(userProfile.id);

      if (!excludeIds.has(userProfile.id)) {
        // Filter checks
        if (filter.roleFilter !== 'all' && userProfile.role !== filter.roleFilter) return;
        if (userProfile.age && (userProfile.age < filter.minAge || userProfile.age > filter.maxAge)) return;
        if (filter.maxDistanceKm && userProfile.distanceKm && userProfile.distanceKm > filter.maxDistanceKm) return;
        if (filter.minBenchPressKg && filter.minBenchPressKg > 0) {
          if (!userProfile.benchPressMaxKg || userProfile.benchPressMaxKg < filter.minBenchPressKg) return;
        }
        if (filter.verifiedOnly && !userProfile.verified) return;

        if (isDummyUser(userProfile)) {
          dummyCandidates.push(userProfile);
        } else {
          realCandidates.push(userProfile);
        }
      }
    });

    let finalCandidates: UserProfile[] = [];
    let dummyUsersUsed = false;
    let dummyReason = 'Not in demo mode and real users evaluated';

    if (isDemoMode) {
      if (realCandidates.length > 0) {
        finalCandidates = realCandidates;
        dummyReason = 'Demo mode active, returning real candidates first';
      } else {
        finalCandidates = dummyCandidates;
        dummyUsersUsed = true;
        dummyReason = 'Demo mode active and using dummy candidates';
      }
    } else {
      // Normal Mode: strictly return real candidates, NEVER fallback to dummy candidates
      finalCandidates = realCandidates;
      dummyUsersUsed = false;
      dummyReason = realCandidates.length === 0
        ? 'Normal Mode: No other real candidates found in Firestore (dummy candidates explicitly excluded)'
        : 'Normal Mode: Showing real candidates from Firestore';
    }

    console.log('=== DISCOVERY CANDIDATES DIAGNOSTICS ===');
    console.log('Current Auth UID:', authUid);
    console.log('Is Demo Mode:', isDemoMode);
    console.log('Firestore users count:', usersSnap.size);
    console.log('Firestore user UIDs:', allFetchedUserIds);
    console.log('Excluded self UID:', currentUserId);
    console.log('Excluded swiped/passed/blocked UIDs:', Array.from(excludeIds));
    console.log('Real candidates count:', realCandidates.length);
    console.log('Dummy candidates count:', dummyCandidates.length);
    console.log('Final candidate UIDs:', finalCandidates.map((c) => c.id));
    console.log('Dummy users used:', dummyUsersUsed);
    console.log('Dummy users reason:', dummyReason);
    console.log('========================================');

    return finalCandidates;
  } catch (error) {
    console.error('Error fetching discovery candidates from Firestore:', error);
    if (isDemoMode) {
      const rawProfiles = rawData.profiles as unknown as UserProfile[];
      return rawProfiles.filter((p) => p.id !== currentUserId);
    }
    return [];
  }
}

export async function fetchLikesReceivedForUser(currentUserId: string): Promise<UserProfile[]> {
  try {
    requireAuthenticatedUid(currentUserId);
    const likesSnap = await getDocs(query(collection(db, 'likes'), where('toUserId', '==', currentUserId)));
    const matchesSnap = await getDocs(query(collection(db, 'matches'), where('users', 'array-contains', currentUserId)));
    const matchedUserIds = new Set<string>();
    matchesSnap.forEach((matchDoc) => {
      const users = matchDoc.data().users as string[];
      users.forEach((userId) => {
        if (userId !== currentUserId) matchedUserIds.add(userId);
      });
    });
    const likers: UserProfile[] = [];

    for (const d of likesSnap.docs) {
      const fromId = d.data().fromUserId;
      if (!matchedUserIds.has(fromId)) {
        const profile = await getUserProfile(fromId);
        if (profile) {
          likers.push(profile);
        }
      }
    }

    return likers;
  } catch (error) {
    console.error('Error fetching likes received:', error);
    return [];
  }
}

export async function swipeRightUser(
  fromUserId: string,
  toUser: UserProfile,
  isSuperLike: boolean = false
): Promise<boolean> {
  requireAuthenticatedUid(fromUserId);
  const likeDocId = `${fromUserId}_${toUser.id}`;
  await setDoc(doc(db, 'likes', likeDocId), {
    fromUserId,
    toUserId: toUser.id,
    type: isSuperLike ? 'superlike' : 'like',
    createdAt: serverTimestamp()
  });

  const reverseLikeDocId = `${toUser.id}_${fromUserId}`;
  const reverseLikeSnap = await getDoc(doc(db, 'likes', reverseLikeDocId));
  if (!reverseLikeSnap.exists()) {
    return false;
  }

  const userIds = [fromUserId, toUser.id].sort();
  const matchId = `match_${userIds[0]}_${userIds[1]}`;
  const matchRef = doc(db, 'matches', matchId);
  let createdMatch = false;

  try {
    // The deterministic ID prevents duplicate matches. Do not read a missing
    // match first: its read is intentionally denied by the Security Rules.
    // An attempted overwrite is rejected by the update rule, preserving the
    // existing match and chat state.
    await setDoc(matchRef, {
      id: matchId,
      users: [userIds[0], userIds[1]],
      matchedAt: '今',
      lastMessage: 'マッチが成立しました！メッセージを送りましょう💪',
      lastMessageTime: '今',
      unreadCount: 0,
      isNewMatch: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    createdMatch = true;
  } catch (createError) {
    // A concurrent request may have created the deterministic match first.
    // Existing participants can read it; any other failure remains visible to
    // the caller instead of being converted into a false success.
    try {
      const existingMatch = await getDoc(matchRef);
      if (existingMatch.exists()) return true;
    } catch {
      // Preserve the original create error, which is the actionable failure.
    }
    throw createError;
  }

  if (createdMatch) {
    await addDoc(collection(db, 'matches', matchId, 'messages'), {
      matchId,
      senderId: fromUserId,
      text: 'マッチありがとうございます✨ 筋肉を追い込んで最高のマッチングにしましょう！',
      timestamp: '今',
      createdAt: serverTimestamp()
    });
  }

  return true;
}

export async function swipeLeftUser(fromUserId: string, toUserId: string) {
  try {
    requireAuthenticatedUid(fromUserId);
    const passDocId = `${fromUserId}_${toUserId}`;
    await setDoc(doc(db, 'passes', passDocId), {
      fromUserId,
      toUserId,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error swiping left:', error);
  }
}

// --- MATCHES & MESSAGES SERVICES ---
export function subscribeToUserMatches(
  currentUserId: string,
  callback: (matches: MatchItem[]) => void
) {
  requireAuthenticatedUid(currentUserId);
  const q = query(
    collection(db, 'matches'),
    where('users', 'array-contains', currentUserId)
  );

  return onSnapshot(q, async (snapshot) => {
    const matchesList: MatchItem[] = [];

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const otherUserId = (data.users as string[]).find((id) => id !== currentUserId) || data.users[0];
      
      let otherProfile = await getUserProfile(otherUserId);
      if (!otherProfile) {
        otherProfile = (rawData.profiles as unknown as UserProfile[]).find((p) => p.id === otherUserId) || rawData.profiles[0] as unknown as UserProfile;
      }

      matchesList.push({
        id: docSnap.id,
        user: otherProfile,
        matchedAt: data.matchedAt || '最近',
        lastMessage: data.lastMessage || '',
        lastMessageTime: data.lastMessageTime || '',
        unreadCount: data.unreadCount || 0,
        isNewMatch: data.isNewMatch || false,
        workoutSessionProposed: data.workoutSessionProposed
      });
    }

    callback(matchesList);
  }, (error) => {
    console.error('Error in matches snapshot listener:', error);
  });
}

export function subscribeToMessages(
  matchId: string,
  callback: (messages: ChatMessage[]) => void
) {
  requireAuthenticatedUid();
  const q = query(
    collection(db, 'matches', matchId, 'messages'),
    orderBy('createdAt', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const msgs: ChatMessage[] = snapshot.docs.map((d) => ({
      id: d.id,
      matchId: d.data().matchId || matchId,
      senderId: d.data().senderId,
      text: d.data().text,
      timestamp: d.data().timestamp || '今',
      isPraiseSticker: d.data().isPraiseSticker,
      praiseCategory: d.data().praiseCategory,
      gymInvite: d.data().gymInvite
    }));

    callback(msgs);
  }, (error) => {
    console.error('Error in messages snapshot listener:', error);
  });
}

export async function sendMessage(
  matchId: string,
  senderId: string,
  text: string,
  praiseCategory?: 'bulk' | 'cut' | 'style' | 'gym',
  gymInvite?: GymInvite
) {
  try {
    requireAuthenticatedUid(senderId);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    await addDoc(collection(db, 'matches', matchId, 'messages'), {
      matchId,
      senderId,
      text,
      praiseCategory: praiseCategory || null,
      gymInvite: gymInvite || null,
      timestamp: timeStr,
      createdAt: serverTimestamp()
    });

    await updateDoc(doc(db, 'matches', matchId), {
      lastMessage: text,
      lastMessageTime: timeStr,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error sending message to Firebase:', error);
  }
}

// --- BLOCK & REPORT SERVICES ---
export async function blockUserInFirebase(fromUserId: string, blockedUserId: string, reason: string) {
  try {
    requireAuthenticatedUid(fromUserId);
    const blockDocId = `${fromUserId}_${blockedUserId}`;
    await setDoc(doc(db, 'blocks', blockDocId), {
      fromUserId,
      blockedUserId,
      reason,
      createdAt: serverTimestamp()
    });

    // Remove existing match if any
    const matchId = `match_${fromUserId}_${blockedUserId}`;
    const reverseMatchId = `match_${blockedUserId}_${fromUserId}`;

    await deleteDoc(doc(db, 'matches', matchId)).catch(() => {});
    await deleteDoc(doc(db, 'matches', reverseMatchId)).catch(() => {});
  } catch (error) {
    console.error('Error blocking user in Firebase:', error);
  }
}

export async function reportUserInFirebase(
  reporterId: string,
  reportedUserId: string,
  reason: string,
  details: string
) {
  try {
    requireAuthenticatedUid(reporterId);
    await addDoc(collection(db, 'reports'), {
      reporterId,
      reportedUserId,
      reason,
      details,
      status: 'pending',
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error submitting report to Firebase:', error);
  }
}
