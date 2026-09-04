/* =========================================================
   INPUT
   ========================================================= */

export const keys = new Set();

export function isDown(...names) {
  return names.some((name) => keys.has(name));
}

export function moveAxis() {
  const right = isDown('ArrowRight', 'd', 'D') ? 1 : 0;
  const left = isDown('ArrowLeft', 'a', 'A') ? 1 : 0;
  return right - left;
}

export function isRunning() {
  return isDown('Shift');
}
