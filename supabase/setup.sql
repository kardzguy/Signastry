-- Signastry TEST database setup
-- Paste all of this into Supabase > SQL Editor > New query, then tap Run.
-- Safe to run more than once.

-- One shared table holds the test site's data.
-- "space" keeps the demo (test.signastry.com) and the Vault (/vault/) apart.
create table if not exists public.docs (
  space      text        not null check (space in ('demo', 'vault')),
  path       text        not null check (char_length(path) between 1 and 200),
  data       jsonb       not null check (pg_column_size(data) < 5000000),
  updated_at timestamptz not null default now(),
  primary key (space, path)
);

-- Row Level Security is on. These rules let anyone using the site
-- read and write the TEST data. Fine for testing with sample data,
-- NOT for real customers: before going live, switch to real accounts.
alter table public.docs enable row level security;

drop policy if exists "test site read"   on public.docs;
drop policy if exists "test site insert" on public.docs;
drop policy if exists "test site update" on public.docs;
drop policy if exists "test site delete" on public.docs;

create policy "test site read"   on public.docs for select to anon, authenticated using (true);
create policy "test site insert" on public.docs for insert to anon, authenticated with check (true);
create policy "test site update" on public.docs for update to anon, authenticated using (true) with check (true);
create policy "test site delete" on public.docs for delete to anon, authenticated using (true);

grant select, insert, update, delete on public.docs to anon, authenticated;

-- Keep updated_at current.
create or replace function public.docs_touch() returns trigger
language plpgsql as $$ begin new.updated_at := now(); return new; end $$;
drop trigger if exists docs_touch on public.docs;
create trigger docs_touch before update on public.docs
  for each row execute function public.docs_touch();

-- Live updates: everyone sees changes as they happen.
do $$ begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'docs'
  ) then
    alter publication supabase_realtime add table public.docs;
  end if;
end $$;

select 'Signastry test database is ready' as result;
