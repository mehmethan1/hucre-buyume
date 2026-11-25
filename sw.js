// Çevrimdışı açılsın diye: önce internetten dene, olmazsa kayıtlı kopyayı ver
const C='hucre-buyume-v2';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html','./manifest.webmanifest'])))});
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r})
    .catch(()=>caches.match(e.request).then(r=>r||caches.match('./'))));
});
// Sunucudan gelen bildirim
self.addEventListener('push',e=>{
  let d={};try{d=e.data?e.data.json():{}}catch(err){d={body:e.data&&e.data.text()}}
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(ws=>ws.forEach(w=>w.postMessage({push:d.title}))));
  e.waitUntil(self.registration.showNotification(d.title||'Hücre Büyüme',{
    body:d.body||'',tag:d.tag||undefined,icon:'icon-192.png',badge:'icon-192.png',data:{url:d.url||'./'}}));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const url=(e.notification.data&&e.notification.data.url)||'./';
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(ws=>{
    for(const w of ws){if('focus' in w)return w.focus()}
    return clients.openWindow(url);
  }));
});
