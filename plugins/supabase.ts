import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()

    const supabase = createClient(
        config.public.supabaseUrl!,
        config.public.supabaseAnonKey!,
        {
            global: {
                headers: {
                    'store-id': config.public.storeId
                }
            }
        }
    )

    nuxtApp.provide('supabase', supabase)
})