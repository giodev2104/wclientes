/* PawWall · scripts comunes de la web (cabecera, menú, catálogo, configurador y carrito) */
(function(){
var GAMAS={
  tr:{n:"Transparente Básico",corto:"Transparente Básico",gama:"Transparente Básico",col:"linear-gradient(135deg,#fff,#e9eef0)",pared:"transparente-pared",perros:"transparente-perros",sola:"transparente",M:39.95,L:49.95,grab:10,claro:true,d:"Casi invisible: protege sin cambiar el aspecto de tu pared."},
  an:{n:"Smoked Gris",corto:"Smoked Gris",gama:"Smoked Glass",col:"linear-gradient(135deg,#6e6c6a,#3e3d3c)",pared:"antracita-pared",perros:"dogwall-smoked-gris",sola:"antracita",M:49.95,L:64.95,grab:15,d:"Ahumado gris, elegante y contemporáneo."},
  br:{n:"Smoked Bronze",corto:"Smoked Bronze",gama:"Smoked Glass",col:"linear-gradient(135deg,#c08a5a,#8e5f38)",pared:"bronce-pared",perros:"bronce-perros",sola:"bronce",M:49.95,L:64.95,grab:15,d:"Ahumado cálido que combina con la madera."}
};
var TALLAS={M:"50 × 35 cm",L:"70 × 50 cm"};
var LINEAS={DogWall:"perros",CatWall:"gatos"};
/* acabados disponibles en cada línea: CatWall solo en Transparente Básico */
var ACAB={DogWall:["tr","an","br"],CatWall:["tr"]};
/* fotos del configurador por línea, acabado y talla: [x, y, ancho, alto del panel en %, ancho y alto de la foto] */
var FOTO={"dog-tr-M":[39,36.5,36,38.06,1200,896],"dog-an-M":[39,36.54,36,38.1,1200,895],"dog-br-M":[39,36.5,36,38.06,1200,896],"dog-tr-L":[36.67,21.32,50.42,53.24,1200,896],"dog-an-L":[36.67,21.34,50.42,53.3,1200,895],"dog-br-L":[36.67,21.32,50.42,53.24,1200,896],"cat-tr-M":[39.5,36.5,35.5,36.2,1200,896],"cat-tr-L":[43.72,26.04,44.8,51.3,1377,768]};
/* tienda de PawWall en Velority: productos, precios y pedidos (los gestiona Ángel desde su portal › Catálogo / Pedidos) */
var TIENDA_CLAVE="799fe49875d3c656",API="https://ufwuvbjrgvphbggkfkuh.supabase.co/functions/v1/productos";
var CAT={},AJUSTES=null,CAT_OK=false,alCargar=[];
var nomProd=function(col,g,t){return col+" "+GAMAS[g].n+" · Talla "+t};
var nomGrab=function(g){return "Grabado del nombre · "+(g=="tr"?"Transparente Básico":"Smoked Glass")};
var PR=function(col,g,t){var p=CAT[nomProd(col,g,t)];return p&&p.precio!=null?p.precio:GAMAS[g][t]};
var GR=function(g){var p=CAT[nomGrab(g)];return p&&p.precio!=null?p.precio:GAMAS[g].grab};
var eur=function(n){return n.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})+" €"};
var $=function(s){return document.querySelector(s)};
var esc=function(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};

/* cabecera y menú */
var cab=$("#cab"),menu=$("#menu"),hamb=$("#hamb");
function scr(){cab.classList.toggle("sol",scrollY>40)}addEventListener("scroll",scr,{passive:true});scr();
hamb.onclick=function(){var on=menu.classList.toggle("on");cab.classList.toggle("abierto",on);hamb.setAttribute("aria-expanded",on)};

/* paneles de una línea: DogWall con perros, CatWall con gato */
var prods=$("#prods");
function pintarProds(){if(!prods)return;var lin=prods.dataset.linea;
  if(ACAB[lin].length<2){prods.style.gridTemplateColumns="minmax(0,440px)";prods.style.justifyContent="center"}
  prods.innerHTML=ACAB[lin].map(function(k){var g=GAMAS[k];return '<article class="prod"><div class="ph"><img src="img/'+(lin=="CatWall"?"catwall-transparente":g.perros)+'.webp" alt="Panel '+esc(lin+" "+g.n)+'" width="1000" height="747" loading="lazy"></div><div class="in"><span class="gama">'+esc(g.gama)+'</span><h3>'+esc(lin+" "+g.corto)+'</h3><p>'+esc(g.d)+' Talla M o L.</p><div class="punt"><i style="background:'+g.col+'"></i></div><div class="pie"><div class="pr"><small>desde </small>'+eur(PR(lin,k,"M"))+'</div><a class="btn osc" href="configurador.html?linea='+lin+'&amp;acabado='+k+'">Configurar</a></div></div></article>'}).join("");
}
pintarProds();alCargar.push(pintarProds);

/* carrito (se guarda en este navegador) */
var C=[];try{C=JSON.parse(localStorage.getItem("pw-carro")||"[]")}catch(e){}
function guardar(){try{localStorage.setItem("pw-carro",JSON.stringify(C))}catch(e){}}
function pintarCarro(){
  C.forEach(function(x){x.p=PR(x.col,x.g,x.t)+(x.nombre?GR(x.g):0)});
  var n=C.reduce(function(a,x){return a+x.q},0),t=C.reduce(function(a,x){return a+x.p*x.q},0);
  $("#n-carro").textContent=n;$("#t-carro").textContent=eur(t);
  $("#lista").innerHTML=C.length?C.map(function(x,i){var g=GAMAS[x.g];return '<div class="linea"><img src="img/conf-'+(x.col=="CatWall"?"cat":"dog")+'-'+x.g+'-'+x.t+'.webp?t4" alt=""><div><b>'+esc(x.col+" "+g.n)+'</b><small>Talla '+x.t+' · '+TALLAS[x.t]+(x.nombre?'<br>Nombre grabado: «'+esc(x.nombre)+'»':'')+'</small><div class="qt"><button data-i="'+i+'" data-d="-1" aria-label="Quitar uno">−</button>'+x.q+'<button data-i="'+i+'" data-d="1" aria-label="Añadir uno">+</button><button class="q" data-i="'+i+'" data-d="x">Eliminar</button></div></div><div class="pr">'+eur(x.p*x.q)+'</div></div>'}).join(""):'<p class="vacio">Tu carrito está vacío.<br><a href="configurador.html">Configura tu PawWall</a></p>';
  $("#pagar").disabled=!C.length;$("#pagar").style.opacity=C.length?1:.5;
}
$("#lista").addEventListener("click",function(e){var b=e.target.closest("button[data-i]");if(!b)return;var i=+b.dataset.i;if(b.dataset.d=="x")C.splice(i,1);else{C[i].q+=+b.dataset.d;if(C[i].q<1)C.splice(i,1)}guardar();pintarCarro()});
var velo=$("#velo"),carro=$("#carro"),ultimo;
function abrir(){ultimo=document.activeElement;velo.classList.add("on");carro.classList.add("on");carro.setAttribute("aria-hidden","false");$("#cerrar-carro").focus()}
function cerrar(){velo.classList.remove("on");carro.classList.remove("on");carro.setAttribute("aria-hidden","true");if(ultimo)ultimo.focus()}
$("#abrir-carro").onclick=abrir;$("#cerrar-carro").onclick=cerrar;velo.onclick=cerrar;
addEventListener("keydown",function(e){if(e.key=="Escape"&&carro.classList.contains("on"))cerrar()});
/* finalizar compra: el pedido llega al portal de la tienda (y por correo a la tienda y al comprador) */
var dlg=$("#dlg-pedido"),fp=$("#f-pedido");
function abrirPedido(){
  $("#p-err").textContent="";$("#p-ok").hidden=true;fp.hidden=false;
  if(!CAT_OK||!AJUSTES){fp.hidden=true;$("#p-ok").hidden=false;$("#p-ok").innerHTML='<h2>Ahora mismo no podemos recibir pedidos</h2><p>Inténtalo de nuevo en unos minutos.</p><button class="btn osc" type="button" style="width:100%" onclick="this.closest(\'dialog\').close()">Cerrar</button>';}
  else{
    var ents=[];if(AJUSTES.recogida)ents.push(["recogida","Recogida"]);if(AJUSTES.envio)ents.push(["envio","Envío a domicilio"+(AJUSTES.coste_envio?" ("+eur(AJUSTES.coste_envio)+(AJUSTES.gratis_desde?", gratis desde "+eur(AJUSTES.gratis_desde):"")+")":" (gratis)")]);
    $("#p-entrega").innerHTML=ents.map(function(e,i){return '<label class="chip"><input type="radio" name="entrega" value="'+e[0]+'"'+(i?'':' checked')+'><span>'+esc(e[1])+'</span></label>'}).join("");
    $("#p-pago-c").hidden=!(AJUSTES.pagos&&AJUSTES.pagos.length);
    $("#p-pago").innerHTML=(AJUSTES.pagos||[]).map(function(x){return '<option>'+esc(x)+'</option>'}).join("");
    $("#p-nota-t").textContent=AJUSTES.nota||"";
    totalPedido();
  }
  cerrar();if(dlg.showModal)dlg.showModal();else dlg.setAttribute("open","");
}
function envioPedido(sub){return fp.entrega&&fp.entrega.value=="envio"?(AJUSTES.gratis_desde&&sub>=AJUSTES.gratis_desde?0:Number(AJUSTES.coste_envio||0)):0}
function totalPedido(){
  var sub=C.reduce(function(a,x){return a+x.p*x.q},0),env=envioPedido(sub);
  $("#p-dir-c").hidden=!(fp.entrega&&fp.entrega.value=="envio");
  $("#p-total").textContent=eur(sub+env)+(env?" (envío incluido)":"");
}
fp.addEventListener("change",totalPedido);
$("#pagar").onclick=abrirPedido;
$("#p-cerrar").onclick=function(){dlg.close()};
fp.onsubmit=function(e){
  e.preventDefault();var er=$("#p-err"),b=$("#p-enviar");er.textContent="";
  var lineas=[],grab=[],falta=false;
  C.forEach(function(x){var p=CAT[nomProd(x.col,x.g,x.t)];if(!p){falta=true;return}lineas.push({id:p.id,cantidad:x.q});
    if(x.nombre){var gp=CAT[nomGrab(x.g)];if(!gp){falta=true;return}lineas.push({id:gp.id,cantidad:x.q});grab.push(x.col+" "+GAMAS[x.g].n+" talla "+x.t+" ×"+x.q+": «"+x.nombre+"»")}});
  if(falta||!lineas.length){er.textContent="Algún panel de tu carrito ya no está disponible. Recarga la página.";return}
  if(fp.nombre.value.trim().length<2){er.textContent="Escribe tu nombre.";fp.nombre.focus();return}
  if(fp.telefono.value.replace(/\D/g,"").length<9){er.textContent="Escribe un teléfono válido.";fp.telefono.focus();return}
  var ent=fp.entrega?fp.entrega.value:"recogida";
  if(ent=="envio"&&fp.direccion.value.trim().length<8){er.textContent="Escribe la dirección de envío completa.";fp.direccion.focus();return}
  var nota=(grab.length?"Nombres a grabar:\n"+grab.join("\n")+"\n":"")+fp.nota.value.trim();
  b.disabled=true;b.textContent="Enviando…";
  fetch(API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({accion:"pedido",clave:TIENDA_CLAVE,pedido:{nombre:fp.nombre.value,telefono:fp.telefono.value,email:fp.email.value,entrega:ent,direccion:fp.direccion.value,pago:$("#p-pago-c").hidden?"":fp.pago.value,nota:nota.slice(0,1000),lineas:lineas}})})
    .then(function(r){return r.json()}).then(function(j){
      if(j.error)throw new Error(j.error);
      C=[];guardar();pintarCarro();fp.reset();fp.hidden=true;
      var ok=$("#p-ok");ok.hidden=false;ok.innerHTML='<h2>¡Pedido recibido! 🐾</h2><p>Tu número de pedido es el <b>#'+esc(j.numero)+'</b> ('+eur(Number(j.total))+'). Te contactaremos muy pronto para confirmarlo y acordar el pago.</p><p>Si nos dejaste tu correo, te hemos enviado el resumen.</p><button class="btn osc" type="button" style="width:100%" onclick="this.closest(\'dialog\').close()">Seguir</button>';
    }).catch(function(x){er.textContent=x.message||"No se ha podido enviar. Inténtalo de nuevo."})
    .then(function(){b.disabled=false;b.textContent="Enviar pedido"});
};
/* carga de productos y precios de la tienda */
fetch(API+"?c="+TIENDA_CLAVE).then(function(r){return r.ok?r.json():Promise.reject(r.status)}).then(function(j){
  (j.productos||[]).forEach(function(p){CAT[p.nombre]=p});CAT_OK=true;AJUSTES=j.pedidos;
  alCargar.forEach(function(f){f()});pintarCarro();
}).catch(function(){});
var tAv;function aviso(t){var a=$("#aviso");a.textContent=t;a.classList.add("on");clearTimeout(tAv);tAv=setTimeout(function(){a.classList.remove("on")},2600)}

/* configurador */
var form=$("#c-form");
if(form){
  var q=new URLSearchParams(location.search);
  var S={col:LINEAS[q.get("linea")]?q.get("linea"):"DogWall",g:GAMAS[q.get("acabado")]?q.get("acabado"):"an",t:q.get("talla")=="L"?"L":"M",nombre:"",q:1};
  $("#c-acab").innerHTML=Object.keys(GAMAS).map(function(k){var g=GAMAS[k];return '<label class="chip"><input type="radio" name="g" value="'+k+'"><span><i style="background:'+g.col+'"></i>'+esc(g.n)+'</span></label>'}).join("");
  $("#c-talla").innerHTML=Object.keys(TALLAS).map(function(t){return '<label class="chip"><input type="radio" name="t" value="'+t+'"><span>Talla '+t+' <small>'+TALLAS[t]+'</small></span></label>'}).join("");
  var precio=function(){return PR(S.col,S.g,S.t)+(S.nombre?GR(S.g):0)};
  /* el nombre grabado se ajusta al ancho del panel de la foto */
  var ajustarGrab=function(){var gr=$("#c-grab"),w=gr.clientWidth;if(!w)return;var fs=Math.min(w*.11,40);gr.style.fontSize=fs+"px";while(gr.scrollWidth>w*.86&&fs>8){fs-=1;gr.style.fontSize=fs+"px"}};
  addEventListener("resize",function(){ajustarGrab()});
  var sync=function(){
    var ok=ACAB[S.col];if(ok.indexOf(S.g)<0)S.g=ok[0];
    document.querySelectorAll('#c-acab input').forEach(function(i){i.closest('label').hidden=ok.indexOf(i.value)<0});
    $("#c-solo").hidden=ok.length>1;
    form.col.value=S.col;form.g.value=S.g;form.t.value=S.t;
    var g=GAMAS[S.g],img=$("#c-img"),k=(S.col=="CatWall"?"cat":"dog")+"-"+S.g+"-"+S.t,f=FOTO[k],src="img/conf-"+k+".webp?t4";
    if(img.getAttribute("src")!=src){img.style.opacity=.2;img.onload=function(){img.style.opacity=1;ajustarGrab()};img.src=src}
    img.parentNode.style.aspectRatio=f[4]+"/"+f[5];
    img.alt="Panel "+S.col+" "+g.n+" talla "+S.t+" ("+TALLAS[S.t]+") colocado en la pared";
    var gr=$("#c-grab");gr.textContent=S.nombre;gr.classList.toggle("claro",!!g.claro);
    gr.style.left=f[0]+"%";gr.style.width=f[2]+"%";gr.style.top=(f[1]+f[3]*.36)+"%";ajustarGrab();
    document.querySelectorAll("#c-talla small").forEach(function(s,i){var t=Object.keys(TALLAS)[i];s.textContent=TALLAS[t]+" · "+eur(PR(S.col,S.g,t))});
    $("#c-acab-n").textContent="· "+g.gama;
    $("#c-ayuda").textContent="Grabado láser: +"+eur(GR(S.g))+" en "+g.gama+". Hasta 14 caracteres.";
    $("#c-cant").textContent=S.q;
    $("#c-total").textContent=eur(precio()*S.q);
    var bt=$("#bm-total");if(bt)bt.textContent=eur(precio()*S.q);
    $("#c-desg").innerHTML=esc(S.col)+" · Talla "+S.t+"<br>"+eur(PR(S.col,S.g,S.t))+(S.nombre?" + grabado "+eur(GR(S.g)):"")+(S.q>1?" × "+S.q:"");
  };
  form.addEventListener("change",function(e){if(e.target.name=="col")S.col=e.target.value;if(e.target.name=="g")S.g=e.target.value;if(e.target.name=="t")S.t=e.target.value;sync()});
  $("#c-nombre").addEventListener("input",function(e){S.nombre=e.target.value.replace(/\s+/g," ").trimStart();sync()});
  $("#c-menos").onclick=function(){if(S.q>1){S.q--;sync()}};
  $("#c-mas").onclick=function(){if(S.q<10){S.q++;sync()}};
  $("#c-add").onclick=function(){
    var nom=S.nombre.trim(),it={col:S.col,g:S.g,t:S.t,nombre:nom,p:precio()};
    var ya=C.find(function(x){return x.col==it.col&&x.g==it.g&&x.t==it.t&&x.nombre==it.nombre});
    if(ya)ya.q+=S.q;else{it.q=S.q;C.push(it)}
    guardar();pintarCarro();aviso("Añadido al carrito: "+S.col+" "+GAMAS[S.g].n+" · Talla "+S.t);
  };
  sync();alCargar.push(sync);
  /* móvil: barra fija con el total mientras el botón principal no está a la vista */
  var bm=$("#barra-m");if(bm){$("#bm-add").onclick=function(){$("#c-add").click()};
    if("IntersectionObserver" in window){new IntersectionObserver(function(es){bm.classList.toggle("on",!es[0].isIntersecting&&es[0].boundingClientRect.top>0)}).observe($("#c-add"))}}
}

/* animación al aparecer */
if("IntersectionObserver" in window&&!matchMedia("(prefers-reduced-motion:reduce)").matches){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("vis-on");io.unobserve(e.target)}})},{threshold:.12});document.querySelectorAll(".rev").forEach(function(el){io.observe(el)})}else document.querySelectorAll(".rev").forEach(function(el){el.classList.add("vis-on")});
var an=$("#anio");if(an)an.textContent=new Date().getFullYear();
pintarCarro();
})();
