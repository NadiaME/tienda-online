<script setup lang="ts">
import { themes } from '~/config/theme'

const config = useRuntimeConfig()
const theme = themes[config.public.storeId as keyof typeof themes]

</script>

<template>
  <div
    id="app-theme"
    :style="{
      '--color-primary': theme.colors.primary,
      '--color-secondary': theme.colors.secondary,
      '--color-text': theme.colors.text,
      '--color-bg': theme.colors.background,
      '--radius-base': theme.radius.base
    }"
  >
    <Header :theme="theme" />
    <NuxtPage />
  </div>
</template>
