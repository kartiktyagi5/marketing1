import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gvjgbzcxmxrlmsbdsmus.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_NOXMlW0_adxGVLzziVGRKg_63YoqB-2';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
