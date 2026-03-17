<script setup lang="ts">
import { computed } from 'vue'
import { themes, type StoreId } from '~/config/themes'
import { useWebsite } from '@/composables/useWebsite'

const { settings } = useWebsite()

const config = useRuntimeConfig()

const route = useRoute()

// ejemplo simple
const showCart = computed(() => {
  return route.path.includes('tienda') // o la lógica que quieras
})

const theme = computed(() => {
  const storeId = config.public?.storeId as StoreId

  return storeId && themes[storeId]
    ? themes[storeId]
    : Object.values(themes)[0]
})

const themeStyles = computed(() => ({
  '--color-primary': settings?.colors?.primary ?? theme.value.colors.primary,
  '--color-secondary': settings?.colors?.secondary ?? theme.value.colors.secondary,
  '--color-text': settings?.colors?.text ?? theme.value.colors.text,
  '--color-bg': settings?.colors?.background ?? theme.value.colors.background,
  '--radius-base': settings?.radius?.base ?? theme.value.radius.base
}))
</script>

<template>
  <div id="app-theme" :style="themeStyles">
    <Header :theme="theme" :showCart="showCart" />

    <ClientOnly>
      <LazyCartDrawer hydrate-on-interaction />
    </ClientOnly>

    <NuxtPage />
  </div>
</template>