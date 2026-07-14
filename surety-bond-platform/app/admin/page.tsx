import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function AdminDashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') redirect('/');

  const { count: userCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
  const { count: applicationCount } = await supabase
    .from('bond_applications')
    .select('*', { count: 'exact', head: true });
  const { count: bondCount } = await supabase
    .from('bonds')
    .select('*', { count: 'exact', head: true });

  const stats = [
    { label: 'Users', value: userCount ?? 0 },
    { label: 'Applications', value: applicationCount ?? 0 },
    { label: 'Issued bonds', value: bondCount ?? 0 },
  ];

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-accent">Admin overview</h1>
      <p className="mt-2 text-sm text-white/60">
        User management, bond issuance and audit log land here next.
      </p>

      <div className="mt-8 grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded border border-white/10 bg-[#151515] p-4 text-center">
            <p className="text-2xl font-semibold text-accent">{s.value}</p>
            <p className="mt-1 text-xs uppercase text-white/40">{s.label}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
