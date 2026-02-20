<script setup>
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const { createOrder } = useOrders()
const loading = ref(false)

const submitOrder = async () => {
  if (loading.value) return
  loading.value = true

  const result = await createOrder({
    name: customerName.value,
    email: customerEmail.value,
    phone: customerPhone.value,
    cartItems: cartStore.items
  })

  loading.value = false

  if (result.success) {
    alert('Pedido enviado correctamente')

    cartStore.clearCart()   // vacía carrito
    cartStore.open = false  // 👈 cierra drawer
  } else {
    alert('Error al enviar el pedido')
  }
}


const finalizarCompra = async () => {
  await createOrder({
    name,
    email,
    phone,
    cartItems: cartStore.items
  })

  cartStore.clearCart()
  cartStore.open = false
}
</script>

<template>
  <LazyCartDrawer hydrate-on-interaction />
</template>