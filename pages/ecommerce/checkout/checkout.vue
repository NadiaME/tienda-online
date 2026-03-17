<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useOrders } from '@/composables/useOrders'
import { navigateTo } from '#app'

/* =========================
   ESTADO
========================= */

const cartStore = useCartStore()
const { createOrder } = useOrders()

const loading = ref(false)

const customerName = ref('')
const customerEmail = ref('')
const customerPhone = ref('')

/* =========================
   VALIDACIÓN SIMPLE
========================= */

const isFormValid = () => {
  return (
    customerName.value.trim() &&
    customerEmail.value.trim() &&
    cartStore.items.length > 0
  )
}

/* =========================
   ENVIAR PEDIDO
========================= */

const submitOrder = async () => {
  if (loading.value) return
  if (!isFormValid()) {
    alert('Completá los datos correctamente')
    return
  }

  loading.value = true

  const result = await createOrder({
    name: customerName.value,
    email: customerEmail.value,
    phone: customerPhone.value,
    cartItems: cartStore.items.map(item => ({
      price: item.price,
      quantity: item.quantity
    }))
  })

  loading.value = false

  if (!result.success) {
    alert('Error al enviar el pedido')
    return
  }

  // limpiar carrito
  cartStore.clearCart()
  cartStore.open = false

  // redirigir
  navigateTo('/order-success')
}
</script>

<template>
  <div class="max-w-xl mx-auto p-6 space-y-4">
    <h1 class="text-2xl font-bold">Finalizar compra</h1>

    <input v-model="customerName" placeholder="Nombre" class="border p-2 w-full" />

    <input v-model="customerEmail" type="email" placeholder="Email" class="border p-2 w-full" />

    <input v-model="customerPhone" placeholder="Teléfono (opcional)" class="border p-2 w-full" />

    <button @click="submitOrder" :disabled="loading" class="bg-black text-white px-6 py-3 rounded-lg w-full">
      {{ loading ? 'Enviando...' : 'Confirmar pedido' }}
    </button>
  </div>
</template>