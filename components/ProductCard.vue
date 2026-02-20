<script setup>
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()

const added = ref(false)

const props = defineProps({
  product: Object
})

const addProduct = () => {
  cart.add(props.product)
  flyToCart()

  added.value = true

  setTimeout(() => {
    added.value = false
  }, 1000)
}

const productImage = ref(null)

const flyToCart = () => {
  const container = productImage.value
  const cartBtn = document.getElementById('cart-button')

  if (!container || !cartBtn) return

  const realImg = container.querySelector('img')
  if (!realImg) return

  const imgRect = realImg.getBoundingClientRect()
  const cartRect = cartBtn.getBoundingClientRect()

  const clone = realImg.cloneNode(true)

  Object.assign(clone.style, {
    position: 'fixed',
    top: `${imgRect.top}px`,
    left: `${imgRect.left}px`,
    width: `${imgRect.width}px`,
    height: `${imgRect.height}px`,
    transition: 'all 0.7s cubic-bezier(.4,-0.3,.3,1.4)',
    zIndex: 9999,
    pointerEvents: 'none'
  })

  document.body.appendChild(clone)

  requestAnimationFrame(() => {
    clone.style.top = `${cartRect.top}px`
    clone.style.left = `${cartRect.left}px`
    clone.style.width = '40px'
    clone.style.height = '40px'
    clone.style.opacity = '0.5'
  })

  setTimeout(() => clone.remove(), 700)

  cartBtn.classList.add('cart-bounce')
  setTimeout(() => cartBtn.classList.remove('cart-bounce'), 300)
}

</script>


<template>
  <div class="border rounded-xl p-4 shadow">
    <NuxtLink :to="`/producto/${props.product.slug}`" prefetch-on="interaction">
      <div ref="productImage">
        <NuxtImg :src="props.product.image" format="webp" quality="80" loading="lazy"
          class="object-cover w-full h-full" />
      </div>
    </NuxtLink>
    <h2 class="mt-2 font-semibold">
      {{ props.product.name }}
    </h2>

    <p class="text-gray-600">
      ${{ props.product.price }}
    </p>

    <button @click="addProduct" class="mt-3 w-full py-2 rounded-lg transition-all duration-200 active:scale-95
 flex items-center justify-center gap-2" :class="added
  ? 'bg-green-600 text-white'
  : 'bg-black text-white'">
      <span v-if="added">✔ Agregado</span>
      <span v-else>Agregar al carrito</span>
    </button>
  </div>
</template>
