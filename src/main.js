import { createApp } from 'vue'
import '@tabler/core/dist/css/tabler.min.css'
import '@tabler/icons-webfont/dist/tabler-icons.min.css'
import './style.css'
import App from './App.vue'
import { iniciarTemaScroll } from './theme-scroll.js'

createApp(App).mount('#app')

// El tema cambia de claro a negro según el scroll (ver theme-scroll.js).
iniciarTemaScroll()
