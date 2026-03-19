<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, watch, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useUiStore } from '@/stores/ui'
import type { Product } from '@/types/product'
import { mapToCartProduct } from '@/utils/mapProduct'

const ui = useUiStore()
const supabase = useSupabaseClient()
const route = useRoute()
const cart = useCartStore()

/* =========================
   FETCH PRODUCTO
========================= */

const storeId = useRuntimeConfig().public.storeId

const { data: product, error } = await useAsyncData<Product | null>(
    `product-${route.params.slug}`,
    async () => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('store_id', storeId)
            .eq('slug', route.params.slug)
            .single()

        if (error) throw error
        return data
    }
)

if (error.value) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Producto no encontrado'
    })
}

/* =========================
   COMPUTED SEGURO
========================= */

const p = computed(() => product.value)

/* =========================
   ESTADO LOCAL
========================= */

const activeImage = ref<string | null>(null)
const quantity = ref(1)
const maxReached = ref(false)

/* =========================
   WATCH PRODUCTO
========================= */

watch(
    () => p.value,
    (newProduct) => {
        quantity.value = 1
        maxReached.value = false

        if (newProduct?.images?.length) {
            activeImage.value = newProduct.images[0]
        }
    },
    { immediate: true }
)

/* =========================
   STOCK
========================= */

const inStock = computed(() => {
    return (p.value?.stock_online ?? 0) > 0
})

/* =========================
   CANTIDAD
========================= */

const increaseQty = () => {
    if (!p.value) return

    if (quantity.value < p.value.stock_online) {
        quantity.value++
        maxReached.value = false
    } else {
        maxReached.value = true
    }
}

const decreaseQty = () => {
    if (quantity.value > 1) {
        quantity.value--
        maxReached.value = false
    }
}

/* =========================
   CARRITO
========================= */

const addToCart = () => {
  const productData = p.value

  if (!productData || !inStock.value) return

  cart.add(mapToCartProduct(productData), quantity.value)

  ui.showToast({
    message: 'Producto agregado al carrito',
    image: productData.images?.[0] ?? null,
    quantity: quantity.value
  })
}

/* =========================
   SEO
========================= */

useHead(() => {
    const slug = route.params.slug as string

    return {
        title: p.value?.name
            ? `${p.value.name} | Tu Tienda`
            : 'Producto',

        meta: [
            {
                name: 'description',
                content:
                    p.value?.description ||
                    `Comprá ${p.value?.name} al mejor precio`
            },
            {
                property: 'og:title',
                content: p.value?.name
            },
            {
                property: 'og:description',
                content: p.value?.description
            },
            {
                property: 'og:image',
                content: p.value?.images?.[0]
            },
            {
                property: 'og:type',
                content: 'product'
            },
            {
                name: 'twitter:card',
                content: 'summary_large_image'
            }
        ],

        link: [
            {
                rel: 'canonical',
                href: `/producto/${slug}`
            }
        ]
    }
})
</script>

<template>
    <!-- 🔒 TODO protegido -->
    <div v-if="p">

        <!-- Breadcrumb -->
        <nav class="text-sm mb-4 text-gray-500">
            <NuxtLink to="/" class="hover:underline">
                Inicio
            </NuxtLink>

            <span v-if="p.category">
                /
                <NuxtLink :to="`/?category=${p.category}`" class="hover:underline">
                    {{ p.category }}
                </NuxtLink>
            </span>

            <span>
                / {{ p.name }}
            </span>
        </nav>

        <div class="max-w-5xl mx-auto p-6">
            <div class="grid md:grid-cols-2 gap-8">

                <!-- IMÁGENES -->
                <div class="space-y-4">

                    <NuxtImg v-if="activeImage" :key="activeImage" :src="activeImage" format="webp" quality="80"
                        class="w-full rounded-xl shadow transition-all duration-300" />

                    <div v-if="p.images?.length > 1" class="flex gap-2">
                        <img v-for="(img, i) in p.images" :key="i" :src="img" @click="activeImage = img"
                            class="w-20 h-20 object-cover rounded cursor-pointer border-2 transition" :class="img === activeImage
                                ? 'border-black'
                                : 'border-transparent hover:border-gray-400'" />
                    </div>

                </div>

                <!-- INFO -->
                <div class="space-y-4">

                    <h1 class="text-3xl font-bold">
                        {{ p.name }}
                    </h1>

                    <p class="text-2xl font-semibold">
                        ${{ p.price }}
                    </p>

                    <p class="text-sm" :class="p.stock_online > 0 ? 'text-green-600' : 'text-red-600'">
                        {{ p.stock_online > 0
                            ? `Disponible online: ${p.stock_online}`
                            : 'Sin stock online' }}
                    </p>

                    <!-- CANTIDAD -->
                    <div v-if="p.stock_online > 0" class="flex items-center gap-3">

                        <button @click="decreaseQty" class="px-3 py-1 border rounded">
                            -
                        </button>

                        <span class="w-8 text-center">
                            {{ quantity }}
                        </span>

                        <button @click="increaseQty" :disabled="quantity >= p.stock_online"
                            class="px-3 py-1 border rounded disabled:opacity-50">
                            +
                        </button>

                        <p v-if="maxReached" class="text-xs text-red-500">
                            Máximo disponible alcanzado
                        </p>

                    </div>

                    <!-- BOTÓN -->
                    <button @click="addToCart" :disabled="!inStock"
                        class="bg-black text-white px-6 py-3 rounded-lg transition" :class="p.stock_online === 0
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-gray-800'">
                        {{ inStock ? 'Agregar al carrito' : 'No disponible online' }}
                    </button>

                    <p class="text-gray-600">
                        {{ p.description }}
                    </p>

                </div>
            </div>
        </div>

    </div>
</template>