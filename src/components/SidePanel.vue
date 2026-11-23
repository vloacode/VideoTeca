<script setup>
import categorias from '../data/categories.json'
import videos from '../data/videos.json'
import { formatearFecha } from '../utils.js'

// Datos calculados a partir de videos.json: se actualizan solos al agregar videos.
const ICONOS_PLATAFORMA = {
  Instagram: 'ti-brand-instagram',
  YouTube: 'ti-brand-youtube',
  TikTok: 'ti-brand-tiktok',
  Facebook: 'ti-brand-facebook',
}

const total = videos.length
const porCategoria = categorias.map((c) => ({
  id: c.id,
  nombre: c.nombre,
  n: videos.filter((v) => v.categoria === c.id).length,
}))
const maxCategoria = Math.max(1, ...porCategoria.map((c) => c.n))

const plataformas = [...new Set(videos.map((v) => v.plataforma))].map((p) => ({
  nombre: p,
  icono: ICONOS_PLATAFORMA[p] || 'ti-world',
  n: videos.filter((v) => v.plataforma === p).length,
}))

const autores = [...new Map(videos.map((v) => [v.usuario, v])).values()].map((v) => ({
  nombre: v.autor,
  usuario: v.usuario,
  inicial: (v.autor || '?').trim().charAt(0).toUpperCase(),
}))

const recientes = [...videos].sort((a, b) => b.guardado.localeCompare(a.guardado)).slice(0, 5)
</script>

<template>
  <aside class="vt-side" aria-label="Resumen de la colección">
    <div class="vt-card-s">
      <h3>Resumen</h3>
      <div class="vt-big">{{ total }}</div>
      <p class="vt-muted">{{ total === 1 ? 'video guardado' : 'videos guardados' }}</p>
      <ul class="vt-list vt-list-tight">
        <li><div><b>{{ categorias.length }}</b><small>categorías listas</small></div></li>
        <li><div><b>{{ plataformas.length }}</b><small>{{ plataformas.length === 1 ? 'plataforma' : 'plataformas' }}</small></div></li>
        <li><div><b>$0</b><small>para publicarla en Cloudflare Pages</small></div></li>
      </ul>
    </div>

    <div class="vt-card-s">
      <h3>Por categoría</h3>
      <div v-for="c in porCategoria" :key="c.id" class="vt-bar-row">
        <div class="vt-bar-top"><span>{{ c.nombre }}</span><span>{{ c.n }}</span></div>
        <div class="vt-bar" aria-hidden="true">
          <span :style="{ width: Math.round((c.n / maxCategoria) * 100) + '%' }"></span>
        </div>
      </div>
    </div>

    <div class="vt-card-s">
      <h3>Plataformas</h3>
      <ul class="vt-list">
        <li v-for="p in plataformas" :key="p.nombre">
          <span class="vt-ico-sm"><i class="ti" :class="p.icono" aria-hidden="true"></i></span>
          <div><b>{{ p.nombre }}</b><small>{{ p.n }} {{ p.n === 1 ? 'video' : 'videos' }}</small></div>
        </li>
      </ul>
    </div>

    <div class="vt-card-s">
      <h3>Autores</h3>
      <ul class="vt-list">
        <li v-for="a in autores" :key="a.usuario">
          <span class="vt-avatar vt-avatar-sm" aria-hidden="true">{{ a.inicial }}</span>
          <div><b>{{ a.nombre }}</b><small>{{ a.usuario }}</small></div>
        </li>
      </ul>
    </div>

    <div class="vt-card-s">
      <h3>Últimos guardados</h3>
      <ul class="vt-list">
        <li v-for="v in recientes" :key="v.url">
          <span class="vt-ico-sm"><i class="ti ti-bookmark" aria-hidden="true"></i></span>
          <div><b>{{ v.titulo }}</b><small>{{ formatearFecha(v.guardado) }}</small></div>
        </li>
      </ul>
    </div>

    <div class="vt-card-s vt-card-dark">
      <span class="vt-price-tag"><i class="ti ti-world" aria-hidden="true"></i>Próximamente · Público</span>
      <h3>Será pública para todos</h3>
      <p>Muy pronto cualquier persona podrá hacer su propia videoteca igual que esta.</p>
    </div>
  </aside>
</template>
