-- Site visitor counts for the admin page. Visitors can only ADD a visit; nobody can read the raw list.
-- The admin page reads totals only, through visit_stats(), which needs the staff PIN.
create table if not exists public.site_visits (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  vid text not null check (char_length(vid) between 4 and 40),
  page text check (char_length(page) <= 40),
  source text check (char_length(source) <= 60),
  device text check (char_length(device) <= 10)
);
alter table public.site_visits enable row level security;
drop policy if exists "site can add visits" on public.site_visits;
create policy "site can add visits" on public.site_visits
  for insert to anon, authenticated with check (true);
revoke select, update, delete on public.site_visits from anon, authenticated;
grant insert on public.site_visits to anon, authenticated;

drop function if exists public.visit_stats(int);
create or replace function public.visit_stats(days int, pin text)
returns json language sql security definer set search_path = public as $$
  with ok as (select md5('signastry-staff:' || coalesce(pin,'')) = '44054613cf4e09d5ca9863fa3ad532cc' as yes),
  p as (select now() - make_interval(days => least(greatest(coalesce(days,30),1),365)) as since),
  v as (select * from site_visits, p where at > p.since),
  f as (select vid, min(at) as first_at from site_visits group by vid)
  select case when (select yes from ok) then json_build_object(
    'views', (select count(*) from v where page <> 'signed up'),
    'visitors', (select count(distinct vid) from v),
    'new', (select count(*) from f, p where f.first_at > p.since),
    'signups', (select count(*) from v where page = 'signed up'),
    'daily', (select coalesce(json_agg(d order by d.day), '[]'::json) from (
       select to_char(at at time zone 'America/New_York', 'YYYY-MM-DD') as day, count(distinct vid) as visitors, count(*) as views
       from v group by 1) d),
    'sources', (select coalesce(json_agg(s), '[]'::json) from (
       select coalesce(source,'Unknown') as name, count(distinct vid) as n from v group by 1 order by 2 desc limit 8) s),
    'pages', (select coalesce(json_agg(s), '[]'::json) from (
       select coalesce(page,'Unknown') as name, count(*) as n from v group by 1 order by 2 desc limit 8) s),
    'devices', (select coalesce(json_agg(s), '[]'::json) from (
       select coalesce(device,'Unknown') as name, count(distinct vid) as n from v group by 1 order by 2 desc) s)
  ) else null end;
$$;
revoke execute on function public.visit_stats(int, text) from public;
grant execute on function public.visit_stats(int, text) to anon, authenticated;
