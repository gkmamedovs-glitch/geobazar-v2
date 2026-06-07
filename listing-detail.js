
async function loadListingDetail() {
  const id = qs("id");
  const box = document.getElementById("listingDetail");

  if (!id) {
    box.innerHTML = "Объявление не найдено";
    return;
  }

  const { data, error } = await supabaseClient.from("listings").select("*").eq("id", id).maybeSingle();

  if (error || !data) {
    box.innerHTML = "Объявление не найдено";
    return;
  }

  const { data:imgs } = await supabaseClient.from("listings-images").select("*").eq("listing_id", id);

  const imageHtml = (imgs && imgs.length ? imgs : [{ image_url:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop" }])
    .map(x => `<img style="width:100%;max-height:420px;object-fit:cover;border-radius:18px;margin-bottom:12px" src="${x.image_url}">`)
    .join("");

  box.innerHTML = `
    <div class="grid-2">
      <div>${imageHtml}</div>
      <div class="panel">
        <h1 style="font-size:34px">${data.title}</h1>
        <h2 style="color:var(--orange)">${money(data.price, data.currency)}</h2>
        <p><b>Категория:</b> ${data.category || ""}</p>
        <p><b>Город:</b> ${data.city || ""}</p>
        <p style="white-space:pre-wrap">${data.description || ""}</p>
        ${shareButtons(data.title)}
        <button class="btn btn-blue" onclick="startConversation(data.id, data.user_id, data.company_id)">Написать продавцу</button>
        <button class="btn btn-light" onclick="addFavorite(data.id)">В избранное</button>
      </div>
    </div>
  `;
}
