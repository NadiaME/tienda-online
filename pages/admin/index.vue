<script setup lang="ts">
import { supabase } from '@/utils/supabase'
import { ref, computed, watch, reactive, onMounted } from 'vue'

/* =========================
   ESTADO
========================= */

const products = ref<any[]>([])
const categories = ref<string[]>([])
const loading = ref(false)

const currentPage = ref(1)
const itemsPerPage = 5
const totalProducts = ref(0)

const search = ref('')
const selectedCategory = ref('')
const sortBy = ref('created_at')
const sortDirection = ref<'asc' | 'desc'>('desc')

const imageFiles = ref<File[]>([])
const fileInput = ref<HTMLInputElement | null>(null)

/* =========================
   FORMULARIO
========================= */

const form = reactive({
    id: null as number | null,
    name: '',
    price: '',
    description: '',
    category: '',
    images: [] as string[],
    stock_online: 0
})

/* =========================
   UTILIDADES
========================= */

const generateSlug = (text: string) =>
    text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')

const normalizeCategory = (value: string) => {
    const clean = value.trim().toLowerCase()
    return clean.charAt(0).toUpperCase() + clean.slice(1)
}

/* =========================
   FETCH PRODUCTOS
========================= */

const loadProducts = async () => {
    const from = (currentPage.value - 1) * itemsPerPage
    const to = from + itemsPerPage - 1

    let query = supabase
        .from('products')
        .select('*', { count: 'exact' })

    if (search.value)
        query = query.ilike('name', `%${search.value}%`)

    if (selectedCategory.value)
        query = query.eq('category', selectedCategory.value)

    query = query.order(sortBy.value, {
        ascending: sortDirection.value === 'asc'
    })

    const { data, count } = await query.range(from, to)

    products.value = data || []
    totalProducts.value = count || 0

    updateCategories()
}

const updateCategories = () => {
    categories.value = [
        ...new Set(
            products.value
                .map(p => p.category)
                .filter(Boolean)
        )
    ]
}

onMounted(loadProducts)

/* =========================
   WATCHERS
========================= */

watch([search, selectedCategory, sortBy, sortDirection], () => {
    currentPage.value = 1
    loadProducts()
})

watch(currentPage, loadProducts)

/* =========================
   IMÁGENES
========================= */

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

const handleFiles = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (!target.files) return

    const files = Array.from(target.files)

    const total =
        form.images.length +
        imageFiles.value.length +
        files.length

    if (total > 5) {
        alert('Máximo 5 imágenes en total')
        return
    }

    imageFiles.value = [...imageFiles.value, ...files]

    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

type CombinedImage =
    | { type: 'existing'; value: string }
    | { type: 'new'; value: File }

const combinedImages = computed<CombinedImage[]>(() => {
    return [
        ...form.images.map(
            (img): CombinedImage => ({
                type: 'existing',
                value: img
            })
        ),
        ...imageFiles.value.map(
            (file): CombinedImage => ({
                type: 'new',
                value: file
            })
        )
    ]
})

const totalPages = computed(() =>
    Math.max(1, Math.ceil(totalProducts.value / itemsPerPage))
)

const getImageSrc = (item: CombinedImage) =>
    item.type === 'existing'
        ? item.value
        : import.meta.client
            ? URL.createObjectURL(item.value)
            : ''

const splitCombined = (list: CombinedImage[]) => {
    form.images = list
        .filter(i => i.type === 'existing')
        .map(i => i.value)

    imageFiles.value = list
        .filter(i => i.type === 'new')
        .map(i => i.value)
}

const moveCombinedLeft = (index: number) => {
    if (index === 0) return
    const list = [...combinedImages.value]
    const item = list[index]
    list.splice(index, 1)
    list.splice(index - 1, 0, item)
    splitCombined(list)
}

const moveCombinedRight = (index: number) => {
    if (index === combinedImages.value.length - 1) return
    const list = [...combinedImages.value]
    const item = list[index]
    list.splice(index, 1)
    list.splice(index + 1, 0, item)
    splitCombined(list)
}

const removeCombined = (index: number) => {
    const list = [...combinedImages.value]
    list.splice(index, 1)
    splitCombined(list)
}

/* =========================
   GUARDAR PRODUCTO
========================= */

const saveProduct = async () => {
    if (!form.name.trim()) {
        alert('El nombre es obligatorio')
        return
    }

    loading.value = true
    const isEditing = !!form.id

    form.category = normalizeCategory(form.category)

    let imageUrls = [...form.images]

    if (!isEditing && imageUrls.length === 0 && imageFiles.value.length === 0) {
        alert('Debés subir al menos 1 imagen')
        loading.value = false
        return
    }

    if (imageFiles.value.length > 0) {
        const uploads = await Promise.all(
            imageFiles.value.map(uploadImage)
        )

        imageUrls = [
            ...imageUrls,
            ...uploads.filter(Boolean) as string[]
        ]
    }

    let slug = generateSlug(form.name)
    if (!isEditing) slug = `${slug}-${Date.now()}`

    const payload = {
        name: form.name,
        price: Number(form.price),
        description: form.description || null,
        category: form.category,
        slug,
        images: imageUrls,
        stock_online: Number(form.stock_online)
    }

    const { error } = isEditing
        ? await supabase.from('products').update(payload).eq('id', form.id)
        : await supabase.from('products').insert([payload])

    if (error) {
        alert(error.message)
        loading.value = false
        return
    }

    resetForm()
    await loadProducts()
    loading.value = false
}

/* =========================
   EDITAR / ELIMINAR
========================= */

const editProduct = (p: any) => {
    Object.assign(form, p)
}

const deleteProduct = async (id: number) => {
    if (!confirm('¿Eliminar producto?')) return
    await supabase.from('products').delete().eq('id', id)
    await loadProducts()
}

/* =========================
   RESET
========================= */

const resetForm = () => {
    form.id = null
    form.name = ''
    form.price = ''
    form.description = ''
    form.category = ''
    form.stock_online = 0
    form.images = []

    imageFiles.value = []

    if (fileInput.value) {
        fileInput.value.value = ''
    }
}
</script>

<template>
    <div class="max-w-3xl mx-auto p-6 space-y-6">
        <h1 class="text-2xl font-bold">Admin de productos</h1>

        <!-- Formulario -->
        <div class="space-y-2">
            <input v-model="form.name" placeholder="Nombre" class="border p-2 w-full" />
            <input v-model="form.price" placeholder="Precio" type="number" class="border p-2 w-full" />
            <div class="flex flex-col gap-1">
                <label class="text-sm font-medium">
                    Categoría
                </label>

                <input v-model="form.category" list="categories-list" placeholder="Ej: Accesorios"
                    class="border p-2 w-full" />

                <datalist id="categories-list">
                    <option v-for="cat in categories" :key="cat" :value="cat" />
                </datalist>

                <span class="text-xs text-gray-500">
                    Escribí para buscar o crear una nueva
                </span>
            </div>
            <input ref="fileInput" type="file" multiple @change="handleFiles" class="border p-2 w-full" />
            <ClientOnly>
                <div v-if="combinedImages.length" class="flex gap-2 mt-2">
                    <div v-for="(item, index) in combinedImages"
                        :key="item.type === 'existing' ? item.value : item.value.name + index"
                        class="relative flex flex-col items-center">
                        <img :src="getImageSrc(item)" class="w-16 h-16 object-cover rounded" />
                        <div class="flex gap-1 mt-1">
                            <button type="button" @click="moveCombinedLeft(index)" class="text-xs px-1 border rounded">
                                ←
                            </button>

                            <button type="button" @click="moveCombinedRight(index)" class="text-xs px-1 border rounded">
                                →
                            </button>
                        </div>

                        <button type="button" @click="removeCombined(index)"
                            class="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                            ×
                        </button>
                    </div>
                </div>
            </ClientOnly>
            <textarea v-model="form.description" placeholder="Descripción" class="border p-2 w-full" />
            <div class="flex flex-col gap-1">
                <label class="text-sm font-medium">
                    Stock disponible online
                </label>

                <input v-model.number="form.stock_online" type="number" min="0" placeholder="Ej: 10"
                    class="border p-2 w-full" />

                <span class="text-xs text-gray-500">
                    Cantidad reservada para ventas online
                </span>
            </div>

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
