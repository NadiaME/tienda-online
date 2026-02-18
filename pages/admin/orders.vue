<script setup>
import { supabase } from '@/utils/supabase'

const orders = ref([])
const loading = ref(true)

const loadOrders = async () => {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error(error)
    } else {
        orders.value = data
    }

    loading.value = false
}

const markDelivered = async (id) => {
    await supabase
        .from('orders')
        .update({ status: 'entregado' })
        .eq('id', id)

    loadOrders()
}

const parseItems = (items) => {
    if (!items) return []

    // Si ya es array, perfecto
    if (Array.isArray(items)) return items

    // Si viene como string JSON
    try {
        return JSON.parse(items)
    } catch {
        return []
    }
}

onMounted(loadOrders)
</script>

<template>
    <div class="max-w-4xl mx-auto p-6 space-y-6">
        <h1 class="text-2xl font-bold">Pedidos</h1>

        <div v-if="loading">Cargando pedidos…</div>

        <div v-else-if="!orders.length">
            No hay pedidos todavía.
        </div>

        <div v-for="order in orders" :key="order.id" class="border p-4 space-y-2">
            <div class="flex justify-between items-center">
                <strong>Pedido</strong>
                <span class="text-sm">
                    {{ new Date(order.created_at).toLocaleString() }}
                </span>
            </div>

            <div class="text-sm">
                <strong>Total:</strong> ${{ order.total }}
            </div>

            <div class="text-sm">
                <strong>Estado:</strong> {{ order.status }}
            </div>

            <div class="mt-2">
                <strong>Productos:</strong>
                <ul class="list-disc ml-5">
                    <li v-for="item in parseItems(order.items)" :key="item.id">
                        {{ item.name }} × {{ item.quantity }}
                    </li>
                </ul>
            </div>

            <button v-if="order.status !== 'entregado'" @click="markDelivered(order.id)"
                class="mt-3 bg-black text-white px-3 py-1">
                Marcar como entregado
            </button>
        </div>
    </div>
</template>
