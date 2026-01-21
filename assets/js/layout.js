document.addEventListener("DOMContentLoaded", async () => {
  await loadPartial("header", "../partials/header.html");
  await loadPartial("footer", "../partials/footer.html");

  initLanguage(); // 🔑 ahora sí existe el botón
});

async function loadPartial(tag, path) {
  const res = await fetch(path);
  const html = await res.text();

  document.body.insertAdjacentHTML(
    tag === "header" ? "afterbegin" : "beforeend",
    html
  );
}
