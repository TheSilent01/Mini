// Shared types for MinimalMind

export interface UserPreferences {
  id: string;
  dark_mode: boolean;
  ai_enabled: boolean;
  ai_covers: boolean;
  reading_reminders: boolean;
  weekly_summary: boolean;
  cloud_sync: boolean;
  cloud_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  created_at: string;
}

export interface AppState {
  user: AuthUser | null;
  preferences: UserPreferences | null;
  isLoading: boolean;
  error: string | null;
}

export interface EmailVerificationPayload {
  name: string;
  email: string;
  verificationLink: string;
  referrer?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}