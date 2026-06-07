
function header(){document.write(`<header class="topbar"><a class="logo" href="index.html"><span class="logo-mark">G</span><strong>GeoBazar<span>.ge</span></strong></a><nav class="nav"><a href="categories.html">Категории</a><a href="listings.html">Объявления</a><a href="map.html">Карта</a><a href="company-dashboard.html">Компании</a><a href="crm.html">CRM</a><a href="messages.html">💬</a><a href="favorites.html">♡</a><select class="lang-select"><option>RU</option><option>KA</option><option>AZ</option><option>EN</option><option>AM</option></select><a class="btn btn-orange" href="create-listing.html">+ Подать объявление</a><a class="btn btn-light" href="dashboard.html">Кабинет</a></nav></header>`)}
function footer(){document.write(`<footer class="footer"><div class="footer-inner"><div><h2>GeoBazar.ge</h2><p>Покупай, продавай, находи услуги по всей Грузии</p></div><div><h3>О нас</h3><p>О компании</p><p>Правила</p><p>Контакты</p></div><div><h3>Помощь</h3><p>Безопасность</p><p>Как подать объявление</p><p>Поддержка</p></div><div><h3>Для бизнеса</h3><p>Магазины</p><p>Реклама</p><p>CRM</p></div><div><h3>Приложение</h3><p>App Store</p><p>Google Play</p></div></div></footer>`)}
function goHomeSearch(){const q=document.getElementById("homeSearchQ")?.value||"";const cat=document.getElementById("homeSearchCategory")?.value||"";const reg=document.getElementById("homeSearchRegion")?.value||"";const p=new URLSearchParams();if(q)p.set("q",q);if(cat)p.set("category",cat);if(reg)p.set("region",reg);location.href="listings.html?"+p.toString()}
function authModal(){document.write(`<div id="authModal" class="modal"><div class="modal-card"><h2>Вход</h2><p>Авторизация Supabase подключается в настройках.</p><button class="btn btn-blue" onclick="document.getElementById('authModal').classList.remove('show')">ОК</button></div></div>`)}
function openAuth(){document.getElementById("authModal")?.classList.add("show")}function logoutUser(){alert("Выход выполнен")}

document.addEventListener("DOMContentLoaded",()=>{
  const s=document.createElement("button");
  s.className="support-float";
  s.textContent="💬 Поддержка";
  s.onclick=()=>openSupportModal();
  document.body.appendChild(s);
});

function openSupportModal(){
  let m=document.getElementById('supportModal');
  if(!m){
    m=document.createElement('div');
    m.id='supportModal';
    m.className='modal';
    m.innerHTML=`<div class="modal-card"><h2>Поддержка GeoBazar</h2>
      <div class="field"><label>Тема</label><input id="supportSubject" placeholder="Например: проблема с объявлением"></div>
      <div class="field"><label>Сообщение</label><textarea id="supportBody"></textarea></div>
      <button class="btn btn-blue" onclick="createSupportTicket()">Отправить</button>
      <button class="btn btn-light" onclick="document.getElementById('supportModal').classList.remove('show')">Закрыть</button>
      <p id="supportMsg"></p></div>`;
    document.body.appendChild(m);
  }
  m.classList.add('show');
}
