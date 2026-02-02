<script setup>
import { useCartStore } from '~/stores/cart'
import { clientConfig } from '~/data/client.config'
import { buildWhatsAppMessage } from '~/utils/whatsapp'

const cart = useCartStore()

function checkout() {
    const msg = buildWhatsAppMessage(cart.items)
    window.open(
        `https://wa.me/${clientConfig.whatsapp}?text=${msg}`,
        '_blank'
    )
}
</script>

<template>
    <div v-if="cart.open" class="fixed inset-0 bg-black/50 flex justify-end z-50">
        <div class="bg-white w-80 h-full p-4 flex flex-col">
            <h2 class="text-xl font-bold mb-4">Tu carrito</h2>

            <div v-if="cart.items.length === 0" class="text-gray-500">
                El carrito está vacío
            </div>

            <ul class="flex-1 overflow-auto">
                <li v-for="(item, index) in cart.items" :key="index" class="flex justify-between items-center mb-2">
                    <div>
                        <p class="font-medium">{{ item.name }}</p>
                        <p class="text-sm text-gray-500">$ {{ item.price }}</p>
                    </div>

                    <button @click="cart.remove(index)" class="text-red-600 text-sm">
                        Quitar
                    </button>
                </li>
            </ul>

            <div class="border-t pt-4">
                <p class="font-semibold mb-2">
                    Total: $ {{ cart.totalPrice }}
                </p>

                <button @click="checkout" class="w-full bg-black text-white py-2 rounded mb-2">
                    Finalizar por WhatsApp
                </button>

                <button @click="cart.toggle" class="w-full text-center text-sm text-gray-500">
                    Cerrar
                </button>
            </div>
        </div>
    </div>
</template>
