import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fmhvwvosjzjpgeastiqx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtaHZ3dm9zanpqcGdlYXN0aXF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NzU2MjcsImV4cCI6MjA4NzM1MTYyN30.8D5pgQITHojkEsZrVKUnM12FUw_f0v3BJp7rDTDih2Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);