const KEY="france-family-packing-v1-7k3p9x2m";
const meta={
  "Документы и техника":["🔌",1],"Одежда":["👕",2],"Обувь":["👟",3],
  "Ванная и здоровье":["🧴",4],"Пляж и вода":["🏖️",5],"Игры и досуг":["🏸",6],
  "В дорогу и машину":["🚗",7],"Артур":["🧳",8]
};
const base=[
["Документы и техника","Все зарядные устройства для телефонов"],
["Документы и техника","Powerbank — 2 штуки"],["Документы и техника","iPad для Даши"],["Документы и техника","iPad для Макса"],
["Одежда","Купальники"],["Одежда","Носки"],["Одежда","Джинсы"],["Одежда","Шорты"],["Одежда","Кофта / свитер на плохую погоду"],
["Обувь","Домашняя обувь"],["Обувь","Обувь для плавания"],["Обувь","Обувь для походов"],["Обувь","Летняя обувь"],["Обувь","Закрытая обувь"],
["Ванная и здоровье","Косметичка / Kulturtasche — всё необходимое для ванной"],["Ванная и здоровье","Маникюрный набор"],["Ванная и здоровье","Лекарства для детей"],["Ванная и здоровье","Лекарства для взрослых"],["Ванная и здоровье","Пластыри"],
["Пляж и вода","Мяч для плавания"],["Пляж и вода","Очки для плавания"],["Пляж и вода","Водный пистолет для детей"],["Пляж и вода","Пляжная сумка"],["Пляж и вода","Подстилка / коврик для пляжа"],["Пляж и вода","Очки"],
["Игры и досуг","Футбольный мяч"],["Игры и досуг","Карты"],["Игры и досуг","Игра"],["Игры и досуг","Ракетки для бадминтона"],["Игры и досуг","Книги для чтения — для всех"],
["В дорогу и машину","Стаканчики"],["В дорогу и машину","Минеральная вода"],["В дорогу и машину","Подготовить маленький холодильник для машины"],
["Артур","Футболки"],["Артур","Трусы"],["Артур","Короткие носки"],["Артур","Один свитер на случай плохой погоды"]
].map((x,i)=>({id:`base-${i+1}`,category:x[0],text:x[1],checked:false}));
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
function valid(a){return Array.isArray(a)&&a.every(x=>x&&typeof x.id==="string"&&typeof x.category==="string"&&typeof x.text==="string"&&typeof x.checked==="boolean")}
function decodeShared(){
  if(!location.hash.startsWith("#list="))return null;
  try{const s=location.hash.slice(6).replace(/-/g,"+").replace(/_/g,"/");const a=JSON.parse(decodeURIComponent(escape(atob(s))));return valid(a)?a:null}catch{return null}
}
function load(){
  const shared=decodeShared();
  if(shared){localStorage.setItem(KEY,JSON.stringify(shared));history.replaceState(null,"",location.pathname+location.search);return shared}
  try{const a=JSON.parse(localStorage.getItem(KEY));if(valid(a))return a}catch{}
  return base.map(x=>({...x}));
}
let items=load();
function save(){localStorage.setItem(KEY,JSON.stringify(items))}
function toast(text){const t=$("toast");t.textContent=text;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),2100)}
function progress(){
  const total=items.length,done=items.filter(x=>x.checked).length,p=total?Math.round(done/total*100):0;
  $("percent").textContent=p+"%";$("progressDetails").textContent=`${done} из ${total} пунктов`;$("fill").style.width=p+"%";
  $("progressTitle").textContent=!total?"Список пока пуст":done===total?"Всё собрано — можно ехать!":p>=75?"Почти готово":p>=40?"Хорошо продвигаемся":done?"Сборы начались":"Пока ничего не собрано";
}
function render(){
  const grouped={};for(const x of items)(grouped[x.category]??=[]).push(x);
  const cats=Object.keys(grouped).sort((a,b)=>(meta[a]?.[1]??999)-(meta[b]?.[1]??999)||a.localeCompare(b,"ru"));
  $("categories").innerHTML=cats.length?cats.map(cat=>{
    const list=grouped[cat],done=list.filter(x=>x.checked).length,icon=meta[cat]?.[0]||"📦";
    return `<article class="category"><header class="category-header"><h2 class="category-title"><span class="icon">${icon}</span>${esc(cat)}</h2><span class="count">${done} / ${list.length}</span></header><div class="items">${list.map(x=>`<div class="item ${x.checked?"checked":""}" data-id="${esc(x.id)}"><label class="check"><input type="checkbox" data-act="toggle" ${x.checked?"checked":""}><span class="fake"></span></label><label class="item-label">${esc(x.text)}</label><button class="delete" data-act="delete" type="button" aria-label="Удалить ${esc(x.text)}">×</button></div>`).join("")}</div></article>`
  }).join(""):'<article class="category"><p class="note">Список пуст. Добавьте первую вещь выше.</p></article>';
  progress();
}
$("newCategory").innerHTML=Object.entries(meta).sort((a,b)=>a[1][1]-b[1][1]).map(([name,v])=>`<option value="${esc(name)}">${v[0]} ${esc(name)}</option>`).join("");
$("categories").addEventListener("change",e=>{
  if(e.target.dataset.act!=="toggle")return;const row=e.target.closest(".item"),x=items.find(i=>i.id===row?.dataset.id);if(!x)return;x.checked=e.target.checked;save();render();
});
$("categories").addEventListener("click",e=>{
  const row=e.target.closest(".item");if(!row)return;const x=items.find(i=>i.id===row.dataset.id);if(!x)return;
  if(e.target.closest('[data-act="delete"]')){items=items.filter(i=>i.id!==x.id);save();render();toast("Пункт удалён")}
  else if(e.target.classList.contains("item-label")){x.checked=!x.checked;save();render()}
});
$("addForm").addEventListener("submit",e=>{
  e.preventDefault();const text=$("newItem").value.trim();if(!text)return;
  items.push({id:crypto.randomUUID?.()||`custom-${Date.now()}`,category:$("newCategory").value,text,checked:false});save();render();$("newItem").value="";$("newItem").focus();toast("Добавлено в список");
});
$("uncheckAll").addEventListener("click",()=>{items.forEach(x=>x.checked=false);save();render();toast("Все галочки сняты")});
$("restoreList").addEventListener("click",()=>{if(confirm("Вернуть исходный список? Добавленные пункты и галочки будут удалены.")){items=base.map(x=>({...x}));save();render();toast("Исходный список восстановлен")}});
$("copyLink").addEventListener("click",async()=>{
  try{const raw=btoa(unescape(encodeURIComponent(JSON.stringify(items)))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"");await navigator.clipboard.writeText(`${location.origin}${location.pathname}${location.search}#list=${raw}`);toast("Ссылка с актуальным списком скопирована")}
  catch{toast("Не удалось скопировать ссылку")}
});
render();