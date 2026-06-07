
async function loadMessagesPage() {
  await initAuth();
  if (!currentUser) { openAuth("login"); return; }

  const { data, error } = await supabaseClient
    .from("conversations")
    .select("*")
    .or(`buyer_id.eq.${currentUser.id},seller_id.eq.${currentUser.id},assigned_to.eq.${currentUser.id}`)
    .order("last_message_at", { ascending:false });

  const box = document.getElementById("conversationsBox");
  if (error) { box.innerHTML = error.message; return; }
  if (!data || !data.length) { box.innerHTML = "<p>Диалогов пока нет.</p>"; return; }

  box.innerHTML = data.map(c => `
    <a class="panel" href="conversation.html?id=${c.id}">
      <b>Диалог по объявлению</b>
      <p>${c.last_message || "Нет сообщений"}</p>
      <small>${new Date(c.last_message_at || c.created_at).toLocaleString()}</small>
    </a>
  `).join("");
}

async function loadConversationPage() {
  await initAuth();
  if (!currentUser) { openAuth("login"); return; }

  const id = qs("id");
  if (!id) { document.getElementById("messagesBox").innerHTML = "Диалог не найден"; return; }

  const { data } = await supabaseClient
    .from("messages")
    .select("*")
    .eq("conversation_id", id)
    .order("created_at", { ascending:true });

  const box = document.getElementById("messagesBox");
  box.innerHTML = (data || []).map(m => `
    <div class="panel" style="max-width:720px; margin:10px 0; ${m.sender_id===currentUser.id ? "margin-left:auto;background:#eef2ff" : ""}">
      <p>${m.message || ""}</p>
      ${m.attachment_url ? `<a href="${m.attachment_url}" target="_blank">Файл</a>` : ""}
      <small>${new Date(m.created_at).toLocaleString()}</small>
    </div>
  `).join("");
}

async function sendMessage() {
  const id = qs("id");
  const text = document.getElementById("messageText").value.trim();
  if (!text) return;

  await initAuth();
  if (!currentUser) { openAuth("login"); return; }

  const { error } = await supabaseClient.from("messages").insert({
    conversation_id: id,
    sender_id: currentUser.id,
    message: text
  });

  if (error) { alert(error.message); return; }

  await supabaseClient.from("conversations").update({
    last_message: text,
    last_message_at: new Date().toISOString()
  }).eq("id", id);

  document.getElementById("messageText").value = "";
  loadConversationPage();
}

async function startConversation(listingId, sellerId, companyId=null) {
  await initAuth();
  if (!currentUser) { openAuth("login"); return; }

  const { data, error } = await supabaseClient.from("conversations").insert({
    listing_id: listingId,
    buyer_id: currentUser.id,
    seller_id: sellerId,
    company_id: companyId
  }).select().single();

  if (error) { alert(error.message); return; }
  location.href = "conversation.html?id=" + data.id;
}
