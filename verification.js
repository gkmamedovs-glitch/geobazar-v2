
async function requireVerificationAuth() {
  await initAuth();
  if (!currentUser) {
    openAuth("login");
    return false;
  }
  return true;
}

async function loadVerificationPage() {
  const ok = await requireVerificationAuth();
  if (!ok) return;

  if (typeof loadMyCompanies === "function") {
    await loadMyCompanies("verificationCompany");
  }

  const { data, error } = await supabaseClient
    .from("verification_requests")
    .select("*")
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending:false });

  const box = document.getElementById("verificationHistory");
  if (!box) return;

  if (error) {
    box.innerHTML = error.message;
    return;
  }

  if (!data || !data.length) {
    box.innerHTML = "<p>Заявок пока нет.</p>";
    return;
  }

  box.innerHTML = data.map(r => `
    <div class="panel">
      <b>${labelRequestType(r.request_type)}</b>
      <p>Статус: <b>${r.status}</b></p>
      <p>${r.comment || ""}</p>
      <small>${new Date(r.created_at).toLocaleString()}</small>
    </div>
  `).join("");
}

function labelRequestType(type) {
  const labels = {
    user: "🟢 Проверенный пользователь",
    company: "🔵 Проверенная компания",
    dealer: "🏆 Официальный дилер",
    developer: "🏗 Проверенный застройщик",
    manufacturer: "🏭 Проверенный производитель"
  };
  return labels[type] || type;
}

async function submitVerification() {
  const msg = document.getElementById("verificationMessage");
  msg.className = "message";

  if (!currentUser) {
    msg.innerText = "Сначала войдите";
    msg.classList.add("err");
    return;
  }

  const requestType = document.getElementById("verificationType").value;
  const companyId = document.getElementById("verificationCompany").value || null;
  const comment = document.getElementById("verificationComment").value;
  const file = document.getElementById("verificationDocument").files[0];

  if (!file) {
    msg.innerText = "Загрузите документ";
    msg.classList.add("err");
    return;
  }

  const safeName = file.name.replaceAll(" ", "-");
  const path = `${currentUser.id}/${requestType}-${Date.now()}-${safeName}`;

  const upload = await supabaseClient.storage
    .from("verification-documents")
    .upload(path, file);

  if (upload.error) {
    msg.innerText = upload.error.message;
    msg.classList.add("err");
    return;
  }

  const { error } = await supabaseClient.from("verification_requests").insert({
    user_id: currentUser.id,
    company_id: companyId,
    request_type: requestType,
    status: "pending",
    document_url: path,
    comment
  });

  if (error) {
    msg.innerText = error.message;
    msg.classList.add("err");
    return;
  }

  msg.innerText = "Заявка на верификацию отправлена ✅";
  msg.classList.add("ok");

  document.getElementById("verificationDocument").value = "";
  document.getElementById("verificationComment").value = "";
  await loadVerificationPage();
}
