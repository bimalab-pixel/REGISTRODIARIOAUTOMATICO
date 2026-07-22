// Service Worker - Asistente de Registros Diarios (Salud Comunitaria)
// Estrategia: Cache First para el shell de la app (funciona sin conexión),
// Network Only para las peticiones a la IA (nunca deben quedar cacheadas
// datos de pacientes ni la respuesta con la API key).

const CACHE_NAME = 'registros-salud-v3';

const ARCHIVOS_NUCLEO = [
  './',
  './index.html',
  './manifest.json',
  './icon-72.png',
  './icon-96.png',
  './icon-128.png',
  './icon-144.png',
  './icon-152.png',
  './icon-192.png',
  './icon-384.png',
  './icon-512.png'
];

// Instalación: precachear el shell de la app
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ARCHIVOS_NUCLEO))
  );
  self.skipWaiting();
});

// Activación: eliminar caches de versiones anteriores
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((nombres) =>
      Promise.all(
        nombres
          .filter((nombre) => nombre !== CACHE_NAME)
          .map((nombre) => caches.delete(nombre))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Nunca cachear las peticiones a la API de Groq (contienen la clave y notas de pacientes)
  if (url.hostname.includes('api.groq.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Google Fonts: intenta red primero, si falla usa lo cacheado (o nada si es la primera vez offline)
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      fetch(event.request)
        .then((respuesta) => {
          const copia = respuesta.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copia));
          return respuesta;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Shell de la app y demás recursos propios: Cache First
  event.respondWith(
    caches.match(event.request).then((respuestaCache) => {
      if (respuestaCache) return respuestaCache;

      return fetch(event.request)
        .then((respuestaRed) => {
          if (event.request.method === 'GET' && respuestaRed && respuestaRed.status === 200) {
            const copia = respuestaRed.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copia));
          }
          return respuestaRed;
        })
        .catch(() => {
          // Sin red y sin cache: si pidieron una página, devolver el index como último recurso
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
    })
  );
});
