<script setup>
import { computed, ref } from 'vue'
import categorias from './data/categories.json'
import videos from './data/videos.json'
import VideoCard from './components/VideoCard.vue'
import { formatearFecha, normalizar } from './utils.js'

const categoriaActiva = ref('todos')
const busqueda = ref('')
const gridRef = ref(null)

const catById = Object.fromEntries(categorias.map((c) => [c.id, c]))
const opcionesFiltro = [{ id: 'todos', nombre: 'Todos', icono: 'ti-layout-grid' }, ...categorias]
const plataformas = [...new Set(videos.map((v) => v.plataforma))]
const fechaActualizacion = formatearFecha(videos.map((v) => v.guardado).sort().at(-1))

const termino = computed(() => normalizar(busqueda.value.trim()))
const catActiva = computed(() => (categoriaActiva.value === 'todos' ? null : catById[categoriaActiva.value]))

// Contadores calculados a partir de los datos: nunca quedan desactualizados.
const conteo = computed(() => {
  const m = { todos: videos.length }
  for (const c of categorias) m[c.id] = videos.filter((v) => v.categoria === c.id).length
  return m
})

const filtrados = computed(() =>
  videos.filter((v) => {
    if (categoriaActiva.value !== 'todos' && v.categoria !== categoriaActiva.value) return false
    if (!termino.value) return true
    const texto = normalizar(
      [v.titulo, v.autor, v.usuario, v.descripcion, v.plataforma, catById[v.categoria]?.nombre, ...(v.herramientas || [])].join(' '),
    )
    return texto.includes(termino.value)
  }),
)

const tituloVacio = computed(() => {
  if (termino.value) return 'Sin resultados para esa búsqueda'
  if (catActiva.value) return `Todavía no hay videos en ${catActiva.value.nombre}`
  return 'Todavía no hay videos aquí'
})

const textoVacio = computed(() =>
  termino.value
    ? 'Prueba con otra palabra — el título, el autor o la herramienta que usa el video, como “After Effects”.'
    : 'Pásale el link a Muse por el chat y lo clasifica, le pone su descripción y aparece en esta categoría en la próxima publicación.',
)

function setCat(id, irAlGrid = false) {
  categoriaActiva.value = id
  if (irAlGrid) gridRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function textoConteo(n) {
  if (n === 0) return '0 videos'
  return `${n} ${n === 1 ? 'video' : 'videos'} →`
}
</script>

<template>
  <div class="vt-wrap">
    <!-- HERO -->
    <header class="vt-hero">
      <span class="vt-hero-label">
        <span class="vt-dot"></span> COLECCIÓN PERSONAL · ACTUALIZADA EL {{ fechaActualizacion.toUpperCase() }}
      </span>
      <h1 class="vt-display">Tus videos, <em>clasificados</em> y listos para ver.</h1>
      <p class="vt-hero-sub">
        Wil guarda links de todas partes y terminan perdidos entre chats. Aquí no: cada video vive en su categoría —
        <strong>AI, comidas, restaurantes, edición de imágenes, fotografía, ebanistería</strong> — con una descripción
        breve de qué trata, para encontrarlo en segundos.
      </p>
      <div class="vt-stats" aria-label="Resumen de la colección">
        <div class="vt-stat">
          <b>{{ videos.length }}</b><span>{{ videos.length === 1 ? 'video guardado' : 'videos guardados' }}</span>
        </div>
        <div class="vt-stat"><b>{{ categorias.length }}</b><span>categorías listas</span></div>
        <div class="vt-stat">
          <b>{{ plataformas.length }}</b>
          <span>{{ plataformas.length === 1 ? 'plataforma' : 'plataformas' }}: {{ plataformas.join(', ') }}</span>
        </div>
        <div class="vt-stat"><b>$0</b><span>publicarla en Cloudflare Pages</span></div>
      </div>
    </header>

    <!-- BUSCADOR + FILTROS -->
    <div class="vt-toolbar">
      <form class="vt-search" role="search" @submit.prevent>
        <i class="ti ti-search" aria-hidden="true"></i>
        <input
          v-model="busqueda"
          type="search"
          placeholder="Busca por título, autor o tema… ej. After Effects"
          aria-label="Buscar en la videoteca"
        />
        <button type="submit" class="btn btn-primary">Buscar</button>
      </form>
      <div class="vt-chips" role="group" aria-label="Filtrar por categoría">
        <button
          v-for="c in opcionesFiltro"
          :key="c.id"
          class="vt-chip"
          type="button"
          :aria-pressed="categoriaActiva === c.id ? 'true' : 'false'"
          @click="setCat(c.id)"
        >
          <i class="ti" :class="c.icono" aria-hidden="true"></i>{{ c.nombre }} <small>{{ conteo[c.id] }}</small>
        </button>
      </div>
      <p class="vt-result-line" aria-live="polite">
        Mostrando <b>{{ filtrados.length }} de {{ videos.length }}</b>
        {{ videos.length === 1 ? 'video' : 'videos' }}
        <template v-if="catActiva"> en <b>{{ catActiva.nombre }}</b></template>
        <template v-if="termino"> para “{{ busqueda.trim() }}”</template>
      </p>
    </div>

    <!-- LISTA DE VIDEOS -->
    <main id="grid" ref="gridRef" class="vt-grid">
      <VideoCard
        v-for="v in filtrados"
        :key="v.url"
        :video="v"
        :categoria="catById[v.categoria]"
      />
      <div v-if="filtrados.length === 0" class="vt-empty" role="status">
        <i class="ti ti-video-off" aria-hidden="true"></i>
        <h3>{{ tituloVacio }}</h3>
        <p>{{ textoVacio }}</p>
      </div>
    </main>

    <!-- CATEGORÍAS -->
    <section class="vt-section" aria-labelledby="cats-title">
      <div class="vt-sec-head">
        <h2 class="vt-sec-title" id="cats-title">Las categorías</h2>
        <p>Toca una categoría para filtrar la colección. Las que están en cero están listas — solo falta que lleguen los links.</p>
      </div>
      <div class="vt-cats">
        <button
          v-for="c in categorias"
          :key="c.id"
          class="vt-cat"
          type="button"
          @click="setCat(c.id, true)"
        >
          <span :class="['vt-ic', c.clase]"><i class="ti" :class="c.icono" aria-hidden="true"></i></span>
          <b>{{ c.nombre }}</b>
          <span class="vt-desc">{{ c.descripcion }}</span>
          <span class="vt-count" :class="{ 'vt-count-on': conteo[c.id] > 0 }">{{ textoConteo(conteo[c.id]) }}</span>
        </button>
      </div>
    </section>

    <!-- CÓMO CRECE -->
    <section class="vt-section" aria-labelledby="how-title">
      <div class="vt-sec-head">
        <h2 class="vt-sec-title" id="how-title">Así crece esta página</h2>
        <p>Tú no editas nada. Solo mandas links; la clasificación, la descripción y la publicación van por Muse.</p>
      </div>
      <div class="vt-two-col">
        <div class="vt-panel">
          <h3>El flujo, en 3 pasos</h3>
          <p>El mismo que ya usaste con el primer video:</p>
          <ol class="vt-steps">
            <li>
              <span class="n">1</span>
              <div><b>Tú pasas el link</b><span>De Instagram, YouTube, TikTok o Facebook — de uno en uno o varios juntos, por el chat.</span></div>
            </li>
            <li>
              <span class="n">2</span>
              <div><b>Muse lo ve y lo clasifica</b><span>Lo ubica en su categoría y escribe la descripción breve: de qué trata, quién lo hizo y qué herramientas usa.</span></div>
            </li>
            <li>
              <span class="n">3</span>
              <div><b>Se publica aquí</b><span>La página se actualiza con la tarjeta nueva y queda accesible desde cualquier teléfono o computadora.</span></div>
            </li>
          </ol>
        </div>
        <div class="vt-panel vt-panel-dark">
          <span class="vt-price-tag"><i class="ti ti-world" aria-hidden="true"></i>Próximamente · Público</span>
          <h3>Próximamente será pública para todos</h3>
          <p>Muy pronto esta videoteca se estará poniendo <strong>pública</strong>, para que cualquier persona pueda conocerla y hacer su propia página igual que esta.</p>
          <p style="margin: 18px 0 0">La idea es que cada quien pueda guardar sus videos, clasificarlos por tema y tener su colección lista para ver cuando quiera — como la tuya.</p>
        </div>
      </div>
    </section>

    <footer class="vt-footer">
      <div class="vt-foot">
        <span><b>Videoteca de Wil</b> · Página hecha con <a href="https://github.com/tabler/tabler" target="_blank" rel="noopener">Tabler</a> y <a href="https://vuejs.org" target="_blank" rel="noopener">Vue</a></span>
        <span>{{ videos.length }} {{ videos.length === 1 ? 'video' : 'videos' }} · Última actualización: {{ fechaActualizacion }} · Publicada en Cloudflare Pages</span>
      </div>
    </footer>
  </div>
</template>
