<script>
import { supabase } from '@/utils/supabase'

const { createOrder } = useOrders()

const submitOrder = async () => {
  const result = await createOrder({
    name: customerName.value,
    email: customerEmail.value,
    phone: customerPhone.value,
    cartItems: cart.value
  })

  if (result.success) {
    alert('Pedido enviado correctamente')
    // acá después vaciamos el carrito
  } else {
    alert('Error al enviar el pedido')
  }
}
</script>

<template>
    <CartDrawer />
</template>