/* ============================================================
   FIREFLY 9 — PIXEL GARDEN
   Renderer low-resolution: 320x180, displayed with nearest-neighbour.
   Art direction: cozy woodland, muted mint, moss, butter yellow,
   lake teal, warm timber and tiny readable pixel clusters.
   ============================================================ */
import {ctx} from '../core/dom.js';
import {state,isNight} from '../core/state.js';
import {W,H} from '../core/constants.js';

const P = {
  ink:'#243b3b', deep:'#203e3d', pine:'#31564b', pine2:'#416b57',
  leaf:'#5e8964', leaf2:'#7da86e', mint:'#a5c89a', grass:'#789b68',
  grass2:'#8eae77', grassLight:'#a9c28b', dirt:'#c6a77a', dirt2:'#ad8b64',
  cream:'#f2e7c6', gold:'#e9ca79', bark:'#765441', bark2:'#9b7051',
  water:'#5ca9ad', water2:'#78c6c1', waterDeep:'#397f8b',
  sky:'#a9d5d4', cloud:'#d9e7d1', dusk:'#7f9db0', night:'#263d59',
  star:'#fff0b8', cave:'#182c3b', crystal:'#8edbd0', lilac:'#b4a4df'
};
const TAU=Math.PI*2;
const wx=x=>Math.round((x-state.camera.x)/4)*4;
const snap=n=>Math.round(n/4)*4;
function box(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(snap(x),snap(y),Math.max(4,snap(w)),Math.max(4,snap(h)));}
function seed(n){const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);}
function worldBox(x,y,w,h,color){box(wx(x),y,w,h,color);}
function text(s,x,y,size,color=P.cream,align='center'){
  ctx.fillStyle=color;ctx.textAlign=align;ctx.font='bold '+(size*2)+'px monospace';ctx.fillText(s,snap(x),snap(y));
}
function sky(){
  const night=isNight(), dusk=state.clock>.68&&state.clock<.82;
  const top=night?P.night:dusk?'#8c9db3':'#a9d5d4';
  const bottom=night?'#45566a':dusk?'#e4b49b':'#e0e8c6';
  box(0,0,W,H,top);
  for(let y=0;y<H;y+=24){const t=y/H;box(0,y,W,24, t<.48?top:bottom);}
  if(night){
    for(let i=0;i<58;i++){const x=(i*197+Math.floor(state.camera.x*.035))%W,y=24+(i*71)%270;if(y<390)box(x,y,i%7===0?8:4,4,i%4===0?P.gold:'#e5eee0');}
    box(1032,72,36,36,'#e9e6d0');box(1040,64,32,36,top);box(1024,76,8,12,top);
  }else{
    const sx=dusk?1000:1050, sy=82;
    box(sx,sy,32,32,dusk?'#f5bf8a':'#f6dc91');box(sx-8,sy+8,48,16,dusk?'#f5bf8a':'#f6dc91');
    for(let i=0;i<5;i++)box(sx-12+i*12,sy-4,4,4,'#f6dc91');
  }
  // Distant rolling hills; low-frequency parallax, no gradients or blur.
  for(let layer=0;layer<3;layer++){
    const y=370-layer*43, offset=(state.camera.x*(.04+layer*.045))%180;
    const col=night?['#304759','#2d4a53','#2d514d'][layer]:['#91b9a1','#79a991','#5e8b78'][layer];
    for(let x=-200-offset;x<W+220;x+=180){
      box(x,y+12,120,60,col);box(x+20,y-8,80,20,col);box(x+40,y-20,40,12,col);
    }
  }
  // Sparse clouds made of chunky clusters.
  if(!night)for(let i=0;i<5;i++){
    const x=(i*287-state.camera.x*.09+W*3)% (W+180)-90,y=86+(i%3)*45;
    box(x,y,48,12,P.cloud);box(x+12,y-8,24,12,P.cloud);box(x+36,y+4,24,8,P.cloud);
  }
}
function tree(x,y,scale=1,variant=0){
  const X=wx(x),s=scale;
  if(X < -180||X>W+180)return;
  const trunkW=12*s, trunkH=82*s, top=y-104*s;
  // Small ground shadow, trunk and three stepped canopy masses.
  box(X-25*s,y-4,52*s,8,'#294b40');
  box(X-trunkW/2,y-72*s,trunkW,trunkH,variant?'#8b644b':P.bark);
  box(X-2*s,y-62*s,4*s,48*s,variant?'#a57a55':P.bark2);
  const c=variant?['#4d7959','#628e62','#7ea46d']:['#3c7056','#4e815c','#659564'];
  box(X-38*s,top+35*s,76*s,34*s,c[0]);
  box(X-30*s,top+16*s,60*s,30*s,c[1]);
  box(X-18*s,top,36*s,28*s,c[2]);
  box(X-46*s,top+45*s,20*s,22*s,c[0]);
  box(X+26*s,top+40*s,20*s,24*s,c[0]);
  box(X-22*s,top+8*s,12*s,8*s,variant?'#8ebc7a':'#80b174');
  box(X+10*s,top+30*s,12*s,8*s,'#8ab879');
  if(scale>1.25){box(X-42*s,top+62*s,20*s,10*s,c[0]);box(X+22*s,top+61*s,22*s,10*s,c[0]);}
}
function grassPatch(x,y,w,h,color){
  const X=wx(x);if(X+w<0||X>W)return;box(X,y,w,h,color);
}
function flower(x,y,color,world=true){
  const X=world?wx(x):x;
  box(X,y-12,4,12,'#426f4c');box(X-4,y-16,4,4,color);box(X+4,y-16,4,4,color);box(X,y-20,4,4,color);box(X,y-12,4,4,P.gold);
}
function stone(x,y,scale=1){
  const X=wx(x),s=scale;if(X<-60||X>W+60)return;
  box(X-18*s,y-10*s,36*s,12*s,'#667d78');box(X-10*s,y-18*s,24*s,10*s,'#82958a');
  box(X-8*s,y-14*s,8*s,4*s,'#b3c3a2');box(X+12*s,y-7*s,6*s,5*s,'#536d67');
}
function pathSegment(x,y,w){
  const X=wx(x);if(X+w<0||X>W)return;
  box(X,y,w,20,P.dirt);box(X+8,y+4,w-16,12,P.dirt2);
  box(X+20,y+4,12,4,'#d8bc8d');box(X+w-28,y+12,8,4,'#dfc497');
}
function lake(){
  const X=wx(1840),y=512;if(X < -650||X>W+650)return;
  // Irregular stepped shoreline and layered still water.
  box(X-420,y-18,840,76,'#9e9d73');box(X-388,y-34,776,96,'#c2b789');
  box(X-360,y-38,720,84,P.waterDeep);box(X-332,y-42,664,76,P.water);
  box(X-288,y-46,576,8,P.water2);box(X-250,y+18,500,8,P.waterDeep);
  box(X-180,y-20,140,4,'#a0d8ce');box(X+60,y-4,168,4,'#a0d8ce');
  for(let i=0;i<14;i++){
    const px=X-300+((i*79+Math.floor(state.t*7))%600),py=y-24+(i*31)%54;
    box(px,py,i%3===0?24:12,4,i%4===0?P.gold:'#b6e5d9');
  }
  // Lily pads and reeds anchor the shore.
  for(let i=0;i<9;i++){const px=X-330+i*78;box(px,y+48,12,4,'#527f59');box(px+4,y+44,8,4,'#7ca66d');}
}
function cabin(x,y){
  const X=wx(x);if(X<-120||X>W+120)return;
  box(X-46,y-40,92,48,'#b68a62');box(X-52,y-48,104,12,'#76544d');box(X-40,y-60,80,12,'#8b6251');
  box(X-30,y-32,16,16,'#8ec6c3');box(X+15,y-32,16,16,'#8ec6c3');box(X-8,y-24,20,32,'#654a42');
  box(X-42,y-38,8,8,'#d4ac79');text('CABANA',X,y+20,8,P.cream);
}
function house(x,y,w,label,kind=0){
  const X=wx(x);if(X<-w-40||X>W+w+40)return;
  const body=kind%2?'#d4b88b':'#e1c99d',roof=kind%3===0?'#a9655a':'#7b6256';
  box(X-w/2,y-50,w,50,body);box(X-w/2-8,y-60,w+16,12,roof);
  box(X-w/2+8,y-68,w-16,8,roof);box(X-w/2+18,y-36,20,16,'#83b9ba');
  box(X-w/2+22,y-36,4,16,'#e4d9b7');box(X-w/2+18,y-30,20,4,'#e4d9b7');
  box(X+w/2-28,y-28,18,28,'#795748');box(X+w/2-24,y-20,4,4,'#d9ba78');
  box(X-w/2+4,y-4,w-8,4,'#a98b69');text(label,X,y-74,9,'#fff0d1');
}
function van(x,y){
  const X=wx(x);if(X<-150||X>W+150)return;
  box(X-100,y-36,196,44,'#d78e6a');box(X-74,y-52,128,20,'#d78e6a');box(X-60,y-48,36,16,'#9bcac8');box(X-16,y-48,36,16,'#9bcac8');
  box(X-104,y-20,204,12,'#ad6d56');box(X-70,y+4,28,20,'#2c3a3e');box(X+48,y+4,28,20,'#2c3a3e');
  box(X-64,y+8,12,12,'#a8b7a3');box(X+54,y+8,12,12,'#a8b7a3');box(X+78,y-18,12,8,P.gold);
  text('FIREFLY',X+8,y-6,12,'#fff0d1');
}
function drawLobby(){
  box(0,420,W,300,'#789a69');box(0,456,W,264,'#91ad76');
  for(let i=0;i<40;i++){const x=(i*113)%W,y=466+(i*47)%230;box(x,y,12,4,i%2?'#a8c48b':'#739768');}
  pathSegment(80,550,1120);
  tree(110,442,.72,0);tree(330,442,.64,1);tree(1030,442,.72,0);tree(1190,442,.64,1);
  house(560,480,170,'LOJINHA',1);house(790,480,210,'GARAGEM',2);van(980,520);
  text('PONTO DE PARTIDA',380,395,12,P.cream);text('VILA LUMINA  →',1130,590,10,P.cream);
}
function drawVillage(){
  box(0,420,W,300,'#789a69');box(0,472,W,248,'#91ad76');
  for(let i=0;i<60;i++){const x=(i*83)%W,y=480+(i*37)%210;box(x,y,8,4,i%2?'#a8c48b':'#739768');}
  pathSegment(0,548,1920);
  tree(85,438,.54,0);tree(300,438,.50,1);tree(670,438,.52,0);tree(930,438,.48,1);tree(1195,438,.5,0);tree(1515,438,.5,1);tree(1810,438,.54,0);
  house(180,486,150,'CASA DA LUNA',0);house(470,486,160,'PRAÇA',1);house(780,486,160,'CASA DO THEO',2);
  house(1050,486,145,'MERCADO',1);house(1390,486,155,'TAVERNA',0);house(1690,486,135,'OFICINA',2);
  for(let x=100;x<1850;x+=118)flower(x,574,x%2?'#e9a7ad':'#c6d98d');
  text('VILA LUMINA',980,330,18,'#fff0d1');text('um lugar para respirar',980,350,10,'#dce9d0');
}
function drawForest(){
  box(0,420,W,300,'#527b59');box(0,460,W,260,'#789b68');
  // Soft patchwork ground texture with deterministic tile placement.
  for(let i=0;i<180;i++){
    const world=i*47, x=wx(world), y=462+(i*61)%220;
    if(x<-20||x>W+20)continue;
    box(x,y,12+(i%3)*4,4,i%5===0?'#9fba80':i%2?'#6d915f':'#86a873');
  }
  // Deep tree wall and distant grove.
  for(let i=0;i<29;i++)tree(i*188+80,435+(i%3)*8,.65+(i%4)*.11,i%3===0?1:0);
  // Route is a broken ribbon, not a flat stripe.
  for(let x=0;x<5200;x+=76){const y=550+Math.round(Math.sin(x*.012)*8/4)*4;pathSegment(x,y,80);}
  lake();
  // Named points of interest are composed from the same tile palette.
  cabin(900,505);
  const ax=wx(1220);if(ax>-80&&ax<W+80){for(let i=0;i<5;i++){box(ax-40+i*20,490-(i%2)*8,8,24,'#658b5b');box(ax-44+i*20,486-(i%2)*8,12,8,'#a7c88a');}}
  const dx=wx(1810);if(dx>-180&&dx<W+180){box(dx-88,530,176,12,'#9c7756');box(dx-78,542,8,22,'#765541');box(dx+66,542,8,22,'#765541');for(let i=0;i<8;i++)box(dx-70+i*20,530,4,12,'#d0ad79');}
  const log=wx(2640);if(log>-120&&log<W+120){box(log-76,510,152,16,'#765441');box(log-68,506,136,8,'#9b7051');}
  for(let x=300;x<5100;x+=370)stone(x,548+(x%3)*3,.65+(x%4)*.1);
  // Ancient tree is deliberately a silhouette landmark.
  tree(4820,442,1.65,1);
  // Cave mouth: a dark pixel arch with cool crystal accents.
  const cx=wx(3880);if(cx>-200&&cx<W+200){
    box(cx-92,400,184,76,'#52665b');box(cx-76,380,152,24,'#52665b');box(cx-52,364,104,24,'#52665b');
    box(cx-44,404,88,72,'#1e303a');box(cx-32,392,64,84,'#14232e');
    for(let i=0;i<6;i++){box(cx-36+i*12,456-(i%3)*8,8,20,i%2?P.crystal:P.lilac);}
    text('CAVERNA ECOANTE',cx,496,9,P.cream);
  }
  for(let i=0;i<55;i++){const x=(i*89+Math.floor(state.camera.x*.14))%W,y=485+(i*53)%205;if(i%3===0)flower(x,y,i%2?'#e9a7ad':'#d8d993',false);}
}
function drawCave(){
  box(0,0,W,H,P.cave);
  for(let i=0;i<32;i++){
    const x=(i*173+Math.floor(state.camera.x*.12))%(W+80)-40;
    box(x,0,44,24,'#223d4a');box(x+12,24,20,12,'#2b4a55');
    box(x,650,52,70,'#294652');box(x+12,626,28,24,'#345561');
  }
  box(0,420,W,300,'#203b48');
  for(let i=0;i<24;i++){
    const x=wx(i*157+70);if(x<-60||x>W+60)continue;
    box(x,535,8,36,'#49717a');box(x-4,547,16,24,'#49717a');box(x,539,4,20,i%2?P.crystal:P.lilac);
  }
  for(let i=0;i<15;i++){
    const x=wx(i*233+110);if(x<-100||x>W+100)continue;
    box(x-16,568,32,8,'#425a5c');box(x-8,560,24,8,'#5d7470');
  }
  // Crystal clusters with a restrained glow rendered as solid pixels.
  for(let i=0;i<10;i++){
    const x=wx(i*337+180);if(x<-80||x>W+80)continue;
    box(x-12,552,28,8,'#365a64');box(x-8,520,8,32,P.crystal);box(x,504,8,48,P.lilac);box(x+8,532,8,20,P.crystal);
  }
  text('GALERIA DOS ECOS',640,70,12,'#b4d9d0');
}
function drawForeground(){
  if(!['forest','village','lobby'].includes(state.map))return;
  // Close ferns frame the bottom edge, fixed to the camera to keep the composition calm.
  for(let i=0;i<20;i++){
    const x=(i*73+Math.floor(state.camera.x*.7))% (W+40)-20;
    const y=628+(i%4)*16;
    box(x,y,4,28,'#315c46');box(x-8,y+8,12,4,'#4f8054');box(x+4,y+16,12,4,'#4f8054');
  }
}

function locationPlaque(){
  let name='',sub='';
  if(state.map==='lobby'){name='ACAMPAMENTO FIREFLY';sub='Sua próxima expedição começa aqui';}
  else if(state.map==='village'){name='VILA LUMINA';sub='Converse com moradores e prepare-se';}
  else if(state.map==='forest'){
    const x=state.player.x;
    const zones=[
      [620,'ENTRADA DA FLORESTA','O caminho começa entre as árvores'],
      [1450,'CLAREIRA DAS FLORES','Procure asas coloridas e pequenos rastros'],
      [2450,'LAGOA CINTILANTE','Olhe perto da água por criaturas curiosas'],
      [3400,'TRILHA ANTIGA','Pedras e troncos escondem recursos'],
      [4200,'PEDREIRA ABANDONADA','Cristais e minérios aparecem por aqui'],
      [5200,'BOSQUE ALTO','Um lugar raro e silencioso']
    ];
    const z=zones.find(([end])=>x<end)||zones[zones.length-1];name=z[1];sub=z[2];
  } else if(state.map==='cave'){
    const x=state.player.x;
    const zones=[[650,'BOCA DA CAVERNA','Vá com calma: a luz não chega longe'],[1450,'GALERIA DOS ECOS','Ouça e observe os cantos'],[2450,'SALÃO DE CRISTAL','Cristais iluminam os túneis'],[3600,'TÚNEIS PROFUNDOS','Criaturas raras preferem o escuro']];
    const z=zones.find(([end])=>x<end)||zones[zones.length-1];name=z[1];sub=z[2];
  }
  if(!name)return;
  const width=Math.min(470,Math.max(250,name.length*11+44));
  box(W/2-width/2,24,width,58,'#294d3d');
  box(W/2-width/2+4,28,width-8,50,'#e9e0bd');
  box(W/2-width/2+10,34,5,38,'#d4ad61');
  text(name,W/2,52,12,'#315442','center');
  text(sub,W/2,70,7,'#6b8065','center');
}

export function drawPixelWorld(){
  ctx.save();
  sky();
  if(state.map==='lobby')drawLobby();
  else if(state.map==='village')drawVillage();
  else if(state.map==='cave')drawCave();
  else drawForest();
  locationPlaque();
  ctx.restore();
}

export function drawPixelCreature(e){
  if(!e.visible)return;
  const X=wx(e.x),Y=snap(e.y);
  ctx.save();ctx.translate(X,Y);if(e.vx<0)ctx.scale(-1,1);
  // A small ground/contact shadow makes every silhouette readable against grass.
  if(!['butterfly','bat','firefly','cavefly','rare'].includes(e.type))box(-24,18,48,6,'#355345');
  if(e.type==='butterfly'){
    const flap=e.aiState==='landed'?0:Math.sin(state.t*15+e.phase);
    box(-28,-10,20,20,flap>0?'#eaa0b2':'#d985a1');box(-24,-14,12,8,'#f4c4cf');box(-24,10,12,8,'#d985a1');
    box(8,-10,20,20,flap<0?'#f0d27a':'#d9b65e');box(12,-14,12,8,'#fff0ad');box(12,10,12,8,'#d9b65e');
    box(-4,-12,8,28,'#72505c');box(-4,-20,4,8,'#72505c');box(0,-24,4,8,'#72505c');
  }else if(e.type==='frog'){
    box(-24,-12,48,28,'#4d8e55');box(-20,-16,40,20,'#73b967');box(-20,-24,12,12,'#86ca75');box(8,-24,12,12,'#86ca75');
    box(-16,-24,8,8,'#fff0b2');box(8,-24,8,8,'#fff0b2');box(-12,-20,4,8,'#243a32');box(12,-20,4,8,'#243a32');
    box(-28,8,16,8,'#4d8e55');box(12,8,16,8,'#4d8e55');box(-28,16,12,4,'#386e49');box(16,16,12,4,'#386e49');
    box(-8,0,16,4,'#315c3e');
  }else if(e.type==='lizard'){
    box(-20,-8,36,16,'#699b63');box(-8,-12,28,12,'#8ab879');box(12,-12,16,12,'#8ab879');box(20,-8,4,4,'#253d31');
    box(-28,-4,12,8,'#527f55');box(-40,0,16,8,'#527f55');box(-52,4,16,4,'#527f55');
    box(-16,8,8,8,'#426b4a');box(8,8,8,8,'#426b4a');box(12,-4,8,4,'#f1d37b');
  }else if(e.type==='spider'){
    box(-8,-8,16,20,'#45425b');box(-12,0,24,12,'#302f43');
    for(let i=0;i<4;i++){box(-8,-8+i*5,-1,1,'#45425b');box(-20-i*4,-12+i*5,12,4,'#55516b');box(8,-12+i*5,12,4,'#55516b');box(-24-i*3,-8+i*5,8,4,'#39384d');box(16+i*3,-8+i*5,8,4,'#39384d');}
    box(-4,-4,4,4,'#f4d77b');box(4,-4,4,4,'#f4d77b');box(-4,-4,2,2,'#252535');box(4,-4,2,2,'#252535');
    if(e.webX!==undefined){ctx.strokeStyle='#e3e8d8';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-28);ctx.lineTo(0,-12);ctx.stroke();}
  }else if(e.type==='mouse'){
    box(-20,-8,36,20,'#8e7772');box(-12,-12,24,16,'#ad9186');box(-20,-20,12,12,'#c59b98');box(4,-20,12,12,'#c59b98');box(-16,-16,4,4,'#e5b6b0');box(8,-16,4,4,'#e5b6b0');
    box(8,-4,4,4,'#263b39');box(16,0,8,4,'#d6a9a0');box(-24,8,12,4,'#ad9186');
  }else if(e.type==='bat'){
    const flap=Math.sin(state.t*16+e.phase)>0;
    box(-32,-8,20,16,'#544d72');box(-28,-16,12,12,'#544d72');box(-36,0,12,12,'#6a6084');box(12,-8,20,16,'#544d72');box(16,-16,12,12,'#544d72');box(24,0,12,12,'#6a6084');
    if(flap){box(-40,-16,16,8,'#45415f');box(24,-16,16,8,'#45415f');}
    box(-8,-12,16,24,'#75658a');box(-8,-16,8,8,'#a89ac2');box(0,-16,8,8,'#a89ac2');box(-4,-4,4,4,'#ffe28a');box(4,-4,4,4,'#ffe28a');
  }else{
    const rare=e.type==='rare'||e.type==='cavefly';
    const core=rare?'#d8a7ff':'#f5df75',wing=rare?'#9d85d6':'#fff0a5';
    box(-12,-8,24,20,core);box(-8,-12,16,8,core);box(-24,-12,12,8,wing);box(-28,-8,12,8,wing);box(12,-12,12,8,wing);box(16,-8,12,8,wing);
    box(-4,-4,8,8,'#fff7cf');
    if(rare){box(-20,-24,40,4,'#b995e9');box(-24,-20,4,8,'#b995e9');box(20,-20,4,8,'#b995e9');}
  }
  ctx.restore();
}

export function drawPixelForeground(){ctx.save();drawForeground();ctx.restore();}
export function drawPixelPlayer(){
  const p=state.player,X=wx(p.x),Y=snap(p.y+(p.mode==='walk'?Math.sin(p.bob)*2:0)),stride=p.mode==='walk'?Math.round(Math.sin(p.bob)*4):0;
  ctx.save();ctx.translate(X,Y);if(p.face<0)ctx.scale(-1,1);
  // Ground shadow, backpack, legs, boots, jacket, skin, hair and field net.
  box(-20,28,40,8,'#355345');
  box(-18,-4,12,32,'#735d4e');box(-20,0,8,20,'#9c7b5b');
  box(-12,20+stride,12,20,'#394c50');box(4,20-stride,12,20,'#394c50');
  box(-16,36+stride,16,8,'#26373d');box(4,36-stride,16,8,'#26373d');
  box(-16,-22,32,40,'#6b8b77');box(-12,-22,24,8,'#86a78a');box(-4,-18,8,28,'#d3bd83');
  box(-24,-16,8,28,'#6b8b77');box(16,-16,8,28,'#6b8b77');
  box(-12,-38,24,20,'#e6b68b');box(-16,-42,32,12,'#342f3c');box(-12,-50,24,12,'#342f3c');box(-8,-54,16,8,'#342f3c');
  box(4,-34,4,4,'#28323b');box(4,-26,8,4,'#a46b60');
  // Signature warm scarf and a small net handle.
  box(-12,-12,24,8,'#d9ba78');box(20,-12,28,4,'#d6c69c');box(44,-28,4,28,'#e5d6b5');
  box(40,-32,20,4,'#e5d6b5');box(40,-32,4,20,'#e5d6b5');
  ctx.restore();
}
