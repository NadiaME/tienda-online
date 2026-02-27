<script setup>
import { useUiStore } from '@/stores/ui'
import { useCartStore } from '@/stores/cart'

const ui = useUiStore()
const cart = useCartStore()

const goToCart = () => {
    cart.open = true
    ui.toast.visible = false
}
</script>

<template>
    <Transition name="toast">
        <div v-if="ui.toast.visible"
            class="fixed bottom-6 right-6 bg-white border shadow-2xl rounded-2xl p-4 w-80 z-50">
            <div class="flex gap-4 items-center">
                <img v-if="ui.toast.image" :src="ui.toast.image" class="w-14 h-14 object-cover rounded-lg" />

                <div class="flex-1">
                    <p class="font-semibold text-sm">
                        {{ ui.toast.message }}
                    </p>

                    <p class="text-xs text-gray-500">
                        Cantidad: {{ ui.toast.quantity }}
                    </p>

                    <button @click="goToCart" class="mt-2 text-sm text-black font-medium hover:underline">
                        Ver carrito
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>