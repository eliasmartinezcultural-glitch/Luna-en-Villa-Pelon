export const GAME_VERSION="0.1.0-vertical-slice";

export const WORLD={
 width:1800,height:1200,tile:48,
 zones:[
  {id:"town",name:"Centro de Villa Pelón",x:120,y:120,w:900,h:760},
  {id:"river",name:"Ribera",x:1120,y:0,w:260,h:1200},
  {id:"chacras",name:"Chacras",x:0,y:900,w:1120,h:300}
 ],
 landmarks:[
  {id:"plaza",name:"Plaza",x:520,y:420,kind:"public"},
  {id:"archivo",name:"Casa de la Memoria",x:760,y:330,kind:"institution"},
  {id:"almacen",name:"Almacén",x:350,y:650,kind:"business"},
  {id:"puente",name:"Puente",x:1080,y:570,kind:"route"}
 ]
};

export const NPCS=[
 {id:"marta",name:"Marta",role:"Guardiana de las memorias",x:760,y:390,color:"#d99a72",
  dialogue:["Hola, Luna. Si querés conocer Villa Pelón, empezá por mirar con atención.","La historia no debería aparecer como una clase: primero tenemos que encontrar las preguntas correctas.","Tu primera tarea es sencilla: recorré la plaza y volvé conmigo."]},
 {id:"tomas",name:"Tomás",role:"Vecino",x:420,y:520,color:"#76a8c4",
  dialogue:["Acá cada lugar tiene una historia, aunque todavía no esté escrita.","Si encontrás algo que parezca importante, anotá dónde estaba y qué viste."]},
 {id:"ines",name:"Inés",role:"Trabajadora de la chacra",x:260,y:1010,color:"#8eb477",
  dialogue:["El territorio también cuenta historias: caminos, agua, cultivos y trabajos dejan huellas.","Cuando investiguemos las chacras, vamos a necesitar fuentes antes de afirmar cualquier dato."]}
];

export const QUESTS={
 intro:{
  id:"intro",title:"Primer recorrido",giver:"marta",
  description:"Conocé Villa Pelón antes de intentar explicarla.",
  objectives:[
   {id:"talk-marta",label:"Hablar con Marta",type:"talk",target:"marta"},
   {id:"inspect-plaza",label:"Observar la Plaza",type:"discover",target:"plaza"},
   {id:"return-marta",label:"Volver con Marta",type:"talk",target:"marta",after:"inspect-plaza"}
  ],
  reward:{money:25,memory:"first-memory"},
  education:"La memoria histórica del juego se cargará únicamente con información documentada y verificada."
 }
};

export const MEMORIES={
 "first-memory":{
  id:"first-memory",title:"Primera memoria",status:"RESEARCH_REQUIRED",
  text:"La primera memoria de Villa Pelón quedó registrada como investigación pendiente. Antes de convertirla en un dato histórico, el proyecto debe incorporar una fuente verificable."
 }
};
