import { createClient } from "@supabase/supabase-js";


const supabaseUrl =
    "https://ccndltltxidchdonhmsb.supabase.co";

const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjbmRsdGx0eGlkY2hkb25obXNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4MDE3MjksImV4cCI6MjA5NjM3NzcyOX0.pWFee37Z3AaGlI8SD_tSq4Kfn1FneVOZAcH2OfN3xnQ";

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
);