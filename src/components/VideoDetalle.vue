<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import ParticleCover from './ParticleCover.vue'
import { formatearFecha } from '../utils.js'

// info: { video, categoria, estado } o null cuando la vista está cerrada.
const props = defineProps({
  info: { type: Object, default: null },
})
const emit = defineEmits(['cerrar'])

const dlg = ref(null)
const textoCopia = ref('Copiar enlace')

const video = computed(() => props.info?.video ?? null)
const inicial = computed(() => (video.value?.autor || '?').trim().charAt(0).toUpperCase())
const fecha = computed(() => formatearFecha(video.value?.guardado))

watch(
  () => props.info,
  async (nuevo) => {
    textoCopia.value = 'Copiar enlace'
    await nextTick()
    if (!dlg.value) return
    if (nuevo && !dlg.value.open) dlg.value.showModal()
    if (!nuevo && dlg.value.open) dlg.value.close()
  },
)

// Cerrar al tocar el fondo oscuro (el propio <dialog> es el fondo).
function alTocarFondo(evento) {
  if (evento.target === dlg.value) dlg.value.close()
}

async function copiar() {
  try {
    await navigator.clipboard.writeText(video.value.url)
    textoCopia.value = '¡Enlace copiado!'
  } catch {
    textoCopia.value = 'No se pudo copiar'
  }
}
</script>

<template>
  <dialog
    ref="dlg"
    class="vt-dialog"
    aria-labelledby="det-titulo"
    @close="emit('cerrar')"
    @click="alTocarFondo"
  >
    <div v-if="video" class="vt-dialog-inner">
      <div class="vt-cover vt-dialog-cover">
        <ParticleCover />
        <span class="vt-plat">
          <i class="ti ti-player-play" aria-hidden="true"></i>{{ video.plataforma }}<template v-if="video.formato"> · {{ video.formato }}</template>
        </span>
        <span v-if="video.portada" class="vt-cover-caption">{{ video.portada }}</span>
      </div>

      <div class="vt-dialog-body">
        <div class="vt-dialog-top">
          <div class="vt-dialog-tags">
            <span v-if="info.categoria" class="vt-cat-tag">
              <i class="ti" :class="info.categoria.icono" :style="{ color: info.categoria.color }" aria-hidden="true"></i>
              {{ info.categoria.nombre }}
            </span>
            <span v-if="info.estado" class="vt-pill pill-ok">
              <span class="vt-pill-dot" aria-hidden="true"></span>{{ info.estado.nombre }}
            </span>
          </div>
          <button class="vt-icon-btn" type="button" aria-label="Cerrar" @click="dlg.close()">
            <i class="ti ti-x" aria-hidden="true"></i>
          </button>
        </div>

        <h2 id="det-titulo" class="vt-dialog-title">{{ video.titulo }}</h2>

        <div class="vt-author">
          <span class="vt-avatar" aria-hidden="true">{{ inicial }}</span>
          <span>{{ video.autor }} · {{ video.usuario }}</span>
        </div>

        <h3 class="vt-dialog-h">Descripción</h3>
        <p class="vt-dialog-desc">{{ video.descripcion }}</p>

        <template v-if="video.herramientas?.length">
          <h3 class="vt-dialog-h">Herramientas y temas</h3>
          <ul class="vt-tech">
            <li v-for="h in video.herramientas" :key="h">{{ h }}</li>
          </ul>
        </template>

        <dl class="vt-dl">
          <div><dt>Plataforma</dt><dd>{{ video.plataforma }}</dd></div>
          <div v-if="video.formato"><dt>Formato</dt><dd>{{ video.formato }}</dd></div>
          <div><dt>Guardado el</dt><dd>{{ fecha }}</dd></div>
        </dl>

        <div class="vt-dialog-actions">
          <a class="vt-btn vt-btn-accent" :href="video.url" target="_blank" rel="noopener">
            Ver en {{ video.plataforma }} <i class="ti ti-external-link" aria-hidden="true"></i>
          </a>
          <button class="vt-btn vt-btn-line" type="button" @click="copiar">
            <i class="ti ti-copy" aria-hidden="true"></i><span aria-live="polite">{{ textoCopia }}</span>
          </button>
        </div>
      </div>
    </div>
  </dialog>
</template>
