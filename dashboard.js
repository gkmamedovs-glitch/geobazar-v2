
async function loadDashboard() {
  await initAuth();
  if (!currentUser) { openAuth("login"); return; }

  const profile = await supabaseClient.from("profiles").select("*").eq("id", currentUser.id).maybeSingle();
  document.getElementById("dashboardUserEmail").innerText = currentUser.email;
  document.getElementById("dashboardUserName").innerText = profile.data?.name || "Пользователь GeoBazar";

  const listings = await supabaseClient.from("listings").select("*").or(`user_id.eq.${currentUser.id},created_by.eq.${currentUser.id}`);
  const favorites = await supabaseClient.from("favorites").select("id", { count:"exact", head:true }).eq("user_id", currentUser.id);
  const messages = await supabaseClient.from("messages").select("id", { count:"exact", head:true }).eq("receiver_id", currentUser.id).eq("is_read", false);
  const notifications = await supabaseClient.from("notifications").select("id", { count:"exact", head:true }).eq("user_id", currentUser.id).eq("is_read", false);

  const items = listings.data || [];
  const active = items.filter(x => x.status === "active").length;
  const vip = items.filter(x => x.vip_until && new Date(x.vip_until) > new Date()).length;
  const views = items.reduce((sum, x) => sum + (x.views_count || 0), 0);

  document.getElementById("dashboardStats").innerHTML = `
    <div class="card"><h2>${items.length}</h2><p>Всего объявлений</p></div>
    <div class="card"><h2>${active}</h2><p>Активных</p></div>
    <div class="card"><h2>${vip}</h2><p>VIP</p></div>
    <div class="card"><h2>${views}</h2><p>Просмотров</p></div>
    <div class="card"><h2>${favorites.count || 0}</h2><p>Избранное</p></div>
    <div class="card"><h2>${messages.count || 0}</h2><p>Новых сообщений</p></div>
    <div class="card"><h2>${notifications.count || 0}</h2><p>Уведомлений</p></div>
  `;
}

async function loadCompanyDashboard() {
  await initAuth();
  if (!currentUser) { openAuth("login"); return; }

  const companiesResult = await supabaseClient.from("companies").select("*").eq("owner_id", currentUser.id).eq("status", "active");
  const companies = companiesResult.data || [];
  const box = document.getElementById("companyDashboardBox");

  if (!companies.length) {
    box.innerHTML = `<p>У вас пока нет компании.</p><a class="btn btn-orange" href="business.html">Создать компанию</a>`;
    return;
  }

  const cards = [];
  for (const c of companies) {
    const listings = await supabaseClient.from("listings").select("id", { count:"exact", head:true }).eq("company_id", c.id);
    const members = await supabaseClient.from("company_members").select("id", { count:"exact", head:true }).eq("company_id", c.id);
    const leads = await supabaseClient.from("leads").select("id", { count:"exact", head:true }).eq("company_id", c.id);
    cards.push(`
      <div class="card">
        <h2>${c.name}</h2>
        <p>${c.company_type || ""}</p>
        <p>Объявления: ${listings.count || 0}</p>
        <p>Сотрудники: ${members.count || 0}</p>
        <p>Лиды: ${leads.count || 0}</p>
        <a class="btn btn-light" href="company.html?id=${c.id}">Открыть страницу</a>
        <a class="btn btn-blue" href="company-team.html">Сотрудники</a>
      </div>
    `);
  }

  box.innerHTML = cards.join("");
}
