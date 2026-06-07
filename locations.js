
async function loadRegions(selectId = "listingRegion") {
  const select = document.getElementById(selectId);
  if (!select) return;

  const { data, error } = await supabaseClient
    .from("regions")
    .select("*")
    .order("name_ru");

  if (error) {
    console.error(error);
    select.innerHTML = `<option value="">Ошибка загрузки регионов</option>`;
    return;
  }

  select.innerHTML = `<option value="">Выберите регион</option>` +
    (data || []).map(r => `<option value="${r.id}">${r.name_ru}</option>`).join("");
}

async function loadMunicipalities(regionSelectId = "listingRegion", municipalitySelectId = "listingMunicipality") {
  const regionId = document.getElementById(regionSelectId)?.value;
  const select = document.getElementById(municipalitySelectId);
  const settlement = document.getElementById("listingSettlement");

  if (!select) return;
  select.innerHTML = `<option value="">Выберите муниципалитет</option>`;
  if (settlement) settlement.innerHTML = `<option value="">Сначала выберите муниципалитет</option>`;

  if (!regionId) return;

  const { data, error } = await supabaseClient
    .from("municipalities")
    .select("*")
    .eq("region_id", regionId)
    .order("name_ru");

  if (error) {
    console.error(error);
    return;
  }

  select.innerHTML = `<option value="">Выберите муниципалитет</option>` +
    (data || []).map(m => `<option value="${m.id}">${m.name_ru}</option>`).join("");
}

async function loadSettlements(municipalitySelectId = "listingMunicipality", settlementSelectId = "listingSettlement") {
  const municipalityId = document.getElementById(municipalitySelectId)?.value;
  const select = document.getElementById(settlementSelectId);

  if (!select) return;
  select.innerHTML = `<option value="">Выберите город/село</option>`;

  if (!municipalityId) return;

  const { data, error } = await supabaseClient
    .from("settlements")
    .select("*")
    .eq("municipality_id", municipalityId)
    .order("name_ru");

  if (error) {
    console.error(error);
    return;
  }

  select.innerHTML = `<option value="">Выберите город/село</option>` +
    (data || []).map(s => `<option value="${s.id}">${s.name_ru} ${s.type ? "(" + s.type + ")" : ""}</option>`).join("");
}

async function initLocationFields() {
  await loadRegions();
}
