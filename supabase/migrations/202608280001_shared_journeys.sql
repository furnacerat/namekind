create extension if not exists pgcrypto;

create table if not exists public.namekind_journeys (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Z2-9]{6}$'),
  owner_id uuid not null references auth.users(id) on delete cascade,
  mode text not null default 'baby' check (mode in ('baby', 'sibling', 'twins', 'pet')),
  state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.namekind_journey_members (
  journey_id uuid not null references public.namekind_journeys(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'partner' check (role in ('owner', 'partner')),
  joined_at timestamptz not null default now(),
  primary key (journey_id, user_id)
);

create table if not exists public.namekind_journey_ratings (
  journey_id uuid not null references public.namekind_journeys(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  item_key text not null check (char_length(item_key) between 1 and 120),
  rating text not null check (rating in ('love', 'maybe', 'pass')),
  updated_at timestamptz not null default now(),
  primary key (journey_id, user_id, item_key)
);

alter table public.namekind_journeys enable row level security;
alter table public.namekind_journey_members enable row level security;
alter table public.namekind_journey_ratings enable row level security;

create or replace function public.is_namekind_member(p_journey_id uuid)
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.namekind_journey_members
    where journey_id = p_journey_id and user_id = auth.uid()
  );
$$;

grant execute on function public.is_namekind_member(uuid) to authenticated;

create policy "members can read their journeys" on public.namekind_journeys
for select using (public.is_namekind_member(id));

create policy "members can update their journeys" on public.namekind_journeys
for update using (public.is_namekind_member(id))
with check (public.is_namekind_member(id));

create policy "members can read memberships" on public.namekind_journey_members
for select using (public.is_namekind_member(journey_id));

create policy "members can read ratings" on public.namekind_journey_ratings
for select using (public.is_namekind_member(journey_id));

create policy "members can add their ratings" on public.namekind_journey_ratings
for insert with check (user_id = auth.uid() and public.is_namekind_member(journey_id));

create policy "members can change their ratings" on public.namekind_journey_ratings
for update using (user_id = auth.uid())
with check (user_id = auth.uid() and public.is_namekind_member(journey_id));

revoke all on public.namekind_journeys from anon, authenticated;
revoke all on public.namekind_journey_members from anon, authenticated;
revoke all on public.namekind_journey_ratings from anon, authenticated;
grant select on public.namekind_journeys to authenticated;
grant update(state, updated_at) on public.namekind_journeys to authenticated;
grant select on public.namekind_journey_members to authenticated;
grant select, insert, update on public.namekind_journey_ratings to authenticated;

create or replace function public.create_namekind_journey(p_mode text, p_state jsonb)
returns table(journey_id uuid, journey_code text, journey_state jsonb)
language plpgsql security definer set search_path = public
as $$
declare
  new_id uuid;
  new_code text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  loop
    new_code := upper(substr(encode(gen_random_bytes(6), 'base64'), 1, 6));
    new_code := translate(new_code, '+/01', 'ABXY');
    exit when not exists (select 1 from public.namekind_journeys where code = new_code);
  end loop;
  insert into public.namekind_journeys(code, owner_id, mode, state)
  values(new_code, auth.uid(), p_mode, coalesce(p_state, '{}'::jsonb)) returning id into new_id;
  insert into public.namekind_journey_members(journey_id, user_id, role)
  values(new_id, auth.uid(), 'owner');
  return query select new_id, new_code, coalesce(p_state, '{}'::jsonb);
end;
$$;

create or replace function public.join_namekind_journey(p_code text)
returns table(journey_id uuid, journey_code text, journey_state jsonb)
language plpgsql security definer set search_path = public
as $$
declare
  found public.namekind_journeys%rowtype;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  select * into found from public.namekind_journeys where code = upper(trim(p_code));
  if found.id is null then raise exception 'Journey code not found'; end if;
  if not exists (select 1 from public.namekind_journey_members where journey_id = found.id and user_id = auth.uid())
     and (select count(*) from public.namekind_journey_members where journey_id = found.id) >= 2
  then raise exception 'This journey already has two participants'; end if;
  insert into public.namekind_journey_members(journey_id, user_id, role)
  values(found.id, auth.uid(), 'partner') on conflict do nothing;
  return query select found.id, found.code, found.state;
end;
$$;

revoke all on function public.create_namekind_journey(text, jsonb) from public;
revoke all on function public.join_namekind_journey(text) from public;
grant execute on function public.create_namekind_journey(text, jsonb) to authenticated;
grant execute on function public.join_namekind_journey(text) to authenticated;

do $$ begin
  alter publication supabase_realtime add table public.namekind_journeys;
  alter publication supabase_realtime add table public.namekind_journey_ratings;
exception when duplicate_object then null;
end $$;
