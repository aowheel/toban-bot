import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error(
		"SUPABASE_URL or SUPABASE_ANON_KEY is not set in environment variables",
	);
}
const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export default supabase;
