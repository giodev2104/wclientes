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
var FOTO={"dog-tr-L":[39,36.5,36,38.06,1200,896],"dog-an-L":[39,36.54,36,38.1,1200,895],"dog-br-L":[39,36.5,36,38.06,1200,896],"dog-tr-M":[44.17,47.32,25.75,27.23,1200,896],"dog-an-M":[44.17,47.37,25.75,27.26,1200,895],"dog-br-M":[44.17,47.32,25.75,27.23,1200,896],"cat-tr-L":[10.44,25.26,71.33,53.39,872,768],"cat-tr-M":[20.64,40.49,50.92,38.15,872,768]};
var eur=function(n){return n.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})+" €"};
var $=function(s){return document.querySelector(s)};
var esc=function(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};

/* cabecera y menú */
var cab=$("#cab"),menu=$("#menu"),hamb=$("#hamb");
function scr(){cab.classList.toggle("sol",scrollY>40)}addEventListener("scroll",scr,{passive:true});scr();
hamb.onclick=function(){var on=menu.classList.toggle("on");cab.classList.toggle("abierto",on);hamb.setAttribute("aria-expanded",on)};

/* paneles de una línea: DogWall con perros, CatWall con gato */
var prods=$("#prods");
if(prods){var lin=prods.dataset.linea;
  if(ACAB[lin].length<2){prods.style.gridTemplateColumns="minmax(0,440px)";prods.style.justifyContent="center"}
  prods.innerHTML=ACAB[lin].map(function(k){var g=GAMAS[k];return '<article class="prod"><div class="ph"><img src="img/'+(lin=="CatWall"?"catwall-transparente":g.perros)+'.webp" alt="Panel '+esc(lin+" "+g.n)+'" width="1000" height="747" loading="lazy"></div><div class="in"><span class="gama">'+esc(g.gama)+'</span><h3>'+esc(lin+" "+g.corto)+'</h3><p>'+esc(g.d)+' Talla M o L.</p><div class="punt"><i style="background:'+g.col+'"></i></div><div class="pie"><div class="pr"><small>desde </small>'+eur(g.M)+'</div><a class="btn osc" href="configurador.html?linea='+lin+'&amp;acabado='+k+'">Configurar</a></div></div></article>'}).join("");
}

/* carrito (se guarda en este navegador) */
var C=[];try{C=JSON.parse(localStorage.getItem("pw-carro")||"[]")}catch(e){}
function guardar(){try{localStorage.setItem("pw-carro",JSON.stringify(C))}catch(e){}}
function pintarCarro(){
  var n=C.reduce(function(a,x){return a+x.q},0),t=C.reduce(function(a,x){return a+x.p*x.q},0);
  $("#n-carro").textContent=n;$("#t-carro").textContent=eur(t);
  $("#lista").innerHTML=C.length?C.map(function(x,i){var g=GAMAS[x.g];return '<div class="linea"><img src="img/conf-'+(x.col=="CatWall"?"cat":"dog")+'-'+x.g+'-'+x.t+'.webp" alt=""><div><b>'+esc(x.col+" "+g.n)+'</b><small>Talla '+x.t+' · '+TALLAS[x.t]+(x.nombre?'<br>Nombre grabado: «'+esc(x.nombre)+'»':'')+'</small><div class="qt"><button data-i="'+i+'" data-d="-1" aria-label="Quitar uno">−</button>'+x.q+'<button data-i="'+i+'" data-d="1" aria-label="Añadir uno">+</button><button class="q" data-i="'+i+'" data-d="x">Eliminar</button></div></div><div class="pr">'+eur(x.p*x.q)+'</div></div>'}).join(""):'<p class="vacio">Tu carrito está vacío.<br><a href="configurador.html">Configura tu PawWall</a></p>';
  $("#pagar").disabled=!C.length;$("#pagar").style.opacity=C.length?1:.5;
}
$("#lista").addEventListener("click",function(e){var b=e.target.closest("button[data-i]");if(!b)return;var i=+b.dataset.i;if(b.dataset.d=="x")C.splice(i,1);else{C[i].q+=+b.dataset.d;if(C[i].q<1)C.splice(i,1)}guardar();pintarCarro()});
var velo=$("#velo"),carro=$("#carro"),ultimo;
function abrir(){ultimo=document.activeElement;velo.classList.add("on");carro.classList.add("on");carro.setAttribute("aria-hidden","false");$("#cerrar-carro").focus()}
function cerrar(){velo.classList.remove("on");carro.classList.remove("on");carro.setAttribute("aria-hidden","true");if(ultimo)ultimo.focus()}
$("#abrir-carro").onclick=abrir;$("#cerrar-carro").onclick=cerrar;velo.onclick=cerrar;
addEventListener("keydown",function(e){if(e.key=="Escape"&&carro.classList.contains("on"))cerrar()});
var dlg=$("#dlg-demo");$("#pagar").onclick=function(){if(dlg.showModal)dlg.showModal();else alert("Esto es una demo: todavía no se cobra nada.")};
$("#dlg-ok").onclick=function(){dlg.close()};
var tAv;function aviso(t){var a=$("#aviso");a.textContent=t;a.classList.add("on");clearTimeout(tAv);tAv=setTimeout(function(){a.classList.remove("on")},2600)}

/* configurador */
var form=$("#c-form");
if(form){
  var q=new URLSearchParams(location.search);
  var S={col:LINEAS[q.get("linea")]?q.get("linea"):"DogWall",g:GAMAS[q.get("acabado")]?q.get("acabado"):"an",t:q.get("talla")=="L"?"L":"M",nombre:"",q:1};
  $("#c-acab").innerHTML=Object.keys(GAMAS).map(function(k){var g=GAMAS[k];return '<label class="chip"><input type="radio" name="g" value="'+k+'"><span><i style="background:'+g.col+'"></i>'+esc(g.n)+'</span></label>'}).join("");
  $("#c-talla").innerHTML=Object.keys(TALLAS).map(function(t){return '<label class="chip"><input type="radio" name="t" value="'+t+'"><span>Talla '+t+' <small>'+TALLAS[t]+'</small></span></label>'}).join("");
  var precio=function(){var g=GAMAS[S.g];return g[S.t]+(S.nombre?g.grab:0)};
  /* el nombre grabado se ajusta al ancho del panel de la foto */
  var ajustarGrab=function(){var gr=$("#c-grab"),w=gr.clientWidth;if(!w)return;var fs=Math.min(w*.11,40);gr.style.fontSize=fs+"px";while(gr.scrollWidth>w*.86&&fs>8){fs-=1;gr.style.fontSize=fs+"px"}};
  addEventListener("resize",function(){ajustarGrab()});
  var sync=function(){
    var ok=ACAB[S.col];if(ok.indexOf(S.g)<0)S.g=ok[0];
    document.querySelectorAll('#c-acab input').forEach(function(i){i.closest('label').hidden=ok.indexOf(i.value)<0});
    $("#c-solo").hidden=ok.length>1;
    form.col.value=S.col;form.g.value=S.g;form.t.value=S.t;
    var g=GAMAS[S.g],img=$("#c-img"),k=(S.col=="CatWall"?"cat":"dog")+"-"+S.g+"-"+S.t,f=FOTO[k],src="img/conf-"+k+".webp";
    if(img.getAttribute("src")!=src){img.style.opacity=.2;img.onload=function(){img.style.opacity=1;ajustarGrab()};img.src=src}
    img.parentNode.style.aspectRatio=f[4]+"/"+f[5];
    img.alt="Panel "+S.col+" "+g.n+" talla "+S.t+" ("+TALLAS[S.t]+") colocado en la pared";
    var gr=$("#c-grab");gr.textContent=S.nombre;gr.classList.toggle("claro",!!g.claro);
    gr.style.left=f[0]+"%";gr.style.width=f[2]+"%";gr.style.top=(f[1]+f[3]*.36)+"%";ajustarGrab();
    document.querySelectorAll("#c-talla small").forEach(function(s,i){var t=Object.keys(TALLAS)[i];s.textContent=TALLAS[t]+" · "+eur(g[t])});
    $("#c-acab-n").textContent="· "+g.gama;
    $("#c-ayuda").textContent="Grabado láser: +"+g.grab+" € en "+g.gama+". Hasta 14 caracteres.";
    $("#c-cant").textContent=S.q;
    $("#c-total").textContent=eur(precio()*S.q);
    $("#c-desg").innerHTML=esc(S.col)+" · Talla "+S.t+"<br>"+eur(g[S.t])+(S.nombre?" + grabado "+eur(g.grab):"")+(S.q>1?" × "+S.q:"");
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
  sync();
}

/* animación al aparecer */
if("IntersectionObserver" in window&&!matchMedia("(prefers-reduced-motion:reduce)").matches){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("vis-on");io.unobserve(e.target)}})},{threshold:.12});document.querySelectorAll(".rev").forEach(function(el){io.observe(el)})}else document.querySelectorAll(".rev").forEach(function(el){el.classList.add("vis-on")});
var an=$("#anio");if(an)an.textContent=new Date().getFullYear();
pintarCarro();
})();
