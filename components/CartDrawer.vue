<script setup>
import { useCartStore } from '@/stores/cart'
import { clientConfig } from '@/data/client.config'
import { buildWhatsAppMessage } from '@/utils/whatsapp'
import { useOrders } from '@/composables/useOrders'
import { ref } from 'vue'

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

const paymentMethod = ref('transfer')

const handleCheckout = async () => {
    if (!cart.items.length || loading.value) return

    loading.value = true

    if (paymentMethod.value === 'transfer') {
        const result = await createOrder({
            name: '',
            email: '',
            phone: '',
            cartItems: cart.items
        })

        if (!result.success) {
            loading.value = false
            alert('Error al enviar el pedido')
            return
        }

        const message = buildWhatsAppMessage(cart.items, cart.totalPrice)
        const phone = '59899423916'

        window.open(`https://wa.me/${phone}?text=${message}`, '_blank')

        cart.clearCart()
        cart.open = false
        loading.value = false
        return
    }

    if (paymentMethod.value === 'mp') {
        const { data, error } = await useFetch('/api/mercadopago/create-preference', {
            method: 'POST',
            body: {
                items: cart.items,
                total: cart.totalPrice
            }
        })

        loading.value = false

        if (error.value || !data.value?.init_point) {
            alert('Error al iniciar el pago')
            return
        }

        window.location.href = data.value.init_point
    }
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

                                <button @click="cart.increase(item.id)" :disabled="item.quantity >= item.stock"
                                    class="px-2 border rounded disabled:opacity-50">
                                    +
                                </button>
                            </div>

                            <p v-if="item.quantity >= item.stock" class="text-xs text-red-500 mt-1">
                                Solo quedan {{ item.stock }} unidades disponibles
                            </p>
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

                    <div class="mb-4 space-y-2">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="radio" value="transfer" v-model="paymentMethod" />
                            <span>Transferencia / WhatsApp</span>
                        </label>

                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="radio" value="mp" v-model="paymentMethod" />
                            <span>Pagar con MercadoPago</span>
                        </label>
                    </div>

                    <div class="space-y-3">
                        <button class="w-full py-2 rounded text-white disabled:opacity-50"
                            :class="paymentMethod === 'mp' ? 'bg-blue-600' : 'bg-green-600'" @click="handleCheckout"
                            :disabled="loading || !cart.items.length">
                            {{ loading
                                ? 'Procesando...'
                                : paymentMethod === 'mp'
                                    ? 'Pagar con MercadoPago'
                                    : 'Enviar pedido por WhatsApp'
                            }}
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
