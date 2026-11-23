<script setup>
import { computed, ref } from 'vue'
import categorias from './data/categories.json'
import estados from './data/estados.json'
import videos from './data/videos.json'
import AppRail from './components/AppRail.vue'
import CategoriaCard from './components/CategoriaCard.vue'
import PipelineCard from './components/PipelineCard.vue'
import { formatearFecha, normalizar } from './utils.js'

// Enlace para editar la lista de videos directamente en GitHub.
const URL_EDITAR = 'https://github.com/vloacode/VideoTeca/edit/main/src/data/videos.json'

const categoriaActiva = ref('todos')
const busqueda = ref('')

const catById = Object.fromEntries(categorias.map((c) => [c.id, c]))
const total = videos.length
const fechaActualizacion = formatearFecha(videos.map((v) => v.guardado).sort().at(-1))

const termino = computed(() => normalizar(busqueda.value.trim()))

// Conteos calculados desde los datos: se actualizan solos al agregar videos.
const conteo = computed(() => {
  const m = { todos: total }
  for (const c of categorias) m[c.id] = videos.filter((v) => v.categoria === c.id).length
  return m
})

const categoriasConDatos = computed(() =>
  categorias.map((c) => ({
    ...c,
    n: conteo.value[c.id],
    pct: total ? Math.round((conteo.value[c.id] / total) * 100) : 0,
  })),
)

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

// Columnas del pipeline: cada video cae en el estado que tiene en videos.json.
const columnas = computed(() =>
  estados.map((e) => ({
    ...e,
    items: filtrados.value.filter((v) => v.estado === e.id),
  })),
)

const publicados = computed(() => videos.filter((v) => v.estado === 'publicado').length)
const pendientes = total - publicados.value

// Tocar la misma categoría otra vez quita el filtro.
function setCat(id) {
  categoriaActiva.value = categoriaActiva.value === id ? 'todos' : id
}
</script>

<template>
  <div class="vt-app">
    <div class="vt-window">
      <div class="vt-body">
        <AppRail />

        <main id="inicio" class="vt-content">
          <header class="vt-head">
            <div>
              <p class="vt-kicker">Videoteca de Wil · {{ categorias.length }} categorías · actualizada el {{ fechaActualizacion }}</p>
              <h1 class="vt-title">Tu videoteca</h1>
            </div>
            <div class="vt-head-actions">
              <form class="vt-search" role="search" @submit.prevent>
                <i class="ti ti-search" aria-hidden="true"></i>
                <input
                  v-model="busqueda"
                  type="search"
                  placeholder="Busca por título, autor o tema…"
                  aria-label="Buscar en la videoteca"
                />
              </form>
              <a class="vt-btn-dark" :href="URL_EDITAR" target="_blank" rel="noopener">
                <i class="ti ti-plus" aria-hidden="true"></i>Agregar video
              </a>
            </div>
          </header>

          <section id="categorias" class="vt-agents" aria-label="Categorías">
            <CategoriaCard
              v-for="c in categoriasConDatos"
              :key="c.id"
              :categoria="c"
              :activa="categoriaActiva === c.id"
              @seleccionar="setCat"
            />
          </section>

          <section id="pipeline" class="vt-board" aria-labelledby="pipeline-title">
            <div class="vt-board-head">
              <div>
                <h2 id="pipeline-title" class="vt-board-title">Pipeline de videos</h2>
                <p class="vt-board-sub">
                  {{ total }} {{ total === 1 ? 'video' : 'videos' }} · {{ publicados }} publicados · {{ pendientes }} pendientes
                </p>
              </div>
              <div class="vt-board-actions">
                <select v-model="categoriaActiva" class="vt-select" aria-label="Filtrar por categoría">
                  <option value="todos">Todas las categorías</option>
                  <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nombre }}</option>
                </select>
              </div>
            </div>

            <p class="vt-result-line" aria-live="polite">
              Mostrando <b>{{ filtrados.length }} de {{ total }}</b>
              <template v-if="termino"> para “{{ busqueda.trim() }}”</template>
            </p>

            <div class="vt-columns">
              <div v-for="col in columnas" :key="col.id" class="vt-col">
                <div class="vt-col-head">
                  <span class="vt-dot" :style="{ background: col.color }" aria-hidden="true"></span>
                  <b>{{ col.nombre }}</b>
                  <span class="vt-col-count">{{ col.items.length }}</span>
                </div>

                <PipelineCard
                  v-for="v in col.items"
                  :key="v.url"
                  :video="v"
                  :categoria="catById[v.categoria]"
                />

                <p v-if="col.items.length === 0" class="vt-col-empty">{{ col.vacio }}</p>
              </div>
            </div>
          </section>

          <section id="como-crece" class="vt-section" aria-labelledby="how-title">
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
              <span><b>Videoteca de Wil</b> · Hecha con <a href="https://github.com/tabler/tabler" target="_blank" rel="noopener">Tabler</a> y <a href="https://vuejs.org" target="_blank" rel="noopener">Vue</a></span>
              <span>{{ total }} {{ total === 1 ? 'video' : 'videos' }} · Última actualización: {{ fechaActualizacion }} · Publicada en Cloudflare Pages</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  </div>
</template>
