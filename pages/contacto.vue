<template>
    <section id="contacto" class="contact--container">

        <h4 class="contact-title">Ubicación:</h4>
        <template>
            <div class="mapa">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3272.128764138255!2d-56.15852401722773!3d-34.90321800283989!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x959f810605d913bb%3A0xfde4897c75c5c10!2sAv.Gral%20Rivera%202836%2C%2011300%20Montevideo%2C%20Departamento%20de%20Montevideo!5e0!3m2!1ses!2suy!4v1771435483956!5m2!1ses!2suy"
                    width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
        </template>

        <h4 class="contact-title">Contacto:</h4>
        <div class="social-contacts">
            <a href="tel:+59894409181" target="_blank" class="social-icon" v-html="icons.phone"></a>
            <a href="https://www.facebook.com/p/El-Club-de-los-Peludos-100054961003573/?locale=es_LA" target="_blank"
                class="social-icon" v-html="icons.facebook"></a>
            <a href="https://wa.me/59899423916?text=Hola,%20quiero%20información%20sobre%20sus%20servicios"
                target="_blank" class="social-icon" v-html="icons.whatsapp"></a>
            <a href="mailto:contacto@entrenate.com.uy?subject=Consulta" target="_blank" class="social-icon"
                v-html="icons.mail"></a>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {
            title: 'Contactanos',
            isMobile: false,
            icons: {
                instagram: `
<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>`,
                facebook: `
    <svg xmlns="http://www.w3.org/2000/svg" 
     width="26" 
     height="26" 
     fill="none" 
     stroke="currentColor" 
     stroke-width="2"
     stroke-linecap="round" 
     stroke-linejoin="round" 
     viewBox="0 0 24 24">
  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
</svg>`,

                whatsapp: `
<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 3a9 9 0 0 0-9 9c0 1.9.6 3.6 1.7 5L3 21l4-1.7c1.4 1 3.1 1.7 5 1.7a9 9 0 1 0 0-18z"/>
      <path d="M16.2 14.7l-.9-1c-.3-.4-.8-.4-1.2 0l-.6.6c-.3.3-.8.4-1.2.2-1.3-.6-2.3-1.6-2.9-2.9-.2-.4-.1-.9.2-1.2l.6-.6c.4-.4.4-.9 0-1.2l-1-.9c-.4-.4-.9-.4-1.3 0l-.5.5c-.8.8-1.1 2-0.7 3.1 1 2.6 3.1 4.7 5.7 5.7 1.1.4 2.3.1 3.1-.7l.5-.5c.4-.4.4-.9 0-1.3z"/>
    </svg>`,

                phone: `
<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2
        19.8 19.8 0 0 1-8.6-3.1
        19.5 19.5 0 0 1-6-6
        19.8 19.8 0 0 1-3.1-8.7
        A2 2 0 0 1 4.1 2h3
        a2 2 0 0 1 2 1.7
        c.1.9.3 1.8.6 2.6
        a2 2 0 0 1-.5 2.1L8.1 9.5
        a16 16 0 0 0 6 6
        l1.1-1.1
        a2 2 0 0 1 2.1-.5
        c.8.3 1.7.5 2.6.6
        a2 2 0 0 1 1.7 2z"/>
    </svg>`,

                mail: `
<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" ry="2"/>
      <path d="M22 6l-10 7L2 6"/>
    </svg>`
            }
        }
    },
}
</script>