import {WORLD,NPCS,QUESTS,MEMORIES,GAME_VERSION} from "./data.js";

const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);

export class Game{
 constructor(canvas,ui){
  this.canvas=canvas;this.ctx=canvas.getContext("2d");this.ui=ui;this.keys=new Set();this.last=0;this.running=false;
  this.state={version:GAME_VERSION,player:{x:650,y:650},money:0,quest:{id:"intro",state:"AVAILABLE",step:0},discoveries:[],memories:[],knowledge:[]};
  this.npcs=NPCS.map(n=>({...n}));this.dialog=null;this.dialogIndex=0;this.resize();
  addEventListener("resize",()=>this.resize());
 }
 resize(){this.dpr=Math.min(devicePixelRatio||1,2);this.canvas.width=innerWidth*this.dpr;this.canvas.height=innerHeight*this.dpr;this.canvas.style.width=innerWidth+"px";this.canvas.style.height=innerHeight+"px";this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0)}
 start(){this.running=true;this.last=performance.now();requestAnimationFrame(t=>this.loop(t));this.updateQuestUI();this.ui.toast("Explorá Villa Pelón. Tu primera misión empieza con Marta.")}
 loop(t){if(!this.running)return;const dt=Math.min((t-this.last)/1000,.05);this.last=t;this.update(dt);this.render();requestAnimationFrame(x=>this.loop(x))}
 update(dt){
  if(this.dialog)return;let x=0,y=0;
  if(this.keys.has("ArrowLeft")||this.keys.has("a"))x--;if(this.keys.has("ArrowRight")||this.keys.has("d"))x++;
  if(this.keys.has("ArrowUp")||this.keys.has("w"))y--;if(this.keys.has("ArrowDown")||this.keys.has("s"))y++;
  if(x||y){const l=Math.hypot(x,y);x/=l;y/=l;const speed=210;this.state.player.x=clamp(this.state.player.x+x*speed*dt,55,WORLD.width-55);this.state.player.y=clamp(this.state.player.y+y*speed*dt,55,WORLD.height-55)}
 }
 render(){
  const c=this.ctx,w=innerWidth,h=innerHeight,p=this.state.player;c.clearRect(0,0,w,h);
  const camX=clamp(p.x-w/2,0,WORLD.width-w),camY=clamp(p.y-h/2,0,WORLD.height-h);
  c.save();c.translate(-camX,-camY);this.drawWorld(c);this.npcs.forEach(n=>this.drawNPC(c,n));this.drawPlayer(c,p);c.restore();
 }
 drawWorld(c){
  c.fillStyle="#6f8a58";c.fillRect(0,0,WORLD.width,WORLD.height);
  c.fillStyle="#8d785c";c.fillRect(0,900,WORLD.width,300);
  c.fillStyle="#4f8ca1";c.fillRect(1120,0,260,1200);
  c.fillStyle="#9d8b68";c.fillRect(1100,0,20,1200);c.fillRect(1380,0,20,1200);
  c.fillStyle="#b8a27a";c.fillRect(120,360,980,100);c.fillRect(430,120,105,760);
  c.fillStyle="#a48b65";c.fillRect(0,680,1100,65);c.fillRect(970,530,150,70);
  this.rect(c,250,570,190,125,"#9a674d");this.rect(c,700,250,150,120,"#77645c");this.rect(c,470,370,120,100,"#c19a68");this.rect(c,1020,480,90,100,"#8b6c50");
  c.fillStyle="#b6a77f";c.fillRect(430,370,180,170);c.fillStyle="#78905e";c.fillRect(455,395,130,120);
  for(let x=0;x<WORLD.width;x+=48)for(let y=0;y<WORLD.height;y+=48){if((x+y)%96===0){c.fillStyle="rgba(255,255,255,.035)";c.fillRect(x,y,1,1)}}
  [[190,300],[330,290],[660,560],[870,500],[910,760],[170,780],[540,1040],[800,1030],[960,1030]].forEach(([x,y])=>this.tree(c,x,y));
  c.font="bold 13px system-ui";c.textAlign="center";c.fillStyle="rgba(20,25,25,.8)";
  [["PLAZA",520,365],["CASA DE LA MEMORIA",775,245],["ALMACÉN",345,555],["PUENTE",1045,520]].forEach(([s,x,y])=>c.fillText(s,x,y));
 }
 rect(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(x,y,w,h);c.fillStyle="rgba(0,0,0,.18)";c.fillRect(x,y,w,5)}
 tree(c,x,y){c.fillStyle="#6d4937";c.fillRect(x-5,y,10,20);c.fillStyle="#355f49";c.fillRect(x-22,y-28,44,40);c.fillStyle="#477456";c.fillRect(x-14,y-40,28,20)}
 drawNPC(c,n){c.fillStyle="rgba(0,0,0,.2)";c.fillRect(n.x-15,n.y+17,30,7);c.fillStyle=n.color;c.fillRect(n.x-13,n.y-13,26,30);c.fillStyle="#ead0b0";c.fillRect(n.x-10,n.y-25,20,17);c.fillStyle="#20252a";c.fillRect(n.x-7,n.y-22,4,4);c.fillRect(n.x+3,n.y-22,4,4);c.font="12px system-ui";c.textAlign="center";c.fillStyle="#fff";c.fillText(n.name,n.x,n.y-34)}
 drawPlayer(c,p){c.fillStyle="rgba(0,0,0,.25)";c.fillRect(p.x-15,p.y+17,30,7);c.fillStyle="#d96f76";c.fillRect(p.x-13,p.y-13,26,30);c.fillStyle="#f0c7a5";c.fillRect(p.x-10,p.y-25,20,17);c.fillStyle="#3c2835";c.fillRect(p.x-11,p.y-29,22,9);c.fillStyle="#252a30";c.fillRect(p.x-7,p.y-21,4,4);c.fillRect(p.x+3,p.y-21,4,4);c.font="12px system-ui";c.textAlign="center";c.fillStyle="#fff";c.fillText("Luna",p.x,p.y-34)}
 nearest(){
  const p=this.state.player;let best=null,bd=Infinity;
  for(const n of this.npcs){const d=dist(p,n);if(d<bd){bd=d;best=n}}
  for(const l of WORLD.landmarks){const d=dist(p,l);if(d<bd){bd=d;best=l}}
  return best&&bd<75?best:null;
 }
 interact(){
  if(this.dialog){this.nextDialog();return}
  const target=this.nearest();if(!target){this.ui.toast("No hay nada cerca con lo que interactuar.");return}
  if(target.id==="plaza"){this.discover("plaza");return}
  if(target.id==="marta"){this.startMarta();return}
  this.startDialog(target);
 }
 startMarta(){
  if(this.state.quest.step===0)this.state.quest.step=1;
  if(this.state.quest.step===2){this.completeQuest();return}
  this.startDialog(this.npcs.find(n=>n.id==="marta"));this.updateQuestUI();
 }
 startDialog(n){this.dialog={name:n.name,lines:n.dialogue};this.dialogIndex=0;this.ui.showDialog(n.name,n.dialogue[0])}
 nextDialog(){this.dialogIndex++;if(this.dialogIndex>=this.dialog.lines.length){this.dialog=null;this.ui.hideDialog();this.updateQuestUI();return}this.ui.showDialog(this.dialog.name,this.dialog.lines[this.dialogIndex])}
 discover(id){
  if(!this.state.discoveries.includes(id))this.state.discoveries.push(id);
  if(id==="plaza"&&this.state.quest.step===1){this.state.quest.step=2;this.ui.toast("Descubrimiento registrado: Plaza.");this.updateQuestUI();this.startDialog({name:"Luna",dialogue:["La plaza queda registrada como un lugar para investigar. Todavía no voy a inventar su historia."]})}
 }
 completeQuest(){
  this.state.quest.state="COMPLETED";this.state.money+=QUESTS.intro.reward.money;
  const m=QUESTS.intro.reward.memory;if(!this.state.memories.includes(m))this.state.memories.push(m);
  this.ui.toast("Misión completada. Nueva memoria registrada.");this.updateQuestUI();this.save();
 }
 updateQuestUI(){
  const q=this.state.quest,data=QUESTS[q.id];
  if(q.state==="COMPLETED"){this.ui.quest("Primer recorrido","Completada · +25 monedas");return}
  const obj=data.objectives[q.step];this.ui.quest(data.title,obj?obj.label:"Hablar con Marta");
 }
 save(){localStorage.setItem("luna-villa-pelon-save",JSON.stringify(this.state));this.ui.toast("Partida guardada.")}
 load(){try{const raw=localStorage.getItem("luna-villa-pelon-save");if(raw)this.state=JSON.parse(raw)}catch(e){console.warn("Save inválido",e)}this.updateQuestUI()}
 journal(tab="missions"){this.ui.renderJournal(this.state,QUESTS,MEMORIES,tab)}
}
