
async function loadFavoritesPage() {
  await initAuth();
  if (!currentUser) { openAuth("login"); return; }

  const { data, error } = await supabaseClient
    .from("favorites")
    .select("*")
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending:false });

  const box = document.getElementById("favoritesBox");
  if (error) { box.innerHTML = error.message; return; }
  if (!data || !data.length) { box.innerHTML = "<p>Пока нет избранных объявлений.</p>"; return; }

  const cards = [];
  for (const fav of data) {
    const { data:item } = await supabaseClient.from("listings").select("*").eq("id", fav.listing_id).maybeSingle();
    if (item) {
      const img = await getFirstImage(item.id);
      cards.push(listingCard(item, img) + `<button class="btn btn-danger" onclick="removeFavorite('${fav.id}')">Удалить из избранного</button>`);
    }
  }
  box.innerHTML = cards.join("");
}

async function addFavorite(listingId) {
  await initAuth();
  if (!currentUser) { openAuth("login"); return; }
  await supabaseClient.from("favorites").insert({ user_id: currentUser.id, listing_id: listingId });
  alert("Добавлено в избранное ❤️");
}

async function removeFavorite(favoriteId) {
  await supabaseClient.from("favorites").delete().eq("id", favoriteId);
  loadFavoritesPage();
}
