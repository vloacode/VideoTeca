# Videoteca de Wil

Una página para guardar videos de Instagram, YouTube, TikTok y Facebook, clasificados por tema y con una descripción breve de cada uno. Todo vive en un solo lugar y se encuentra en segundos con el buscador o los filtros.

**En vivo:** https://videoteca.vloacode.workers.dev/

---

## Características

- **Buscador sin distinguir acentos ni mayúsculas.** Busca por título, autor, herramienta, plataforma o categoría.
- **Filtros por categoría** en la barra superior y en la barra lateral, con el contador de videos de cada una.
- **Barra lateral** con las categorías (en escritorio) y **panel derecho** con resumen, videos por categoría, plataformas, autores y últimos guardados.
- **Tarjetas de video** con portada animada, plataforma, categoría, descripción, herramientas y dos acciones: ver el video original y copiar el enlace.
- **Modo claro y oscuro** según la configuración del sistema.
- **Diseño responsive**, pensado primero para celular.
- **Sin backend ni base de datos.** Todo el contenido está en archivos JSON dentro del proyecto.

---

## Cómo agregar un video

Todo el contenido vive en [`src/data/videos.json`](src/data/videos.json). Para agregar un video, copia este bloque dentro de la lista y completa los campos:

```json
{
  "titulo": "Título del video",
  "autor": "Nombre de quien lo hizo",
  "usuario": "@usuario",
  "url": "https://www.instagram.com/p/XXXXXXXX/",
  "plataforma": "Instagram",
  "formato": "Reel",
  "categoria": "edicion",
  "descripcion": "Descripción breve de 1 a 3 oraciones.",
  "herramientas": ["Herramienta 1", "Herramienta 2"],
  "guardado": "2026-11-22"
}
```

| Campo | Qué poner |
| --- | --- |
| `titulo` | El título del video, tal como aparece en la plataforma. |
| `autor` / `usuario` | Nombre y usuario de quien publicó el video. |
| `url` | El enlace original, copiado exacto. |
| `plataforma` | `Instagram`, `YouTube`, `TikTok` o `Facebook`. |
| `formato` | Opcional. Por ejemplo `Reel`, `Short` o `Video`. |
| `categoria` | Uno de los `id` de `src/data/categories.json`. |
| `descripcion` | Una descripción breve en español. |
| `herramientas` | Lista opcional de herramientas o temas del video. |
| `portada` | Opcional. Texto corto que aparece sobre la portada. |
| `guardado` | Fecha en formato `AAAA-MM-DD`. |

Los contadores, los filtros, las estadísticas y el panel derecho se calculan solos a partir de este archivo. No hay que tocar nada más.

---

## Categorías

Las categorías están en [`src/data/categories.json`](src/data/categories.json). Cada una tiene:

- `id`: nombre interno, sin acentos ni espacios (por ejemplo `edicion`).
- `nombre`: el texto que se muestra.
- `descripcion`: una frase que explica qué entra en esa categoría.
- `icono`: un ícono de [Tabler Icons](https://tabler.io/icons), por ejemplo `ti-camera`.
- `clase`: la clase de color del ícono en la página.

Categorías actuales: AI, Comidas, Restaurantes, Edición de imágenes, Fotografía y Ebanistería.

Para agregar una nueva, añade un objeto a la lista con esos cinco campos. La categoría aparece en la barra lateral, en los filtros y en la sección de categorías.

---

## Estructura del proyecto

```text
VideoTeca/
├── index.html              Página base que carga la app
├── package.json            Dependencias y scripts
├── vite.config.js          Configuración de Vite
├── wrangler.jsonc          Configuración de Cloudflare Workers
├── src/
│   ├── main.js             Arranque de la app y tema claro/oscuro
│   ├── App.vue             Layout principal, buscador y filtros
│   ├── style.css           Estilos propios (los colores están en :root)
│   ├── utils.js            Búsqueda sin acentos y formato de fechas
│   ├── components/
│   │   ├── AppSidebar.vue  Barra lateral de categorías
│   │   ├── SidePanel.vue   Panel derecho con resumen y estadísticas
│   │   ├── VideoCard.vue   Tarjeta de cada video
│   │   └── ParticleCover.vue  Portada animada en canvas
│   └── data/
│       ├── videos.json     Los videos guardados
│       └── categories.json Las categorías
```

---

## Desarrollo local

Necesitas [Node.js](https://nodejs.org/) 20 o superior.

```powershell
npm install        # instala las dependencias (solo la primera vez)
npm run dev        # servidor de desarrollo en http://localhost:5173
npm run build      # genera la carpeta dist/ con la versión final
npm run preview    # sirve dist/ para revisar el resultado del build
```

Los cambios en `src/` se ven al instante en el servidor de desarrollo.

---

## Publicación

El sitio se publica con **Cloudflare Workers** (static assets) desde la rama `main` de este repositorio. Cada cambio que llega a `main` se despliega solo.

Configuración de build en Cloudflare:

| Ajuste | Valor |
| --- | --- |
| Rama de producción | `main` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |

`wrangler.jsonc` indica que el Worker sirve la carpeta `dist/` como sitio estático.

### Desplegar desde la terminal

```powershell
npx wrangler login    # una vez: inicia sesión en Cloudflare
npm run deploy        # compila y publica
```

---

## Solución de problemas

- **La página no muestra un cambio reciente.** Espera 1 a 3 minutos a que termine el despliegue y recarga con `Ctrl + F5` para saltarte la caché del navegador.
- **`npm install` falla.** Revisa que tengas Node.js 20 o superior con `node --version`.
- **Un video no aparece.** Revisa que `categoria` coincida con un `id` de `categories.json` y que el JSON no tenga comas de más.

---

## Tecnologías

- [Vue 3](https://vuejs.org/) con [Vite](https://vitejs.dev/)
- [Tabler](https://github.com/tabler/tabler) (Bootstrap 5) y [Tabler Icons](https://tabler.io/icons)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/) para el hospedaje
- Tipografías: Bricolage Grotesque y Manrope, desde Google Fonts

---

## Próximamente

La videoteca se estará poniendo pública para que cualquier persona pueda crear su propia colección con esta misma base.
