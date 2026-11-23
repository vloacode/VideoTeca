// Tema ligado al scroll: arriba el fondo es claro, a mitad de la página pasa
// a gris y al final de la página queda negro. Cada color se interpola entre
// tres paradas, así que el cambio es continuo y no un salto.

// Variables CSS que cambian y su valor en cada parada del recorrido.
const PARADAS = [
  {
    t: 0,
    c: {
      page: '#e9eaee', frame: '#f5f5f7', surface: '#ffffff', 'surface-2': '#f2f3f5',
      line: '#e6e8ec', ink: '#15171c', 'ink-2': '#5b616e', 'ink-3': '#8f96a3',
      'dark-btn': '#111318', 'dark-btn-ink': '#ffffff', track: '#eef0f3',
    },
  },
  {
    t: 0.5,
    c: {
      page: '#3a3d45', frame: '#2b2e35', surface: '#33363e', 'surface-2': '#3d4048',
      line: '#4a4e57', ink: '#f2f3f5', 'ink-2': '#c3c7ce', 'ink-3': '#9aa0aa',
      'dark-btn': '#f2f3f5', 'dark-btn-ink': '#1a1c21', track: '#4a4e57',
    },
  },
  {
    t: 1,
    c: {
      page: '#000000', frame: '#0a0a0b', surface: '#111113', 'surface-2': '#1a1a1d',
      line: '#242428', ink: '#f5f5f5', 'ink-2': '#b0b0b6', 'ink-3': '#76767e',
      'dark-btn': '#f5f5f5', 'dark-btn-ink': '#000000', track: '#242428',
    },
  },
]

function aRgb(hex) {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function aHex([r, g, b]) {
  return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')
}

// Devuelve los colores para un progreso t entre 0 y 1.
function coloresEn(t) {
  const [a, b] = t <= 0.5 ? [PARADAS[0], PARADAS[1]] : [PARADAS[1], PARADAS[2]]
  const lineal = t <= 0.5 ? t / 0.5 : (t - 0.5) / 0.5
  // Suavizado (smoothstep) para que el cambio arranque y termine despacio.
  const k = lineal * lineal * (3 - 2 * lineal)
  const salida = {}
  for (const clave of Object.keys(a.c)) {
    const [r1, g1, b1] = aRgb(a.c[clave])
    const [r2, g2, b2] = aRgb(b.c[clave])
    salida[clave] = aHex([r1 + (r2 - r1) * k, g1 + (g2 - g1) * k, b1 + (b2 - b1) * k])
  }
  return salida
}

function nombreTema(t) {
  if (t < 0.34) return { etiqueta: 'Claro', icono: 'ti-sun' }
  if (t < 0.67) return { etiqueta: 'Gris', icono: 'ti-moon' }
  return { etiqueta: 'Oscuro', icono: 'ti-moon-stars' }
}

// Inicia el cambio de tema. Devuelve una función para detenerlo.
export function iniciarTemaScroll() {
  const raiz = document.documentElement
  const pastilla = document.getElementById('tema-pill')
  const etiqueta = pastilla?.querySelector('span')
  const icono = pastilla?.querySelector('i')

  function progreso() {
    const maximo = document.documentElement.scrollHeight - window.innerHeight
    if (maximo <= 0) return 0
    return Math.min(1, Math.max(0, window.scrollY / maximo))
  }

  function aplicar(t) {
    const colores = coloresEn(t)
    for (const [clave, valor] of Object.entries(colores)) {
      raiz.style.setProperty(`--${clave}`, valor)
    }
    // Tabler cambia sus componentes según este atributo.
    raiz.setAttribute('data-bs-theme', t >= 0.5 ? 'dark' : 'light')
    if (pastilla && etiqueta && icono) {
      const { etiqueta: texto, icono: clase } = nombreTema(t)
      etiqueta.textContent = texto
      icono.className = `ti ${clase}`
    }
  }

  // Movimiento reducido: sin cambio ligado al scroll, la página queda clara.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    aplicar(0)
    return () => {}
  }

  let pendiente = false
  function alMover() {
    if (pendiente) return
    pendiente = true
    requestAnimationFrame(() => {
      pendiente = false
      aplicar(progreso())
    })
  }

  aplicar(progreso())
  window.addEventListener('scroll', alMover, { passive: true })
  window.addEventListener('resize', alMover)
  return () => {
    window.removeEventListener('scroll', alMover)
    window.removeEventListener('resize', alMover)
  }
}
