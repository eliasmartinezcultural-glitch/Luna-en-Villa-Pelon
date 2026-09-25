import {WORLD,NPCS,QUESTS,MEMORIES,GAME_VERSION,WORLD_EVENTS} from "./data.js";

const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const lerp=(a,b,t)=>a+(b-a)*t;
const DAY=420;

export class Game{
 constructor(canvas,ui){
  this.canvas=canvas;this.ctx=canvas.getContext("2d");this.ui=ui;this.keys=new Set();this.last=0;this.running=false;
  this.state=this.defaultState();
  this.npcs=NPCS.map(n=>({...n,x:n.home.x,y:n.home.y,activity:"home"}));
  this.dialog=null;this.dialogIndex=0;this.particles=[];this.resize();
  addEventListener("resize",()=>this.resize());
 }
 defaultState(){return{version:GAME_VERSION,player:{x:650,y:650},money:0,quest:{id:"intro",state:"AVAILABLE",step:0},discoveries:[],memories:[],knowledge:[],world:{day:1,time:8*60,weather:"clear",seed:73}}}
 resize(){this.dpr=Math.min(devicePixelRatio||1,2);this.canvas.width=innerWidth*this.dpr;this.canvas.height=innerHeight*this.dpr;this.canvas.style.width=innerWidth+"px";this.canvas.style.height=innerHeight+"px";this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0)}
 start(){this.running=true;this.last=performance.now();requestAnimationFrame(t=>this.loop(t));this.updateQuestUI();this.ui.toast("Villa Pelón está despierta. Explorá y prestá atención a lo que cambia.")}
 loop(t){if(!this.running)return;const dt=Math.min((t-this.last)/1000,.05);this.last=t;this.update(dt);this.render();requestAnimationFrame(x=>this.loop(x))}
 update(dt){
  this.advanceWorld(dt);
  if(this.dialog)return;
  let x=0,y=0;
  if(this.keys.has("ArrowLeft")||this.keys.has("a"))x--;if(this.keys.has("ArrowRight")||this.keys.has("d"))x++;
  if(this.keys.has("ArrowUp")||this.keys.has("w"))y--;if(this.keys.has("ArrowDown")||this.keys.has("s"))y++;
  if(x||y){const l=Math.hypot(x,y);x/=l;y/=l;const speed=this.movementSpeed();this.state.player.x=clamp(this.state.player.x+x*speed*dt,55,WORLD.width-55);this.state.player.y=clamp(this.state.player.y+y*speed*dt,55,WORLD.height-55)}
  this.updateNPCs(dt);this.updateParticles(dt);
 }
 advanceWorld(dt){
  this.state.world.time+=dt*3;
  if(this.state.world.time>=24*60){this.state.world.time-=24*60;this.state.world.day++;}
  const hour=this.state.world.time/60;
  const cycle=Math.sin(this.state.world.time/1440*Math.PI*2);
  this.state.world.weather=Math.abs(cycle)<.18?"windy":(this.state.world.day%7===4?"cloudy":"clear");
 }
 movementSpeed(){const h=this.state.world.time/60;return h>=22||h<6?185:210}
 period(){const h=this.state.world.time/60;return h<12?"morning":h<18?"afternoon":"evening"}
 updateNPCs(dt){
  const period=this.period();
  this.npcs.forEach((n,i)=>{
   const target=n.schedule?.[period]||n.home;
   const wobble=Math.sin(this.state.world.time*.025+i*1.7)*8;
   const tx=target.x+wobble,ty=target.y+Math.cos(this.state.world.time*.021+i)*6;
   const d=Math.hypot(tx-n.x,ty-n.y);
   if(d>5){const step=Math.min(d,dt*(24+(i%3)*4));n.x=lerp(n.x,tx,step/d);n.y=lerp(n.y,ty,step/d);n.activity=period}else n.activity="idle";
  });
 }
 updateParticles(dt){
  const p=this.state.world.weather==="windy"?1.5:.35;
  if(Math.random()<dt*p){this.particles.push({x:this.state.player.x+(Math.random()-.5)*innerWidth,y:this.state.player.y+(Math.random()-.5)*innerHeight,life:1,size:1+Math.random()*2,vx:-15-Math.random()*20,vy:Math.random()*8})}
  this.particles.forEach(q=>{q.life-=dt;q.x+=q.vx*dt;q.y+=q.vy*dt});this.particles=this.particles.filter(q=>q.life>0);
 }
 render(){
  const c=this.ctx,w=innerWidth,h=innerHeight,p=this.state.player;c.clearRect(0,0,w,h);
  const camX=clamp(p.x-w/2,0,Math.max(0,WORLD.width-w)),camY=clamp(p.y-h/2,0,Math.max(0,WORLD.height-h));
  c.save();c.translate(-camX,-camY);this.drawWorld(c);this.drawLandmarks(c);this.npcs.forEach(n=>this.drawNPC(c,n));this.drawPlayer(c,p);this.drawParticles(c,camX,camY);c.restore();this.drawAtmosphere(c,w,h);
 }
 drawWorld(c){
  c.fillStyle="#6f8a58";c.fillRect(0,0,WORLD.width,WORLD.height);
  WORLD.zones.forEach(z=>{c.fillStyle=z.color;c.fillRect(z.x,z.y,z.w,z.h)});
  c.fillStyle="#4f8ca1";c.fillRect(1450,0,330,1500);
  c.fillStyle="#a88b65";c.fillRect(1780,0,620,1500);
  WORLD.paths.forEach(p=>{c.fillStyle="#b7a277";c.fillRect(p.x,p.y,p.w,p.h);c.fillStyle="rgba(255,255,255,.08)";c.fillRect(p.x,p.y,p.w,2)});
  this.drawRiver(c);this.drawVegetation(c);this.drawBuildings(c);this.drawSigns(c);
 }
 drawRiver(c){
  const t=this.state.world.time*.02;
  for(let y=0;y<1500;y+=34){c.fillStyle="rgba(230,246,242,.13)";c.fillRect(1470+Math.sin(t+y*.02)*18,y,70,2)}
  c.fillStyle="rgba(20,60,60,.12)";c.fillRect(1550,0,6,1500);
 }
 drawVegetation(c){
  const spots=[[180,300],[330,290],[760,580],[1010,540],[1120,820],[170,880],[540,1150],[900,1160],[1180,1120],[1950,900],[2210,780],[2050,500]];
  spots.forEach(([x,y],i)=>this.tree(c,x,y,0.85+(i%3)*.12));
  for(let x=40;x<1450;x+=72)for(let y=1040;y<1480;y+=72)if((x+y)%144===0)this.crop(c,x,y);
 }
 drawBuildings(c){
  [[290,600,190,125,"#9a674d"],[820,260,160,125,"#77645c"],[520,390,260,175,"#b6a77f"],[1110,500,110,105,"#8b6c50"]].forEach(a=>this.rect(c,...a));
 }
 drawSigns(c){
  c.font="bold 13px system-ui";c.textAlign="center";c.fillStyle="rgba(20,25,25,.72)";
  [["PLAZA",650,405],["CASA DE LA MEMORIA",900,250],["ALMACÉN",385,585],["PUENTE",1410,540],["CHACRAS",650,1035],["MIRADOR",2100,270]].forEach(([s,x,y])=>c.fillText(s,x,y));
 }
 drawLandmarks(c){
  WORLD.landmarks.forEach(l=>{const known=this.state.discoveries.includes(l.id);c.beginPath();c.arc(l.x,l.y,l.radius,0,Math.PI*2);c.strokeStyle=known?"rgba(228,194,123,.28)":"rgba(255,255,255,.08)";c.lineWidth=2;c.stroke();if(known){c.fillStyle="rgba(228,194,123,.85)";c.font="10px system-ui";c.fillText("✓",l.x+l.radius-5,l.y-l.radius+12)}});
 }
 rect(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(x,y,w,h);c.fillStyle="rgba(0,0,0,.18)";c.fillRect(x,y,w,5)}
 tree(c,x,y,s=1){c.fillStyle="#654837";c.fillRect(x-5*s,y,10*s,20*s);c.fillStyle="#355f49";c.beginPath();c.arc(x,y-20*s,24*s,0,Math.PI*2);c.fill();c.fillStyle="#477456";c.beginPath();c.arc(x-10*s,y-34*s,18*s,0,Math.PI*2);c.fill()}
 crop(c,x,y){c.strokeStyle="rgba(74,91,46,.65)";c.lineWidth=3;c.beginPath();c.moveTo(x-10,y+8);c.lineTo(x,y-10);c.lineTo(x+10,y+8);c.stroke()}
 drawNPC(c,n){const near=dist(this.state.player,n)<110;c.fillStyle="rgba(0,0,0,.22)";c.ellipse(n.x,n.y+19,17,6,0,0,Math.PI*2);c.fill();c.fillStyle=n.color;c.fillRect(n.x-13,n.y-13,26,30);c.fillStyle="#ead0b0";c.fillRect(n.x-10,n.y-25,20,17);c.fillStyle="#20252a";c.fillRect(n.x-7,n.y-22,4,4);c.fillRect(n.x+3,n.y-22,4,4);if(near){c.fillStyle="rgba(228,194,123,.9)";c.font="bold 10px system-ui";c.fillText("• "+n.activity,n.x,n.y+42)}c.font="12px system-ui";c.textAlign="center";c.fillStyle="#fff";c.fillText(n.name,n.x,n.y-34)}
 drawPlayer(c,p){c.fillStyle="rgba(0,0,0,.25)";c.ellipse(p.x,p.y+19,17,6,0,0,Math.PI*2);c.fill();c.fillStyle="#d96f76";c.fillRect(p.x-13,p.y-13,26,30);c.fillStyle="#f0c7a5";c.fillRect(p.x-10,p.y-25,20,17);c.fillStyle="#3c2835";c.fillRect(p.x-11,p.y-29,22,9);c.fillStyle="#252a30";c.fillRect(p.x-7,p.y-21,4,4);c.fillRect(p.x+3,p.y-21,4,4);c.font="12px system-ui";c.textAlign="center";c.fillStyle="#fff";c.fillText("Luna",p.x,p.y-34)}
 drawParticles(c,camX,camY){this.particles.forEach(q=>{c.fillStyle="rgba(235,222,184,"+q.life*.22+")";c.fillRect(q.x+camX,q.y+camY,q.size,q.size)})}
 drawAtmosphere(c,w,h){
  const hour=this.state.world.time/60;let alpha=hour<6||hour>20?.18:hour<8?(8-hour)*.035:hour>18?(hour-18)*.025:.02;
  c.fillStyle="rgba(14,20,25,"+alpha+")";c.fillRect(0,0,w,h);
 }
 nearest(){
  const p=this.state.player;let best=null,bd=Infinity;
  for(const n of this.npcs){const d=dist(p,n);if(d<bd){bd=d;best=n}}
  for(const l of WORLD.landmarks){const d=dist(p,l);if(d<bd){bd=d;best=l}}
  return best&&bd<85?best:null;
 }
 interact(){
  if(this.dialog){this.nextDialog();return}
  const target=this.nearest();
  if(!target){this.ui.toast("Acercate a una persona o lugar para interactuar.");return}
  if(target.id==="marta"){this.startMarta();return}
  if(target.id==="raul"){this.startRaul();return}
  if(target.id==="plaza"||target.id==="puente"||target.id==="chacra"||target.id==="mirador"||target.id==="archivo"||target.id==="almacen"){this.discover(target.id);return}
  this.startDialog(target);
 }
 startMarta(){
  if(this.state.quest.id==="intro"&&this.state.quest.step===0)this.state.quest.step=1;
  if(this.state.quest.id==="intro"&&this.state.quest.step===2){this.completeQuest();return}
  this.startDialog(this.npcs.find(n=>n.id==="marta"));this.updateQuestUI();
 }
 startRaul(){
  if(this.state.quest.id==="river"&&this.state.quest.step===0)this.state.quest.step=1;
  if(this.state.quest.id==="river"&&this.state.quest.step===2){this.completeQuest();return}
  this.startDialog(this.npcs.find(n=>n.id==="raul"));this.updateQuestUI();
 }
 startDialog(n){this.dialog={name:n.name,lines:n.dialogue};this.dialogIndex=0;this.ui.showDialog(n.name,n.dialogue[0])}
 nextDialog(){this.dialogIndex++;if(this.dialogIndex>=this.dialog.lines.length){this.dialog=null;this.ui.hideDialog();this.updateQuestUI();return}this.ui.showDialog(this.dialog.name,this.dialog.lines[this.dialogIndex])}
 discover(id){
  if(!this.state.discoveries.includes(id)){this.state.discoveries.push(id);this.ui.toast("Descubrimiento registrado: "+id+".")}
  if(id==="plaza"&&this.state.quest.id==="intro"&&this.state.quest.step===1){this.state.quest.step=2;this.updateQuestUI();this.startDialog({name:"Luna",dialogue:["La plaza queda registrada. Ahora puedo volver con Marta."]})}
  if(id==="puente"&&this.state.quest.id==="river"&&this.state.quest.step===1){this.state.quest.step=2;this.updateQuestUI();this.startDialog({name:"Luna",dialogue:["El río cambia delante de mis ojos. Lo observado queda separado de lo que todavía tengo que investigar."]})}
  if(id==="puente"&&!this.state.discoveries.includes("river-intro")){}
  if(id==="chacra")this.addKnowledge("El trabajo de la chacra forma parte del territorio vivo que Luna puede observar.");
  if(id==="mirador")this.addKnowledge("Desde los lugares altos se pueden observar relaciones entre caminos, agua, cultivos y asentamientos.");
  if(id==="archivo")this.addKnowledge("La Casa de la Memoria es un punto de investigación: observar no significa inventar.");
  this.updateQuestUI();
 }
 addKnowledge(text){if(!this.state.knowledge.includes(text)){this.state.knowledge.push(text);this.ui.toast("Nuevo conocimiento registrado.");}}
 completeQuest(){
  const q=QUESTS[this.state.quest.id];if(!q)return;
  this.state.quest.state="COMPLETED";this.state.money+=q.reward.money;
  if(!this.state.memories.includes(q.reward.memory))this.state.memories.push(q.reward.memory);
  this.ui.toast("Misión completada. El mundo guarda esta experiencia.");this.updateQuestUI();this.save();
  if(this.state.quest.id==="intro")this.state.quest={id:"river",state:"AVAILABLE",step:0};
 }
 updateQuestUI(){
  const q=this.state.quest,data=QUESTS[q.id];if(!data){this.ui.quest("Exploración libre","Seguí recorriendo Villa Pelón");return}
  if(q.state==="COMPLETED"){this.ui.quest(data.title,"Completada · +"+data.reward.money+" monedas");return}
  const obj=data.objectives[q.step];this.ui.quest(data.title,obj?obj.label:"Explorá el territorio");
 }
 save(){localStorage.setItem("luna-villa-pelon-save",JSON.stringify(this.state));this.ui.toast("Partida guardada.")}
 load(){
  try{const raw=localStorage.getItem("luna-villa-pelon-save");if(raw){const old=JSON.parse(raw);this.state={...this.defaultState(),...old,world:{...this.defaultState().world,...old.world},player:{...this.defaultState().player,...old.player},quest:{...this.defaultState().quest,...old.quest}}}}catch(e){console.warn("Save inválido",e)}
  this.updateQuestUI();
 }
 journal(tab="missions"){this.ui.renderJournal(this.state,QUESTS,MEMORIES,tab)}
}
