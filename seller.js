
async function loadSellerProfile() {
  const userId = new URLSearchParams(location.search).get("id");
  const box = document.getElementById("sellerBox");
  if (!userId) { box.innerHTML = "Продавец не найден"; return; }

  const profile = await supabaseClient.from("profiles").select("*").eq("id", userId).maybeSingle();
  const listings = await supabaseClient.from("listings").select("*").eq("user_id", userId).eq("status","active").order("created_at",{ascending:false});
  const reviews = await supabaseClient.from("reviews").select("*").eq("target_user_id", userId).eq("status","active");

  const p = profile.data || {};
  const r = reviews.data || [];
  const rating = r.length ? (r.reduce((s,x)=>s+Number(x.rating||0),0)/r.length).toFixed(1) : "Нет";

  box.innerHTML = `
    <section class="panel">
      <div class="grid-2">
        <div>
          <img class="avatar" src="${p.avatar_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(p.name || 'User')}">
          <h1>${p.name || 'Пользователь GeoBazar'}</h1>
          <p>${p.verification_status === "approved" ? "🟢 Проверенный пользователь" : "⚪ Не верифицирован"}</p>
          <p>Город: ${p.city || ""}</p>
          <p>Рейтинг: ⭐ ${p.rating_avg || rating} (${p.reviews_count || r.length} отзывов)</p>
          <p>Объявлений: ${(listings.data || []).length}</p>
        </div>
        <div>
          <h2>Контакты</h2>
          <p>Телефон: ${p.phone || "скрыт"}</p>
          <p>WhatsApp: ${p.whatsapp || ""}</p>
          <a class="btn btn-light" href="reviews.html?user_id=${userId}">Отзывы</a>
        </div>
      </div>
    </section>
    <section class="section">
      <h2>Объявления продавца</h2>
      <div id="sellerListings" class="grid-4"></div>
    </section>
  `;

  const cards = [];
  for (const item of listings.data || []) {
    const img = await getFirstImage(item.id);
    cards.push(listingCard(item, img));
  }
  document.getElementById("sellerListings").innerHTML = cards.join("") || "<p>Активных объявлений нет.</p>";
}
