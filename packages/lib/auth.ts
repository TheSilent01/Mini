// Auth helpers for MinimalMind
import { supabase } from '../api/supabaseClient';
import { createDefaultPreferences } from './settings';
import type { AuthUser } from './types';

/**
 * Sign up a new user
 */
export async function signUp(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Create default preferences for new user
    if (data.user) {
      await createDefaultPreferences(data.user.id);
    }

    return { success: true, data };
  } catch (err) {
    console.error('Sign up error:', err);
    return { success: false, error: 'Failed to sign up' };
  }
}

/**
 * Sign in an existing user
 */
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Sign in error:', err);
    return { success: false, error: 'Failed to sign in' };
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return { success: false, error: error.message };
    }

    // Clear local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_preferences');
    }

    return { success: true };
  } catch (err) {
    console.error('Sign out error:', err);
    return { success: false, error: 'Failed to sign out' };
  }
}

/**
 * Get current user session
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    return {
      id: user.id,
      email: user.email || '',
      created_at: user.created_at,
    };
  } catch (err) {
    console.error('Get current user error:', err);
    return null;
  }
}