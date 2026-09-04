/* =========================================================
   PONTOS DE INTERESSE DO CENÁRIO
   ========================================================= */

export const LAKE = { x: 760, y: 510, radius: 230 };
export const CAVE_ENTRANCE_X = 1590;
export const FOREST_ROCKS = [
  { x: 380, y: 540, scale: 1 },
  { x: 1180, y: 550, scale: 0.8 },
  { x: 1840, y: 545, scale: 1.1 }
];
export function forestFlowerSpots() {
  const spots = [];
  for (let x = 160; x < 2200; x += 87) spots.push(x);
  return spots;
}
export const CAVE_WEB_SPOTS = [660, 1440];
export const CAVE_CEILING_SPOTS = [570, 1050];
