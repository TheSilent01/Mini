// Settings helpers for MinimalMind
import { supabase } from '../api/supabaseClient';
import type { UserPreferences } from './types';

/**
 * Fetch user preferences from Supabase
 */
export async function fetchPreferences(userId: string): Promise<UserPreferences | null> {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching preferences:', error);
      return null;
    }
    
    return data as UserPreferences;
  } catch (err) {
    console.error('Failed to fetch preferences:', err);
    return null;
  }
}

/**
 * Save user preferences to Supabase
 */
export async function savePreferences(userId: string, prefs: Partial<UserPreferences>) {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({ id: userId, ...prefs }, { onConflict: 'id' })
      .select()
      .single();
    
    if (error) {
      console.error('Error saving preferences:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (err) {
    console.error('Failed to save preferences:', err);
    return { success: false, error: 'Failed to save preferences' };
  }
}

/**
 * Create default preferences for a new user
 */
export async function createDefaultPreferences(userId: string): Promise<UserPreferences | null> {
  const defaultPrefs: Partial<UserPreferences> = {
    dark_mode: false,
    ai_enabled: true,
    ai_covers: true,
    reading_reminders: true,
    weekly_summary: true,
    cloud_sync: false,
    cloud_url: null,
  };
  
  const result = await savePreferences(userId, defaultPrefs);
  return result.success ? result.data : null;
}

/**
 * Sync preferences with local storage (web)
 */
export function syncPreferencesToLocalStorage(prefs: UserPreferences) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_preferences', JSON.stringify(prefs));
  }
}

/**
 * Get preferences from local storage (web)
 */
export function getPreferencesFromLocalStorage(): UserPreferences | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('user_preferences');
    return stored ? JSON.parse(stored) : null;
  }
  return null;
}