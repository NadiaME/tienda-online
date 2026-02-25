<script setup>
import { useCartStore } from '@/stores/cart'
import { clientConfig } from '@/data/client.config'
import { buildWhatsAppMessage } from '@/utils/whatsapp'
import { useOrders } from '@/composables/useOrders'

const { createOrder } = useOrders()

const cart = useCartStore()
const loading = ref(false)


const submitOrder = async () => {
    if (loading.value) return      // 👈 evita doble click
    if (!cart.items.length) return

    loading.value = true

    const result = await createOrder({
        name: '',
        email: '',
        phone: '',
        cartItems: cart.items
    })

    loading.value = false

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

    const phone = '59899423916'
    const url = `https://wa.me/${phone}?text=${message}`

    window.open(url, '_blank')

    cart.clearCart()
    cart.open = false   // 👈 cerrar drawer automáticamente
}


const payWithMercadoPago = async () => {
    if (loading.value) return
    loading.value = true

    const { data, error } = await useFetch('/api/mercadopago/create-preference', {
        method: 'POST',
        body: {
            items: cart.items
        }
    })

    loading.value = false

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
    <Transition name="drawer">
        <div v-if="cart.open" class="fixed inset-0 bg-black/50 flex justify-end z-50" @click.self="cart.toggle()">
            <div class="bg-white w-80 h-full p-4 flex flex-col">
                <!-- TODO tu contenido actual queda igual -->
                <h2 class="text-xl font-bold mb-4">Tu carrito</h2>

                <div v-if="cart.items.length === 0" class="text-gray-500">
                    El carrito está vacío
                </div>

                <div v-for="item in cart.items" :key="item.id" class="flex justify-between items-center">

                    <div class="flex items-center gap-3">
                        <img :src="item.image" class="w-12 h-12 object-cover rounded" />

                        <div>
                            <p class="font-medium">{{ item.name }}</p>
                            <p class="text-sm text-gray-500">
                                ${{ item.price }} c/u
                            </p>

                            <div class="flex items-center gap-2 mt-1">
                                <button @click="cart.decrease(item.id)" class="px-2 border rounded">
                                    -
                                </button>

                                <span>{{ item.quantity }}</span>

                                <button @click="cart.increase(item.id)" class="px-2 border rounded">
                                    +
                                </button>
                            </div>
                        </div>
                    </div>

                    <button @click="cart.removeById(item.id)" class="text-red-500 text-sm">
                        Eliminar producto
                    </button>
                </div>

                <div class="border-t pt-4">
                    <p class="font-semibold mb-2">
                        Total: $ {{ cart.totalPrice }}
                    </p>

                    <div class="space-y-3">
                        <button
                            class="w-full bg-green-600 text-white py-2 rounded flex items-center justify-center gap-2 disabled:opacity-50"
                            @click="payWithMercadoPago" :disabled="loading">
                            <svg v-if="loading" class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4" />
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>

                            {{ loading ? 'Procesando...' : 'Pagar pedido' }}
                        </button>



                        <button
                            class="w-full border py-2 rounded flex items-center justify-center gap-2 disabled:opacity-50"
                            @click="submitOrder" :disabled="loading">
                            <svg v-if="loading" class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4" />
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>

                            {{ loading ? 'Enviando...' : 'Enviar pedido por WhatsApp' }}
                        </button>


                    </div>

                    <button @click="cart.toggle" class="w-full text-center text-sm text-gray-500">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>
