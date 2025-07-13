# MinimalMind

The Ultimate Self-Hosted, AI-Powered, Privacy-First Reading + Notes App

---

## Monorepo Structure

```
MinimalMind/
├── apps/
│   ├── mobile/                 # React Native app
│   └── web/                    # Next.js PWA
│       └── components/
│       └── pages/
│       └── hooks/
│       └── lib/
│       └── styles/
├── packages/
│   ├── ui/                     # Shared UI components
│   ├── lib/                    # Nextcloud, AI, metadata tools
│   ├── api/                    # Supabase client
│   ├── config/                 # Theme, settings defaults
├── functions/
│   └── email-verification/    # Edge Function for auth email
├── scripts/
│   └── sync-nextcloud.js      # CLI sync to WebDAV
├── supabase/
│   └── schema.sql             # DB Schema
├── .env.example
└── README.md
```

## Quickstart

1. Install dependencies in root, `/apps/web`, and `/apps/mobile`.
2. Set up `.env` (see `.env.example`).
3. Configure Supabase and Nextcloud credentials.
4. Run the web app (`apps/web`) and mobile app (`apps/mobile`).
5. See below for what you MUST change after cloning.

---

## What You MUST Change

- Copy `.env.example` to `.env` and fill in all secrets (Supabase, Nextcloud, etc.)
- Update the Supabase project URL and anon key in `/packages/api/supabaseClient.ts` (and mobile config)
- Set your Nextcloud credentials in `.env`
- Deploy the `email-verification` edge function to your Supabase project
- (Optional) Update theme colors in `/packages/config/theme.ts`
- (Optional) Add your own AI API keys if using paid providers

---

## Next Steps

- Implement your own onboarding, AI, and analytics features as needed
- Extend the settings screen and UI kit
- Connect to your own Supabase/Nextcloud instances

---

See individual folders for more info.
