/* Service Worker — Bitácora PWA  (sube CACHE a v4, v5... cuando actualices index.html) */
const CACHE = 'bitacora-v7';
const ASSETS = ['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-512-maskable.png','./apple-touch-icon.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req=e.request; if(req.method!=='GET') return;
  const url=new URL(req.url); if(url.hostname.indexOf('script.google')!==-1) return;
  if(url.pathname.indexOf('correo-config.json')!==-1) return; // siempre desde la red (config maestra)
  e.respondWith(caches.match(req).then(cached=>{
    const net=fetch(req).then(res=>{ if(res&&res.status===200&&(res.type==='basic'||res.type==='cors')){ const c=res.clone(); caches.open(CACHE).then(x=>x.put(req,c)); } return res; }).catch(()=>cached);
    return cached||net;
  }));
});
