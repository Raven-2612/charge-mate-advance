import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ieocvfwezfrchojeccyy.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imllb2N2ZndlemZyY2hvamVjY3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2OTIxMTcsImV4cCI6MjA1MzI2ODExN30.hi1hww6Xi3DHAB1zM9WHXECMMei-ar6wmn_pxf341iY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
