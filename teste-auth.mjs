import { supabase } from './js/supabase.bundle.js';

const { data, error } = await supabase.auth.signInWithPassword({
  email: 'teste.casillas@example.com',
  password: process.env.CASILLAS_TEST_PASSWORD
});

console.log('USER:', data.user?.id ?? null);
console.log('SESSION:', !!data.session);
console.log('ERROR:', error?.message ?? null);

await supabase.auth.signOut();
