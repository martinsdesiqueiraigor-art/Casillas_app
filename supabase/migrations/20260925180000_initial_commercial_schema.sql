-- ============================================================
-- CASILLAS 2.0
-- Migration 001 — Initial Commercial Schema
--
-- Fundação do sistema comercial:
-- autenticação, trial, licenças, direitos de acesso,
-- auditoria e funções administrativas.
--
-- IMPORTANTE:
-- Esta migration cria a estrutura.
-- As operações comerciais serão implementadas posteriormente
-- através de Edge Functions e funções SQL protegidas.
-- ============================================================

create extension if not exists pgcrypto;

create schema if not exists private;

-- ============================================================
-- FUNÇÃO INTERNA: updated_at
-- ============================================================

create or replace function private.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

revoke execute on function private.set_updated_at() from public, anon, authenticated;

-- ============================================================
-- PRODUTOS
-- ============================================================

create table public.products (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    name text not null,
    description text,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint products_slug_format check (
        slug = lower(slug)
        and length(slug) between 2 and 64
        and slug ~ '^[a-z0-9][a-z0-9_-]*$'
    ),

    constraint products_name_not_blank check (
        length(trim(name)) > 0
    )
);

create trigger products_set_updated_at
before update on public.products
for each row
execute function private.set_updated_at();

-- ============================================================
-- PERFIS
-- ============================================================

create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text,
    locale text not null default 'pt-BR',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint profiles_locale_not_blank check (
        length(trim(locale)) > 0
    )
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function private.set_updated_at();

-- ============================================================
-- CRIA PERFIL AUTOMATICAMENTE AO CRIAR USUÁRIO
-- ============================================================

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    insert into public.profiles (id)
    values (new.id);

    return new;
end;
$$;

revoke execute on function private.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function private.handle_new_user();

-- ============================================================
-- TRIAL
-- ============================================================

create table public.trials (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id),
    product_id uuid not null references public.products(id),

    status text not null default 'ACTIVE',

    started_at timestamptz not null,
    ends_at timestamptz not null,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint trials_status_check check (
        status in ('ACTIVE', 'EXPIRED', 'CANCELLED')
    ),

    constraint trials_dates_check check (
        ends_at > started_at
    ),

    constraint trials_unique_user_product unique (
        user_id,
        product_id
    )
);

create index trials_user_id_idx
on public.trials(user_id);

create index trials_product_id_idx
on public.trials(product_id);

create index trials_status_ends_at_idx
on public.trials(status, ends_at);

create trigger trials_set_updated_at
before update on public.trials
for each row
execute function private.set_updated_at();

-- ============================================================
-- LICENÇAS
-- ============================================================

create table public.licenses (
    id uuid primary key default gen_random_uuid(),
    product_id uuid not null references public.products(id),

    -- SOMENTE o hash da licença é armazenado.
    -- O código original não fica no banco.
    license_code_hash text not null unique,

    status text not null default 'AVAILABLE',

    activated_by uuid references auth.users(id),
    activated_at timestamptz,

    revoked_at timestamptz,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint licenses_status_check check (
        status in ('AVAILABLE', 'ACTIVE', 'REVOKED')
    ),

    constraint licenses_hash_not_blank check (
        length(trim(license_code_hash)) > 0
    ),

    constraint licenses_activation_consistency check (
        (
            status = 'AVAILABLE'
            and activated_by is null
            and activated_at is null
        )
        or
        (
            status in ('ACTIVE', 'REVOKED')
            and activated_by is not null
            and activated_at is not null
        )
    ),

    constraint licenses_revocation_consistency check (
        (
            status = 'REVOKED'
            and revoked_at is not null
        )
        or
        (
            status <> 'REVOKED'
            and revoked_at is null
        )
    )
);

create index licenses_product_id_idx
on public.licenses(product_id);

create index licenses_activated_by_idx
on public.licenses(activated_by);

create index licenses_status_idx
on public.licenses(status);

create trigger licenses_set_updated_at
before update on public.licenses
for each row
execute function private.set_updated_at();

-- ============================================================
-- DIREITO EFETIVO DE USO
-- ============================================================

create table public.entitlements (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null references auth.users(id),
    product_id uuid not null references public.products(id),

    license_id uuid references public.licenses(id),

    source text not null,
    status text not null default 'ACTIVE',

    valid_from timestamptz not null default now(),
    valid_until timestamptz,

    revoked_at timestamptz,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint entitlements_source_check check (
        source in ('LICENSE', 'GRANT', 'PROMOTION', 'ADMIN')
    ),

    constraint entitlements_status_check check (
        status in ('ACTIVE', 'REVOKED')
    ),

    constraint entitlements_dates_check check (
        valid_until is null
        or valid_until > valid_from
    ),

    constraint entitlements_revocation_check check (
        (
            status = 'REVOKED'
            and revoked_at is not null
        )
        or
        (
            status = 'ACTIVE'
            and revoked_at is null
        )
    )
);

create index entitlements_user_id_idx
on public.entitlements(user_id);

create index entitlements_product_id_idx
on public.entitlements(product_id);

create index entitlements_license_id_idx
on public.entitlements(license_id);

create index entitlements_access_lookup_idx
on public.entitlements(user_id, product_id, status);

create unique index entitlements_one_active_per_user_product
on public.entitlements(user_id, product_id)
where status = 'ACTIVE';

create trigger entitlements_set_updated_at
before update on public.entitlements
for each row
execute function private.set_updated_at();

-- ============================================================
-- AUDITORIA
-- ============================================================

create table public.access_events (
    id uuid primary key default gen_random_uuid(),

    user_id uuid references auth.users(id) on delete set null,
    product_id uuid references public.products(id) on delete set null,

    event_type text not null,
    source text not null default 'SYSTEM',

    metadata jsonb not null default '{}'::jsonb,

    created_at timestamptz not null default now(),

    constraint access_events_event_type_check check (
        event_type in (
            'TRIAL_STARTED',
            'LICENSE_ACTIVATED',
            'LICENSE_REVOKED',
            'ACCESS_CHECKED',
            'ACCESS_BLOCKED'
        )
    ),

    constraint access_events_source_check check (
        source in (
            'SYSTEM',
            'USER',
            'ADMIN',
            'EDGE_FUNCTION'
        )
    )
);

create index access_events_user_id_idx
on public.access_events(user_id);

create index access_events_product_id_idx
on public.access_events(product_id);

create index access_events_event_type_idx
on public.access_events(event_type);

create index access_events_created_at_idx
on public.access_events(created_at desc);

-- ============================================================
-- ADMINISTRAÇÃO
-- ============================================================

create table public.admin_roles (
    user_id uuid primary key references auth.users(id) on delete cascade,

    role text not null,

    created_at timestamptz not null default now(),

    constraint admin_roles_role_check check (
        role in ('ADMIN', 'SUPER_ADMIN')
    )
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.trials enable row level security;
alter table public.licenses enable row level security;
alter table public.entitlements enable row level security;
alter table public.access_events enable row level security;
alter table public.admin_roles enable row level security;

-- ============================================================
-- REVOGAÇÃO DE ACESSOS DIRETOS
-- ============================================================

revoke all on table public.products from anon, authenticated;
revoke all on table public.profiles from anon, authenticated;
revoke all on table public.trials from anon, authenticated;
revoke all on table public.licenses from anon, authenticated;
revoke all on table public.entitlements from anon, authenticated;
revoke all on table public.access_events from anon, authenticated;
revoke all on table public.admin_roles from anon, authenticated;

-- ============================================================
-- PRODUCTS
-- ============================================================

grant select on table public.products
to anon, authenticated;

create policy "products_public_read_active"
on public.products
for select
to anon, authenticated
using (
    is_active = true
);

-- ============================================================
-- PROFILES
-- ============================================================

grant select
on table public.profiles
to authenticated;

grant update (full_name, locale)
on table public.profiles
to authenticated;

create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (
    (select auth.uid()) = id
);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (
    (select auth.uid()) = id
)
with check (
    (select auth.uid()) = id
);

-- ============================================================
-- TRIALS
-- ============================================================

grant select
on table public.trials
to authenticated;

create policy "trials_select_own"
on public.trials
for select
to authenticated
using (
    (select auth.uid()) = user_id
);

-- ============================================================
-- SERVICE ROLE
-- ============================================================

grant all
on table public.products
to service_role;

grant all
on table public.profiles
to service_role;

grant all
on table public.trials
to service_role;

grant all
on table public.licenses
to service_role;

grant all
on table public.entitlements
to service_role;

grant all
on table public.access_events
to service_role;

grant all
on table public.admin_roles
to service_role;

-- ============================================================
-- DOCUMENTAÇÃO
-- ============================================================

comment on table public.products is
'Produtos comerciais disponíveis no ecossistema Casillas.';

comment on table public.profiles is
'Dados complementares do usuário. A identidade principal permanece no Supabase Auth.';

comment on table public.trials is
'Períodos de avaliação controlados pelo servidor.';

comment on table public.licenses is
'Licenças comerciais. Somente o hash do código é armazenado.';

comment on table public.entitlements is
'Direito efetivo de uma conta utilizar determinado produto.';

comment on table public.access_events is
'Trilha de auditoria de eventos comerciais e de autorização.';

comment on table public.admin_roles is
'Papéis administrativos persistentes. Não dependem de metadata editável pelo usuário.';
