import {Game} from "./game.js";
import {MEMORIES,QUESTS} from "./data.js";

const canvas=document.querySelector("#game");
const ui={
 quest:(title,obj)=>{document.querySelector("#quest-title").textContent=title;document.querySelector("#quest-objective").textContent=obj},
 toast:(msg)=>{const el=document.querySelector("#toast");el.textContent=msg;el.classList.add("show");clearTimeout(ui._t);ui._t=setTimeout(()=>el.classList.remove("show"),2400)},
 showDialog:(name,text)=>{document.querySelector("#dialog-name").textContent=name;document.querySelector("#dialog-text").textContent=text;document.querySelector("#dialog").classList.remove("hidden")},
 hideDialog:()=>document.querySelector("#dialog").classList.add("hidden"),
 renderJournal:(state,quests,memories,tab)=>{
  const box=document.querySelector("#journal-content");
  document.querySelectorAll("[data-tab]").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));
  if(tab==="missions"){
   const q=state.quest,d=quests[q.id];
   box.innerHTML='<div class="entry"><small>'+q.state+'</small><strong>'+d.title+'</strong><p>'+d.description+'</p><p>'+d.objectives.map((o,i)=>(i<q.step?"✓ ":"• ")+o.label).join("<br>")+'</p></div>';
  }
  if(tab==="knowledge"){
   box.innerHTML=state.knowledge.length?state.knowledge.map(x=>'<div class="entry"><small>CONOCIMIENTO</small><p>'+x+'</p></div>').join(""):'<div class="entry"><p>Todavía no hay conocimientos consolidados. El juego los incorporará a medida que se verifiquen fuentes y se descubran en el mundo.</p></div>';
  }
  if(tab==="memories"){
   box.innerHTML=state.memories.length?state.memories.map(id=>{const m=memories[id];return '<div class="entry"><small>'+m.status+'</small><strong>'+m.title+'</strong><p>'+m.text+'</p></div>'}).join(""):'<div class="entry"><p>Las memorias aparecen cuando una misión cambia el estado del mundo.</p></div>';
  }
 }
};

const game=new Game(canvas,ui);
game.load();game.start();

addEventListener("keydown",e=>{
 const k=e.key;
 if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," ","w","a","s","d"].includes(k))e.preventDefault();
 if(k==="e"||k===" "){game.interact();return}
 if(k==="j"){toggleJournal();return}
 if(k==="g"){game.save();return}
 game.keys.add(k);
});
addEventListener("keyup",e=>game.keys.delete(e.key));

document.querySelector("#dialog-next").addEventListener("click",()=>game.interact());
document.querySelectorAll("[data-key]").forEach(btn=>{
 const key=btn.dataset.key;
 const down=e=>{e.preventDefault();game.keys.add(key)};
 const up=e=>{e.preventDefault();game.keys.delete(key)};
 btn.addEventListener("pointerdown",down);btn.addEventListener("pointerup",up);btn.addEventListener("pointercancel",up);btn.addEventListener("pointerleave",up);
});
document.querySelector('[data-action="interact"]').addEventListener("click",()=>game.interact());
document.querySelector('[data-action="save"]').addEventListener("click",()=>game.save());
document.querySelector('[data-action="journal"]').addEventListener("click",toggleJournal);
document.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>game.journal(b.dataset.tab)));

function toggleJournal(){
 const el=document.querySelector("#journal");el.classList.toggle("hidden");
 if(!el.classList.contains("hidden"))game.journal("missions");
}
