// cv-generator.js

function getT(key) {
    return translations[currentLang]?.[key] || "";
}

function buildCVData() {
    const langData = translations[currentLang];

    const trajectory = {
        prof: [],
        acad: [],
    };

    Object.keys(langData)
        .filter(key => key.startsWith("traj_"))
        .forEach(key => {
            const [, year, type, field] = key.split("_");
            if (!trajectory[type]) return;

            let item = trajectory[type].find(e => e.year === year);
            if (!item) {
                item = { year };
                trajectory[type].push(item);
            }

            item[field] = langData[key];
        });

    return {
        header: {
            name: getT("hero_title"),
            role: getT("hero_subtitle"),
            summary: getT("hero_description"),
        },

        about: [
            getT("about_p1"),
            getT("about_p2"),
            getT("about_p3"),
            getT("about_p4"),
        ],

        trajectory,
    };
}

function sortByYearDesc(list) {
    return list.sort((a, b) => Number(b.year) - Number(a.year));
}

function generateCVHtml() {
    const cv = buildCVData();

    const renderSection = (title, items) => `
    <h2>${title}</h2>
    ${items.map(item => `
      <div class="cv-item">
        <strong>${item.title}</strong><br>
        <em>${item.org}</em><br>
        <small>${item.date}</small>
        <p>${item.desc}</p>
      </div>
    `).join("")}
  `;

    return `
<!DOCTYPE html>
<html lang="${currentLang}">
<head>
  <meta charset="UTF-8">
  <title>CV - ${cv.header.name}</title>
<style>
  :root {
    --text-primary: #111827;
    --text-secondary: #374151;
    --text-muted: #6b7280;
    --accent: #2563eb;
    --border: #e5e7eb;
  }

  * {
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
                 Roboto, Helvetica, Arial, sans-serif;
    color: var(--text-primary);
    line-height: 1.6;
    padding: 2.5rem;
    max-width: 900px;
    margin: 0 auto;
  }

  h1 {
    font-size: 2.2rem;
    margin-bottom: 0.25rem;
    letter-spacing: -0.02em;
  }

  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 1.3rem;
    margin-top: 3rem;
    margin-bottom: 1.25rem;
    border-bottom: 1px solid var(--border);
    padding-bottom: 0.4rem;
    letter-spacing: 0.02em;
  }

  p {
    margin-bottom: 0.75rem;
    color: var(--text-secondary);
    text-align: justify;
    hyphens: auto;
  }

  .cv-item {
    margin-bottom: 1.75rem;
  }

  .cv-item strong {
    font-size: 1.05rem;
    display: block;
    margin-bottom: 0.15rem;
  }

  .cv-item em {
    font-style: normal;
    font-weight: 500;
    color: var(--accent);
    display: block;
    margin-bottom: 0.1rem;
  }

  .cv-item small {
    font-size: 0.85rem;
    color: var(--text-muted);
    display: block;
    margin-bottom: 0.4rem;
  }

  @media print {
    body {
      padding: 1.5rem;
    }

    h2 {
      margin-top: 2rem;
    }
  }
</style>
</head>

<body>
  <h1>${cv.header.name}</h1>
  <h3>${cv.header.role}</h3>
  <p>${cv.header.summary}</p>

  <h2>${getT("about_title")}</h2>
  ${cv.about.map(p => `<p>${p}</p>`).join("")}

  ${renderSection(
        currentLang === "es" ? "Experiencia Profesional" : "Professional Experience",
        sortByYearDesc(cv.trajectory.prof)
    )}

  ${renderSection(
        currentLang === "es" ? "Formación Académica" : "Academic Background",
        sortByYearDesc(cv.trajectory.acad)
    )}
</body>
</html>
`;
}

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("download-cv");
    if (!btn) return;

    btn.addEventListener("click", () => {
        const html = generateCVHtml();
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `CV_Fabian_Lecaros_${currentLang}.html`;
        a.click();

        URL.revokeObjectURL(url);
    });
});

