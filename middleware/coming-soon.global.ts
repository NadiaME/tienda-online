export default defineNuxtRouteMiddleware((to) => {
    // 👉 permitir localhost
    if (process.dev) return

    // 👉 permitir vista previa manual
    if (to.query.preview === 'true') return

    // 👉 evitar loop
    if (to.path === '/coming-soon') return

    return navigateTo('/coming-soon')
})