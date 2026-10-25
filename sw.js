// CK Dentmaster service worker – caches the app shell so it opens offline.
// Bump CACHE when you change index.html so phones pick up the new version.
const CACHE = "ckdm-v5";
const SHELL = ["./", "./index.html", "./firebase-config.js", "./manifest.json", "./report.html", "./logo.png",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-180.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return; // Firebase/CDN requests go straight to network
  // Network first for the shell (so updates land), fall back to cache offline.
  e.respondWith(
    fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match("./index.html")))
  );
});
