<script setup>
import { useCartStore } from '~/stores/cart'

defineProps({
  product: Object
})

const cart = useCartStore()
</script>

<template>
  <div class="border rounded-xl p-4 shadow">
    <img :src="product.image" class="h-40 w-full object-cover rounded" />

    <h2 class="mt-2 font-semibold">
      {{ product.name }}
    </h2>

    <p class="text-gray-600">
      ${{ product.price }}
    </p>

    <button @click="cart.add(product)" class="mt-3 w-full bg-black text-white py-2 rounded-lg">
      Agregar al carrito
    </button>
  </div>
</template>
