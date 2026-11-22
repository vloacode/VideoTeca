// Quita acentos y pasa a minúsculas para que la búsqueda no distinga "Edición" de "edicion".
export function normalizar(texto) {
  return (texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

// "2026-11-22" -> "22 de noviembre de 2026"
export function formatearFecha(iso) {
  if (!iso) return ''
  return new Date(iso + 'T12:00:00').toLocaleDateString('es', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
