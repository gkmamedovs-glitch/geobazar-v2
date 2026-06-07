
async function requireCompanyAuth() {
  await initAuth();
  if (!currentUser) {
    openAuth("login");
    return false;
  }
  return true;
}

async function loadCompanyForm() {
  const ok = await requireCompanyAuth();
  if (!ok) return;

  const typeSelect = document.getElementById("companyType");
  if (typeSelect) {
    typeSelect.innerHTML = COMPANY_TYPES.map(x => `<option value="${x}">${x}</option>`).join("");
  }

  const { data } = await supabaseClient
    .from("companies")
    .select("*")
    .eq("owner_id", currentUser.id)
    .order("created_at", { ascending:false })
    .limit(1)
    .maybeSingle();

  if (data) {
    document.getElementById("companyId").value = data.id || "";
    document.getElementById("companyName").value = data.name || "";
    document.getElementById("companyType").value = data.company_type || "Другое";
    document.getElementById("companyDescription").value = data.description || "";
    document.getElementById("companyPhone").value = data.phone || "";
    document.getElementById("companyWhatsapp").value = data.whatsapp || "";
    document.getElementById("companyEmail").value = data.email || "";
    document.getElementById("companyWebsite").value = data.website || "";
    document.getElementById("companyFacebook").value = data.facebook || "";
    document.getElementById("companyInstagram").value = data.instagram || "";
    document.getElementById("companyTelegram").value = data.telegram || "";
    document.getElementById("companyCity").value = data.city || "";
    document.getElementById("companyAddress").value = data.address || "";
    if (data.logo_url) document.getElementById("companyLogoPreview").src = data.logo_url;
  }
}

async function saveCompany() {
  const msg = document.getElementById("companyMessage");
  msg.className = "message";

  if (!currentUser) {
    msg.innerText = "Сначала войдите";
    msg.classList.add("err");
    return;
  }

  let logoUrl = document.getElementById("companyLogoPreview").src || "";
  const logoFile = document.getElementById("companyLogo").files[0];

  if (logoFile) {
    const path = `${currentUser.id}/company-logo-${Date.now()}-${logoFile.name}`;
    const upload = await supabaseClient.storage.from("listing-images").upload(path, logoFile, { upsert:true });
    if (!upload.error) {
      logoUrl = supabaseClient.storage.from("listing-images").getPublicUrl(path).data.publicUrl;
    }
  }

  const existingId = document.getElementById("companyId").value;

  const payload = {
    owner_id: currentUser.id,
    public_id: existingId ? undefined : "GB-B-" + Date.now(),
    name: document.getElementById("companyName").value,
    company_type: document.getElementById("companyType").value,
    description: document.getElementById("companyDescription").value,
    logo_url: logoUrl,
    phone: document.getElementById("companyPhone").value,
    whatsapp: document.getElementById("companyWhatsapp").value,
    email: document.getElementById("companyEmail").value,
    website: document.getElementById("companyWebsite").value,
    facebook: document.getElementById("companyFacebook").value,
    instagram: document.getElementById("companyInstagram").value,
    telegram: document.getElementById("companyTelegram").value,
    city: document.getElementById("companyCity").value,
    address: document.getElementById("companyAddress").value,
    status: "active"
  };

  let result;
  if (existingId) {
    result = await supabaseClient.from("companies").update(payload).eq("id", existingId).select().single();
  } else {
    result = await supabaseClient.from("companies").insert(payload).select().single();
  }

  if (result.error) {
    msg.innerText = result.error.message;
    msg.classList.add("err");
    return;
  }

  msg.innerText = "Компания сохранена ✅";
  msg.classList.add("ok");
  document.getElementById("companyId").value = result.data.id;
  if (logoUrl) document.getElementById("companyLogoPreview").src = logoUrl;
  await addOwnerAsMember(result.data.id);
}

async function addOwnerAsMember(companyId) {
  await supabaseClient.from("company_members").insert({
    company_id: companyId,
    user_id: currentUser.id,
    role: "owner",
    status: "active",
    permissions: {
      manage_company: true,
      manage_team: true,
      manage_listings: true,
      manage_billing: true
    }
  });
}

async function loadMyCompanies(selectId = null) {
  await initAuth();
  if (!currentUser) return [];

  const owned = await supabaseClient
    .from("companies")
    .select("*")
    .eq("owner_id", currentUser.id)
    .eq("status", "active");

  const member = await supabaseClient
    .from("company_members")
    .select("company_id, role, companies(*)")
    .eq("user_id", currentUser.id)
    .eq("status", "active");

  const map = new Map();

  (owned.data || []).forEach(c => map.set(c.id, { ...c, my_role: "owner" }));
  (member.data || []).forEach(m => {
    if (m.companies) map.set(m.companies.id, { ...m.companies, my_role: m.role });
  });

  const companies = Array.from(map.values());

  if (selectId) {
    const select = document.getElementById(selectId);
    if (select) {
      select.innerHTML =
        `<option value="">От частного лица</option>` +
        companies.map(c => `<option value="${c.id}">${c.name} (${c.my_role || "member"})</option>`).join("");
    }
  }

  return companies;
}

async function loadCompanyPage() {
  const id = qs("id");
  const box = document.getElementById("companyDetail");

  if (!id) {
    box.innerHTML = "Компания не найдена";
    return;
  }

  const { data, error } = await supabaseClient.from("companies").select("*").eq("id", id).maybeSingle();

  if (error || !data) {
    box.innerHTML = "Компания не найдена";
    return;
  }

  const { data:listings } = await supabaseClient
    .from("listings")
    .select("*")
    .eq("company_id", id)
    .eq("status", "active")
    .order("created_at", { ascending:false });

  box.innerHTML = `
    <section class="panel">
      <div class="grid-2">
        <div>
          <img class="avatar" style="width:130px;height:130px" src="${data.logo_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(data.name)}">
          <h1>${data.name}</h1>
          <p><b>Тип:</b> ${data.company_type || ""}</p>
          <p><b>Город:</b> ${data.city || ""}</p>
          <p><b>Адрес:</b> ${data.address || ""}</p>
          <p>${data.description || ""}</p>
        </div>
        <div>
          <h2>Контакты</h2>
          <p>Телефон: ${data.phone || ""}</p>
          <p>WhatsApp: ${data.whatsapp || ""}</p>
          <p>Email: ${data.email || ""}</p>
          <p>Сайт: ${data.website || ""}</p>
          ${shareButtons(data.name)}
        </div>
      </div>
    </section>
    <section class="section">
      <h2>Объявления компании</h2>
      <div class="grid-4" id="companyListings"></div>
    </section>
  `;

  const listBox = document.getElementById("companyListings");
  if (!listings || !listings.length) {
    listBox.innerHTML = "<p>Пока нет объявлений.</p>";
    return;
  }

  const cards = [];
  for (const item of listings) {
    const img = await getFirstImage(item.id);
    cards.push(listingCard(item, img));
  }
  listBox.innerHTML = cards.join("");
}
