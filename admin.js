
async function isAdmin() {
  await initAuth();
  if (!currentUser) return false;
  const { data } = await supabaseClient.from("admin_users").select("*").eq("user_id", currentUser.id).eq("status","active").maybeSingle();
  return !!data;
}

async function requireAdmin() {
  const ok = await isAdmin();
  if (!ok) {
    document.querySelector("main").innerHTML = "<section class='panel'><h1>Нет доступа</h1><p>Эта страница только для администраторов.</p></section>";
    return false;
  }
  return true;
}

async function loadAdminDashboard() {
  if (!await requireAdmin()) return;
  const users = await supabaseClient.from("profiles").select("id", { count:"exact", head:true });
  const companies = await supabaseClient.from("companies").select("id", { count:"exact", head:true });
  const listings = await supabaseClient.from("listings").select("id", { count:"exact", head:true });
  const reports = await supabaseClient.from("reports").select("id", { count:"exact", head:true });
  document.getElementById("adminStats").innerHTML = `
    <div class="card"><h2>${users.count || 0}</h2><p>Пользователи</p></div>
    <div class="card"><h2>${companies.count || 0}</h2><p>Компании</p></div>
    <div class="card"><h2>${listings.count || 0}</h2><p>Объявления</p></div>
    <div class="card"><h2>${reports.count || 0}</h2><p>Жалобы</p></div>
  `;
}
