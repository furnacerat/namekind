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
    new_code := upper(substr(encode(extensions.gen_random_bytes(6), 'base64'), 1, 6));
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

revoke all on function public.create_namekind_journey(text, jsonb) from public;
grant execute on function public.create_namekind_journey(text, jsonb) to authenticated;
