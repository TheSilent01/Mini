import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTheme } from '../../packages/config/ThemeContext';
import { signOut } from '../../packages/lib/auth';

export default function SettingsPage() {
  const router = useRouter();
  const { darkMode, toggleTheme, preferences, updatePreferences, user, isLoading } = useTheme();
  
  // Local state for form inputs
  const [cloudUrl, setCloudUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Initialize form with current preferences
  useEffect(() => {
    if (preferences) {
      setCloudUrl(preferences.cloud_url || '');
    }
  }, [preferences]);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleToggle = async (key: keyof typeof preferences, value: boolean) => {
    if (!preferences) return;
    
    setSaving(true);
    await updatePreferences({ [key]: value });
    setSaving(false);
    
    setSaveMessage('Settings saved!');
    setTimeout(() => setSaveMessage(''), 2000);
  };

  const handleCloudUrlSave = async () => {
    if (!preferences) return;
    
    setSaving(true);
    await updatePreferences({ cloud_url: cloudUrl || null });
    setSaving(false);
    
    setSaveMessage('Cloud URL saved!');
    setTimeout(() => setSaveMessage(''), 2000);
  };

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

  if (!user || !preferences) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Customize your MinimalMind experience
            </p>
          </div>
          <Link
            href="/"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            ← Back to Home
          </Link>
        </div>

        {saveMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <p className="text-green-800 dark:text-green-400 text-sm">{saveMessage}</p>
          </div>
        )}

        <div className="space-y-8">
          {/* Appearance Section */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Appearance
            </h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-gray-900 dark:text-white font-medium">Dark Mode</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Use dark theme across the app
                  </p>
                </div>
                <button
                  onClick={toggleTheme}
                  disabled={saving}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    darkMode ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            </div>
          </section>

          {/* AI Features Section */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              AI Features
            </h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-gray-900 dark:text-white font-medium">Smart Suggestions</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get AI-powered book recommendations and insights
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('ai_enabled', !preferences.ai_enabled)}
                  disabled={saving}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    preferences.ai_enabled ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.ai_enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>

              <label className="flex items-center justify-between">
                <div>
                  <span className="text-gray-900 dark:text-white font-medium">Auto Book Covers</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Automatically generate book covers using AI
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('ai_covers', !preferences.ai_covers)}
                  disabled={saving}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    preferences.ai_covers ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.ai_covers ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            </div>
          </section>

          {/* Email Notifications Section */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Email Notifications
            </h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-gray-900 dark:text-white font-medium">Reading Reminders</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get daily reminders to maintain your reading habit
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('reading_reminders', !preferences.reading_reminders)}
                  disabled={saving}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    preferences.reading_reminders ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.reading_reminders ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>

              <label className="flex items-center justify-between">
                <div>
                  <span className="text-gray-900 dark:text-white font-medium">Weekly Progress</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive weekly summaries of your reading progress
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('weekly_summary', !preferences.weekly_summary)}
                  disabled={saving}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    preferences.weekly_summary ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.weekly_summary ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            </div>
          </section>

          {/* Cloud Sync Section */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Cloud Sync
            </h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-gray-900 dark:text-white font-medium">Enable Nextcloud Sync</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sync your data with Nextcloud or compatible WebDAV server
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('cloud_sync', !preferences.cloud_sync)}
                  disabled={saving}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    preferences.cloud_sync ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.cloud_sync ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>

              {preferences.cloud_sync && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nextcloud URL
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="url"
                      value={cloudUrl}
                      onChange={(e) => setCloudUrl(e.target.value)}
                      placeholder="https://nextcloud.example.com/remote.php/webdav"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={handleCloudUrlSave}
                      disabled={saving}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Account Section */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Account
            </h2>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Email</span>
                <p className="text-gray-900 dark:text-white font-medium">{user.email}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Member since</span>
                <p className="text-gray-900 dark:text-white font-medium">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}