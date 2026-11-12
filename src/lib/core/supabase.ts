import { createClient } from '@supabase/supabase-js';

// Supabase project identifier (extracted from the dashboard URL you provided)
const PROJECT_REF = 'mhwtecfdqtlsxhcfvfkh';

export const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`;
export const SUPABASE_ANON_KEY = 'sb_publishable_NW-jVyt_-w8GukCN08zs7g_2P6YL8wT';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
