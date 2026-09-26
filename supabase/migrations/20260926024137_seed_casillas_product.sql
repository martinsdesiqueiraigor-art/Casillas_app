insert into public.products (slug, name, description, is_active)
values (
  'casillas',
  'Casillas',
  'Calculadora técnica de usinagem',
  true
)
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  is_active = excluded.is_active,
  updated_at = now();
