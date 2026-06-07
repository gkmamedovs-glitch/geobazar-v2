
async function loadBillingPage() {
  await initAuth();
  const { data, error } = await supabaseClient.from("plans").select("*").eq("active", true).order("price");
  const box = document.getElementById("plansBox");
  if (error) { box.innerHTML = error.message; return; }

  box.innerHTML = (data || []).map(p => `
    <div class="card">
      <h2>${p.name}</h2>
      <p><b>${p.price} ${p.currency}</b> / ${p.duration_days} дней</p>
      <p>Объявлений: ${p.listing_limit}</p>
      <p>VIP: ${p.vip_limit}</p>
      <p>Поднятий: ${p.boost_limit}</p>
      <button class="btn btn-orange" onclick="createPaymentIntent('${p.id}', ${p.price}, '${p.currency}', '${p.name}')">Выбрать пакет</button>
    </div>
  `).join("");
}

async function createPaymentIntent(planId, amount, currency, name) {
  await initAuth();
  if (!currentUser) { openAuth("login"); return; }

  const { error } = await supabaseClient.from("payment_transactions").insert({
    user_id: currentUser.id,
    plan_id: planId,
    type: "plan",
    amount,
    currency,
    status: "pending",
    provider: "manual",
    description: "Пакет " + name
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("Заявка на оплату создана. Реальное подключение банка добавим следующим этапом.");
}
