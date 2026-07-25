const KEY="france-family-packing-v1-7k3p9x2m";
const OUTBOX_KEY=`${KEY}-outbox`;
const LIST_ID=new URLSearchParams(location.search).get("list")||"france-2026-7k3p9x2m";
const API=`/api/packing-list/${encodeURIComponent(LIST_ID)}`;
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
].map((x,i)=>({id:`base-${i+1}`,category:x[0],text:x[1],checked:false,sortOrder:i}));
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const clone=a=>a.map((x,i)=>({...x,sortOrder:Number.isInteger(x.sortOrder)?x.sortOrder:i}));
const valid=a=>Array.isArray(a)&&a.every(x=>x&&typeof x.id==="string"&&typeof x.category==="string"&&typeof x.text==="string"&&typeof x.checked==="boolean");
let importedFromHash=false;
function decodeShared(){
  if(!location.hash.startsWith("#list="))return null;
  try{const s=location.hash.slice(6).replace(/-/g,"+").replace(/_/g,"/");const a=JSON.parse(decodeURIComponent(escape(atob(s))));return valid(a)?clone(a):null}catch{return null}
}
function loadLocal(){
  const shared=decodeShared();
  if(shared){importedFromHash=true;localStorage.setItem(KEY,JSON.stringify(shared));history.replaceState(null,"",location.pathname+location.search);return shared}
  try{const a=JSON.parse(localStorage.getItem(KEY));if(valid(a))return clone(a)}catch{}
  return clone(base);
}
function loadOutbox(){try{const a=JSON.parse(localStorage.getItem(OUTBOX_KEY));return Array.isArray(a)?a:[]}catch{return[]}}
let items=loadLocal();
let outbox=loadOutbox();
if(importedFromHash){outbox=[{kind:"replace",items:clone(items)}];localStorage.setItem(OUTBOX_KEY,JSON.stringify(outbox))}
let flushing=false,pulling=false,remoteKnown=false,lastRemoteUpdate=0;
function save(){localStorage.setItem(KEY,JSON.stringify(items))}
function saveOutbox(){localStorage.setItem(OUTBOX_KEY,JSON.stringify(outbox))}
function toast(text){const t=$("toast");t.textContent=text;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),2100)}
function syncStatus(mode){
  const el=$("syncStatus");
  const state={connecting:["⏳ Подключаем общий список…","#65746f","#fff"],syncing:["🔄 Сохраняем изменения…","#235f50","#dff1e9"],synced:["● Общий список синхронизирован","#235f50","#dff1e9"],offline:["☁️ Нет связи — изменения сохранены локально","#7b6232","#f4e7bd"]}[mode];
  el.textContent=state[0];el.style.color=state[1];el.style.background=state[2];
}
function progress(){
  const total=items.length,done=items.filter(x=>x.checked).length,p=total?Math.round(done/total*100):0;
  $("percent").textContent=p+"%";$("progressDetails").textContent=`${done} из ${total} пунктов`;$("fill").style.width=p+"%";
  $("progressTitle").textContent=!total?"Список пока пуст":done===total?"Всё собрано — можно ехать!":p>=75?"Почти готово":p>=40?"Хорошо продвигаемся":done?"Сборы начались":"Пока ничего не собрано";
}
function render(){
  const grouped={};for(const x of items)(grouped[x.category]??=[]).push(x);
  const cats=Object.keys(grouped).sort((a,b)=>(meta[a]?.[1]??999)-(meta[b]?.[1]??999)||a.localeCompare(b,"ru"));
  $("categories").innerHTML=cats.length?cats.map(cat=>{
    const list=grouped[cat].sort((a,b)=>(a.sortOrder??0)-(b.sortOrder??0)),done=list.filter(x=>x.checked).length,icon=meta[cat]?.[0]||"📦";
    return `<article class="category"><header class="category-header"><h2 class="category-title"><span class="icon">${icon}</span>${esc(cat)}</h2><span class="count">${done} / ${list.length}</span></header><div class="items">${list.map(x=>`<div class="item ${x.checked?"checked":""}" data-id="${esc(x.id)}"><label class="check"><input type="checkbox" data-act="toggle" ${x.checked?"checked":""}><span class="fake"></span></label><label class="item-label">${esc(x.text)}</label><button class="delete" data-act="delete" type="button" aria-label="Удалить ${esc(x.text)}">×</button></div>`).join("")}</div></article>`
  }).join(""):'<article class="category"><p class="note">Список пуст. Добавьте первую вещь выше.</p></article>';
  progress();
}
async function request(method="GET",body,query=""){
  const response=await fetch(API+query,{method,cache:"no-store",headers:body?{"Content-Type":"application/json"}:undefined,body:body?JSON.stringify(body):undefined});
  if(!response.ok)throw new Error(`sync ${response.status}`);
  return response.json();
}
async function ensureRemote(){
  if(remoteKnown)return;
  const data=await request();
  if(!data.exists){await request("POST",{action:"initialize",items:clone(items)})}
  remoteKnown=true;
}
async function sendOperation(op){
  if(op.kind==="upsert")return request("PUT",{item:op.item});
  if(op.kind==="delete")return request("DELETE",undefined,`?itemId=${encodeURIComponent(op.itemId)}`);
  if(op.kind==="uncheckAll")return request("POST",{action:"uncheckAll"});
  if(op.kind==="replace")return request("POST",{action:"replace",items:op.items});
  throw new Error("unknown operation");
}
function enqueue(op){
  if(op.kind==="upsert")outbox=outbox.filter(x=>!(x.kind==="upsert"&&x.item?.id===op.item.id));
  outbox.push(op);saveOutbox();void flushOutbox();
}
async function flushOutbox(){
  if(flushing||pulling||!outbox.length)return;
  flushing=true;syncStatus("syncing");
  try{
    await ensureRemote();
    while(outbox.length){await sendOperation(outbox[0]);outbox.shift();saveOutbox()}
    syncStatus("synced");
  }catch{syncStatus("offline")}
  finally{flushing=false;if(!outbox.length)void pullRemote()}
}
async function pullRemote(){
  if(pulling||flushing||outbox.length)return;
  pulling=true;
  if(!remoteKnown)syncStatus("connecting");
  try{
    let data=await request();
    if(!data.exists){await request("POST",{action:"initialize",items:clone(items)});data=await request()}
    remoteKnown=true;
    if(outbox.length)return;
    if(valid(data.items)&&(data.updatedAt!==lastRemoteUpdate||JSON.stringify(data.items)!==JSON.stringify(items))){items=clone(data.items);lastRemoteUpdate=data.updatedAt||0;save();render()}
    syncStatus("synced");
  }catch{syncStatus("offline")}
  finally{pulling=false;if(outbox.length)void flushOutbox()}
}
function updateItem(id,change){
  const x=items.find(i=>i.id===id);if(!x)return;
  change(x);save();render();enqueue({kind:"upsert",item:{...x}});
}
$("newCategory").innerHTML=Object.entries(meta).sort((a,b)=>a[1][1]-b[1][1]).map(([name,v])=>`<option value="${esc(name)}">${v[0]} ${esc(name)}</option>`).join("");
$("categories").addEventListener("change",e=>{
  if(e.target.dataset.act!=="toggle")return;const row=e.target.closest(".item");updateItem(row?.dataset.id,x=>x.checked=e.target.checked);
});
$("categories").addEventListener("click",e=>{
  const row=e.target.closest(".item");if(!row)return;const id=row.dataset.id,x=items.find(i=>i.id===id);if(!x)return;
  if(e.target.closest('[data-act="delete"]')){items=items.filter(i=>i.id!==id);save();render();enqueue({kind:"delete",itemId:id});toast("Пункт удалён")}
  else if(e.target.classList.contains("item-label"))updateItem(id,item=>item.checked=!item.checked);
});
$("addForm").addEventListener("submit",e=>{
  e.preventDefault();const text=$("newItem").value.trim();if(!text)return;
  const item={id:crypto.randomUUID?.()||`custom-${Date.now()}-${Math.random().toString(36).slice(2)}`,category:$("newCategory").value,text,checked:false,sortOrder:items.reduce((m,x)=>Math.max(m,x.sortOrder??0),-1)+1};
  items.push(item);save();render();enqueue({kind:"upsert",item:{...item}});$("newItem").value="";$("newItem").focus();toast("Добавлено в общий список");
});
$("uncheckAll").addEventListener("click",()=>{items.forEach(x=>x.checked=false);save();render();enqueue({kind:"uncheckAll"});toast("Все галочки сняты")});
$("restoreList").addEventListener("click",()=>{
  if(!confirm("Вернуть исходный список? Добавленные пункты и галочки будут удалены у всех."))return;
  items=clone(base);save();render();outbox=[{kind:"replace",items:clone(items)}];saveOutbox();void flushOutbox();toast("Исходный список восстановлен");
});
$("copyLink").addEventListener("click",async()=>{
  try{await navigator.clipboard.writeText(`${location.origin}${location.pathname}${location.search}`);toast("Общая ссылка скопирована")}
  catch{toast("Не удалось скопировать ссылку")}
});
window.addEventListener("online",()=>{remoteKnown=false;void(outbox.length?flushOutbox():pullRemote())});
window.addEventListener("focus",()=>void(outbox.length?flushOutbox():pullRemote()));
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")void(outbox.length?flushOutbox():pullRemote())});
render();syncStatus("connecting");void(outbox.length?flushOutbox():pullRemote());setInterval(()=>void(outbox.length?flushOutbox():pullRemote()),5000);
