<script setup>
defineProps(['content'])
</script>

<template>
  <section class="py-20 text-center">
    <h1 class="text-4xl font-bold">
      {{ content.title }}
    </h1>

    <p class="mt-4">
      {{ content.subtitle }}
    </p>
  </section>
</template>