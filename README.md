# MinimalMind

The Ultimate Self-Hosted, AI-Powered, Privacy-First Reading + Notes App

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Supabase account (free tier works)
- Resend account for email verification (free tier works)
- (Optional) Nextcloud instance for file sync

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/minimalmind.git
cd minimalmind
npm run install:all
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your actual credentials (see setup guide below)
```

### 3. Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy the SQL from `supabase/migrations/create_user_preferences.sql`
3. Run it in your Supabase SQL editor
4. Update `.env` with your Supabase URL and keys

### 4. Email Function Setup

1. In your Supabase dashboard, go to Edge Functions
2. Create a new function called `email-verification`
3. Copy the code from `functions/email-verification/index.ts`
4. Deploy the function
5. Set environment variables in Supabase:
   - `RESEND_API_KEY`: Your Resend API key
   - `RESEND_SENDER`: Your sender email (e.g., "MinimalMind <hello@yourdomain.com>")

### 5. Run the Apps

```bash
# Web app (Next.js)
npm run dev:web

# Mobile app (React Native/Expo)
npm run dev:mobile
```

---

## 📁 Project Structure

```
MinimalMind/
├── apps/
│   ├── web/                    # Next.js PWA
│   │   ├── pages/             # App pages (home, login, settings)
│   │   ├── public/            # Static assets, PWA manifest
│   │   └── styles/            # Tailwind CSS
│   └── mobile/                # React Native/Expo app
│       ├── screens/           # Mobile screens
│       └── navigation.tsx     # Navigation setup
├── packages/
│   ├── api/                   # Supabase client
│   ├── lib/                   # Shared utilities (auth, settings)
│   ├── config/                # Theme context, app config
│   └── ui/                    # Shared UI components
├── functions/
│   └── email-verification/    # Supabase Edge Function
├── supabase/
│   └── migrations/            # Database schema
├── scripts/
│   └── sync-nextcloud.js      # CLI sync script
└── .env.example               # Environment template
```

---

## 🔧 Detailed Setup Guide

### Supabase Configuration

1. **Create Project**: Go to [supabase.com](https://supabase.com) and create a new project
2. **Get Credentials**: 
   - Project URL: `https://your-project.supabase.co`
   - Anon Key: Found in Settings > API
   - Service Role Key: Found in Settings > API (keep this secret!)

3. **Database Setup**:
   ```sql
   -- Run this in Supabase SQL Editor
   -- Copy from supabase/migrations/create_user_preferences.sql
   ```

4. **Environment Variables**:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

### Email Service (Resend)

1. **Sign up**: Create account at [resend.com](https://resend.com)
2. **Get API Key**: Go to API Keys section
3. **Verify Domain** (optional): Add your domain for custom sender
4. **Environment Variables**:
   ```bash
   RESEND_API_KEY=re_your_api_key
   RESEND_SENDER=MinimalMind <hello@yourdomain.com>
   ```

### Edge Function Deployment

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy the email function
supabase functions deploy email-verification

# Set environment variables
supabase secrets set RESEND_API_KEY=your_key
supabase secrets set RESEND_SENDER="MinimalMind <hello@yourdomain.com>"
```

### Nextcloud Sync (Optional)

1. **Setup Nextcloud**: Have a Nextcloud instance running
2. **Create App Password**: In Nextcloud settings, create an app-specific password
3. **Environment Variables**:
   ```bash
   NEXTCLOUD_URL=https://your-nextcloud.com/remote.php/webdav
   NEXTCLOUD_USER=your_username
   NEXTCLOUD_PASS=your_app_password
   ```

4. **Test Sync**:
   ```bash
   npm run sync
   ```

---

## 🧪 Testing

### Test Email Function

```bash
# Test the email verification function
curl -X POST 'https://your-project.supabase.co/functions/v1/email-verification' \
  -H 'Authorization: Bearer your-anon-key' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "verificationLink": "https://your-app.com/auth/callback?token=test",
    "referrer": "Friend"
  }'
```

### Test Authentication

1. Go to `/onboarding` and create an account
2. Check your email for verification link
3. Click link to verify account
4. Sign in at `/login`
5. Check settings sync at `/settings`

---

## 🎨 Features

### ✅ Implemented

- **Authentication**: Email/password with Supabase Auth
- **Settings Sync**: User preferences synced across devices
- **Theme System**: Light/dark mode with persistence
- **Email Verification**: Beautiful HTML emails via Resend
- **PWA Support**: Installable web app with offline capabilities
- **Mobile App**: React Native app with native feel
- **Cloud Sync**: Nextcloud/WebDAV integration ready

### 🚧 Coming Soon (TODO)

- **Book Management**: Add, track, and organize your reading list
- **Note Taking**: Rich text notes with highlights and annotations
- **AI Features**: Smart recommendations and reading insights
- **Reading Analytics**: Progress tracking and reading statistics
- **Import/Export**: Goodreads, CSV, and other format support
- **Social Features**: Share recommendations with friends

---

## 🔒 Privacy & Security

- **Self-Hosted**: Run on your own infrastructure
- **Data Ownership**: Your data stays yours, always
- **Open Source**: Transparent and auditable code
- **Minimal Tracking**: No analytics or third-party trackers
- **Encrypted**: All data encrypted in transit and at rest

---

## 🛠️ Development

### Adding New Features

1. **Database Changes**: Add migrations to `supabase/migrations/`
2. **Shared Logic**: Add to `packages/lib/`
3. **UI Components**: Add to `packages/ui/`
4. **Web Pages**: Add to `apps/web/pages/`
5. **Mobile Screens**: Add to `apps/mobile/screens/`

### Code Organization

- **Modular**: Each feature in its own module
- **Shared**: Common code in packages
- **Typed**: Full TypeScript support
- **Tested**: Unit tests for critical functions
- **Documented**: Clear comments and README files

---

## 📚 Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Mobile**: React Native, Expo, NativeBase
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Email**: Resend API
- **Storage**: Nextcloud/WebDAV
- **Deployment**: Vercel, Netlify, or self-hosted

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/minimalmind/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/minimalmind/discussions)
- **Email**: hello@minimalmind.com

---

**Made with ❤️ for readers everywhere**