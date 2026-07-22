# Asistente de Registros Diarios (PWA)

App de salud comunitaria que convierte notas rápidas de campo en un informe oficial en tabla usando IA (Groq), con historial guardado en el dispositivo. Funciona sin conexión y se puede instalar como app en el celular.

## Archivos del proyecto

```
├── index.html        (la app completa)
├── manifest.json      (metadatos de la PWA: nombre, ícono, colores)
├── sw.js               (Service Worker: hace que funcione offline)
└── icons/              (ícono en varios tamaños, generado de tu imagen)
```

## Cómo publicarla en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `registros-salud`).
2. Sube estos 4 elementos (`index.html`, `manifest.json`, `sw.js`, y la carpeta `icons/`) a la raíz del repositorio.
3. Entra a **Settings → Pages** del repositorio.
4. En "Source", selecciona la rama `main` y la carpeta `/ (root)`. Guarda.
5. Espera 1-2 minutos. Tu app quedará publicada en:
   `https://TU-USUARIO.github.io/registros-salud/`

## Cómo instalarla en el celular (Android)

1. Abre el enlace de GitHub Pages en Chrome.
2. Toca el menú (⋮) → **"Instalar aplicación"** o **"Agregar a pantalla de inicio"**.
3. Aparecerá el ícono en tu celular como una app normal, y abrirá sin la barra del navegador.

## Notas importantes

- **HTTPS obligatorio para el Service Worker**: GitHub Pages ya sirve todo por HTTPS automáticamente, así que no necesitas configurar nada extra para que el modo offline funcione.
- **La API Key de Groq** se sigue guardando solo en el `localStorage` de cada dispositivo (nunca se sube al repositorio ni se comparte entre usuarios).
- **Actualizaciones**: cada vez que subas cambios nuevos a `index.html`, cambia el número de versión en la primera línea de `sw.js` (`CACHE_NAME = 'registros-salud-v1'` → `v2`, `v3`, etc.) para que los celulares que ya instalaron la app reciban la versión más reciente en vez de quedarse con la cacheada.
