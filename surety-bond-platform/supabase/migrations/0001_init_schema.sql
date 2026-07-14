-- Roles
create type user_role as enum ('customer', 'underwriter', 'admin');
create type application_status as enum ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'issued');
create type bond_status as enum ('active', 'expired', 'cancelled');

-- Profiles (1:1 with auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  company_name text,
  role user_role not null default 'customer',
  created_at timestamptz not null default now()
);

-- Bond applications
create table bond_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references profiles(id) on delete cascade,
  underwriter_id uuid references profiles(id),
  bond_type text not null,
  requested_amount numeric(12,2) not null,
  status application_status not null default 'draft',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Supporting documents
create table documents (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references bond_applications(id) on delete cascade,
  uploaded_by uuid not null references profiles(id),
  file_path text not null,
  file_name text not null,
  doc_type text,
  created_at timestamptz not null default now()
);

-- Issued bonds
create table bonds (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references bond_applications(id) on delete cascade,
  bond_number text not null unique,
  amount numeric(12,2) not null,
  premium numeric(12,2),
  status bond_status not null default 'active',
  issued_at timestamptz not null default now(),
  expires_at timestamptz
);

-- Audit log
create table audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- Helper: current user's role
create or replace function current_role_is(target_role user_role)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = target_role
  );
$$;

alter table profiles enable row level security;
alter table bond_applications enable row level security;
alter table documents enable row level security;
alter table bonds enable row level security;
alter table audit_log enable row level security;

-- profiles policies
create policy "profiles_self_select" on profiles for select using (id = auth.uid() or current_role_is('admin') or current_role_is('underwriter'));
create policy "profiles_self_update" on profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles_self_insert" on profiles for insert with check (id = auth.uid());

-- bond_applications policies
create policy "applications_owner_select" on bond_applications for select using (
  applicant_id = auth.uid() or current_role_is('underwriter') or current_role_is('admin')
);
create policy "applications_owner_insert" on bond_applications for insert with check (applicant_id = auth.uid());
create policy "applications_owner_update_draft" on bond_applications for update using (
  (applicant_id = auth.uid() and status = 'draft') or current_role_is('underwriter') or current_role_is('admin')
);

-- documents policies
create policy "documents_related_select" on documents for select using (
  exists (
    select 1 from bond_applications a
    where a.id = application_id
      and (a.applicant_id = auth.uid() or current_role_is('underwriter') or current_role_is('admin'))
  )
);
create policy "documents_related_insert" on documents for insert with check (
  uploaded_by = auth.uid() and exists (
    select 1 from bond_applications a
    where a.id = application_id
      and (a.applicant_id = auth.uid() or current_role_is('underwriter') or current_role_is('admin'))
  )
);

-- bonds policies
create policy "bonds_related_select" on bonds for select using (
  exists (
    select 1 from bond_applications a
    where a.id = application_id
      and (a.applicant_id = auth.uid() or current_role_is('underwriter') or current_role_is('admin'))
  )
);
create policy "bonds_admin_write" on bonds for insert with check (current_role_is('underwriter') or current_role_is('admin'));
create policy "bonds_admin_update" on bonds for update using (current_role_is('underwriter') or current_role_is('admin'));

-- audit_log policies
create policy "audit_admin_select" on audit_log for select using (current_role_is('admin'));
create policy "audit_insert_self" on audit_log for insert with check (actor_id = auth.uid());
