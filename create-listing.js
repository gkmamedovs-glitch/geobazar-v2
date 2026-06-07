
async function initCreateListing() {
  await requireAuth();

  const cat = document.getElementById("listingCategory");
  cat.innerHTML = CATEGORIES.map(c => `<option value="${c.ru}">${c.icon} ${catName(c)}</option>`).join("");

  renderCategoryFields();
}

function renderCategoryFields() {
  const category = document.getElementById("listingCategory").value;
  const sub = document.getElementById("listingSubcategory");
  const list = SUBCATEGORIES[category] || ["Общее"];

  sub.innerHTML = list.map(x => `<option value="${x}">${x}</option>`).join("");

  const box = document.getElementById("extraFields");
  if (typeof renderSmartCategoryFields === "function") renderSmartCategoryFields(category);

  if (category === "Авто") {
    box.innerHTML = `
      <div class="field"><label>Марка</label><input id="autoBrand"></div>
      <div class="field"><label>Модель</label><input id="autoModel"></div>
      <div class="field"><label>Год</label><input id="autoYear" type="number"></div>
      <div class="field"><label>Пробег</label><input id="autoMileage" type="number"></div>
      <div class="field"><label>Топливо</label><select id="autoFuel"><option>Бензин</option><option>Дизель</option><option>Гибрид</option><option>Электро</option><option>Газ</option></select></div>
      <div class="field"><label>Коробка</label><select id="autoGear"><option>Автомат</option><option>Механика</option></select></div>
    `;
    return;
  }

  if (category === "Недвижимость") {
    box.innerHTML = `
      <div class="field"><label>Тип</label><select id="realType"><option>Квартира</option><option>Дом</option><option>Земля</option><option>Коммерческая</option></select></div>
      <div class="field"><label>Площадь м²</label><input id="realArea" type="number"></div>
      <div class="field"><label>Комнаты</label><input id="realRooms" type="number"></div>
      <div class="field"><label>Этаж</label><input id="realFloor" type="number"></div>
    `;
    return;
  }

  box.innerHTML = "";
}

function fillAI() {
  const category = document.getElementById("listingCategory").value;
  const title = document.getElementById("listingTitle").value || "объявление";
  document.getElementById("listingDescription").value = aiDescription(category, title);
}

function collectExtraText() {
  const c = document.getElementById("listingCategory").value;
  let e = "";

  if (c === "Авто") {
    e += `\nМарка: ${document.getElementById("autoBrand")?.value || ""}`;
    e += `\nМодель: ${document.getElementById("autoModel")?.value || ""}`;
    e += `\nГод: ${document.getElementById("autoYear")?.value || ""}`;
    e += `\nПробег: ${document.getElementById("autoMileage")?.value || ""}`;
    e += `\nТопливо: ${document.getElementById("autoFuel")?.value || ""}`;
    e += `\nКоробка: ${document.getElementById("autoGear")?.value || ""}`;
  }

  if (c === "Недвижимость") {
    e += `\nТип: ${document.getElementById("realType")?.value || ""}`;
    e += `\nПлощадь: ${document.getElementById("realArea")?.value || ""} м²`;
    e += `\nКомнаты: ${document.getElementById("realRooms")?.value || ""}`;
    e += `\nЭтаж: ${document.getElementById("realFloor")?.value || ""}`;
  }

  return e;
}

async function createListing() {
  const msg = document.getElementById("listingMessage");
  msg.className = "message";

  if (!currentUser) {
    msg.innerText = "Сначала войдите";
    msg.classList.add("err");
    return;
  }

  const title = document.getElementById("listingTitle").value.trim();
  const description = document.getElementById("listingDescription").value.trim();

  if (!title || !description) {
    msg.innerText = "Заполните заголовок и описание";
    msg.classList.add("err");
    return;
  }

  const payload = {
    user_id: currentUser.id,
    title,
    category: document.getElementById("listingCategory").value,
    price: Number(document.getElementById("listingPrice").value || 0),
    currency: document.getElementById("listingCurrency").value,
    city: document.getElementById("listingCity").value,
    region_id: document.getElementById("listingRegion") ? (document.getElementById("listingRegion").value || null) : null,
    municipality_id: document.getElementById("listingMunicipality") ? (document.getElementById("listingMunicipality").value || null) : null,
    settlement_id: document.getElementById("listingSettlement") ? (document.getElementById("listingSettlement").value || null) : null,
    address: document.getElementById("listingAddress") ? document.getElementById("listingAddress").value : "",
    description:
      description +
      "\nПодкатегория: " + document.getElementById("listingSubcategory").value +
      collectExtraText() + "\n" + (typeof smartDataToText === "function" ? smartDataToText(collectSmartCategoryData()) : "") +
      "\nТелефон: " + document.getElementById("listingPhone").value +
      "\nWhatsApp: " + document.getElementById("listingWhatsapp").value,
    company_id: document.getElementById("listingCompany") ? (document.getElementById("listingCompany").value || null) : null,
    seller_type: document.getElementById("listingCompany") && document.getElementById("listingCompany").value ? "company" : "private",
    created_by: currentUser.id,
    parameters: typeof collectSmartCategoryData === "function" ? collectSmartCategoryData() : {},
    status: "active"
  };

  const { data, error } = await supabaseClient.from("listings").insert(payload).select().single();

  if (error) {
    msg.innerText = error.message;
    msg.classList.add("err");
    return;
  }

  const files = document.getElementById("listingImages").files;

  for (const file of files) {
    const path = `${currentUser.id}/${data.id}/${Date.now()}-${file.name}`;
    const upload = await supabaseClient.storage.from("listing-images").upload(path, file);

    if (!upload.error) {
      const image_url = supabaseClient.storage.from("listing-images").getPublicUrl(path).data.publicUrl;
      await supabaseClient.from("listings-images").insert({ listing_id:data.id, image_url });
    }
  }

  msg.innerText = "Объявление опубликовано ✅";
  msg.classList.add("ok");

  setTimeout(() => location.href = "listing.html?id=" + data.id, 1000);
}


// GeoBazar fix: one clean category renderer.
// Старые поля не показываем, чтобы не было дублей "Марка/Модель".
// Все параметры теперь идут только из category-fields.js в smartCategoryFields.
function renderCategoryFields() {
  const category = document.getElementById("listingCategory")?.value || "";
  const extraBox = document.getElementById("extraFields");
  const smartBox = document.getElementById("smartCategoryFields");

  if (extraBox) extraBox.innerHTML = "";

  if (typeof renderSmartCategoryFields === "function") {
    renderSmartCategoryFields(category);
  } else if (smartBox) {
    smartBox.innerHTML = "";
  }
}
