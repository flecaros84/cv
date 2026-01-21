//lang.js

let currentLang = "es";

function initLanguage() {
  const elements = document.querySelectorAll("[data-i18n]");
  const btn = document.querySelector("#lang-toggle");

  if (!btn) return;

  let lang = localStorage.getItem("lang") || "es";
  currentLang = lang;
  applyLang(lang);

  btn.addEventListener("click", () => {
    lang = lang === "es" ? "en" : "es";
    localStorage.setItem("lang", lang);
    currentLang = lang;
    applyLang(lang);
  });

  function applyLang(language) {
    elements.forEach(el => {
      const key = el.dataset.i18n;
      if (translations[language][key]) {
        el.textContent = translations[language][key];
      }
    });

    btn.textContent = language === "es" ? "EN" : "ES";
  }
}

