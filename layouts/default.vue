<script setup lang="ts">
import { themes } from '@/config/theme'

const theme = themes.default!
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
    <Header />
    <NuxtPage />
  </div>
</template>
