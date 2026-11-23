// Encabezado que reacciona al scroll, como los títulos grandes de Apple:
// el título se achica, aparece un título compacto arriba y el encabezado
// cambia de color (claro -> gris -> negro). Solo afecta la barra de arriba;
// el resto de la página sigue el modo del sistema.

const RANGO = 240 // píxeles de scroll que tarda el cambio en completarse

// Paradas de color según el tema del sistema.
const CLARO = {
  fondo: [
    { t: 0, c: [245, 245, 247] },
    { t: 0.5, c: [51, 54, 62] },
    { t: 1, c: [0, 0, 0] },
  ],
  tinta: [
    { t: 0, c: [21, 23, 28] },
    { t: 0.5, c: [242, 243, 245] },
    { t: 1, c: [245, 245, 245] },
  ],
}
const OSCURO = {
  fondo: [
    { t: 0, c: [15, 16, 20] },
    { t: 0.5, c: [51, 54, 62] },
    { t: 1, c: [0, 0, 0] },
  ],
  tinta: [
    { t: 0, c: [242, 243, 245] },
    { t: 0.5, c: [242, 243, 245] },
    { t: 1, c: [245, 245, 245] },
  ],
}

function mezclar(paradas, t) {
  const [a, b] = t <= 0.5 ? [paradas[0], paradas[1]] : [paradas[1], paradas[2]]
  const lineal = t <= 0.5 ? t / 0.5 : (t - 0.5) / 0.5
  const k = lineal * lineal * (3 - 2 * lineal) // suavizado
  return a.c.map((v, i) => Math.round(v + (b.c[i] - v) * k))
}

export function iniciarEncabezado() {
  const raiz = document.documentElement

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    raiz.style.setProperty('--hp', '0')
    return () => {}
  }

  function aplicar() {
    const p = Math.min(1, Math.max(0, window.scrollY / RANGO))
    const paleta = raiz.getAttribute('data-bs-theme') === 'dark' ? OSCURO : CLARO
    const fondo = mezclar(paleta.fondo, p)
    const tinta = mezclar(paleta.tinta, p)
    raiz.style.setProperty('--hp', p.toFixed(3))
    raiz.style.setProperty('--top-bg', `rgb(${fondo.join(',')})`)
    raiz.style.setProperty('--top-ink', `rgb(${tinta.join(',')})`)
  }

  let pendiente = false
  function alMover() {
    if (pendiente) return
    pendiente = true
    requestAnimationFrame(() => {
      pendiente = false
      aplicar()
    })
  }

  aplicar()
  window.addEventListener('scroll', alMover, { passive: true })
  window.addEventListener('resize', alMover)
  return () => {
    window.removeEventListener('scroll', alMover)
    window.removeEventListener('resize', alMover)
  }
}
