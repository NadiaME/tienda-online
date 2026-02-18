<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { clientConfig } from '@/data/client.config'

// state
const isScrolled = ref(false)
const menuOpen = ref(false)

// function
const handleScroll = () => {
    isScrolled.value = window.scrollY > 100
}

// menu helpers
const toggleMenu = () => {
    menuOpen.value = !menuOpen.value
}

const closeMenu = () => {
    menuOpen.value = false
}

// lifecycle (CLIENT ONLY)
onMounted(() => {
    window.addEventListener('scroll', handleScroll)
    cart.init();
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})

// store
const cart = useCartStore()
</script>

<template>
    <header :class="[
        { animated: isScrolled },
        clientConfig.primaryColor,
        clientConfig.textColor
    ]" class="header-store">
        <div class="flex items-center gap-3">
            <NuxtLink to="/">
                <img :src="clientConfig.logo" alt="Logo" class="h-10" />
            </NuxtLink>
            <span class="font-bold text-xl">
                {{ clientConfig.storeName }}
            </span>
        </div>
        <ul class="navbar--right nav-titles" :class="{ active: menuOpen }">
            <li>
                <NuxtLink to="/quienessomos" @click="closeMenu">Quienes somos</NuxtLink>
            </li>
            <li>
                <NuxtLink to="/contacto" @click="closeMenu">Contacto</NuxtLink>
            </li>
        </ul>

        <button @click="cart.toggle" class="bg-white text-black px-4 py-2 rounded-lg">
            🛒 ({{ cart.totalItems }})
        </button>
    </header>
</template>
