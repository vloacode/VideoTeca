# Videoteca de Wil

Una página para guardar videos de Instagram, YouTube, TikTok y Facebook, clasificados por tema y con una descripción breve de cada uno. Todo vive en un solo lugar: se encuentra en segundos con el buscador o los filtros, y se ve en qué etapa está cada video.

**En vivo:** https://videoteca.vloacode.workers.dev/

---

## Características

- **Tablero de categorías:** una tarjeta por categoría con su estado, cuántos videos tiene y su porcentaje del total. Tocarla filtra la colección; tocarla otra vez quita el filtro.
- **Pipeline de videos:** los videos aparecen en columnas según su estado (en cola, clasificando, revisión, publicado).
- **Buscador sin distinguir acentos ni mayúsculas.** Busca por título, autor, herramienta, plataforma o categoría.
- **Filtro por categoría** en el menú del tablero, que aplica a todas las columnas a la vez.
- **Barra lateral** con categorías y plataformas (en escritorio), y **calendario de publicaciones** a la derecha, por fecha de publicación.
- **Color por categoría** en la franja de cada tarjeta y en las barras de progreso.
- **Encabezado que se achica al bajar**, con el color que cambia con el scroll (claro, gris y negro).
- **Tarjetas de video** con plataforma, categoría, autor, herramientas y dos acciones: ver el video original y copiar el enlace.
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
  "estado": "revision",
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
| `estado` | En qué etapa está el video: `cola`, `clasificando`, `revision` o `publicado`. |
| `guardado` | Fecha en formato `AAAA-MM-DD`. |

Los contadores, los porcentajes, las columnas del pipeline y los filtros se calculan solos a partir de este archivo. No hay que tocar nada más.

### Estados del pipeline

Los estados están en [`src/data/estados.json`](src/data/estados.json) y determinan las columnas, en este orden:

| `id` | Columna | Cuándo usarlo |
| --- | --- | --- |
| `cola` | En cola | El link llegó por el chat y todavía no se clasifica. |
| `clasificando` | Clasificando | Ya se escribe la descripción y la categoría. |
| `revision` | Revisión | Esperando tu confirmación antes de publicar. |
| `publicado` | Publicado | Ya está en la página. |

---

## Categorías

Las categorías están en [`src/data/categories.json`](src/data/categories.json). Cada una tiene:

- `id`: nombre interno, sin acentos ni espacios (por ejemplo `edicion`).
- `nombre`: el texto que se muestra.
- `descripcion`: una frase que explica qué entra en esa categoría.
- `icono`: un ícono de [Tabler Icons](https://tabler.io/icons), por ejemplo `ti-camera`.
- `color`: el color de fondo del ícono en la tarjeta, en formato `#rrggbb`.

Categorías actuales: AI, Comidas, Restaurantes, Edición de imágenes, Fotografía y Ebanistería.

Para agregar una nueva, añade un objeto a la lista con esos cinco campos. La categoría aparece en el tablero, en el menú de filtros y en la barra de iconos.

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
│   ├── App.vue             Layout, tablero, pipeline y secciones
│   ├── style.css           Estilos propios (los colores están en :root)
│   ├── utils.js            Búsqueda sin acentos y formato de fechas
│   ├── header-scroll.js    Encabezado que se achica y cambia de color con el scroll
│   ├── components/
│   │   ├── Carrusel.vue      Fila horizontal con botones izquierda y derecha
│   │   ├── AppSidebar.vue    Barra izquierda con categorías y plataformas
│   │   ├── CalendarPanel.vue Calendario de publicaciones (columna derecha)
│   │   ├── PipelineCard.vue  Tarjeta de cada video en el pipeline
│   │   ├── VideoDetalle.vue  Vista con la descripción completa del video
│   │   └── ParticleCover.vue Portada animada de la vista de detalle
│   └── data/
│       ├── videos.json       Los videos guardados
│       ├── categories.json   Las categorías
│       └── estados.json      Las columnas del pipeline
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
- **Un video no aparece.** Revisa que `categoria` coincida con un `id` de `categories.json`, que `estado` sea uno de los de `estados.json`, y que el JSON no tenga comas de más.

---

## Tecnologías

- [Vue 3](https://vuejs.org/) con [Vite](https://vitejs.dev/)
- [Tabler](https://github.com/tabler/tabler) (Bootstrap 5) y [Tabler Icons](https://tabler.io/icons)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/) para el hospedaje
- Tipografía Inter, desde Google Fonts

---

## Próximamente

La videoteca se estará poniendo pública para que cualquier persona pueda crear su propia colección con esta misma base.
