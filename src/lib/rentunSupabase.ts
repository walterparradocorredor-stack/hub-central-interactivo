import { createClient } from '@supabase/supabase-js';

// Supabase dedicado de Rentun Group
const rentunUrl = 'https://bvdmbknemahfupadhnnf.supabase.co';
const rentunAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2ZG1ia25lbWFoZnVwYWRobm5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NzU2MTksImV4cCI6MjA5ODE1MTYxOX0.VsETmYdOUPmIcIoCWOVrK-xTiGPVAGfbUSnmR_nW5ew';

export const rentunSupabase = createClient(rentunUrl, rentunAnonKey);
