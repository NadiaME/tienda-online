<script setup>
import products from '~/data/products.json'
import { useCartStore } from '~/stores/cart'

const cart = useCartStore()

onMounted(() => {
  cart.load()
})
</script>

<template>
  <Header />

  <div class="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    <ProductCard
      v-for="p in products"
      :key="p.id"
      :product="p"
    />
  </div>

  <CartDrawer />
</template>
