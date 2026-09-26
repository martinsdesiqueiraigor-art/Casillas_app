-- CASILLAS 2.0
-- Shared database test setup

create extension if not exists pgtap with schema extensions;

begin;
select plan(1);
select ok(true, 'Pre-test setup completed successfully');
select * from finish();
rollback;
