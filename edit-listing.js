
async function loadEditListing() {
  await initAuth();
  if (!currentUser) { openAuth("login"); return; }
  const id = qs("id");
  const { data, error } = await supabaseClient.from("listings").select("*").eq("id", id).maybeSingle();
  if (error || !data) { document.getElementById("editMessage").innerText = "Объявление не найдено"; return; }
  document.getElementById("listingTitle").value = data.title || "";
  document.getElementById("listingCategory").value = data.category || "";
  if (typeof renderSmartCategoryFields === "function") renderSmartCategoryFields(data.category || "");
  setTimeout(() => { if (data.parameters) { Object.entries(data.parameters).forEach(([k,v]) => { const el=document.getElementById(k); if(el) el.value=v; }); } }, 100);
  document.getElementById("listingPrice").value = data.price || "";
  document.getElementById("listingCurrency").value = data.currency || "GEL";
  document.getElementById("listingCity").value = data.city || "";
  document.getElementById("listingDescription").value = data.description || "";
  if (typeof loadRegions === "function") { await loadRegions(); }
  if (document.getElementById("listingRegion")) document.getElementById("listingRegion").value = data.region_id || "";
  if (typeof loadMunicipalities === "function") { await loadMunicipalities(); }
  if (document.getElementById("listingMunicipality")) document.getElementById("listingMunicipality").value = data.municipality_id || "";
  if (typeof loadSettlements === "function") { await loadSettlements(); }
  if (document.getElementById("listingSettlement")) document.getElementById("listingSettlement").value = data.settlement_id || "";
  if (document.getElementById("listingAddress")) document.getElementById("listingAddress").value = data.address || "";
  document.getElementById("statsBox").innerHTML = `
    <b>${tr("stats")}</b>
    <p>Просмотры: ${data.views_count || 0}</p>
    <p>Телефон: ${data.phone_clicks_count || 0}</p>
    <p>WhatsApp: ${data.whatsapp_clicks_count || 0}</p>
    <p>Избранное: ${data.favorites_count || 0}</p>
    <p>Сообщения: ${data.messages_count || 0}</p>
    <p>Цена по рынку: ${data.price_status || "пока нет данных"}</p>
  `;
}

async function saveListingEdit() {
  const id = qs("id");
  const { error } = await supabaseClient.from("listings").update({
    title: document.getElementById("listingTitle").value,
    category: document.getElementById("listingCategory").value,
    price: Number(document.getElementById("listingPrice").value || 0),
    currency: document.getElementById("listingCurrency").value,
    city: document.getElementById("listingCity").value,
    description: document.getElementById("listingDescription").value,
    region_id: document.getElementById("listingRegion") ? (document.getElementById("listingRegion").value || null) : null,
    municipality_id: document.getElementById("listingMunicipality") ? (document.getElementById("listingMunicipality").value || null) : null,
    settlement_id: document.getElementById("listingSettlement") ? (document.getElementById("listingSettlement").value || null) : null,
    address: document.getElementById("listingAddress") ? document.getElementById("listingAddress").value : "",
    parameters: typeof collectSmartCategoryData === "function" ? collectSmartCategoryData() : {},
    updated_at: new Date().toISOString()
  }).eq("id", id);
  document.getElementById("editMessage").innerText = error ? error.message : "Сохранено ✅";
}

async function archiveListing() {
  const id = qs("id");
  await supabaseClient.from("listings").update({ status:"archived", archived_at:new Date().toISOString() }).eq("id", id);
  alert("Объявление архивировано");
}

async function restoreListing() {
  const id = qs("id");
  await supabaseClient.from("listings").update({ status:"active", archived_at:null }).eq("id", id);
  alert("Объявление восстановлено");
}

async function deleteListing() {
  if (!confirm("Удалить объявление?")) return;
  const id = qs("id");
  await supabaseClient.from("listings").delete().eq("id", id);
  location.href = "my-listings.html";
}

async function boostListing() {
  const id = qs("id");
  const until = new Date(Date.now() + 7*24*60*60*1000).toISOString();
  await supabaseClient.from("listings").update({ boosted_until: until }).eq("id", id);
  alert("Поднятие включено на 7 дней (демо до оплаты)");
}

async function vipListing() {
  const id = qs("id");
  const until = new Date(Date.now() + 7*24*60*60*1000).toISOString();
  await supabaseClient.from("listings").update({ vip_until: until, is_premium:true }).eq("id", id);
  alert("VIP включен на 7 дней (демо до оплаты)");
}


function renderCategoryFields() {
  const category = document.getElementById("listingCategory")?.value || "";
  const smartBox = document.getElementById("smartCategoryFields");
  if (typeof renderSmartCategoryFields === "function") {
    renderSmartCategoryFields(category);
  } else if (smartBox) {
    smartBox.innerHTML = "";
  }
}


// Payment-aware promotion actions
async function boostListing() {
  const id = qs("id");
  if (typeof buyBoost === "function") {
    await buyBoost(id);
  } else {
    alert("Платежный модуль не загружен");
  }
}

async function vipListing() {
  const id = qs("id");
  if (typeof buyVip === "function") {
    await buyVip(id);
  } else {
    alert("Платежный модуль не загружен");
  }
}
