// Shared types for MinimalMind

export type UserPreferences = {
  dark_mode: boolean;
  ai_enabled: boolean;
  ai_covers: boolean;
  reading_reminders: boolean;
  weekly_summary: boolean;
  cloud_sync: boolean;
  cloud_url: string | null;
};
