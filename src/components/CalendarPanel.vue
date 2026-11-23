<script setup>
import { computed, ref } from 'vue'
import videos from '../data/videos.json'
import categorias from '../data/categories.json'
import { formatearFecha } from '../utils.js'

// Calendario por fecha de publicación (campo publicadoEl de videos.json).
const hoy = new Date()
const anio = ref(hoy.getFullYear())
const mes = ref(hoy.getMonth())

const catById = Object.fromEntries(categorias.map((c) => [c.id, c]))
const DIAS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do']

const nombreMes = computed(() => {
  const texto = new Date(anio.value, mes.value, 1).toLocaleDateString('es', { month: 'long', year: 'numeric' })
  return texto.charAt(0).toUpperCase() + texto.slice(1)
})

// Publicaciones agrupadas por día (clave AAAA-MM-DD).
const porDia = computed(() => {
  const m = {}
  for (const v of videos) {
    if (!v.publicadoEl) continue
    ;(m[v.publicadoEl] ??= []).push(v)
  }
  return m
})

const celdas = computed(() => {
  const primero = new Date(anio.value, mes.value, 1)
  const offset = (primero.getDay() + 6) % 7 // semana empieza en lunes
  const diasDelMes = new Date(anio.value, mes.value + 1, 0).getDate()
  const lista = []
  for (let i = 0; i < offset; i++) lista.push({ vacia: true, key: `v${i}` })
  for (let d = 1; d <= diasDelMes; d++) {
    const clave = `${anio.value}-${String(mes.value + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const items = porDia.value[clave] ?? []
    lista.push({
      key: clave,
      dia: d,
      hoy: clave === `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`,
      colores: [...new Set(items.map((v) => catById[v.categoria]?.color).filter(Boolean))],
    })
  }
  return lista
})

// Publicaciones del mes que se está viendo.
const delMes = computed(() =>
  videos
    .filter((v) => v.publicadoEl && v.publicadoEl.startsWith(`${anio.value}-${String(mes.value + 1).padStart(2, '0')}`))
    .sort((a, b) => a.publicadoEl.localeCompare(b.publicadoEl)),
)

const sinFecha = computed(() => videos.filter((v) => !v.publicadoEl).length)

function mover(delta) {
  const nuevo = new Date(anio.value, mes.value + delta, 1)
  anio.value = nuevo.getFullYear()
  mes.value = nuevo.getMonth()
}
</script>

<template>
  <section class="vt-cal" aria-label="Calendario de publicaciones">
    <div class="vt-cal-head">
      <button class="vt-icon-btn" type="button" aria-label="Mes anterior" @click="mover(-1)">
        <i class="ti ti-chevron-left" aria-hidden="true"></i>
      </button>
      <b>{{ nombreMes }}</b>
      <button class="vt-icon-btn" type="button" aria-label="Mes siguiente" @click="mover(1)">
        <i class="ti ti-chevron-right" aria-hidden="true"></i>
      </button>
    </div>

    <div class="vt-cal-grid" role="grid" aria-label="Días del mes">
      <span v-for="d in DIAS" :key="d" class="vt-cal-dow" aria-hidden="true">{{ d }}</span>
      <template v-for="c in celdas" :key="c.key">
        <span v-if="c.vacia" class="vt-cal-day is-vacia" aria-hidden="true"></span>
        <span v-else class="vt-cal-day" :class="{ 'is-hoy': c.hoy }">
          <span class="vt-cal-num">{{ c.dia }}</span>
          <span v-if="c.colores.length" class="vt-cal-dots" aria-hidden="true">
            <span v-for="(col, i) in c.colores" :key="i" class="vt-cal-dot" :style="{ background: col }"></span>
          </span>
        </span>
      </template>
    </div>

    <h3 class="vt-cal-sub">Publicados este mes</h3>
    <ul v-if="delMes.length" class="vt-cal-list">
      <li v-for="v in delMes" :key="v.url">
        <span class="vt-cal-bar" :style="{ background: catById[v.categoria]?.color }" aria-hidden="true"></span>
        <div>
          <b>{{ v.titulo }}</b>
          <small>{{ formatearFecha(v.publicadoEl) }}</small>
        </div>
      </li>
    </ul>
    <p v-else class="vt-cal-empty">No hay publicaciones en este mes.</p>

    <p v-if="sinFecha" class="vt-cal-note">
      {{ sinFecha }} {{ sinFecha === 1 ? 'video no tiene' : 'videos no tienen' }} fecha de publicación todavía.
    </p>
  </section>
</template>
