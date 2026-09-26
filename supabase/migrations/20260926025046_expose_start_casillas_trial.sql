create or replace function public.start_casillas_trial()
returns public.trials
language sql
security invoker
set search_path = ''
as $function$
  select private.start_casillas_trial();
$function$;

revoke all on function public.start_casillas_trial() from public;
revoke all on function public.start_casillas_trial() from anon;
grant execute on function public.start_casillas_trial() to authenticated;

