<script setup>
const cartStore = useCartStore()

onMounted(() => {
    cartStore.init()
})
</script>

<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>
