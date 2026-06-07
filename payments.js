
async function ensureWallet() {
  await initAuth();
  if (!currentUser) return null;

  let { data } = await supabaseClient
    .from("wallets")
    .select("*")
    .eq("user_id", currentUser.id)
    .maybeSingle();

  if (!data) {
    const created = await supabaseClient.from("wallets").insert({
      user_id: currentUser.id,
      balance: 0,
      currency: "GEL"
    }).select().single();
    data = created.data;
  }

  return data;
}

async function loadPaymentsDashboard() {
  await initAuth();
  if (!currentUser) { openAuth("login"); return; }

  const wallet = await ensureWallet();
  document.getElementById("walletBalance").innerText =
    `${wallet?.balance || 0} ${wallet?.currency || "GEL"}`;

  const payments = await supabaseClient
    .from("payments")
    .select("*")
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending:false })
    .limit(50);

  const box = document.getElementById("paymentsHistory");
  if (payments.error) {
    box.innerHTML = payments.error.message;
    return;
  }

  if (!payments.data || !payments.data.length) {
    box.innerHTML = "<p>Операций пока нет.</p>";
  } else {
    box.innerHTML = payments.data.map(p => `
      <div class="panel">
        <b>${p.description || p.type}</b>
        <p>${p.amount} ${p.currency} · ${p.status}</p>
        <small>${new Date(p.created_at).toLocaleString()}</small>
      </div>
    `).join("");
  }

  await loadPaymentPlans();
}

async function loadPaymentPlans() {
  const box = document.getElementById("paymentPlans");
  if (!box) return;

  const { data, error } = await supabaseClient
    .from("plans")
    .select("*")
    .eq("active", true)
    .order("price");

  if (error) {
    box.innerHTML = error.message;
    return;
  }

  box.innerHTML = (data || []).map(p => `
    <div class="card">
      <h2>${p.name}</h2>
      <p><b>${p.price} ${p.currency}</b> / ${p.duration_days || 30} дней</p>
      <p>Объявлений: ${p.listing_limit || 0}</p>
      <p>VIP: ${p.vip_limit || 0}</p>
      <p>Поднятий: ${p.boost_limit || 0}</p>
      <button class="btn btn-orange" onclick="createPayment('plan','${p.id}',${p.price || 0},'${p.currency || "GEL"}','Пакет ${p.name}')">Купить пакет</button>
    </div>
  `).join("");
}

async function createPayment(type, planId, amount, currency, description, listingId = null) {
  await initAuth();
  if (!currentUser) { openAuth("login"); return; }

  const { error } = await supabaseClient.from("payments").insert({
    user_id: currentUser.id,
    listing_id: listingId,
    plan_id: planId || null,
    type,
    amount,
    currency,
    status: "pending",
    provider: "manual",
    description
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("Заявка на оплату создана ✅ Реальный банк подключим следующим этапом.");
  if (typeof loadPaymentsDashboard === "function") loadPaymentsDashboard();
}

async function buyVip(listingId) {
  await createPayment("vip", null, 10, "GEL", "VIP объявление", listingId);
}

async function buyBoost(listingId) {
  await createPayment("boost", null, 5, "GEL", "Поднять объявление", listingId);
}

async function topUpWallet() {
  const amount = Number(prompt("На сколько GEL пополнить баланс?") || 0);
  if (!amount || amount <= 0) return;

  await createPayment("wallet_topup", null, amount, "GEL", "Пополнение баланса");
}
