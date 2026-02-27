<script setup lang="ts">
const route = useRoute()
const supabase = useSupabaseClient()

const slug = route.params.slug as string

type Website = {
    id: string
    name: string
    slug: string
}

type WebsiteSection = {
    id: string
    type: string
    content: any
}

const resolveSectionComponent = (type: string) => {
    switch (type) {
        case 'hero':
            return 'WebsiteSectionsHero'
        default:
            return 'div'
    }
}

// WEBSITE
const { data: websiteData } = await supabase
    .from('websites')
    .select('*')
    .eq('slug', slug)
    .single()

if (!websiteData) {
    throw createError({ statusCode: 404 })
}

const website = websiteData as Website

// SECTIONS
const { data: sectionsData } = await supabase
    .from('website_sections')
    .select('*')
    .eq('website_id', website.id)
    .eq('is_active', true)
    .order('"order"')

const sections = (sectionsData ?? []) as WebsiteSection[]
</script>

<template>
    <div>
        <h1>{{ website.name }}</h1>

        <component v-for="section in sections" :is="resolveSectionComponent(section.type)" :key="section.id"
            :content="section.content" />
    </div>
</template>