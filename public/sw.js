// Kill-switch service worker — CARMETA ไม่ใช้ service worker
// มีไว้ถอน SW เก่าที่โปรเจคอื่นเคยลงทะเบียนไว้บน origin นี้ (เช่น dev server อื่นบน localhost:3000)
// browser จะเช็คอัปเดต sw.js เป็นระยะ → ไฟล์นี้จะติดตั้งแทนตัวเก่า แล้วถอนตัวเอง + ล้าง cache + reload หน้า
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((client) => client.navigate(client.url));
    })(),
  );
});
