import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "../config.js";
import type { Database } from "../types/supabase.js";

const { supabaseUrl, supabaseSecretKey } = getSupabaseEnv();
const supabase = createClient<Database>(supabaseUrl, supabaseSecretKey);

export default supabase;
