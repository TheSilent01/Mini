-- MinimalMind Supabase schema: user_preferences table
create table user_preferences (
  id uuid primary key references auth.users(id) on delete cascade,
  
  dark_mode boolean default false,                -- Light/dark theme toggle
  ai_enabled boolean default true,                -- Use AI features (e.g. summaries, recs)
  ai_covers boolean default true,                 -- Auto-generate book covers using AI
  reading_reminders boolean default true,         -- Daily habit reminders
  weekly_summary boolean default true,            -- Weekly stats & suggestions
  cloud_sync boolean default false,               -- Enable Nextcloud or remote sync
  cloud_url text,                                 -- Remote sync path (Nextcloud)

  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(id)
);

-- Trigger to update updated_at on row update
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on user_preferences;
create trigger set_updated_at
before update on user_preferences
for each row
execute procedure update_updated_at_column();
