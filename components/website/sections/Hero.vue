<script setup lang="ts">
defineProps<{ content: any }>()
</script>

<template>
  <section>
    <h1>{{ content.title }}</h1>
    <p>{{ content.subtitle }}</p>
  </section>
</template>