/* =========================================================
   INPUT — movimento e ações
   ========================================================= */

export const keys = new Set();

export function isDown(...names) {
  return names.some((name) => keys.has(name));
}

export function moveVector() {
  const x = (isDown('ArrowRight', 'd', 'D') ? 1 : 0) - (isDown('ArrowLeft', 'a', 'A') ? 1 : 0);
  const y = (isDown('ArrowDown', 's', 'S') ? 1 : 0) - (isDown('ArrowUp', 'w', 'W') ? 1 : 0);
  const length = Math.hypot(x, y);
  return length ? { x: x / length, y: y / length } : { x: 0, y: 0 };
}

export function moveAxis() {
  return moveVector().x;
}

export function isRunning() {
  return isDown('Shift');
}

export function clearKeys() {
  keys.clear();
}
