import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "../config";
import type { Database } from "../types/supabase";

const { supabaseUrl, supabaseSecretKey } = getSupabaseEnv();
const supabase = createClient<Database>(supabaseUrl, supabaseSecretKey);

export default supabase;
