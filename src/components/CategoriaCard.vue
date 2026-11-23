<script setup>
defineProps({
  // categoria: { id, nombre, descripcion, icono, color, n, pct }
  categoria: { type: Object, required: true },
  activa: { type: Boolean, default: false },
})
defineEmits(['seleccionar'])
</script>

<template>
  <button
    class="vt-agent"
    :class="{ 'is-on': activa }"
    type="button"
    :aria-pressed="activa ? 'true' : 'false'"
    @click="$emit('seleccionar', categoria.id)"
  >
    <span class="vt-agent-top">
      <span class="vt-agent-ico" :style="{ background: categoria.color }">
        <i class="ti" :class="categoria.icono" aria-hidden="true"></i>
      </span>
      <span class="vt-pill" :class="categoria.n > 0 ? 'pill-ok' : 'pill-idle'">
        <span class="vt-pill-dot" aria-hidden="true"></span>
        {{ categoria.n > 0 ? 'Publicada' : 'Sin videos' }}
      </span>
    </span>
    <span class="vt-agent-name">{{ categoria.nombre }}</span>
    <span class="vt-agent-desc">{{ categoria.descripcion }}</span>
    <span class="vt-agent-foot">
      <span>{{ categoria.n }} {{ categoria.n === 1 ? 'video' : 'videos' }}</span>
      <span>{{ categoria.pct }}%</span>
    </span>
    <span class="vt-progress" aria-hidden="true">
      <span :style="{ width: categoria.pct + '%' }"></span>
    </span>
  </button>
</template>
