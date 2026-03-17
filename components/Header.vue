<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useWebsite } from '@/composables/useWebsite'
import { useMenus } from '@/composables/useMenus'

const { menus } = useMenus()

const { settings } = useWebsite()

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

defineProps({
    showCart: {
        type: Boolean,
        default: false
    }
})

// lifecycle (CLIENT ONLY)
onMounted(() => {
    window.addEventListener('scroll', handleScroll)
    cartStore.init()
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})

// store
const cartStore = useCartStore()

const bounce = ref(false)

watch(
    () => cartStore.totalItems,
    () => {
        bounce.value = true

        setTimeout(() => {
            bounce.value = false
        }, 300)
    }
)
</script>

<template>
    <header class="header-store" :class="[
        { animated: isScrolled }]" :style="{
            background: settings.colors?.primary ?? '#000000',
            color: settings.colors?.text ?? '#ffffff'
        }">
        <div class="flex items-center gap-3">
            <NuxtLink to="/">
                <img :src="settings.logo" alt="Logo" class="transition-all duration-300"
                    :class="isScrolled ? 'h-8' : 'h-10'" />
            </NuxtLink>
            <span class="font-bold text-xl">
                {{ settings.storeName }}
            </span>
        </div>
        <ul class="navbar--right nav-titles" :class="{ active: menuOpen }">
            <li v-for="menu in menus" :key="menu.id">
                <NuxtLink :to="menu.link" @click="closeMenu">
                    {{ menu.label }}
                </NuxtLink>
            </li>
        </ul>
        <button id="cart-button" @click="cartStore.toggle()" v-if="showCart"
            class="bg-white text-black px-4 py-2 rounded-lg transition-transform duration-300"
            :class="bounce ? 'scale-125 rotate-6' : 'scale-100'">
            🛒 {{ cartStore.totalItems }}
        </button>
    </header>
</template>
