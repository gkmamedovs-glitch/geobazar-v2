
function openReportModal(targetType, targetId) {
  let modal = document.getElementById("reportModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "reportModal";
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-card">
        <h2>Пожаловаться</h2>
        <input type="hidden" id="reportTargetType">
        <input type="hidden" id="reportTargetId">
        <div class="field">
          <label>Причина</label>
          <select id="reportReason">
            <option>Мошенничество</option>
            <option>Дубликат</option>
            <option>Запрещённый товар</option>
            <option>Неверная категория</option>
            <option>Неверная цена</option>
            <option>Другое</option>
          </select>
        </div>
        <div class="field"><label>Комментарий</label><textarea id="reportComment"></textarea></div>
        <button class="btn btn-danger" onclick="submitReport()">Отправить жалобу</button>
        <button class="btn btn-light" onclick="document.getElementById('reportModal').classList.remove('show')">Закрыть</button>
        <p id="reportMessage" class="message"></p>
      </div>
    `;
    document.body.appendChild(modal);
  }

  document.getElementById("reportTargetType").value = targetType;
  document.getElementById("reportTargetId").value = targetId;
  modal.classList.add("show");
}

async function submitReport() {
  await initAuth();
  const msg = document.getElementById("reportMessage");
  if (!currentUser) { msg.innerText = "Сначала войдите"; return; }

  const reason = document.getElementById("reportReason").value + ": " + document.getElementById("reportComment").value;
  const { error } = await supabaseClient.from("reports").insert({
    reporter_id: currentUser.id,
    target_type: document.getElementById("reportTargetType").value,
    target_id: document.getElementById("reportTargetId").value,
    reason,
    status: "new"
  });

  msg.innerText = error ? error.message : "Жалоба отправлена ✅";
}
