<script setup>
defineProps({
    type: String
})
</script>

<template>
    <div class="p-6 border border-red-300 bg-red-50 text-red-600 rounded">
        Sección "{{ type }}" no encontrada
    </div>
</template>