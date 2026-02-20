<script setup>
import { supabase } from '@/utils/supabase'
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const sortOption = ref('')

// 🔎 búsqueda
const search = ref('')

// 🎛 categoría
const selectedCategory = ref('')

// 📄 paginación
const currentPage = ref(1)

onMounted(() => {
  const pageFromQuery = parseInt(route.query.page)

  if (!isNaN(pageFromQuery) && pageFromQuery > 0) {
    currentPage.value = pageFromQuery
  }
})

const itemsPerPage = 6

const products = ref([])

const productsGrid = ref(null)

onMounted(async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')

  if (error) {
    console.error(error)
  } else {
    products.value = data
  }
})

const filteredProducts = computed(() => {
  let result = products.value.filter(product => {

    const matchesSearch =
      product.name?.toLowerCase().includes(search.value.toLowerCase())

    const matchesCategory =
      !selectedCategory.value ||
      product.category === selectedCategory.value

    return matchesSearch && matchesCategory
  })

  // 🔽 ORDENAMIENTO
  if (sortOption.value === 'price-asc') {
    result = result.slice().sort((a, b) => a.price - b.price)
  }

  if (sortOption.value === 'price-desc') {
    result = result.slice().sort((a, b) => b.price - a.price)
  }

  return result
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredProducts.value.length / itemsPerPage))
})

const pages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const delta = 1

  const range = []
  const rangeWithDots = []

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i)
    }
  }

  let last

  for (const page of range) {
    if (last !== undefined) {
      if (page === last + 2) {
        rangeWithDots.push(last + 1)
      } else if (page > last + 2) {
        rangeWithDots.push('...')
      }
    }

    rangeWithDots.push(page)
    last = page
  }

  return rangeWithDots
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredProducts.value.slice(start, start + itemsPerPage)
})

watch([search, selectedCategory, sortOption], () => {
  currentPage.value = 1
})

const changePage = (page) => {
  if (typeof page !== 'number') return

  if (page < 1) page = 1
  if (page > totalPages.value) page = totalPages.value

  currentPage.value = page

  router.replace({
    query: {
      ...route.query,
      page: currentPage.value
    }
  })

  if (process.client && productsGrid.value) {
    productsGrid.value.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}

const categories = ref([])

onMounted(async () => {
  const { data } = await supabase
    .from('products')
    .select('category')

  const unique = [...new Set(data.map(p => p.category))]
  categories.value = unique
})

const categoriesWithCount = computed(() => {
  const counts = {}

  products.value.forEach(product => {
    const cat = product.category
    if (!counts[cat]) {
      counts[cat] = 0
    }
    counts[cat]++
  })

  const result = Object.keys(counts)
    .sort()
    .map(cat => ({
      label: `${cat} (${counts[cat]})`,
      value: cat
    }))

  return [
    {
      label: `Todas (${products.value.length})`,
      value: ''
    },
    ...result
  ]
})

</script>

<template>
  <input v-model="search" type="text" placeholder="Buscar productos..." />

  <select v-model="selectedCategory">
    <option v-for="category in categoriesWithCount" :key="category.value" :value="category.value">
      {{ category.label }}
    </option>
  </select>

  <div v-if="filteredProducts.length === 0" class="text-center py-10">
    No se encontraron productos.
  </div>

  <select v-model="sortOption" class="border p-2">
    <option value="">Ordenar</option>
    <option value="price-asc">Precio: menor a mayor</option>
    <option value="price-desc">Precio: mayor a menor</option>
  </select>

  <div ref="productsGrid" class="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    <ProductCard v-for="product in paginatedProducts" :key="product.id" :product="product" v-memo="[product.id]" />
  </div>

  <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-8 items-center">
    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="px-3 py-1 border rounded">
      ←
    </button>

    <button v-for="(page, index) in pages" :key="index" @click="changePage(page)" :disabled="page === '...'"
      class="px-3 py-1 border rounded transition" :class="[
        page === currentPage
          ? 'bg-black text-white'
          : 'bg-white hover:bg-gray-100',
        page === '...' ? 'cursor-default border-none bg-transparent' : ''
      ]">
      {{ page }}
    </button>

    <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
      class="px-3 py-1 border rounded">
      →
    </button>
  </div>

  <ClientOnly>
    <LazyCartDrawer hydrate-on-interaction />
  </ClientOnly>
</template>
