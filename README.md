# VideoTeca

La videoteca personal de Wil: un solo lugar donde guardar enlaces de videos, clasificados por tema, con una descripción breve de cada uno.

## Qué es

Una página que reúne videos guardados de Instagram, YouTube, TikTok y Facebook. Cada video tiene su título, autor, portada, categoría y una descripción breve en español.

## Cómo crece

Tú no editas nada. El flujo es así:

1. **Pasas el link** por el chat, de uno en uno o varios juntos.
2. **Muse lo ve y lo clasifica** en su categoría y escribe la descripción breve.
3. **Se publica aquí**: se agrega una entrada nueva a `src/data/videos.json` y la página se actualiza sola.

## Agregar un video

Todo el contenido vive en `src/data/videos.json`. Cada video es un objeto como este:

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

- `categoria` debe ser uno de los `id` de `src/data/categories.json`.
- Los contadores, los filtros y las estadísticas se calculan solos a partir de este archivo.

## Categorías

Se definen en `src/data/categories.json`. Para agregar una nueva, añade un objeto con `id`, `nombre`, `descripcion`, `icono` (un ícono de [Tabler Icons](https://tabler.io/icons)) y `clase`.

- AI
- Comidas
- Restaurantes
- Edición de imágenes
- Fotografía
- Ebanistería

## Tecnología

- [Vue 3](https://vuejs.org/) + [Vite](https://vitejs.dev/), sin backend ni base de datos.
- Diseño con [Tabler](https://github.com/tabler/tabler) (Bootstrap 5), con modo claro y oscuro según el sistema.
- Buscador sin distinguir acentos ni mayúsculas, y filtros por categoría, todo en el navegador.

## Desarrollo local

Requiere Node.js 20 o superior.

```powershell
npm install
npm run dev      # servidor de desarrollo
npm run build    # genera la carpeta dist/
npm run preview  # revisa el build final
```

## Publicación en Cloudflare Pages

Configuración del proyecto en Cloudflare:

- **Framework preset:** Vue (o None)
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Rama de producción:** `main`

Cada cambio en `main` se despliega solo.

## En vivo

https://videoteca.vloacode.workers.dev/

## Próximamente

La videoteca se estará poniendo pública para que la gente pueda hacer sus propias páginas.
