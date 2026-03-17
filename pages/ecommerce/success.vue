<script setup>
import { useCartStore } from '@/stores/cart'
import { createClient } from '@supabase/supabase-js'

const route = useRoute()
const cart = useCartStore()
const config = useRuntimeConfig()

const loading = ref(true)
const order = ref(null)
const status = ref('pending')

const supabase = createClient(
  config.public.supabaseUrl,
  config.public.supabaseAnonKey
)

onMounted(async () => {
  const orderId = route.query.order_id

  if (!orderId) {
    loading.value = false
    return
  }

  const { data } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (data) {
    order.value = data
    status.value = data.status

    if (data.status === 'paid') {
      cart.clearCart()
    }
  }

  loading.value = false
})
</script>

<template>
  <div class="max-w-2xl mx-auto p-8">
    <div v-if="loading" class="text-center">
      <p class="text-lg">Verificando pago...</p>
    </div>

    <div v-else-if="status === 'paid'" class="text-center">
      <h1 class="text-3xl font-bold text-green-600 mb-4">
        Pago aprobado 🎉
      </h1>

      <p class="mb-6">Gracias por tu compra.</p>

      <div v-if="order" class="bg-gray-100 p-6 rounded text-left">
        <h2 class="font-semibold mb-4">Resumen del pedido</h2>

        <div v-for="item in order.items" :key="item.id" class="flex justify-between mb-2">
          <span>{{ item.name }} x{{ item.quantity }}</span>
          <span>$ {{ item.price * item.quantity }}</span>
        </div>

        <div class="border-t mt-4 pt-4 font-bold flex justify-between">
          <span>Total</span>
          <span>$ {{ order.total }}</span>
        </div>
      </div>
    </div>

    <div v-else class="text-center">
      <h1 class="text-2xl font-bold text-yellow-600 mb-4">
        Pago en proceso
      </h1>

      <p>
        Tu pago aún está siendo procesado. Si ya pagaste, se confirmará en breve.
      </p>
    </div>
  </div>
</template>