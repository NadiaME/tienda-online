<script setup>
import { supabase } from '@/utils/supabase'

const products = ref([])

onMounted(async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')

  if (error) {
    console.error(error)
  } else {
    products.value = data
  }
})
</script>

<template>
  <div class="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    <ProductCard v-for="p in products" :key="p.id" :product="p" v-memo="[p.id]"/>
  </div>
  
  <ClientOnly>
    <LazyCartDrawer hydrate-on-interaction />
  </ClientOnly>
</template>
