import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = 'https://tgzkmcsoekyuhqavrhno.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnemttY3NvZWt5dWhxYXZyaG5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyOTk0NzIsImV4cCI6MjA1OTg3NTQ3Mn0.nz4ueg3g_w-uDg8ttB_y2Ch67QNu6Z-hs9yPDosArz8';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
