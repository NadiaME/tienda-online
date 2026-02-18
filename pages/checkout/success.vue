<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { useOrders } from '@/composables/useOrders'

const cart = useCartStore()
const { createOrder } = useOrders()

onMounted(async () => {
  if (!cart.items.length) return

  await createOrder({
    name: '',
    email: '',
    phone: '',
    cartItems: cart.items,
    status: 'paid'
  })

  cart.clearCart()
})
</script>
