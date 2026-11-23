import { createApp } from 'vue'
import '@tabler/core/dist/css/tabler.min.css'
import '@tabler/icons-webfont/dist/tabler-icons.min.css'
import './style.css'
import App from './App.vue'
import { iniciarEncabezado } from './header-scroll.js'

// Sigue el modo claro/oscuro del sistema y se actualiza si cambia mientras la página está abierta.
const modoOscuro = window.matchMedia('(prefers-color-scheme: dark)')
function aplicarTema() {
  document.documentElement.setAttribute('data-bs-theme', modoOscuro.matches ? 'dark' : 'light')
}
aplicarTema()
modoOscuro.addEventListener('change', aplicarTema)

createApp(App).mount('#app')
iniciarEncabezado()
