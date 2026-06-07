
async function loadReviewsPage() {
  const companyId = qs("company_id");
  const userId = qs("user_id");
  const listingId = qs("listing_id");

  let q = supabaseClient.from("reviews").select("*").eq("status", "active").order("created_at", {ascending:false});
  if (companyId) q = q.eq("company_id", companyId);
  if (userId) q = q.eq("target_user_id", userId);
  if (listingId) q = q.eq("listing_id", listingId);

  const { data, error } = await q;
  const box = document.getElementById("reviewsBox");
  if (error) { box.innerHTML = error.message; return; }

  const reviews = data || [];
  const avg = reviews.length ? (reviews.reduce((s,x)=>s+Number(x.rating||0),0) / reviews.length).toFixed(1) : "0.0";
  const summary = document.getElementById("reviewsSummary");
  if (summary) summary.innerHTML = `<h2>⭐ ${avg}</h2><p>${reviews.length} отзывов</p>`;

  if (!reviews.length) { box.innerHTML = "<p>Отзывов пока нет.</p>"; return; }

  box.innerHTML = reviews.map(r => `
    <div class="panel">
      <b>${"⭐".repeat(r.rating)}</b>
      <p>${r.comment || ""}</p>
      <small>${new Date(r.created_at).toLocaleString()}</small>
    </div>
  `).join("");
}

async function submitReview() {
  await initAuth();
  if (!currentUser) { openAuth("login"); return; }

  const rating = Number(document.getElementById("reviewRating").value);
  const comment = document.getElementById("reviewComment").value;
  const companyId = qs("company_id") || null;
  const targetUserId = qs("user_id") || null;
  const listingId = qs("listing_id") || null;

  const { error } = await supabaseClient.from("reviews").insert({
    reviewer_id: currentUser.id,
    target_user_id: targetUserId,
    company_id: companyId,
    listing_id: listingId,
    rating,
    comment
  });

  if (error) { alert(error.message); return; }

  await updateRatingCounters(targetUserId, companyId);

  document.getElementById("reviewComment").value = "";
  loadReviewsPage();
}

async function updateRatingCounters(userId, companyId) {
  if (userId) {
    const { data } = await supabaseClient.from("reviews").select("rating").eq("target_user_id", userId).eq("status","active");
    const list = data || [];
    const avg = list.length ? list.reduce((s,x)=>s+Number(x.rating||0),0)/list.length : 0;
    await supabaseClient.from("profiles").update({ rating_avg: avg, reviews_count: list.length }).eq("id", userId);
  }

  if (companyId) {
    const { data } = await supabaseClient.from("reviews").select("rating").eq("company_id", companyId).eq("status","active");
    const list = data || [];
    const avg = list.length ? list.reduce((s,x)=>s+Number(x.rating||0),0)/list.length : 0;
    await supabaseClient.from("companies").update({ rating_avg: avg, reviews_count: list.length }).eq("id", companyId);
  }
}
