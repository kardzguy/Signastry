-- Private tester sign-up list for Signastry.
-- The website can ADD rows, but it can never READ them back.
-- Only you can see this list, in the Supabase dashboard (Table Editor > tester_signups).

create table if not exists public.tester_signups (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  member_code text not null unique,
  display_name text not null check (char_length(display_name) between 1 and 120),
  email text not null check (char_length(email) between 5 and 200 and email like '%_@_%._%')
);

alter table public.tester_signups enable row level security;

-- Anyone using the site may add their own row...
drop policy if exists "testers can add themselves" on public.tester_signups;
create policy "testers can add themselves" on public.tester_signups
  for insert to anon, authenticated with check (true);

-- ...but nobody using the site can read, change or delete rows.
revoke select, update, delete on public.tester_signups from anon, authenticated;
grant insert on public.tester_signups to anon, authenticated;
