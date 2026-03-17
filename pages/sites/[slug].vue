<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { themes, type StoreId } from '@/config/themes'
import type { PageData } from '@/types/sections'

// obtener slug
const route = useRoute()
const slug = route.params.slug as StoreId

// theme
const theme = themes[slug] ?? themes.tiendaA

useHead({
    bodyAttrs: {
        style: `
      --color-primary: ${theme.colors.primary};
      --color-secondary: ${theme.colors.secondary};
      --color-text: ${theme.colors.text};
      --color-bg: ${theme.colors.background};
      --radius-base: ${theme.radius.base};
    `
    }
})

// fetch page
const { data: page } = await useAsyncData<PageData>(
    `page-${slug}`,
    () => $fetch(`/api/sites/${slug}`)
)

// autoload sections
const sections = import.meta.glob('~/components/sections/*.vue')

function resolveSectionComponent(type: string) {
    const name = type
        .split('-')
        .map(p => p.charAt(0).toUpperCase() + p.slice(1))
        .join('')

    const path = `/components/sections/${name}.vue`
    const loader = sections[path]

    if (!loader) {
        console.warn(`Sección no encontrada: ${path}`)
        return null
    }

    return defineAsyncComponent(loader as any)
}
</script>

<template>
    <div class="site">
        <component v-for="(section, i) in page?.sections ?? []" :key="i" :is="resolveSectionComponent(section.type)"
            v-bind="section.props" />
    </div>
</template>