import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function UnderwriterDashboard() {
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
  if (profile?.role !== 'underwriter' && profile?.role !== 'admin') redirect('/');

  const { data: applications } = await supabase
    .from('bond_applications')
    .select('id, bond_type, requested_amount, status, applicant_id, created_at')
    .order('created_at', { ascending: false });

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-accent">Applications queue</h1>
      <p className="mt-2 text-sm text-white/60">Review, request documents, approve or reject.</p>

      <div className="mt-8 space-y-3">
        {applications?.length ? (
          applications.map((a) => (
            <div key={a.id} className="rounded border border-white/10 bg-[#151515] p-4">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{a.bond_type}</span>
                <span className="uppercase text-white/50">{a.status}</span>
              </div>
              <p className="mt-1 text-xs text-white/40">£{a.requested_amount} requested</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-white/40">No applications in the queue.</p>
        )}
      </div>
    </main>
  );
}
