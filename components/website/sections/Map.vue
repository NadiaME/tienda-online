<script setup lang="ts">
const props = defineProps({
  content: Object
})
</script>

<template>
  <div>
    <div>{{ props.content?.title }}</div>
    <div>{{ props.content?.subtitle }}</div>
  </div>
</template>