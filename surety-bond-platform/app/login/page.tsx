'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } =
      mode === 'sign-in'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push('/');
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg border border-white/10 bg-[#151515] p-8"
      >
        <h1 className="text-xl font-semibold text-accent">Surety Bond Platform</h1>
        <p className="text-sm text-white/60">
          {mode === 'sign-in' ? 'Sign in to continue.' : 'Create a customer account.'}
        </p>

        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded border border-white/10 bg-[#181818] px-3 py-2 text-sm"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded border border-white/10 bg-[#181818] px-3 py-2 text-sm"
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-accent py-2 text-sm font-medium text-black disabled:opacity-50"
        >
          {loading ? 'Please wait…' : mode === 'sign-in' ? 'Sign in' : 'Sign up'}
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}
          className="w-full text-center text-xs text-white/50 underline"
        >
          {mode === 'sign-in' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
        </button>
      </form>
    </main>
  );
}
