// Settings helpers for MinimalMind
import { supabase } from '../api/supabaseClient';
import type { UserPreferences } from './types';

export async function fetchPreferences(userId: string): Promise<UserPreferences | null> {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) return null;
  return data as UserPreferences;
}

export async function savePreferences(userId: string, prefs: Partial<UserPreferences>) {
  return supabase.from('user_preferences').upsert({ id: userId, ...prefs });
}
