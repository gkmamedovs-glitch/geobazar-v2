
async function requireAuth() {
  await initAuth();
  if (!currentUser) {
    openAuth("login");
    return false;
  }
  return true;
}

async function loadProfilePage() {
  const ok = await requireAuth();
  if (!ok) return;

  document.getElementById("profileEmail").innerText = currentUser.email;

  const { data } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", currentUser.id)
    .maybeSingle();

  if (data) {
    document.getElementById("profileName").value = data.name || "";
    document.getElementById("profilePhone").value = data.phone || "";
    document.getElementById("profileWhatsapp").value = data.whatsapp || "";
    document.getElementById("profileCity").value = data.city || "";
    document.getElementById("profileType").value = data.account_type || "private";
    if (data.avatar) document.getElementById("profileAvatar").src = data.avatar;
  }
}

async function saveProfile() {
  const msg = document.getElementById("profileMessage");
  if (!currentUser) {
    msg.innerText = "Сначала войдите";
    return;
  }

  let avatarUrl = document.getElementById("profileAvatar").src || "";
  const file = document.getElementById("avatarFile").files[0];

  if (file) {
    const path = `${currentUser.id}/avatar-${Date.now()}-${file.name}`;
    const upload = await supabaseClient.storage.from("listing-images").upload(path, file, { upsert:true });
    if (!upload.error) {
      avatarUrl = supabaseClient.storage.from("listing-images").getPublicUrl(path).data.publicUrl;
    }
  }

  const payload = {
    id: currentUser.id,
    email: currentUser.email,
    name: document.getElementById("profileName").value,
    phone: document.getElementById("profilePhone").value,
    whatsapp: document.getElementById("profileWhatsapp").value,
    city: document.getElementById("profileCity").value,
    account_type: document.getElementById("profileType").value,
    avatar: avatarUrl
  };

  const { error } = await supabaseClient.from("profiles").upsert(payload);
  msg.innerText = error ? error.message : "Профиль сохранён ✅";
  msg.className = "message " + (error ? "err" : "ok");

  if (!error && avatarUrl) document.getElementById("profileAvatar").src = avatarUrl;
}

async function loadMyListings() {
  await requireAuth();

  const { data, error } = await supabaseClient
    .from("listings")
    .select("*")
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending:false });

  const box = document.getElementById("myListings");

  if (error) {
    box.innerHTML = error.message;
    return;
  }

  if (!data || !data.length) {
    box.innerHTML = "<p>Пока нет объявлений.</p>";
    return;
  }

  box.innerHTML = data.map(x => `
    <div class="panel">
      <b>${x.title}</b>
      <p>${x.city || ""} · ${money(x.price, x.currency)}</p>
      <a class="btn btn-light" href="listing.html?id=${x.id}">Открыть</a>
    </div>
  `).join("");
}


async function loadMyListings() {
  await requireAuth();

  const { data, error } = await supabaseClient
    .from("listings")
    .select("*")
    .or(`user_id.eq.${currentUser.id},created_by.eq.${currentUser.id}`)
    .order("created_at", { ascending:false });

  const box = document.getElementById("myListings");
  if (!box) return;

  if (error) { box.innerHTML = error.message; return; }
  if (!data || !data.length) { box.innerHTML = "<p>Пока нет объявлений.</p>"; return; }

  box.innerHTML = data.map(x => `
    <div class="panel">
      <b>${x.title}</b>
      <p>${x.city || ""} · ${money(x.price, x.currency)}</p>
      <p>Статус: ${x.status || "active"} · Просмотры: ${x.views_count || 0}</p>
      <a class="btn btn-light" href="listing.html?id=${x.id}">Открыть</a>
      <a class="btn btn-blue" href="edit-listing.html?id=${x.id}">✏️ Редактировать</a>
    </div>
  `).join("");
}
