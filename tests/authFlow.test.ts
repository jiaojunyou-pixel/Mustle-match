import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {
  canStartAuthenticatedData,
  canAccessScreen,
  getPostAuthScreen,
  isProtectedScreen,
} from '../src/auth/authFlow';
import {UserProfile} from '../src/types';

const profile = (profileCompleted: boolean): UserProfile => ({
  id: 'alice',
  name: 'Alice',
  age: 25,
  gender: 'female',
  role: 'muscle_lover',
  avatar: '',
  photos: [],
  bio: '',
  location: '',
  gymLocation: '',
  distanceKm: 0,
  heightCm: 165,
  weightKg: 55,
  bodyType: 'fitness_model',
  trainingYears: 1,
  weeklyFrequency: 3,
  favoriteMuscles: [],
  purpose: [],
  badges: [],
  verified: false,
  isOnline: true,
  lastActive: '',
  profileCompleted,
});

test('unauthenticated users can access public screens', () => {
  for (const screen of ['landing', 'login', 'signup'] as const) {
    assert.equal(canAccessScreen(screen, 'unauthenticated', false), true);
  }
});

test('unauthenticated and loading users cannot access protected screens', () => {
  for (const screen of ['discovery', 'matches', 'chat', 'my_profile', 'settings'] as const) {
    assert.equal(isProtectedScreen(screen), true);
    assert.equal(canAccessScreen(screen, 'unauthenticated', false), false);
    assert.equal(canAccessScreen(screen, 'loading', false), false);
  }
});

test('authenticated users with a profile can access protected screens', () => {
  assert.equal(canAccessScreen('discovery', 'authenticated', true), true);
  assert.equal(canAccessScreen('chat', 'authenticated', true), true);
});

test('post-auth screen requires profile completion', () => {
  assert.equal(getPostAuthScreen(profile(false)), 'profile_creation');
  assert.equal(getPostAuthScreen(profile(true)), 'discovery');
});

test('authenticated Firestore work waits for Auth and a profile', () => {
  assert.equal(canStartAuthenticatedData('loading', null), false);
  assert.equal(canStartAuthenticatedData('unauthenticated', null), false);
  assert.equal(canStartAuthenticatedData('authenticated', null), false);
  assert.equal(canStartAuthenticatedData('authenticated', profile(true)), true);
});

test('email authentication has no anonymous or local UID fallback', async () => {
  const source = await readFile('src/services/firebaseService.ts', 'utf8');
  assert.equal(source.includes('user_reg_'), false);
  assert.equal(source.includes('user_login_'), false);
  assert.equal(source.includes('Falling back to anonymous auth session'), false);
});
