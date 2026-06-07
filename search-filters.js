
function getParam(name) {
  return new URLSearchParams(location.search).get(name) || "";
}

async function initSearchFilters() {
  await loadRegions("filterRegion");

  const category = document.getElementById("filterCategory");
  if (category) {
    category.value = getParam("category");
    renderFilterByCategory(category.value);
  }

  const params = new URLSearchParams(location.search);
  ["q","priceFrom","priceTo","filterBrand","filterModel","filterYearFrom","filterYearTo","filterFuel","filterTransmission","filterRooms","filterDeal","filterEstateType","filterPartOEM"].forEach(id => {
    const el = document.getElementById(id);
    if (el && params.get(id)) el.value = params.get(id);
  });

  await loadListingsWithFilters();
}

function renderFilterByCategory(category) {
  const box = document.getElementById("categoryFilters");
  if (!box) return;

  if (category === "Авто") {
    box.innerHTML = `
      <div class="field"><label>Марка</label><input id="filterBrand" placeholder="BMW, Toyota..."></div>
      <div class="field"><label>Модель</label><input id="filterModel" placeholder="X5, Camry..."></div>
      <div class="field"><label>Год от</label><input id="filterYearFrom" type="number"></div>
      <div class="field"><label>Год до</label><input id="filterYearTo" type="number"></div>
      <div class="field"><label>Топливо</label><select id="filterFuel"><option value="">Любое</option><option>Бензин</option><option>Дизель</option><option>Гибрид</option><option>Электро</option><option>Газ</option></select></div>
      <div class="field"><label>Коробка</label><select id="filterTransmission"><option value="">Любая</option><option>Автомат</option><option>Механика</option><option>Робот</option><option>Вариатор</option></select></div>
    `;
    return;
  }

  if (category === "Недвижимость") {
    box.innerHTML = `
      <div class="field"><label>Тип сделки</label><select id="filterDeal"><option value="">Любая</option><option>Продажа</option><option>Аренда</option><option>Посуточно</option></select></div>
      <div class="field"><label>Тип объекта</label><select id="filterEstateType"><option value="">Любой</option><option>Квартира</option><option>Дом</option><option>Коммерческая</option><option>Земля</option><option>Новостройка</option></select></div>
      <div class="field"><label>Комнат от</label><input id="filterRooms" type="number"></div>
      <div class="field"><label>Площадь от м²</label><input id="filterAreaFrom" type="number"></div>
    `;
    return;
  }

  if (category === "Автозапчасти") {
    box.innerHTML = `
      <div class="field"><label>Марка авто</label><input id="filterBrand" placeholder="BMW, Mercedes..."></div>
      <div class="field"><label>Модель авто</label><input id="filterModel" placeholder="X5, E-class..."></div>
      <div class="field"><label>OEM / артикул</label><input id="filterPartOEM" placeholder="номер детали"></div>
      <div class="field"><label>Состояние</label><select id="filterPartCondition"><option value="">Любое</option><option>Новая</option><option>Б/у</option><option>Восстановленная</option></select></div>
    `;
    return;
  }

  box.innerHTML = "";
}

function applyFilters() {
  const params = new URLSearchParams();

  const ids = [
    "q","filterCategory","filterRegion","filterMunicipality","filterSettlement",
    "priceFrom","priceTo","filterBrand","filterModel","filterYearFrom","filterYearTo",
    "filterFuel","filterTransmission","filterRooms","filterDeal","filterEstateType","filterAreaFrom",
    "filterPartOEM","filterPartCondition"
  ];

  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.value) {
      const key = id.replace("filter", "");
      params.set(key.charAt(0).toLowerCase() + key.slice(1), el.value);
    }
  });

  location.href = "listings.html?" + params.toString();
}

function resetFilters() {
  location.href = "listings.html";
}

async function loadListingsWithFilters() {
  const box = document.getElementById("listingsBox") || document.getElementById("listingsGrid");
  if (!box) return;

  const params = new URLSearchParams(location.search);
  let query = supabaseClient.from("listings").select("*").order("created_at", { ascending:false });

  const q = params.get("q");
  const category = params.get("category");
  const region = params.get("region");
  const municipality = params.get("municipality");
  const settlement = params.get("settlement");
  const priceFrom = params.get("priceFrom");
  const priceTo = params.get("priceTo");

  if (category) query = query.eq("category", category);
  if (region) query = query.eq("region_id", region);
  if (municipality) query = query.eq("municipality_id", municipality);
  if (settlement) query = query.eq("settlement_id", settlement);
  if (priceFrom) query = query.gte("price", Number(priceFrom));
  if (priceTo) query = query.lte("price", Number(priceTo));
  if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);

  const { data, error } = await query.limit(80);

  if (error) {
    box.innerHTML = `<p class="message err">${error.message}</p>`;
    return;
  }

  let items = data || [];

  // Client-side filter for jsonb parameters. Это временно, пока не сделаем серверный поиск.
  const brand = params.get("brand");
  const model = params.get("model");
  const yearFrom = params.get("yearFrom");
  const yearTo = params.get("yearTo");
  const fuel = params.get("fuel");
  const transmission = params.get("transmission");
  const deal = params.get("deal");
  const estateType = params.get("estateType");
  const rooms = params.get("rooms");
  const partOEM = params.get("partOEM");

  items = items.filter(x => {
    const p = x.parameters || {};
    if (brand && !Object.values(p).join(" ").toLowerCase().includes(brand.toLowerCase())) return false;
    if (model && !Object.values(p).join(" ").toLowerCase().includes(model.toLowerCase())) return false;
    if (fuel && p.auto_fuel !== fuel) return false;
    if (transmission && p.auto_transmission !== transmission) return false;
    if (deal && p.real_estate_deal !== deal) return false;
    if (estateType && p.real_estate_type !== estateType) return false;
    if (rooms && Number(p.real_estate_rooms || 0) < Number(rooms)) return false;
    if (partOEM && !(p.part_oem || "").toLowerCase().includes(partOEM.toLowerCase())) return false;
    if (yearFrom && Number(p.auto_year || 0) < Number(yearFrom)) return false;
    if (yearTo && Number(p.auto_year || 9999) > Number(yearTo)) return false;
    return true;
  });

  if (!items.length) {
    box.innerHTML = "<p>Ничего не найдено.</p>";
    return;
  }

  const cards = [];
  for (const item of items) {
    const img = typeof getFirstImage === "function" ? await getFirstImage(item.id) : "";
    cards.push(listingCard(item, img));
  }
  box.innerHTML = cards.join("");
}
