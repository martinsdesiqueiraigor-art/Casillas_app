create or replace function private.start_casillas_trial()
returns public.trials
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_product_id uuid;
  v_trial public.trials;
begin
  if auth.uid() is null then
    raise exception 'Usuário não autenticado';
  end if;

  select id
    into v_product_id
    from public.products
   where slug = 'casillas'
     and is_active = true;

  if v_product_id is null then
    raise exception 'Produto Casillas não encontrado ou inativo';
  end if;

  insert into public.trials (
    user_id,
    product_id,
    status,
    started_at,
    ends_at
  )
  values (
    auth.uid(),
    v_product_id,
    'ACTIVE',
    now(),
    now() + interval '30 days'
  )
  on conflict (user_id, product_id)
  do update set
    status = case
      when public.trials.ends_at > now()
        then public.trials.status
      else 'EXPIRED'
    end
  returning * into v_trial;

  return v_trial;
end;
$function$;

revoke all on function private.start_casillas_trial() from public;
revoke all on function private.start_casillas_trial() from anon;
revoke all on function private.start_casillas_trial() from authenticated;

grant execute on function private.start_casillas_trial() to authenticated;

