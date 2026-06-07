
async function getListings(filters = {}) {
  let q = supabaseClient.from("listings").select("*").eq("status", "active").order("created_at", { ascending:false }).limit(50);

  if (filters.category) q = q.eq("category", filters.category);
  if (filters.city) q = q.ilike("city", `%${filters.city}%`);

  const { data, error } = await q;
  if (error) {
    console.error(error);
    return [];
  }
  return data || [];
}

async function getFirstImage(listingId) {
  const { data } = await supabaseClient
    .from("listings-images")
    .select("image_url")
    .eq("listing_id", listingId)
    .limit(1)
    .maybeSingle();

  return data?.image_url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop";
}

async function renderListings(elementId, filters = {}) {
  const box = document.getElementById(elementId);
  if (!box) return;

  box.innerHTML = "Загрузка...";
  const data = await getListings(filters);

  if (!data.length) {
    box.innerHTML = demoCards();
    return;
  }

  const cards = [];
  for (const item of data) {
    const img = await getFirstImage(item.id);
    cards.push(listingCard(item, img));
  }

  box.innerHTML = cards.join("");
}

function listingCard(item, img) {
  const title = item.title || "Объявление";
  return `
    <article class="card listing-card">
      <a href="listing.html?id=${item.id}">
        <img src="${img}" alt="${title}">
        <span class="badge">GeoBazar</span>
        <h3>${title}</h3>
        <p>${item.city || "Грузия"} · ${item.category || ""}</p>
        <b>${money(item.price, item.currency)}</b>
      </a>
      ${shareButtons(title, "https://geobazar.ge/listing.html?id=" + item.id)}
    </article>
  `;
}

function demoCards() {
  const demo = [
    ["Mercedes-Benz GLE 2020","Тбилиси","95 000 GEL","Авто","https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1200&auto=format&fit=crop"],
    ["Сдается 2-комн. квартира","Батуми","1 200 GEL / мес","Недвижимость","https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop"],
    ["iPhone 14 Pro 256GB","Рустави","2 350 GEL","Электроника","https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1200&auto=format&fit=crop"],
    ["Грузоперевозки по Грузии","Марнеули","Договорная","Грузоперевозки","https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=1200&auto=format&fit=crop"]
  ];

  return demo.map(d => `
    <article class="card listing-card">
      <img src="${d[4]}" alt="${d[0]}">
      <span class="badge">DEMO</span>
      <h3>${d[0]}</h3>
      <p>${d[1]} · ${d[3]}</p>
      <b>${d[2]}</b>
      ${shareButtons(d[0])}
    </article>
  `).join("");
}
