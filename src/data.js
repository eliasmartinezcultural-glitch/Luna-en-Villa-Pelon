export const GAME_VERSION="1.0.0-living-world";

export const WORLD={
 width:2400,height:1500,tile:48,
 zones:[
  {id:"town",name:"Centro de Villa Pelón",x:100,y:120,w:1250,h:820,color:"#6f8a58"},
  {id:"river",name:"Ribera",x:1450,y:0,w:330,h:1500,color:"#4f8ca1"},
  {id:"chacras",name:"Chacras",x:0,y:1080,w:1450,h:420,color:"#7f965c"},
  {id:"barda",name:"Bardas",x:1780,y:0,w:620,h:1500,color:"#a88b65"}
 ],
 landmarks:[
  {id:"plaza",name:"Plaza",x:650,y:470,kind:"public",radius:62},
  {id:"archivo",name:"Casa de la Memoria",x:900,y:350,kind:"institution",radius:55},
  {id:"almacen",name:"Almacén",x:390,y:710,kind:"business",radius:48},
  {id:"puente",name:"Puente",x:1410,y:610,kind:"route",radius:52},
  {id:"chacra",name:"Chacra",x:650,y:1230,kind:"production",radius:70},
  {id:"mirador",name:"Mirador de la Barda",x:2100,y:310,kind:"landscape",radius:65}
 ],
 paths:[
  {x:80,y:430,w:1370,h:100},
  {x:560,y:90,w:105,h:1030},
  {x:0,y:760,w:1450,h:70},
  {x:1100,y:1020,w:680,h:70},
  {x:1330,y:500,w:190,h:70}
 ]
};

export const NPCS=[
 {id:"marta",name:"Marta",role:"Guardiana de las memorias",home:{x:900,y:410},color:"#d99a72",
  schedule:{morning:{x:900,y:410},afternoon:{x:650,y:500},evening:{x:900,y:410}},
  dialogue:["Hola, Luna. Si querés conocer Villa Pelón, empezá por mirar con atención.","La historia no debería aparecer como una clase: primero tenemos que encontrar las preguntas correctas.","Tu primera tarea es sencilla: recorré la plaza y volvé conmigo."]},
 {id:"tomas",name:"Tomás",role:"Vecino",home:{x:420,y:570},color:"#76a8c4",
  schedule:{morning:{x:420,y:570},afternoon:{x:680,y:470},evening:{x:420,y:570}},
  dialogue:["Acá cada lugar tiene una historia, aunque todavía no esté escrita.","Si encontrás algo que parezca importante, anotá dónde estaba y qué viste."]},
 {id:"ines",name:"Inés",role:"Trabajadora de la chacra",home:{x:300,y:1190},color:"#8eb477",
  schedule:{morning:{x:300,y:1190},afternoon:{x:650,y:1230},evening:{x:300,y:1190}},
  dialogue:["El territorio también cuenta historias: caminos, agua, cultivos y trabajos dejan huellas.","Cuando investiguemos las chacras, vamos a necesitar fuentes antes de afirmar cualquier dato."]},
 {id:"raul",name:"Raúl",role:"Cuidador del puente",home:{x:1350,y:620},color:"#c29b68",
  schedule:{morning:{x:1350,y:620},afternoon:{x:1410,y:610},evening:{x:1350,y:620}},
  dialogue:["El río cambia, aunque desde lejos parezca siempre igual.","Mirá cómo se mueve el agua, escuchá el viento y fijate qué cosas deja en la orilla."]},
 {id:"lola",name:"Lola",role:"Vecina joven",home:{x:760,y:790},color:"#a58cc4",
  schedule:{morning:{x:760,y:790},afternoon:{x:650,y:470},evening:{x:760,y:790}},
  dialogue:["A veces una historia empieza con una pregunta muy chiquita.","Podés volver a los lugares. El mundo no tiene por qué estar igual que antes."]}
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
 },
 river:{
  id:"river",title:"El pulso del agua",giver:"raul",
  description:"Observar el río sin convertir una observación en una afirmación.",
  objectives:[
   {id:"meet-raul",label:"Hablar con Raúl",type:"talk",target:"raul"},
   {id:"inspect-bridge",label:"Observar el Puente",type:"discover",target:"puente"},
   {id:"return-raul",label:"Volver con Raúl",type:"talk",target:"raul",after:"inspect-bridge"}
  ],
  reward:{money:40,memory:"river-memory"},
  education:"Observar, registrar y luego investigar."
 }
};

export const MEMORIES={
 "first-memory":{id:"first-memory",title:"Primera memoria",status:"INVESTIGACIÓN ABIERTA",text:"La primera memoria de Villa Pelón quedó registrada como investigación pendiente. Antes de convertirla en un dato histórico, el proyecto debe incorporar una fuente verificable."},
 "river-memory":{id:"river-memory",title:"Memoria del agua",status:"OBSERVACIÓN",text:"El río forma parte del territorio vivo. Esta memoria conserva una observación del viaje, no reemplaza una fuente documental."}
};

export const WORLD_EVENTS=[
 {id:"market-day",label:"Movimiento en la plaza",days:[0,3],start:9,end:14,zone:"town"},
 {id:"quiet-river",label:"Hora tranquila del río",days:[1,4],start:15,end:18,zone:"river"},
 {id:"chacra-work",label:"Trabajo en la chacra",days:[0,1,2,3,4],start:8,end:17,zone:"chacras"}
];
