<script setup>
defineProps({
  opciones: { type: Array, required: true },
  conteo: { type: Object, required: true },
  activa: { type: String, required: true },
})
defineEmits(['seleccionar'])
</script>

<template>
  <nav class="vt-nav" aria-label="Categorías de la videoteca">
    <div class="vt-brand">
      <span class="vt-brand-mark"><i class="ti ti-player-play" aria-hidden="true"></i></span>
      <span>Videoteca</span>
    </div>

    <div>
      <p class="vt-nav-label">Colección</p>
      <ul class="vt-nav-list">
        <li v-for="o in opciones" :key="o.id">
          <button
            class="vt-nav-item"
            type="button"
            :aria-current="activa === o.id ? 'true' : 'false'"
            @click="$emit('seleccionar', o.id)"
          >
            <i class="ti" :class="o.icono" aria-hidden="true"></i>
            <span>{{ o.nombre }}</span>
            <small>{{ conteo[o.id] }}</small>
          </button>
        </li>
      </ul>
    </div>

    <p class="vt-nav-foot">De Wil · Publicada en Cloudflare Pages</p>
  </nav>
</template>
