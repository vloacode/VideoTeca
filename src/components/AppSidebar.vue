<script setup>
import { ref } from 'vue'
import videos from '../data/videos.json'

defineProps({
  categorias: { type: Array, required: true },
  activa: { type: String, required: true },
  plataformaActiva: { type: String, default: 'todas' },
  total: { type: Number, required: true },
})
defineEmits(['seleccionar', 'seleccionarPlataforma'])

// URL para editar la lista de videos directamente en GitHub.
const URL_EDITAR = 'https://github.com/vloacode/VideoTeca/edit/main/src/data/videos.json'

const ICONOS_PLATAFORMA = {
  Instagram: 'ti-brand-instagram',
  YouTube: 'ti-brand-youtube',
  TikTok: 'ti-brand-tiktok',
  Facebook: 'ti-brand-facebook',
}

const plataformas = [...new Set(videos.map((v) => v.plataforma))].map((p) => ({
  nombre: p,
  icono: ICONOS_PLATAFORMA[p] || 'ti-world',
  n: videos.filter((v) => v.plataforma === p).length,
}))

const abiertoCategorias = ref(true)
const abiertoPlataformas = ref(true)
</script>

<template>
  <aside class="vt-side-l" aria-label="Navegación de la videoteca">
    <div class="vt-brand">
      <span class="vt-brand-mark"><i class="ti ti-player-play" aria-hidden="true"></i></span>
      <span>Videoteca</span>
    </div>

    <nav class="vt-side-nav" aria-label="Secciones">
      <button
        class="vt-nav-item"
        :class="{ 'is-on': activa === 'todos' && plataformaActiva === 'todas' }"
        type="button"
        @click="$emit('seleccionar', 'todos')"
      >
        <i class="ti ti-layout-grid" aria-hidden="true"></i><span>Todos</span><small>{{ total }}</small>
      </button>
      <a class="vt-nav-item" href="#pipeline"><i class="ti ti-list-check" aria-hidden="true"></i><span>Pipeline</span></a>
      <a class="vt-nav-item" href="#como-crece"><i class="ti ti-route" aria-hidden="true"></i><span>Cómo crece</span></a>
    </nav>

    <div class="vt-tree">
      <button class="vt-tree-head" type="button" :aria-expanded="abiertoCategorias" @click="abiertoCategorias = !abiertoCategorias">
        <i class="ti ti-chevron-down vt-chev" :class="{ 'is-closed': !abiertoCategorias }" aria-hidden="true"></i>Categorías
      </button>
      <ul v-show="abiertoCategorias" class="vt-tree-list">
        <li v-for="c in categorias" :key="c.id">
          <button
            class="vt-tree-item"
            :class="{ 'is-on': activa === c.id }"
            type="button"
            :aria-pressed="activa === c.id ? 'true' : 'false'"
            @click="$emit('seleccionar', c.id)"
          >
            <span class="vt-tree-dot" :style="{ background: c.color }" aria-hidden="true"></span>
            <span class="vt-tree-name">{{ c.nombre }}</span>
            <small>{{ c.n }}</small>
          </button>
        </li>
      </ul>
    </div>

    <div class="vt-tree">
      <button class="vt-tree-head" type="button" :aria-expanded="abiertoPlataformas" @click="abiertoPlataformas = !abiertoPlataformas">
        <i class="ti ti-chevron-down vt-chev" :class="{ 'is-closed': !abiertoPlataformas }" aria-hidden="true"></i>Plataformas
      </button>
      <ul v-show="abiertoPlataformas" class="vt-tree-list">
        <li v-for="p in plataformas" :key="p.nombre">
          <button
            class="vt-tree-item"
            :class="{ 'is-on': plataformaActiva === p.nombre }"
            type="button"
            :aria-pressed="plataformaActiva === p.nombre ? 'true' : 'false'"
            @click="$emit('seleccionarPlataforma', p.nombre)"
          >
            <i class="ti vt-tree-ico" :class="p.icono" aria-hidden="true"></i>
            <span class="vt-tree-name">{{ p.nombre }}</span>
            <small>{{ p.n }}</small>
          </button>
        </li>
      </ul>
    </div>

    <a class="vt-btn-dark vt-side-add" :href="URL_EDITAR" target="_blank" rel="noopener">
      <i class="ti ti-plus" aria-hidden="true"></i>Agregar video
    </a>
  </aside>
</template>
