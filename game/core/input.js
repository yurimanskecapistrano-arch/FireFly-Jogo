/* =========================================================
   INPUT — teclado robusto e movimento
   ========================================================= */
export const keys = new Set();

const ALIASES = {
  ArrowRight:['ArrowRight','KeyD'], ArrowLeft:['ArrowLeft','KeyA'],
  ArrowDown:['ArrowDown','KeyS'], ArrowUp:['ArrowUp','KeyW'],
  d:['KeyD','ArrowRight'], D:['KeyD','ArrowRight'],
  a:['KeyA','ArrowLeft'], A:['KeyA','ArrowLeft'],
  s:['KeyS','ArrowDown'], S:['KeyS','ArrowDown'],
  w:['KeyW','ArrowUp'], W:['KeyW','ArrowUp'],
  Shift:['ShiftLeft','ShiftRight'], ' ':['Space']
};

export function isDown(...names){
  return names.some(name=>(ALIASES[name]||[name]).some(key=>keys.has(key)));
}

export function normalizeKey(event){return event.code||event.key;}

export function moveVector(){
  const x=(isDown('ArrowRight')?1:0)-(isDown('ArrowLeft')?1:0);
  const y=(isDown('ArrowDown')?1:0)-(isDown('ArrowUp')?1:0);
  const length=Math.hypot(x,y);
  return length?{x:x/length,y:y/length}:{x:0,y:0};
}

export function moveAxis(){return moveVector().x;}
export function isRunning(){return isDown('Shift');}
export function clearKeys(){keys.clear();}
