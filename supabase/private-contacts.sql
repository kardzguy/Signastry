-- Private contact details (invitations, signer requests, beneficiaries, payout accounts).
-- The website can ADD rows but can never READ them back. Only you see them in the dashboard.
create table if not exists public.private_contacts (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  ref text not null unique,
  kind text not null,
  owner text,
  name text,
  contact text,
  details text
);
alter table public.private_contacts enable row level security;
drop policy if exists "site can add contacts" on public.private_contacts;
create policy "site can add contacts" on public.private_contacts
  for insert to anon, authenticated with check (true);
revoke select, update, delete on public.private_contacts from anon, authenticated;
grant insert on public.private_contacts to anon, authenticated;
