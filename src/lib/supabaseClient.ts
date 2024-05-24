import { PUBLIC_SUPABASE_API_KEY, PUBLIC_SUPABASE_SECRET_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";
import { createClient } from "@supabase/supabase-js";

const supabaseURL = PUBLIC_SUPABASE_URL;
const supabaseKey = PUBLIC_SUPABASE_SECRET_KEY;

export const supabase = createClient(supabaseURL, supabaseKey);