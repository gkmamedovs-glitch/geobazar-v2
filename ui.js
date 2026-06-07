
function header() {
  const T = (key, fallback) => (typeof tr === "function" ? tr(key) : fallback);
  const lang = (typeof getLang === "function" ? getLang() : "ru");

  document.write(`
    <header class="topbar">
      <a class="logo" href="index.html"><span class="logo-dot">G</span><b>GeoBazar<span>.ge</span></b></a>
      <nav class="nav">
        <a class="hide-mobile" href="categories.html">${T("nav_categories","Категории")}</a>
        <a class="hide-mobile" href="listings.html">${T("nav_listings","Объявления")}</a>
        <a class="hide-mobile" href="cargo.html">${T("nav_cargo","GeoCargo")}</a>
        <a class="hide-mobile" href="tourism.html">${T("nav_travel","GeoTravel")}</a>
        <a class="hide-mobile" href="business.html">${T("nav_business","Бизнес")}</a>
        <a class="hide-mobile" href="verification.html">${T("nav_verification","Верификация")}</a>
        <a class="hide-mobile" href="billing.html">${T("nav_packages","Пакеты")}</a>
        <select class="lang-select" onchange="setLang(this.value)">
          <option value="ru" ${lang==="ru"?"selected":""}>RU</option>
          <option value="ka" ${lang==="ka"?"selected":""}>KA</option>
          <option value="az" ${lang==="az"?"selected":""}>AZ</option>
          <option value="en" ${lang==="en"?"selected":""}>EN</option>
          <option value="am" ${lang==="am"?"selected":""}>AM</option>
        </select>
        <a class="btn btn-orange" href="create-listing.html">${T("nav_post","+ Подать объявление")}</a>
        <span id="authNav"></span>
      </nav>
    </header>
  `);
}

function authModal() {
  document.write(`
    <div id="authModal" class="modal">
      <div class="modal-card">
        <h2 id="authTitle">Вход</h2>
        <div class="field"><label>Email</label><input id="authEmail" type="email" placeholder="email@example.com"></div>
        <div class="field"><label>Пароль</label><input id="authPassword" type="password" placeholder="Минимум 6 символов"></div>
        <button class="btn btn-orange" style="width:100%" onclick="submitAuth()">Продолжить</button>
        <button class="btn btn-light" style="width:100%;margin-top:10px" onclick="closeAuth()">Закрыть</button>
        <p id="authMessage" class="message"></p>
        <hr>
        <button class="btn btn-light" style="width:100%;margin-top:8px" onclick="showProviderNote('Google')">Войти через Google</button>
        <button class="btn btn-light" style="width:100%;margin-top:8px" onclick="showProviderNote('Apple')">Войти через Apple</button>
        <button class="btn btn-light" style="width:100%;margin-top:8px" onclick="showProviderNote('Phone/SMS')">Войти по телефону / SMS</button>
      </div>
    </div>
  `);
}

function footer() {
  document.write(`
    <footer>
      <div class="logo"><span class="logo-dot">G</span><b>GeoBazar<span>.ge</span></b></div>
      <p>© 2026 GeoBazar.ge — Вся Грузия в одном месте.</p>
      <p>info@geobazar.ge · support@geobazar.ge</p>
    </footer>
  `);
}

function renderCategoryGrid(elementId) {
  const box = document.getElementById(elementId);
  if (!box) return;
  box.innerHTML = CATEGORIES.map(c => `
    <a class="category-card" href="listings.html?category=${encodeURIComponent(c.ru)}">
      ${c.icon}<span>${catName(c)}</span>
    </a>
  `).join("");
}

function shareButtons(title, url = location.href) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return `
    <div class="share-row">
      <a class="btn btn-light" target="_blank" href="https://wa.me/?text=${t}%20${u}">WhatsApp</a>
      <a class="btn btn-light" target="_blank" href="https://t.me/share/url?url=${u}&text=${t}">Telegram</a>
      <a class="btn btn-light" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=${u}">Facebook</a>
      <button class="btn btn-light" onclick="navigator.clipboard.writeText('${url}')">Скопировать</button>
    </div>
  `;
}

function aiDescription(category, title) {
  if (category === "Авто") return `Продаётся ${title}. Автомобиль в хорошем состоянии, документы в порядке. Возможен торг.`;
  if (category === "Недвижимость") return `${title}. Удобное расположение, рядом инфраструктура. Подробности по телефону.`;
  if (category === "Работа") return `Открыта вакансия: ${title}. Требуется ответственный сотрудник.`;
  if (category === "Услуги") return `Предлагаем услугу: ${title}. Качественно, быстро и по договорённости.`;
  return `${title}. Подробное описание, состояние, условия продажи и контакты продавца.`;
}
