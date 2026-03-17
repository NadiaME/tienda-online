import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const supabase = await serverSupabaseClient(event)

    const websiteId = event.context.params?.id

    // traer secciones del sitio
    const { data: sections, error: sectionsError } = await supabase
        .from('website_sections')
        .select('*')
        .eq('website_id', websiteId)
        .order('order')

    if (sectionsError) {
        throw createError({
            statusCode: 500,
            statusMessage: sectionsError.message
        })
    }

    // traer tipos de sección
    const { data: sectionTypes, error: typesError } = await supabase
        .from('section_types')
        .select('*')

    if (typesError) {
        throw createError({
            statusCode: 500,
            statusMessage: typesError.message
        })
    }

    return {
        sections,
        sectionTypes
    }
})