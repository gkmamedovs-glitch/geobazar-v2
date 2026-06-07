
async function loadCompanyTeamPage() {
  await requireCompanyAuth();

  const companies = await loadMyCompanies("teamCompanySelect");
  if (!companies.length) {
    document.getElementById("teamBox").innerHTML = "Сначала создайте компанию.";
    return;
  }

  document.getElementById("teamCompanySelect").onchange = loadTeam;
  await loadTeam();
}

async function loadTeam() {
  const companyId = document.getElementById("teamCompanySelect").value;
  const box = document.getElementById("teamBox");

  if (!companyId) {
    box.innerHTML = "Выберите компанию.";
    return;
  }

  const { data, error } = await supabaseClient
    .from("company_members")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending:false });

  if (error) {
    box.innerHTML = error.message;
    return;
  }

  if (!data || !data.length) {
    box.innerHTML = "<p>Сотрудников пока нет.</p>";
    return;
  }

  box.innerHTML = data.map(m => `
    <div class="panel">
      <b>${m.role}</b>
      <p>User ID: ${m.user_id}</p>
      <p>Status: ${m.status}</p>
    </div>
  `).join("");
}

async function inviteEmployee() {
  const msg = document.getElementById("inviteMessage");
  msg.className = "message";

  const companyId = document.getElementById("teamCompanySelect").value;
  const email = document.getElementById("inviteEmail").value.trim();
  const role = document.getElementById("inviteRole").value;

  if (!companyId || !email) {
    msg.innerText = "Выберите компанию и введите email";
    msg.classList.add("err");
    return;
  }

  const { error } = await supabaseClient.from("company_invites").insert({
    company_id: companyId,
    email,
    role,
    created_by: currentUser.id,
    status: "pending"
  });

  msg.innerText = error ? error.message : "Приглашение создано ✅";
  msg.classList.add(error ? "err" : "ok");
}
