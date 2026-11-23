<script setup>
import { computed, ref } from 'vue'
import categorias from './data/categories.json'
import estados from './data/estados.json'
import videos from './data/videos.json'
import AppSidebar from './components/AppSidebar.vue'
import Carrusel from './components/Carrusel.vue'
import CalendarPanel from './components/CalendarPanel.vue'
import PipelineCard from './components/PipelineCard.vue'
import VideoDetalle from './components/VideoDetalle.vue'
import { formatearFecha, normalizar } from './utils.js'

const categoriaActiva = ref('todos')
const busqueda = ref('')
const detalle = ref(null)

const catById = Object.fromEntries(categorias.map((c) => [c.id, c]))
const total = videos.length
const fechaActualizacion = formatearFecha(videos.map((v) => v.guardado).sort().at(-1))
const termino = computed(() => normalizar(busqueda.value.trim()))
const catActiva = computed(() => (categoriaActiva.value === 'todos' ? null : catById[categoriaActiva.value]))

// Conteos calculados desde los datos: se actualizan solos al agregar videos.
const conteo = computed(() => {
  const m = { todos: total }
  for (const c of categorias) m[c.id] = videos.filter((v) => v.categoria === c.id).length
  return m
})
const categoriasConDatos = computed(() => categorias.map((c) => ({ ...c, n: conteo.value[c.id] })))

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

// Grupos del pipeline: solo las categorías que tienen videos en la vista actual.
const columnas = computed(() =>
  categorias
    .map((c) => ({ ...c, items: filtrados.value.filter((v) => v.categoria === c.id) }))
    .filter((g) => g.items.length > 0),
)

const publicados = computed(() => videos.filter((v) => v.estado === 'publicado').length)
const pendientes = total - publicados.value
const porcentajePublicado = computed(() => (total ? Math.round((publicados.value / total) * 100) : 0))

const estadoDe = (v) => estados.find((e) => e.id === v.estado)

const mensajeVacio = computed(() => {
  if (filtrados.value.length > 0) return ''
  if (termino.value) {
    return 'Sin resultados para esa búsqueda. Prueba con el título, el autor o la herramienta que usa el video, como “After Effects”.'
  }
  if (catActiva.value) return `Todavía no hay videos en ${catActiva.value.nombre}.`
  return 'Todavía no hay videos aquí.'
})

// Datos para la vista de detalle.
const infoDetalle = computed(() => {
  if (!detalle.value) return null
  return {
    video: detalle.value,
    categoria: catById[detalle.value.categoria] ?? null,
    estado: estadoDe(detalle.value) ?? null,
  }
})

function abrirDetalle(video) {
  detalle.value = video
}

// Tocar la misma categoría otra vez quita el filtro.
function setCat(id) {
  categoriaActiva.value = categoriaActiva.value === id ? 'todos' : id
}
</script>

<template>
  <div class="vt-shell">
    <AppSidebar
      :categorias="categoriasConDatos"
      :activa="categoriaActiva"
      :total="total"
      @seleccionar="setCat"
    />

    <main class="vt-main">
      <div class="vt-topbar">
        <span class="vt-top-title" aria-hidden="true">Tu videoteca</span>
        <form class="vt-search" role="search" @submit.prevent>
          <i class="ti ti-search" aria-hidden="true"></i>
          <input
            v-model="busqueda"
            type="search"
            placeholder="Busca por título, autor o tema…"
            aria-label="Buscar en la videoteca"
          />
        </form>
        <select v-model="categoriaActiva" class="vt-select" aria-label="Filtrar por categoría">
          <option value="todos">Todas las categorías</option>
          <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nombre }}</option>
        </select>
        <span class="vt-me" aria-hidden="true">W</span>
      </div>

      <header class="vt-hero">
        <div class="vt-hero-text">
          <h1 class="vt-title">Tu videoteca</h1>
          <p class="vt-sub">
            {{ publicados }} {{ publicados === 1 ? 'video publicado' : 'videos publicados' }} de {{ total }} ·
            {{ pendientes }} {{ pendientes === 1 ? 'pendiente' : 'pendientes' }}
          </p>
          <div class="vt-progress vt-progress-big" aria-hidden="true">
            <span :style="{ width: porcentajePublicado + '%' }"></span>
          </div>
        </div>
      </header>

      <section id="categorias" class="vt-section" aria-labelledby="cats-title">
        <div class="vt-sec-head">
          <h2 id="cats-title" class="vt-sec-title">Categorías</h2>
        </div>
        <Carrusel label="Categorías">
          <button
            type="button"
            class="vt-catchip"
            :aria-pressed="categoriaActiva === 'todos' ? 'true' : 'false'"
            @click="setCat('todos')"
          >Todas <small>{{ total }}</small></button>
          <button
            v-for="c in categoriasConDatos"
            :key="c.id"
            type="button"
            class="vt-catchip"
            :aria-pressed="categoriaActiva === c.id ? 'true' : 'false'"
            @click="setCat(c.id)"
          >
            <span class="vt-tree-dot" :style="{ background: c.color }" aria-hidden="true"></span>
            {{ c.nombre }} <small>{{ c.n }}</small>
          </button>
        </Carrusel>
      </section>

      <section id="pipeline" class="vt-section" aria-labelledby="pipeline-title">
        <div class="vt-sec-head">
          <div>
            <h2 id="pipeline-title" class="vt-sec-title">Pipeline de videos</h2>
            <p class="vt-result-line" aria-live="polite">
              Mostrando <b>{{ filtrados.length }} de {{ total }}</b>
              {{ total === 1 ? 'video' : 'videos' }}
              <template v-if="catActiva"> en <b>{{ catActiva.nombre }}</b></template>
              <template v-if="termino"> para “{{ busqueda.trim() }}”</template>
            </p>
          </div>
        </div>
        <p v-if="mensajeVacio" class="vt-empty-banner" role="status">{{ mensajeVacio }}</p>

        <div class="vt-groups">
          <div v-for="col in columnas" :key="col.id" class="vt-group">
            <div class="vt-col-head">
              <span class="vt-dot" :style="{ background: col.color }" aria-hidden="true"></span>
              <b>{{ col.nombre }}</b>
              <span class="vt-col-count">{{ col.items.length }}</span>
            </div>
            <PipelineCard v-for="v in col.items" :key="v.url" :video="v" :categoria="catById[v.categoria]" :estado="estadoDe(v)" @abrir="abrirDetalle" />
          </div>
        </div>
      </section>

      <section id="como-crece" class="vt-section" aria-labelledby="how-title">
        <div class="vt-sec-head">
          <h2 class="vt-sec-title" id="how-title">Así crece esta página</h2>
          <p>Tú no editas nada. Solo mandas links; la clasificación, la descripción y la publicación van por Muse.</p>
        </div>
        <div>
          <ol class="vt-steps vt-flow">
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
      </section>

      <footer class="vt-footer">
        <div class="vt-foot">
          <span><b>Videoteca de Wil</b> · Hecha con <a href="https://github.com/tabler/tabler" target="_blank" rel="noopener">Tabler</a> y <a href="https://vuejs.org" target="_blank" rel="noopener">Vue</a></span>
          <span>{{ total }} {{ total === 1 ? 'video' : 'videos' }} · Última actualización: {{ fechaActualizacion }} · Publicada en Cloudflare Pages</span>
        </div>
      </footer>
    </main>

    <aside class="vt-side-r" aria-label="Calendario">
      <CalendarPanel />
    </aside>

    <VideoDetalle :info="infoDetalle" @cerrar="detalle = null" />
  </div>
</template>
