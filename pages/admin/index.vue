<script setup lang="ts">
import { supabase } from '@/utils/supabase'

const products = ref<any[]>([])
const loading = ref(false)

const form = reactive({
    id: null,
    name: '',
    price: '',
    image: '',
    description: ''
})

const loadProducts = async () => {
    const { data } = await supabase.from('products').select('*')
    products.value = data || []
}

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
        description: form.description || null
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
            <input type="file" @change="e => imageFile = (e.target as HTMLInputElement)?.files?.[0] || null" class="border p-2 w-full" />
            <textarea v-model="form.description" placeholder="Descripción" class="border p-2 w-full" />

            <button @click="saveProduct" class="bg-black text-white px-4 py-2" :disabled="loading">
                {{ form.id ? 'Actualizar' : 'Agregar' }}
            </button>
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
    </div>
</template>
