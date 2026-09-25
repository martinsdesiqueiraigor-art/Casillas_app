-- CASILLAS 2.0
-- RLS Test - public.profiles
-- Estrutural + comportamental (usuario A x usuario B)

begin;

create extension if not exists pgtap with schema extensions;

select plan(16);

-- ============================================================
-- TESTES ESTRUTURAIS
-- ============================================================

-- 1. Tabela existe
select has_table(
    'public',
    'profiles',
    'public.profiles deve existir'
);

-- 2. Coluna id existe
select has_column(
    'public',
    'profiles',
    'id',
    'profiles.id deve existir'
);

-- 3. RLS esta habilitado
select ok(
    (select relrowsecurity
     from pg_class
     where oid = 'public.profiles'::regclass),
    'RLS deve estar habilitado em public.profiles'
);

-- 4. Policy de SELECT existe
select ok(
    exists (
        select 1
        from pg_policies
        where schemaname = 'public'
          and tablename = 'profiles'
          and policyname = 'profiles_select_own'
    ),
    'Policy profiles_select_own deve existir'
);

-- 5. Policy de UPDATE existe
select ok(
    exists (
        select 1
        from pg_policies
        where schemaname = 'public'
          and tablename = 'profiles'
          and policyname = 'profiles_update_own'
    ),
    'Policy profiles_update_own deve existir'
);

-- 6. UPDATE permitido somente nas colunas esperadas
select ok(
    has_column_privilege(
        'authenticated',
        'public.profiles',
        'full_name',
        'UPDATE'
    )
    and has_column_privilege(
        'authenticated',
        'public.profiles',
        'locale',
        'UPDATE'
    ),
    'authenticated deve poder atualizar full_name e locale'
);

-- 7. Colunas protegidas nao devem ter UPDATE
select ok(
    not has_column_privilege(
        'authenticated',
        'public.profiles',
        'id',
        'UPDATE'
    )
    and not has_column_privilege(
        'authenticated',
        'public.profiles',
        'created_at',
        'UPDATE'
    )
    and not has_column_privilege(
        'authenticated',
        'public.profiles',
        'updated_at',
        'UPDATE'
    ),
    'authenticated nao deve atualizar id, created_at ou updated_at'
);

-- 8. SELECT permitido
select ok(
    has_table_privilege(
        'authenticated',
        'public.profiles',
        'SELECT'
    ),
    'authenticated deve possuir SELECT em profiles'
);

-- ============================================================
-- CRIACAO DOS USUARIOS DE TESTE
-- O trigger de auth.users cria os profiles automaticamente.
-- ============================================================

select tests.create_supabase_user('casillas-a@test.com');
select tests.create_supabase_user('casillas-b@test.com');

-- ============================================================
-- USUARIO A
-- ============================================================

select tests.authenticate_as('casillas-a@test.com');

-- 9. Usuario A deve enxergar somente seu proprio profile
select is(
    (select count(*)
     from public.profiles),
    1::bigint,
    'Usuario A deve enxergar somente seu proprio profile'
);

-- 10. Usuario A nao deve enxergar o profile de B
select is(
    (select count(*)
     from public.profiles
     where id = tests.get_supabase_uid('casillas-b@test.com')),
    0::bigint,
    'Usuario A nao deve enxergar o profile de B'
);

-- 11. Usuario A deve conseguir atualizar seu proprio profile
update public.profiles
set full_name = 'Usuario A'
where id = tests.get_supabase_uid('casillas-a@test.com');

select is(
    (select count(*)
     from public.profiles
     where id = tests.get_supabase_uid('casillas-a@test.com')
       and full_name = 'Usuario A'),
    1::bigint,
    'Usuario A deve conseguir atualizar seu proprio profile'
);

-- 12. Usuario A nao deve conseguir atualizar o profile de B
select results_eq(
    $$
        update public.profiles
        set full_name = 'Alterado por A'
        where id = tests.get_supabase_uid('casillas-b@test.com')
        returning id
    $$,
    $$
        select null::uuid
        where false
    $$,
    'Usuario A nao deve conseguir atualizar o profile de B'
);

-- ============================================================
-- USUARIO B
-- ============================================================

select tests.authenticate_as('casillas-b@test.com');

-- 13. Usuario B deve enxergar somente seu proprio profile
select is(
    (select count(*)
     from public.profiles),
    1::bigint,
    'Usuario B deve enxergar somente seu proprio profile'
);

-- 14. Usuario B nao deve enxergar o profile de A
select is(
    (select count(*)
     from public.profiles
     where id = tests.get_supabase_uid('casillas-a@test.com')),
    0::bigint,
    'Usuario B nao deve enxergar o profile de A'
);

-- 15. Usuario B deve conseguir atualizar seu proprio profile
update public.profiles
set full_name = 'Usuario B'
where id = tests.get_supabase_uid('casillas-b@test.com');

select is(
    (select count(*)
     from public.profiles
     where id = tests.get_supabase_uid('casillas-b@test.com')
       and full_name = 'Usuario B'),
    1::bigint,
    'Usuario B deve conseguir atualizar seu proprio profile'
);

-- 16. Usuario B nao deve conseguir atualizar o profile de A
select results_eq(
    $$
        update public.profiles
        set full_name = 'Alterado por B'
        where id = tests.get_supabase_uid('casillas-a@test.com')
        returning id
    $$,
    $$
        select null::uuid
        where false
    $$,
    'Usuario B nao deve conseguir atualizar o profile de A'
);

select * from finish();

rollback;
