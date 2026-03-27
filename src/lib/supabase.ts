import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://pckgdbzptlagqnzpwgce.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjIwNDc1ZGEwLTBhOWQtNGFhMy04YjVlLTU1NGY2NmEyNzZlOSJ9.eyJwcm9qZWN0SWQiOiJwY2tnZGJ6cHRsYWdxbnpwd2djZSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzcyNzM4ODgzLCJleHAiOjIwODgwOTg4ODMsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.rgmzrbrJXCjS09k1yqHtgh7InJgRyNucg1ZxLoU17DY';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };