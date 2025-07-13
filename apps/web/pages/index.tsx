import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTheme } from '../../packages/config/ThemeContext';
import { signOut } from '../../packages/lib/auth';

export default function Home() {
  const router = useRouter();
  const { darkMode, toggleTheme, user, isLoading } = useTheme();

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      router.push('/login');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto py-20 px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              MinimalMind
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Your self-hosted, privacy-first reading and notes app. 
              Track books, build habits, and grow with clarity.
            </p>
            <div className="space-x-4">
              <Link
                href="/onboarding"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign In
              </Link>
            </div>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Privacy First
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Self-hosted and secure. Your data stays yours, always.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Smart Reading
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track progress, take notes, and discover new books with AI assistance.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">☁️</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Cloud Sync
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Sync across devices with Nextcloud or your preferred cloud storage.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Signed in as {user.email}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <Link
              href="/settings"
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Settings
            </Link>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* TODO: Add book/note management features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              📚 My Library
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Manage your book collection and reading progress.
            </p>
            <button className="text-indigo-600 hover:text-indigo-500 font-medium">
              Coming Soon →
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              📝 Notes & Highlights
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Capture thoughts and insights from your reading.
            </p>
            <button className="text-indigo-600 hover:text-indigo-500 font-medium">
              Coming Soon →
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              🤖 AI Insights
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Get personalized recommendations and summaries.
            </p>
            <button className="text-indigo-600 hover:text-indigo-500 font-medium">
              Coming Soon →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}