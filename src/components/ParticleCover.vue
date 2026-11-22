<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

// Portada animada tipo Gaussian Splat. Solo se anima mientras está visible
// y se queda estática si el visitante pide menos movimiento.
const canvas = ref(null)
const COLORES = ['#5ed6a5', '#ff5c38', '#f2c14e', '#8ec2ff', '#ff9ecf', '#e8f5e9']
const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches

let ctx = null
let W = 0
let H = 0
let puntos = []
let frame = 0
let visible = false
let observador = null
let redimension = null

function tamano() {
  const padre = canvas.value.parentElement.getBoundingClientRect()
  W = canvas.value.width = Math.max(300, Math.floor(padre.width))
  H = canvas.value.height = Math.max(220, Math.floor(padre.height))
  sembrar()
}

function sembrar() {
  puntos = []
  const n = Math.floor((W * H) / 2600)
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2
    const d = Math.pow(Math.random(), 0.6)
    puntos.push({
      x: W / 2 + Math.cos(a) * d * W * 0.42 + (Math.random() - 0.5) * 14,
      y: H / 2 + Math.sin(a) * d * H * 0.34 + (Math.random() - 0.5) * 14,
      r: 1 + Math.random() * 3.4,
      c: COLORES[Math.floor(Math.random() * COLORES.length)],
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      ph: Math.random() * Math.PI * 2,
    })
  }
}

function dibujar(t) {
  ctx.fillStyle = '#101410'
  ctx.fillRect(0, 0, W, H)
  for (const p of puntos) {
    if (!sinMovimiento) {
      p.x += p.vx + Math.sin(t / 1400 + p.ph) * 0.12
      p.y += p.vy + Math.cos(t / 1700 + p.ph) * 0.12
      if (p.x < 0 || p.x > W) p.vx *= -1
      if (p.y < 0 || p.y > H) p.vy *= -1
    }
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fillStyle = p.c
    ctx.globalAlpha = 0.75
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

function bucle(t) {
  dibujar(t)
  frame = visible && !sinMovimiento ? requestAnimationFrame(bucle) : 0
}

function arrancar() {
  if (!frame && visible && !sinMovimiento) frame = requestAnimationFrame(bucle)
}

onMounted(() => {
  ctx = canvas.value.getContext('2d')
  tamano()
  dibujar(0)

  observador = new IntersectionObserver(([entrada]) => {
    visible = entrada.isIntersecting
    arrancar()
  })
  observador.observe(canvas.value)

  redimension = new ResizeObserver(() => {
    tamano()
    dibujar(0)
  })
  redimension.observe(canvas.value.parentElement)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  observador?.disconnect()
  redimension?.disconnect()
})
</script>

<template>
  <canvas ref="canvas" class="vt-cover-canvas" aria-hidden="true"></canvas>
</template>
