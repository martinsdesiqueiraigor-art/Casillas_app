import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://maayjshlsxvxtrgjpcep.supabase.co'
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_1p4-6-tNmiBhz0edN-UQDQ_sbwJwABo'

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
)
