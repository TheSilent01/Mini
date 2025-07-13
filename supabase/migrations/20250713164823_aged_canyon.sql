/*
  # Create user preferences table with proper schema

  1. New Tables
    - `user_preferences`
      - `id` (uuid, primary key, references auth.users)
      - `dark_mode` (boolean, default false)
      - `ai_enabled` (boolean, default true)
      - `ai_covers` (boolean, default true)
      - `reading_reminders` (boolean, default true)
      - `weekly_summary` (boolean, default true)
      - `cloud_sync` (boolean, default false)
      - `cloud_url` (text, nullable)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `user_preferences` table
    - Add policy for authenticated users to manage their own preferences

  3. Triggers
    - Auto-update `updated_at` timestamp on row changes
*/

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  dark_mode boolean DEFAULT false,
  ai_enabled boolean DEFAULT true,
  ai_covers boolean DEFAULT true,
  reading_reminders boolean DEFAULT true,
  weekly_summary boolean DEFAULT true,
  cloud_sync boolean DEFAULT false,
  cloud_url text,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(id)
);

-- Enable Row Level Security
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for user preferences
CREATE POLICY "Users can view own preferences"
  ON user_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own preferences"
  ON user_preferences
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS set_updated_at ON user_preferences;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();