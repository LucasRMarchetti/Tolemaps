import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const SUPABASE_URL = 'https://uaqsbwrhctudlaqmudok.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhcXNid3JoY3R1ZGxhcW11ZG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODQzMzcsImV4cCI6MjA5NDM2MDMzN30.z3PvPtHxm6osOolfZFGPRKFwS6g5Mz3uAKpEdpyVAT0'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

console.log('Supabase conectado:', supabase)