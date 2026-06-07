const SUPABASE_URL="https://hexatytkkerqhtsukozp.supabase.co";
const SUPABASE_ANON_KEY="sb_publishable_Rs28uZ0iGl0YLrJm8yfxoA_Ba2sRgHC";
const supabaseClient=window.supabase?window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY):null;
let currentUser=null;