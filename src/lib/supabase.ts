import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://ytfeqodjrjpmpnbmscoa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZmVxb2RqcmpwbXBuYm1zY29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2NDAxODIsImV4cCI6MjA5MDIxNjE4Mn0.JLiwQzZplY0FKXoLhOxHKb2_CK-K5tFKtwgH04S04oU';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };
