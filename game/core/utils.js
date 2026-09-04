/* =========================================================
   UTILITÁRIOS
   ========================================================= */
export const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
export const rnd = (min, max) => min + Math.random() * (max - min);
export const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
export const lerp = (a, b, t) => a + (b - a) * t;
export const chance = (probability) => Math.random() < probability;
export const pick = (list) => list[Math.floor(Math.random() * list.length)];
