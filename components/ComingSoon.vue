<script setup>
definePageMeta({
    layout: false
})

const phone = "598XXXXXXXX"

const message = encodeURIComponent(
    "Hola! Vi tu página y quiero info sobre un sitio web o tienda online 👀"
)

const whatsappLink = `https://wa.me/${phone}?text=${message}`

const year = new Date().getFullYear()
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white px-6 relative overflow-hidden">

        <!-- Glow dorado -->
        <div
            class="absolute w-[500px] h-[500px] bg-[#C6A85A]/20 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
        <div
            class="absolute w-[400px] h-[400px] bg-[#8C6A2F]/20 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

        <!-- Textura sutil -->
        <div
            class="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:40px_40px]" />

        <div class="text-center max-w-xl z-10">

            <!-- Marca -->
            <h1 class="text-4xl md:text-6xl font-semibold mb-4 tracking-tight text-white">
                Guidai Bilu
            </h1>

            <!-- Tagline -->
            <p class="text-lg md:text-xl text-gray-200 mb-6">
                Diseño web con estética, estrategia y propósito
            </p>

            <!-- Mensaje -->
            <p class="text-sm md:text-base text-gray-300 mb-10 leading-relaxed">
                Creamos sitios y tiendas online pensadas para destacar, conectar y vender.
                Si tu marca merece más, estás en el lugar correcto.
            </p>

            <!-- Botones -->
            <div class="flex flex-col md:flex-row gap-4 justify-center">

                <!-- Botón dorado premium -->
                <a :href="whatsappLink" target="_blank"
                    class="group relative px-7 py-3 rounded-xl font-medium overflow-hidden transition">
                    <span class="relative z-10 text-black tracking-wide">
                        Quiero mi web
                    </span>

                    <!-- Base dorada elegante -->
                    <div class="absolute inset-0 bg-gradient-to-r from-[#8C6A2F] via-[#C6A85A] to-[#B8963D]" />

                    <!-- Shimmer -->
                    <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                        <div class="absolute top-0 left-[-75%] w-[50%] h-full bg-white/30 blur-md rotate-12 shimmer" />
                    </div>
                </a>

                <!-- Botón secundario -->
                <a href="#"
                    class="px-6 py-3 rounded-xl border border-[#C6A85A]/40 text-[#C6A85A] hover:bg-[#C6A85A] hover:text-black transition">
                    Ver avances
                </a>

            </div>

            <!-- Urgencia -->
            <p class="text-xs text-gray-500 mt-6">
                Cupos limitados para nuevos proyectos este mes
            </p>

            <!-- Firma -->
            <p class="text-xs text-[#C6A85A]/70 mt-6 tracking-widest uppercase">
                Diseño & Desarrollo Web Boutique
            </p>

            <!-- Footer -->
            <p class="text-xs text-gray-600 mt-8">
                © {{ year }} Guidai Bilu Company
            </p>

        </div>
    </div>
</template>

<style>
@keyframes shimmer {
    0% {
        left: -75%;
    }

    100% {
        left: 125%;
    }
}

.shimmer {
    animation: shimmer 1.5s ease-in-out;
}
</style>