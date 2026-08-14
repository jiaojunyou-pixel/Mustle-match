import {after, before, beforeEach, test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

const projectId = 'muscle-match-rules-test';
let testEnv;

const authedDb = (uid) => testEnv.authenticatedContext(uid).firestore();
const anonDb = () => testEnv.unauthenticatedContext().firestore();

async function seed() {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await Promise.all([
      setDoc(doc(db, 'users/alice'), {id: 'alice', name: 'Alice'}),
      setDoc(doc(db, 'users/bob'), {id: 'bob', name: 'Bob'}),
      setDoc(doc(db, 'users/charlie'), {id: 'charlie', name: 'Charlie'}),
      setDoc(doc(db, 'likes/alice_bob'), {
        fromUserId: 'alice',
        toUserId: 'bob',
        type: 'like',
      }),
      setDoc(doc(db, 'likes/bob_alice'), {
        fromUserId: 'bob',
        toUserId: 'alice',
        type: 'like',
      }),
      setDoc(doc(db, 'matches/match_alice_bob'), {
        id: 'match_alice_bob',
        users: ['alice', 'bob'],
        lastMessage: '',
      }),
      setDoc(doc(db, 'matches/match_alice_bob/messages/seed'), {
        matchId: 'match_alice_bob',
        senderId: 'alice',
        text: 'seed',
        timestamp: 'now',
      }),
      setDoc(doc(db, 'reports/alice-report'), {
        reporterId: 'alice',
        reportedUserId: 'bob',
        reason: 'test',
        details: '',
        status: 'pending',
      }),
    ]);
  });
}

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {
      rules: await readFile('firestore.rules', 'utf8'),
      host: '127.0.0.1',
      port: 8080,
    },
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
  await seed();
});

after(async () => {
  await testEnv?.cleanup();
});

test('authenticated user can update their own profile', async () => {
  await assertSucceeds(updateDoc(doc(authedDb('alice'), 'users/alice'), {name: 'Alice 2'}));
});

test('authenticated user can create a like in their own name', async () => {
  await assertSucceeds(setDoc(doc(authedDb('alice'), 'likes/alice_charlie'), {
    fromUserId: 'alice',
    toUserId: 'charlie',
    type: 'like',
    createdAt: serverTimestamp(),
  }));
});

test('match participant can read the match', async () => {
  await assertSucceeds(getDoc(doc(authedDb('alice'), 'matches/match_alice_bob')));
});

test('match participant can send a message with their own senderId', async () => {
  await assertSucceeds(addDoc(collection(authedDb('alice'), 'matches/match_alice_bob/messages'), {
    matchId: 'match_alice_bob',
    senderId: 'alice',
    text: 'hello',
    timestamp: 'now',
    createdAt: serverTimestamp(),
  }));
});

test('authenticated user can create a block in their own name', async () => {
  await assertSucceeds(setDoc(doc(authedDb('alice'), 'blocks/alice_bob'), {
    fromUserId: 'alice',
    blockedUserId: 'bob',
    reason: 'test',
    createdAt: serverTimestamp(),
  }));
});

test('authenticated user can create a report in their own name', async () => {
  await assertSucceeds(addDoc(collection(authedDb('alice'), 'reports'), {
    reporterId: 'alice',
    reportedUserId: 'bob',
    reason: 'spam',
    details: 'details',
    status: 'pending',
    createdAt: serverTimestamp(),
  }));
});

test('unauthenticated users cannot read or write users', async () => {
  await assertFails(getDoc(doc(anonDb(), 'users/alice')));
  await assertFails(getDocs(collection(anonDb(), 'users')));
  await assertFails(setDoc(doc(anonDb(), 'users/anon'), {id: 'anon'}));
});

test('user cannot update another user profile', async () => {
  await assertFails(updateDoc(doc(authedDb('alice'), 'users/bob'), {name: 'spoofed'}));
});

test('user cannot create a like in another user name', async () => {
  await assertFails(setDoc(doc(authedDb('alice'), 'likes/bob_charlie'), {
    fromUserId: 'bob',
    toUserId: 'charlie',
    type: 'like',
    createdAt: serverTimestamp(),
  }));
});

test('non-participant cannot read a match', async () => {
  await assertFails(getDoc(doc(authedDb('charlie'), 'matches/match_alice_bob')));
});

test('non-participant cannot read or post messages', async () => {
  await assertFails(getDocs(collection(authedDb('charlie'), 'matches/match_alice_bob/messages')));
  await assertFails(addDoc(collection(authedDb('charlie'), 'matches/match_alice_bob/messages'), {
    matchId: 'match_alice_bob',
    senderId: 'charlie',
    text: 'intrusion',
    timestamp: 'now',
    createdAt: serverTimestamp(),
  }));
});

test('participant cannot spoof a message senderId', async () => {
  await assertFails(addDoc(collection(authedDb('alice'), 'matches/match_alice_bob/messages'), {
    matchId: 'match_alice_bob',
    senderId: 'bob',
    text: 'spoofed',
    timestamp: 'now',
    createdAt: serverTimestamp(),
  }));
});

test('user cannot create a block in another user name', async () => {
  await assertFails(setDoc(doc(authedDb('alice'), 'blocks/bob_charlie'), {
    fromUserId: 'bob',
    blockedUserId: 'charlie',
    reason: 'spoofed',
    createdAt: serverTimestamp(),
  }));
});

test('user cannot create a report in another user name', async () => {
  await assertFails(addDoc(collection(authedDb('alice'), 'reports'), {
    reporterId: 'bob',
    reportedUserId: 'charlie',
    reason: 'spoofed',
    details: '',
    status: 'pending',
    createdAt: serverTimestamp(),
  }));
});

test('ordinary user cannot read another report', async () => {
  await assertFails(getDoc(doc(authedDb('bob'), 'reports/alice-report')));
});

test('ordinary user cannot read even their own report after submission', async () => {
  await assertFails(getDoc(doc(authedDb('alice'), 'reports/alice-report')));
});

const matchData = (firstUserId, secondUserId) => ({
  id: `match_${firstUserId}_${secondUserId}`,
  users: [firstUserId, secondUserId],
  matchedAt: 'now',
  lastMessage: '',
  lastMessageTime: 'now',
  unreadCount: 0,
  isNewMatch: true,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});

test('one ordinary like is not enough to create a match', async () => {
  await assertSucceeds(setDoc(doc(authedDb('alice'), 'likes/alice_charlie'), {
    fromUserId: 'alice',
    toUserId: 'charlie',
    type: 'like',
    createdAt: serverTimestamp(),
  }));
  await assertFails(setDoc(
    doc(authedDb('alice'), 'matches/match_alice_charlie'),
    matchData('alice', 'charlie'),
  ));
});

test('mutual ordinary likes allow exactly one deterministic match', async () => {
  await assertSucceeds(setDoc(doc(authedDb('alice'), 'likes/alice_charlie'), {
    fromUserId: 'alice',
    toUserId: 'charlie',
    type: 'like',
    createdAt: serverTimestamp(),
  }));
  await assertSucceeds(setDoc(doc(authedDb('charlie'), 'likes/charlie_alice'), {
    fromUserId: 'charlie',
    toUserId: 'alice',
    type: 'like',
    createdAt: serverTimestamp(),
  }));
  await assertSucceeds(setDoc(
    doc(authedDb('charlie'), 'matches/match_alice_charlie'),
    matchData('alice', 'charlie'),
  ));
  await assertSucceeds(getDoc(doc(authedDb('alice'), 'matches/match_alice_charlie')));
  await assertSucceeds(getDoc(doc(authedDb('charlie'), 'matches/match_alice_charlie')));

  const matches = await assertSucceeds(getDocs(query(
    collection(authedDb('alice'), 'matches'),
    where('users', 'array-contains', 'alice'),
  )));
  assert.equal(matches.docs.filter((item) => item.id === 'match_alice_charlie').length, 1);
});

test('a super like alone cannot create a match', async () => {
  await assertSucceeds(setDoc(doc(authedDb('alice'), 'likes/alice_charlie'), {
    fromUserId: 'alice',
    toUserId: 'charlie',
    type: 'superlike',
    createdAt: serverTimestamp(),
  }));
  await assertFails(setDoc(
    doc(authedDb('alice'), 'matches/match_alice_charlie'),
    matchData('alice', 'charlie'),
  ));
});

test('a super like plus the reverse ordinary like allows a match', async () => {
  await assertSucceeds(setDoc(doc(authedDb('alice'), 'likes/alice_charlie'), {
    fromUserId: 'alice',
    toUserId: 'charlie',
    type: 'superlike',
    createdAt: serverTimestamp(),
  }));
  await assertSucceeds(setDoc(doc(authedDb('charlie'), 'likes/charlie_alice'), {
    fromUserId: 'charlie',
    toUserId: 'alice',
    type: 'like',
    createdAt: serverTimestamp(),
  }));
  await assertSucceeds(setDoc(
    doc(authedDb('charlie'), 'matches/match_alice_charlie'),
    matchData('alice', 'charlie'),
  ));
});

test('a non-participant cannot create a match for two other users', async () => {
  await assertFails(setDoc(
    doc(authedDb('charlie'), 'matches/match_alice_bob'),
    matchData('alice', 'bob'),
  ));
});

test('a message cannot be created when its parent match was not created', async () => {
  await assertFails(addDoc(collection(authedDb('alice'), 'matches/match_alice_charlie/messages'), {
    matchId: 'match_alice_charlie',
    senderId: 'alice',
    text: 'orphan message',
    timestamp: 'now',
    createdAt: serverTimestamp(),
  }));
});

test('creating the same deterministic match cannot overwrite existing chat state', async () => {
  await assertFails(setDoc(
    doc(authedDb('alice'), 'matches/match_alice_bob'),
    matchData('alice', 'bob'),
  ));
  const existing = await assertSucceeds(getDoc(doc(authedDb('alice'), 'matches/match_alice_bob')));
  assert.equal(existing.data().lastMessage, '');
});

test('client match flow does not pre-read a missing match and like-back is ordinary', async () => {
  const serviceSource = await readFile('src/services/firebaseService.ts', 'utf8');
  const appSource = await readFile('src/App.tsx', 'utf8');
  const swipeFlow = serviceSource.slice(
    serviceSource.indexOf('export async function swipeRightUser'),
    serviceSource.indexOf('export async function swipeLeftUser'),
  );
  const createAttempt = swipeFlow.indexOf('await setDoc(matchRef');
  const existingMatchRead = swipeFlow.indexOf('await getDoc(matchRef)');
  assert.ok(createAttempt >= 0);
  assert.ok(existingMatchRead > createAttempt);

  const likeBackFlow = appSource.slice(
    appSource.indexOf('const handleLikeBack'),
    appSource.indexOf('// Select match & navigate to chat'),
  );
  assert.match(likeBackFlow, /swipeRightUser\(currentUser\.id, targetUser, false\)/);
  assert.doesNotMatch(likeBackFlow, /swipeRightUser\(currentUser\.id, targetUser, true\)/);
});

assert.ok(true);
