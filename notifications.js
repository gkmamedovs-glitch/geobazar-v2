
async function loadNotificationsPage() {
  await initAuth();
  if (!currentUser) { openAuth("login"); return; }
  const { data, error } = await supabaseClient.from("notifications").select("*").eq("user_id", currentUser.id).order("created_at", {ascending:false});
  const box = document.getElementById("notificationsBox");
  if (error) { box.innerHTML = error.message; return; }
  if (!data || !data.length) { box.innerHTML = "<p>Уведомлений пока нет.</p>"; return; }
  box.innerHTML = data.map(n => `<div class="panel"><b>${n.title || n.type}</b><p>${n.body || ""}</p><small>${new Date(n.created_at).toLocaleString()}</small></div>`).join("");
}
