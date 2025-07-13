import { useState } from 'react';
import { supabase } from '../../../packages/api/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
  }

  return (
    <div className="max-w-md mx-auto py-20">
      <h1 className="text-2xl font-bold mb-6">Log in to MinimalMind</h1>
      <input className="border rounded px-3 py-2 w-full mb-4" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="border rounded px-3 py-2 w-full mb-4" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="w-full bg-indigo-600 text-white py-2 rounded" onClick={handleLogin} disabled={loading}>{loading ? 'Logging in...' : 'Log In'}</button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
