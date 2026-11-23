<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import ParticleCover from './ParticleCover.vue'
import { formatearFecha } from '../utils.js'

const props = defineProps({
  video: { type: Object, required: true },
  categoria: { type: Object, default: null },
})

const ICONOS_PLATAFORMA = {
  Instagram: 'ti-brand-instagram',
  YouTube: 'ti-brand-youtube',
  TikTok: 'ti-brand-tiktok',
  Facebook: 'ti-brand-facebook',
}

const iconoPlataforma = computed(() => ICONOS_PLATAFORMA[props.video.plataforma] || 'ti-world')
const inicial = computed(() => (props.video.autor || '?').trim().charAt(0).toUpperCase())
const etiquetaPlataforma = computed(() =>
  props.video.formato ? `${props.video.plataforma} · ${props.video.formato}` : props.video.plataforma,
)
const fecha = computed(() => formatearFecha(props.video.guardado))

// Botón "Copiar enlace": cada tarjeta tiene el suyo y muestra si la copia funcionó.
const textoCopia = ref('Copiar enlace')
let temporizador = null

function mostrar(texto) {
  textoCopia.value = texto
  clearTimeout(temporizador)
  temporizador = setTimeout(() => (textoCopia.value = 'Copiar enlace'), 2200)
}

async function copiar() {
  try {
    await navigator.clipboard.writeText(props.video.url)
    mostrar('¡Enlace copiado!')
  } catch {
    mostrar('No se pudo copiar')
  }
}

onBeforeUnmount(() => clearTimeout(temporizador))
</script>

<template>
  <article class="vt-video-card">
    <div class="vt-cover">
      <ParticleCover />
      <span class="vt-plat">
        <i class="ti" :class="iconoPlataforma" aria-hidden="true"></i>{{ etiquetaPlataforma }}
      </span>
      <a
        class="vt-play"
        :href="video.url"
        target="_blank"
        rel="noopener"
        :aria-label="`Ver el video de ${video.titulo} en ${video.plataforma}`"
      >
        <span><i class="ti ti-player-play" aria-hidden="true"></i></span>
      </a>
      <span v-if="video.portada" class="vt-cover-caption">{{ video.portada }}</span>
    </div>

    <div class="vt-card-body">
      <span v-if="categoria" class="vt-cat-tag">
        <i class="ti" :class="categoria.icono" aria-hidden="true"></i>{{ categoria.nombre }}
      </span>
      <h2 class="vt-video-title">{{ video.titulo }}</h2>
      <div class="vt-author">
        <span class="vt-avatar" aria-hidden="true">{{ inicial }}</span>
        <span>{{ video.autor }} · {{ video.usuario }}</span>
      </div>
      <p class="vt-card-desc">{{ video.descripcion }}</p>
      <ul v-if="video.herramientas?.length" class="vt-tech">
        <li v-for="h in video.herramientas" :key="h">{{ h }}</li>
      </ul>
      <div class="vt-card-actions">
        <a class="vt-btn vt-btn-accent" :href="video.url" target="_blank" rel="noopener">
          Ver en {{ video.plataforma }} <i class="ti ti-external-link" aria-hidden="true"></i>
        </a>
        <button class="vt-btn vt-btn-line" type="button" @click="copiar">
          <i class="ti ti-copy" aria-hidden="true"></i><span>{{ textoCopia }}</span>
        </button>
      </div>
      <span class="vt-saved">
        <i class="ti ti-bookmark" aria-hidden="true"></i>Guardado el {{ fecha }}
      </span>
    </div>
  </article>
</template>
