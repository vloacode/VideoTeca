<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

// Fila horizontal que se recorre con botones de izquierda y derecha.
const props = defineProps({
  label: { type: String, default: 'Desplazar' },
})

const pista = ref(null)
const alInicio = ref(true)
const alFinal = ref(true)

function actualizarBordes() {
  const el = pista.value
  if (!el) return
  alInicio.value = el.scrollLeft <= 2
  alFinal.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2
}

function mover(direccion) {
  const el = pista.value
  el.scrollBy({ left: direccion * el.clientWidth * 0.8, behavior: 'smooth' })
}

onMounted(() => {
  actualizarBordes()
  pista.value.addEventListener('scroll', actualizarBordes, { passive: true })
  window.addEventListener('resize', actualizarBordes)
})

onBeforeUnmount(() => {
  pista.value?.removeEventListener('scroll', actualizarBordes)
  window.removeEventListener('resize', actualizarBordes)
})
</script>

<template>
  <div class="vt-carrusel">
    <button class="vt-carr-btn" type="button" aria-label="Anterior" :disabled="alInicio" @click="mover(-1)">
      <i class="ti ti-chevron-left" aria-hidden="true"></i>
    </button>
    <div ref="pista" class="vt-carr-pista" tabindex="0" role="region" :aria-label="props.label">
      <slot />
    </div>
    <button class="vt-carr-btn" type="button" aria-label="Siguiente" :disabled="alFinal" @click="mover(1)">
      <i class="ti ti-chevron-right" aria-hidden="true"></i>
    </button>
  </div>
</template>
