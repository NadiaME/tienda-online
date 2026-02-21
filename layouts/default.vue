<script setup lang="ts">
import { computed } from 'vue'
import { themes, type StoreId } from '~/config/theme'

const config = useRuntimeConfig()

const theme = computed(() => {
  const storeId = config.public.storeId as StoreId
  return themes[storeId] ?? Object.values(themes)[0]
})

const themeStyles = computed(() => ({
  '--color-primary': theme.value.colors.primary,
  '--color-secondary': theme.value.colors.secondary,
  '--color-text': theme.value.colors.text,
  '--color-bg': theme.value.colors.background,
  '--radius-base': theme.value.radius.base
}))
</script>

<template>
  <div id="app-theme" :style="themeStyles">
    <Header :theme="theme" />

    <ClientOnly>
      <LazyCartDrawer hydrate-on-interaction />
    </ClientOnly>

    <NuxtPage />
  </div>
</template>