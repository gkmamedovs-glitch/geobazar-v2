
let currentUser = null;

async function initAuth() {
  const { data } = await supabaseClient.auth.getUser();
  currentUser = data.user || null;
  renderAuthNav();
}

function renderAuthNav() {
  const navBox = document.getElementById("authNav");
  if (!navBox) return;

  if (currentUser) {
    navBox.innerHTML = `
      <a class="btn btn-light" href="dashboard.html">👤 ${typeof tr === "function" ? tr("cabinet") : "Кабинет"}</a>
      <button class="btn btn-danger" onclick="logoutUser()">🚪 ${typeof tr === "function" ? tr("logout") : "Выйти"}</button>
    `;
  } else {
    navBox.innerHTML = `
      <button class="btn btn-light" onclick="openAuth('login')">${typeof tr === "function" ? tr("login") : "Войти"}</button>
      <button class="btn btn-light" onclick="openAuth('register')">${typeof tr === "function" ? tr("register") : "Регистрация"}</button>
    `;
  }
}

function openAuth(mode) {
  window.authMode = mode;
  const title = document.getElementById("authTitle");
  const msg = document.getElementById("authMessage");
  const modal = document.getElementById("authModal");

  if (title) title.innerText = mode === "register" ? (typeof tr === "function" ? tr("register") : "Регистрация") : (typeof tr === "function" ? tr("login") : "Вход");
  if (msg) msg.innerText = "";
  if (modal) modal.classList.add("show");
}

function closeAuth() {
  const modal = document.getElementById("authModal");
  if (modal) modal.classList.remove("show");
}

async function submitAuth() {
  const email = document.getElementById("authEmail").value.trim();
  const password = document.getElementById("authPassword").value;
  const msg = document.getElementById("authMessage");

  msg.className = "message";

  if (!email || !password) {
    msg.innerText = "Введите email и пароль";
    msg.classList.add("err");
    return;
  }

  let result;

  if (window.authMode === "register") {
    result = await supabaseClient.auth.signUp({ email, password });
    msg.innerText = result.error ? result.error.message : "Регистрация создана. Теперь войдите в аккаунт.";
  } else {
    result = await supabaseClient.auth.signInWithPassword({ email, password });
    msg.innerText = result.error ? result.error.message : "Вы вошли.";
    if (!result.error) {
      closeAuth();
      await initAuth();
      location.href = "dashboard.html";
    }
  }

  msg.classList.add(result.error ? "err" : "ok");
}

async function logoutUser() {
  try {
    await supabaseClient.auth.signOut();
  } catch (e) {
    console.error(e);
  }

  localStorage.removeItem("sb-hexatytkkerqhtsukozp-auth-token");
  sessionStorage.clear();

  location.href = "index.html";
}

// Emergency logout from browser console: forceLogout()
async function forceLogout() {
  await logoutUser();
}

document.addEventListener("DOMContentLoaded", initAuth);
