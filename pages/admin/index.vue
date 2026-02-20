<script setup lang="ts">
import { supabase } from '@/utils/supabase'
import { ref, computed, watch, onMounted } from 'vue'

const currentPage = ref(1)
const itemsPerPage = 5
const totalProducts = ref(0)
const search = ref('')
const selectedCategory = ref('')
const sortBy = ref('created_at')
const sortDirection = ref<'asc' | 'desc'>('desc')

const totalPages = computed(() =>
    Math.ceil(totalProducts.value / itemsPerPage)
)

const products = ref<any[]>([])
const loading = ref(false)

const form = reactive({
    id: null,
    name: '',
    price: '',
    image: '',
    description: '',
    category: ''
})

const loadProducts = async () => {
    const from = (currentPage.value - 1) * itemsPerPage
    const to = from + itemsPerPage - 1

    let query = supabase
        .from('products')
        .select('*', { count: 'exact' })

    // 🔎 Buscador
    if (search.value) {
        query = query.ilike('name', `%${search.value}%`)
    }

    // 🎛 Filtro categoría
    if (selectedCategory.value) {
        query = query.eq('category', selectedCategory.value)
    }

    // ↕ Orden
    query = query.order(sortBy.value, {
        ascending: sortDirection.value === 'asc'
    })

    // 📄 Paginación
    const { data, count } = await query.range(from, to)

    products.value = data || []
    totalProducts.value = count || 0
}

watch([search, selectedCategory, sortBy, sortDirection], () => {
    currentPage.value = 1
    loadProducts()
})

watch(currentPage, loadProducts)

const uploadImage = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`

    const { error } = await supabase.storage
        .from('products')
        .upload(fileName, file)

    if (error) {
        alert('Error subiendo imagen')
        return null
    }

    const { data } = supabase.storage
        .from('products')
        .getPublicUrl(fileName)

    return data.publicUrl
}

const imageFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    imageFile.value = target.files?.[0] || null
}

const saveProduct = async () => {
    loading.value = true

    let imageUrl = form.image

    if (imageFile.value) {
        const uploadedUrl = await uploadImage(imageFile.value)
        if (uploadedUrl) imageUrl = uploadedUrl
    }

    const payload = {
        name: form.name,
        price: Number(form.price),
        image: imageUrl,
        description: form.description || null,
        category: form.category
    }

    const { error } = form.id
        ? await supabase.from('products').update(payload).eq('id', form.id)
        : await supabase.from('products').insert([payload])

    if (error) {
        alert(error.message)
        loading.value = false
        return
    }

    resetForm()
    imageFile.value = null
    await loadProducts()
    loading.value = false
}

const editProduct = (p: any) => {
    Object.assign(form, p)
}

const deleteProduct = async (id: number) => {
    if (!confirm('¿Eliminar producto?')) return
    await supabase.from('products').delete().eq('id', id)
    await loadProducts()
}

const resetForm = () => {
    form.id = null
    form.name = ''
    form.price = ''
    form.image = ''
    form.description = ''
    form.category = ''
}

onMounted(loadProducts)
</script>

<template>
    <div class="max-w-3xl mx-auto p-6 space-y-6">
        <h1 class="text-2xl font-bold">Admin de productos</h1>

        <!-- Formulario -->
        <div class="space-y-2">
            <input v-model="form.name" placeholder="Nombre" class="border p-2 w-full" />
            <input v-model="form.price" placeholder="Precio" type="number" class="border p-2 w-full" />
            <input v-model="form.category" placeholder="Categoría" class="border p-2 w-full" />
            <input ref="fileInput" type="file" @change="handleFileChange" class="border p-2 w-full" />
            <textarea v-model="form.description" placeholder="Descripción" class="border p-2 w-full" />

            <button @click="saveProduct" class="bg-black text-white px-4 py-2" :disabled="loading">
                {{ form.id ? 'Actualizar' : 'Agregar' }}
            </button>
        </div>
        <div class="flex flex-wrap gap-2 mb-4">

            <!-- Buscador -->
            <input v-model="search" placeholder="Buscar producto..." class="border p-2" />

            <!-- Filtro categoría -->
            <input v-model="selectedCategory" placeholder="Filtrar por categoría" class="border p-2" />

            <!-- Orden -->
            <select v-model="sortBy" class="border p-2">
                <option value="created_at">Fecha</option>
                <option value="name">Nombre</option>
                <option value="price">Precio</option>
            </select>

            <select v-model="sortDirection" class="border p-2">
                <option value="desc">Descendente</option>
                <option value="asc">Ascendente</option>
            </select>

        </div>

        <!-- Listado -->
        <div class="space-y-2">
            <div v-for="p in products" :key="p.id" class="border p-3 flex justify-between items-center">
                <div>
                    <strong>{{ p.name }}</strong> – ${{ p.price }}
                </div>
                <div class="space-x-2">
                    <button @click="editProduct(p)">✏️</button>
                    <button @click="deleteProduct(p.id)">🗑️</button>
                </div>
            </div>
        </div>
        
        <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-6">
            <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1 border rounded">
                ←
            </button>

            <span class="px-3 py-1">
                {{ currentPage }} / {{ totalPages }}
            </span>

            <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1 border rounded">
                →
            </button>
        </div>
    </div>
</template>
