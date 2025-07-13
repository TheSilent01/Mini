import Link from 'next/link';
import { useTheme } from '../../packages/config/ThemeContext';

export default function Home() {
  const { darkMode, toggleTheme } = useTheme();
  return (
    <main className={darkMode ? 'dark bg-gray-900 text-white min-h-screen' : 'bg-white text-black min-h-screen'}>
      <div className="max-w-xl mx-auto py-20 px-4">
        <h1 className="text-4xl font-bold mb-4">MinimalMind</h1>
        <p className="mb-8">Your self-hosted, privacy-first reading and notes app.</p>
        <Link href="/settings" className="underline">Go to Settings</Link>
        <button onClick={toggleTheme} className="block mt-8 px-4 py-2 rounded bg-indigo-600 text-white">Toggle Theme</button>
      </div>
    </main>
  );
}
