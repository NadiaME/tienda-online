import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://vgwbxcimfpehttmcdkgt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnd2J4Y2ltZnBlaHR0bWNka2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNTIwODIsImV4cCI6MjA4NTYyODA4Mn0.vEhp2nm_MK7iO-bEWYIPZiJH3VuBMyn0mBW4rH7Z114'
)

export const useSupabase = () => {
  const config = useRuntimeConfig()

  return createClient(
    config.public.supabaseUrl!,
    config.public.supabaseAnonKey!
  )
}
