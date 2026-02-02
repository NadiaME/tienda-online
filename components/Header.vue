<script setup>
import { useCartStore } from '~/stores/cart'
import { clientConfig } from '~/data/client.config'

const cart = useCartStore()
</script>

<template>
    <header :class="`${clientConfig.primaryColor} ${clientConfig.textColor}`"
        class="px-6 py-4 flex justify-between items-center">
        <div class="flex items-center gap-3">
            <img :src="clientConfig.logo" class="h-10" />
            <span class="font-bold text-xl">
                {{ clientConfig.storeName }}
            </span>
        </div>

        <button @click="cart.toggle" class="bg-white text-black px-4 py-2 rounded-lg">
            Carrito ({{ cart.totalItems }})
        </button>
    </header>
</template>
