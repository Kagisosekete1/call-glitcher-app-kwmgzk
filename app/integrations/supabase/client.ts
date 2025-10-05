import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://mvjiimrytwzboexnkcbf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12amlpbXJ5dHd6Ym9leG5rY2JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NzE3MTksImV4cCI6MjA3NTI0NzcxOX0.ZGkAD0R-CTaG_IyI9i1lWawEiTR8KGNz00mP8joFhm0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
