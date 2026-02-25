<script setup>
import { supabase } from '@/utils/supabase'
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Estado
const products = ref([])
const search = ref('')
const selectedCategory = ref('')
const sortOption = ref('')
const currentPage = ref(1)
const itemsPerPage = 6
const productsGrid = ref(null)
const storeId = useRuntimeConfig().public.storeId

// --------- CARGA INICIAL ---------

onMounted(async () => {
  // Leer query
  const { page, category, search: qSearch, sort } = route.query

  if (page && !isNaN(Number(page))) currentPage.value = Number(page)
  if (typeof category === 'string') selectedCategory.value = category
  if (typeof qSearch === 'string') search.value = qSearch
  if (typeof sort === 'string') sortOption.value = sort

  // Traer productos
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', storeId)

  if (!error) products.value = data
})

// --------- FILTRADO + ORDEN ---------

const filteredProducts = computed(() => {
  let result = products.value.filter(p => {
    const matchesSearch =
      p.name?.toLowerCase().includes(search.value.toLowerCase())

    const matchesCategory =
      !selectedCategory.value ||
      p.category === selectedCategory.value

    return matchesSearch && matchesCategory
  })

  if (sortOption.value === 'price-asc') {
    result = [...result].sort((a, b) => a.price - b.price)
  }

  if (sortOption.value === 'price-desc') {
    result = [...result].sort((a, b) => b.price - a.price)
  }

  return result
})

// --------- PAGINACIÓN ---------

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredProducts.value.length / itemsPerPage))
)

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredProducts.value.slice(start, start + itemsPerPage)
})

// --------- CATEGORÍAS DINÁMICAS ---------

const categoriesWithCount = computed(() => {
  const counts = {}

  for (const p of products.value) {
    if (!p.category) continue
    counts[p.category] = (counts[p.category] || 0) + 1
  }

  const result = Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([cat, count]) => ({
      label: `${cat} (${count})`,
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

// --------- SINCRONIZAR URL ---------

const updateQuery = () => {
  router.replace({
    query: {
      category: selectedCategory.value || undefined,
      search: search.value || undefined,
      sort: sortOption.value || undefined,
      page: currentPage.value > 1 ? currentPage.value : undefined
    }
  })
}

watch([selectedCategory, search, sortOption], () => {
  currentPage.value = 1
  updateQuery()
})

const changePage = (page) => {
  if (typeof page !== 'number') return

  currentPage.value = Math.min(
    Math.max(page, 1),
    totalPages.value
  )

  updateQuery()

  if (process.client && productsGrid.value) {
    productsGrid.value.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}
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
