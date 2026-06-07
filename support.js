
function injectSupportWidget() {
  if (document.getElementById("supportWidgetButton")) return;

  const btn = document.createElement("button");
  btn.id = "supportWidgetButton";
  btn.innerText = "💬 Поддержка";
  btn.className = "btn btn-blue";
  btn.style.cssText = "position:fixed;right:18px;bottom:18px;z-index:9999;border-radius:999px;box-shadow:0 12px 35px rgba(0,0,0,.22)";
  btn.onclick = openSupportWidget;
  document.body.appendChild(btn);

  const modal = document.createElement("div");
  modal.id = "supportWidgetModal";
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-card">
      <h2>💬 Поддержка GeoBazar</h2>
      <p>Опишите проблему, и мы создадим обращение в поддержку.</p>
      <div class="field">
        <label>Категория</label>
        <select id="supportCategory">
          <option value="listing">Проблема с объявлением</option>
          <option value="payment">Проблема с оплатой</option>
          <option value="verification">Верификация</option>
          <option value="company">Компания</option>
          <option value="complaint">Жалоба</option>
          <option value="other">Другое</option>
        </select>
      </div>
      <div class="field"><label>Тема</label><input id="supportSubject" placeholder="Коротко о проблеме"></div>
      <div class="field"><label>Сообщение</label><textarea id="supportMessage" placeholder="Опишите подробнее"></textarea></div>
      <button class="btn btn-blue" style="width:100%" onclick="createSupportTicket()">Отправить</button>
      <button class="btn btn-light" style="width:100%;margin-top:10px" onclick="closeSupportWidget()">Закрыть</button>
      <p id="supportWidgetMessage" class="message"></p>
    </div>
  `;
  document.body.appendChild(modal);
}

function openSupportWidget() {
  document.getElementById("supportWidgetModal").classList.add("show");
}

function closeSupportWidget() {
  document.getElementById("supportWidgetModal").classList.remove("show");
}

async function createSupportTicket() {
  await initAuth();
  const msg = document.getElementById("supportWidgetMessage");
  msg.className = "message";

  if (!currentUser) {
    msg.innerText = "Сначала войдите в аккаунт";
    msg.classList.add("err");
    return;
  }

  const category = document.getElementById("supportCategory").value;
  const subject = document.getElementById("supportSubject").value.trim();
  const message = document.getElementById("supportMessage").value.trim();

  if (!subject || !message) {
    msg.innerText = "Заполните тему и сообщение";
    msg.classList.add("err");
    return;
  }

  const { data, error } = await supabaseClient.from("support_tickets").insert({
    user_id: currentUser.id,
    category,
    subject,
    message,
    status: "new"
  }).select().single();

  if (error) {
    msg.innerText = error.message;
    msg.classList.add("err");
    return;
  }

  msg.innerText = "Обращение отправлено ✅";
  msg.classList.add("ok");
  document.getElementById("supportSubject").value = "";
  document.getElementById("supportMessage").value = "";
}

document.addEventListener("DOMContentLoaded", injectSupportWidget);
