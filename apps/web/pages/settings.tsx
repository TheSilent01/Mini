import { useTheme } from '../../packages/config/ThemeContext';
import { useState } from 'react';

export default function SettingsPage() {
  const { darkMode, toggleTheme } = useTheme();
  const [aiEnabled, setAiEnabled] = useState(true);
  const [aiCovers, setAiCovers] = useState(true);
  const [readingReminders, setReadingReminders] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(true);
  const [cloudSync, setCloudSync] = useState(false);
  const [cloudUrl, setCloudUrl] = useState('');

  return (
    <div className={darkMode ? 'dark bg-gray-900 text-white min-h-screen' : 'bg-white text-black min-h-screen'}>
      <div className="max-w-xl mx-auto py-12">
        <h1 className="text-2xl font-bold mb-8">Settings</h1>
        <section className="mb-6">
          <h2 className="font-semibold mb-2">Appearance</h2>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={darkMode} onChange={toggleTheme} />
            Dark Mode
          </label>
        </section>
        <section className="mb-6">
          <h2 className="font-semibold mb-2">AI Features</h2>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={aiEnabled} onChange={()=>setAiEnabled(v=>!v)} />
            Smart Suggestions
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={aiCovers} onChange={()=>setAiCovers(v=>!v)} />
            Auto Book Covers
          </label>
        </section>
        <section className="mb-6">
          <h2 className="font-semibold mb-2">Email Notifications</h2>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={readingReminders} onChange={()=>setReadingReminders(v=>!v)} />
            Send reading reminders
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={weeklySummary} onChange={()=>setWeeklySummary(v=>!v)} />
            Send weekly progress
          </label>
        </section>
        <section className="mb-6">
          <h2 className="font-semibold mb-2">Cloud Sync</h2>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={cloudSync} onChange={()=>setCloudSync(v=>!v)} />
            Enable Nextcloud Sync
          </label>
          <input className="mt-2 w-full border rounded px-2 py-1" placeholder="Nextcloud URL" value={cloudUrl} onChange={e=>setCloudUrl(e.target.value)} />
        </section>
      </div>
    </div>
  );
}
