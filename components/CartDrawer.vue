<script setup>
import { useCartStore } from '@/stores/cart'
import { clientConfig } from '@/data/client.config'
import { buildWhatsAppMessage } from '@/utils/whatsapp'
import { useOrders } from '@/composables/useOrders'

const { createOrder } = useOrders()

const cart = useCartStore()

const submitOrder = async () => {
    if (!cart.items.length) return

    const result = await createOrder({
        name: '',
        email: '',
        phone: '',
        cartItems: cart.items
    })

    if (!result.success) {
        alert('Error al enviar el pedido')
        return
    }

    const total = cart.items.reduce((sum, item) => {
        const price = Number(item.price) || 0
        const quantity = Number(item.quantity) || 1
        return sum + price * quantity
    }, 0)

    const message = buildWhatsAppMessage(cart.items, total)

    const phone = '59899423916' // ← TU NÚMERO
    const url = `https://wa.me/${phone}?text=${message}`

    window.open(url, '_blank')

    cart.clearCart()
}

const payWithMercadoPago = async () => {
    const { data, error } = await useFetch('/api/mercadopago/create-preference', {
        method: 'POST',
        body: {
            items: cart.items
        }
    })

    if (error.value) {
        alert('Error al iniciar el pago')
        return
    }

    window.location.href = data.value.init_point
}

const sendOrderByWhatsApp = () => {
    const message = buildWhatsAppMessage(cart.items, cart.total)
    const phone = '59899423916'
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
}

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

                <div class="space-y-3">
                    <button class="w-full bg-green-600 text-white py-2 rounded" @click="payWithMercadoPago">
                        Pagar pedido
                    </button>

                    <button class="w-full border py-2 rounded" @click="sendOrderByWhatsApp">
                        Enviar pedido por WhatsApp
                    </button>
                </div>

                <button @click="cart.toggle" class="w-full text-center text-sm text-gray-500">
                    Cerrar
                </button>
            </div>
        </div>
    </div>
</template>
