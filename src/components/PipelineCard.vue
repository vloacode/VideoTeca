<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
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
const fecha = computed(() => formatearFecha(props.video.guardado))

// Copiar el enlace: muestra si la copia funcionó.
const estadoCopia = ref('')
let temporizador = null

async function copiar() {
  try {
    await navigator.clipboard.writeText(props.video.url)
    estadoCopia.value = 'Enlace copiado'
  } catch {
    estadoCopia.value = 'No se pudo copiar'
  }
  clearTimeout(temporizador)
  temporizador = setTimeout(() => (estadoCopia.value = ''), 2200)
}

onBeforeUnmount(() => clearTimeout(temporizador))
</script>

<template>
  <article class="vt-task">
    <div class="vt-task-top">
      <span v-if="categoria" class="vt-task-cat">
        <i class="ti" :class="categoria.icono" :style="{ color: categoria.color }" aria-hidden="true"></i>
        {{ categoria.nombre }}
      </span>
      <span class="vt-task-plat">
        <i class="ti" :class="iconoPlataforma" aria-hidden="true"></i>{{ video.plataforma }}
      </span>
    </div>

    <h3 class="vt-task-title">{{ video.titulo }}</h3>

    <div class="vt-task-meta">
      <span class="vt-mini-avatar" aria-hidden="true">{{ inicial }}</span>
      <span>{{ video.autor }}</span>
      <span class="vt-task-right">{{ video.usuario }}</span>
    </div>

    <div class="vt-task-foot">
      <a class="vt-task-link" :href="video.url" target="_blank" rel="noopener" :aria-label="`Ver ${video.titulo} en ${video.plataforma}`">
        Ver video <i class="ti ti-external-link" aria-hidden="true"></i>
      </a>
      <span class="vt-task-status" aria-live="polite">{{ estadoCopia }}</span>
      <button class="vt-icon-btn" type="button" aria-label="Copiar enlace" title="Copiar enlace" @click="copiar">
        <i class="ti ti-copy" aria-hidden="true"></i>
      </button>
    </div>
  </article>
</template>
