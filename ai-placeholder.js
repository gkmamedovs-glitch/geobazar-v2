
function injectGeoBazarAIPlaceholder() {
  if (document.getElementById("gbAiButton")) return;

  const btn = document.createElement("button");
  btn.id = "gbAiButton";
  btn.innerHTML = "🤖 GeoBazar AI";
  btn.style.cssText = "position:fixed;right:18px;bottom:86px;z-index:9999;border:0;border-radius:999px;padding:13px 18px;background:#0b67ff;color:white;font-weight:800;box-shadow:0 12px 35px rgba(11,103,255,.28);cursor:pointer;";
  btn.onclick = function () {
    alert("GeoBazar AI будет подключён финальным этапом: описание объявлений, переводы, подсказка цены и поддержка.");
  };
  document.body.appendChild(btn);
}
document.addEventListener("DOMContentLoaded", injectGeoBazarAIPlaceholder);
