
async function isAdmin() {
  await initAuth();
  if (!currentUser) return false;

  const { data } = await supabaseClient
    .from("admin_users")
    .select("*")
    .eq("user_id", currentUser.id)
    .eq("status", "active")
    .maybeSingle();

  return !!data;
}

async function requireAdmin() {
  const ok = await isAdmin();
  if (!ok) {
    document.querySelector("main").innerHTML = `
      <section class="panel">
        <h1>Нет доступа</h1>
        <p>Эта страница доступна только администраторам GeoBazar.</p>
      </section>
    `;
    return false;
  }
  return true;
}

async function logAdminAction(actionType, targetType, targetId, note = "") {
  if (!currentUser) return;
  await supabaseClient.from("admin_actions").insert({
    admin_id: currentUser.id,
    action_type: actionType,
    target_type: targetType,
    target_id: String(targetId),
    note
  });
}

async function loadAdminDashboard() {
  if (!await requireAdmin()) return;

  const users = await supabaseClient.from("profiles").select("id", { count:"exact", head:true });
  const companies = await supabaseClient.from("companies").select("id", { count:"exact", head:true });
  const listings = await supabaseClient.from("listings").select("id", { count:"exact", head:true });
  const reports = await supabaseClient.from("reports").select("id", { count:"exact", head:true }).eq("status", "new");
  const verification = await supabaseClient.from("verification_requests").select("id", { count:"exact", head:true }).eq("status", "pending");

  document.getElementById("adminStats").innerHTML = `
    <div class="card"><h2>${users.count || 0}</h2><p>Пользователи</p></div>
    <div class="card"><h2>${companies.count || 0}</h2><p>Компании</p></div>
    <div class="card"><h2>${listings.count || 0}</h2><p>Объявления</p></div>
    <div class="card"><h2>${reports.count || 0}</h2><p>Новые жалобы</p></div>
    <div class="card"><h2>${verification.count || 0}</h2><p>Верификация</p></div>
  `;
}

async function loadAdminListings() {
  if (!await requireAdmin()) return;

  const { data, error } = await supabaseClient
    .from("listings")
    .select("*")
    .order("created_at", { ascending:false })
    .limit(100);

  const box = document.getElementById("adminList");
  if (error) { box.innerHTML = error.message; return; }

  box.innerHTML = (data || []).map(x => `
    <div class="panel">
      <h3>${x.title || "Без названия"}</h3>
      <p>${x.category || ""} · ${x.city || ""} · ${x.price || 0} ${x.currency || "GEL"}</p>
      <p>Статус: <b>${x.status || "active"}</b> · Модерация: <b>${x.moderation_status || ""}</b></p>
      <a class="btn btn-light" href="listing.html?id=${x.id}" target="_blank">Открыть</a>
      <button class="btn btn-blue" onclick="approveListing('${x.id}')">Одобрить</button>
      <button class="btn btn-orange" onclick="manualReviewListing('${x.id}')">На проверку</button>
      <button class="btn btn-danger" onclick="blockListing('${x.id}')">Заблокировать</button>
    </div>
  `).join("");
}

async function approveListing(id) {
  await supabaseClient.from("listings").update({ status:"active", moderation_status:"approved", admin_status:"active" }).eq("id", id);
  await logAdminAction("approve_listing", "listing", id);
  loadAdminListings();
}

async function manualReviewListing(id) {
  await supabaseClient.from("listings").update({ moderation_status:"manual_review" }).eq("id", id);
  await logAdminAction("manual_review_listing", "listing", id);
  loadAdminListings();
}

async function blockListing(id) {
  const note = prompt("Причина блокировки объявления?") || "";
  await supabaseClient.from("listings").update({ status:"blocked", admin_status:"blocked", admin_note:note }).eq("id", id);
  await logAdminAction("block_listing", "listing", id, note);
  loadAdminListings();
}

async function loadAdminReports() {
  if (!await requireAdmin()) return;

  const { data, error } = await supabaseClient
    .from("reports")
    .select("*")
    .order("created_at", { ascending:false })
    .limit(100);

  const box = document.getElementById("adminList");
  if (error) { box.innerHTML = error.message; return; }

  box.innerHTML = (data || []).map(r => `
    <div class="panel">
      <h3>Жалоба: ${r.target_type} / ${r.target_id}</h3>
      <p>${r.reason || ""}</p>
      <p>Статус: <b>${r.status}</b></p>
      <button class="btn btn-blue" onclick="closeReport('${r.id}')">Закрыть</button>
      <button class="btn btn-danger" onclick="acceptReport('${r.id}')">Принять меры</button>
    </div>
  `).join("");
}

async function closeReport(id) {
  await supabaseClient.from("reports").update({ status:"closed", admin_id:currentUser.id }).eq("id", id);
  await logAdminAction("close_report", "report", id);
  loadAdminReports();
}

async function acceptReport(id) {
  const note = prompt("Комментарий администратора") || "";
  await supabaseClient.from("reports").update({ status:"action_taken", admin_id:currentUser.id, admin_note:note }).eq("id", id);
  await logAdminAction("accept_report", "report", id, note);
  loadAdminReports();
}

async function loadAdminVerification() {
  if (!await requireAdmin()) return;

  const { data, error } = await supabaseClient
    .from("verification_requests")
    .select("*")
    .order("created_at", { ascending:false })
    .limit(100);

  const box = document.getElementById("adminList");
  if (error) { box.innerHTML = error.message; return; }

  box.innerHTML = (data || []).map(v => `
    <div class="panel">
      <h3>${v.request_type}</h3>
      <p>User: ${v.user_id}</p>
      <p>Company: ${v.company_id || "-"}</p>
      <p>Status: <b>${v.status}</b></p>
      <p>${v.comment || ""}</p>
      <p>Document path: <code>${v.document_url || ""}</code></p>
      <button class="btn btn-blue" onclick="approveVerification('${v.id}','${v.user_id}','${v.company_id || ""}','${v.request_type}')">Одобрить</button>
      <button class="btn btn-danger" onclick="rejectVerification('${v.id}')">Отклонить</button>
    </div>
  `).join("");
}

async function approveVerification(id, userId, companyId, type) {
  await supabaseClient.from("verification_requests").update({
    status:"approved",
    reviewed_by:currentUser.id,
    reviewed_at:new Date().toISOString()
  }).eq("id", id);

  if (companyId) {
    await supabaseClient.from("companies").update({
      verification_status:"approved",
      verification_type:type,
      verified_at:new Date().toISOString(),
      verified_by:currentUser.id,
      verified:true
    }).eq("id", companyId);
  } else {
    await supabaseClient.from("profiles").update({
      verification_status:"approved",
      verification_type:type,
      verified_at:new Date().toISOString(),
      verified_by:currentUser.id
    }).eq("id", userId);
  }

  await logAdminAction("approve_verification", "verification_request", id);
  loadAdminVerification();
}

async function rejectVerification(id) {
  const note = prompt("Причина отказа") || "";
  await supabaseClient.from("verification_requests").update({
    status:"rejected",
    admin_note:note,
    reviewed_by:currentUser.id,
    reviewed_at:new Date().toISOString()
  }).eq("id", id);

  await logAdminAction("reject_verification", "verification_request", id, note);
  loadAdminVerification();
}

async function loadAdminUsers() {
  if (!await requireAdmin()) return;
  const { data, error } = await supabaseClient.from("profiles").select("*").limit(100);
  const box = document.getElementById("adminList");
  if (error) { box.innerHTML = error.message; return; }
  box.innerHTML = (data || []).map(u => `
    <div class="panel">
      <h3>${u.name || u.email || u.id}</h3>
      <p>${u.phone || ""} · ${u.city || ""}</p>
      <p>Верификация: ${u.verification_status || "none"} · Рейтинг: ${u.rating_avg || 0}</p>
      <button class="btn btn-danger" onclick="banUser('${u.id}')">Заблокировать</button>
    </div>
  `).join("");
}

async function banUser(userId) {
  const reason = prompt("Причина блокировки") || "";
  await supabaseClient.from("user_bans").insert({
    user_id:userId,
    reason,
    banned_by:currentUser.id,
    active:true
  });
  await logAdminAction("ban_user", "user", userId, reason);
  alert("Пользователь добавлен в блокировки");
}

async function loadAdminCompanies() {
  if (!await requireAdmin()) return;
  const { data, error } = await supabaseClient.from("companies").select("*").limit(100);
  const box = document.getElementById("adminList");
  if (error) { box.innerHTML = error.message; return; }
  box.innerHTML = (data || []).map(c => `
    <div class="panel">
      <h3>${c.name}</h3>
      <p>${c.company_type || ""} · ${c.city || ""}</p>
      <p>Верификация: ${c.verification_status || "none"} · Рейтинг: ${c.rating_avg || 0}</p>
      <a class="btn btn-light" href="company.html?id=${c.id}" target="_blank">Открыть</a>
    </div>
  `).join("");
}
