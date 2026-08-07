import {AppScreen, UserProfile} from '../types';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export const PROTECTED_SCREENS = new Set<AppScreen>([
  'profile_creation',
  'discovery',
  'matches',
  'chat',
  'my_profile',
  'settings',
]);

export function isProtectedScreen(screen: AppScreen): boolean {
  return PROTECTED_SCREENS.has(screen);
}

export function canAccessScreen(
  screen: AppScreen,
  authStatus: AuthStatus,
  hasProfile: boolean,
): boolean {
  return !isProtectedScreen(screen)
    || (authStatus === 'authenticated' && hasProfile);
}

export function getPostAuthScreen(profile: UserProfile): AppScreen {
  return profile.profileCompleted ? 'discovery' : 'profile_creation';
}

export function canStartAuthenticatedData(
  authStatus: AuthStatus,
  profile: UserProfile | null,
): profile is UserProfile {
  return authStatus === 'authenticated' && profile !== null;
}
