// Skills marquees, experience timeline, education rail.
// Layout patterns adapted from manixh.dev; content from Swayam's résumé.

(function mountCareerSections() {
  const skillsRoot = document.getElementById("skills-marquees");
  const expRoot = document.getElementById("experience-timeline");
  const eduRoot = document.getElementById("education-rail");
  if (!skillsRoot && !expRoot) return;
  if (typeof CAREER === "undefined") return;

  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* Local mono icons (assets/skill-icons/) — no CDN dependency for GitHub Pages.
     Brand SVGs from Simple Icons (MIT); Azure pair from simple-icons@9 (removed upstream).
     Concepts use inline stroke SVGs. Img onerror falls back to letter mark. */
  const ICON_DIR = "assets/skill-icons";

  function letterMark(item) {
    const mark = item.mark || (item.name || "?").slice(0, 2).toUpperCase();
    return `<span class="skill-mark-fallback">${esc(mark)}</span>`;
  }

  function localIcon(file, item) {
    const fallback = esc(item.mark || (item.name || "?").slice(0, 2).toUpperCase());
    return `<img class="skill-icon-img" src="${ICON_DIR}/${file}" alt="" width="16" height="16" loading="lazy" decoding="async" data-mark="${fallback}" onerror="var s=document.createElement('span');s.className='skill-mark-fallback';s.textContent=this.dataset.mark;this.replaceWith(s)" />`;
  }

  const strokeSvg = (paths) =>
    `<svg class="skill-icon-svg" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter">${paths}</svg>`;

  const ICON_SVG = {
    brain: strokeSvg(
      `<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M12 18v-3"/>`
    ),
    layers: strokeSvg(
      `<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>`
    ),
    eye: strokeSvg(
      `<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>`
    ),
    database: strokeSvg(
      `<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>`
    ),
    workflow: strokeSvg(
      `<rect width="8" height="8" x="3" y="3" rx="0"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect width="8" height="8" x="13" y="13" rx="0"/>`
    ),
  };

  /** name → local file or inline concept SVG (existing CAREER.skillRows only) */
  const SKILL_ICON_FILES = {
    Python: "python.svg",
    "C / C++": "cplusplus.svg",
    Java: "openjdk.svg",
    JavaScript: "javascript.svg",
    Bash: "gnubash.svg",
    PyTorch: "pytorch.svg",
    TensorFlow: "tensorflow.svg",
    OpenCV: "opencv.svg",
    NumPy: "numpy.svg",
    Pandas: "pandas.svg",
    Azure: "microsoftazure.svg",
    "Azure DevOps": "azuredevops.svg",
    Docker: "docker.svg",
    Linux: "linux.svg",
    PostgreSQL: "postgresql.svg",
    MongoDB: "mongodb.svg",
    Terraform: "terraform.svg",
    Ansible: "ansible.svg",
  };

  const SKILL_ICON_INLINE = {
    "Machine learning": ICON_SVG.brain,
    "Deep learning": ICON_SVG.layers,
    "Computer vision": ICON_SVG.eye,
    SQL: ICON_SVG.database,
    "CI / CD": ICON_SVG.workflow,
  };

  function skillIcon(item) {
    const file = SKILL_ICON_FILES[item.name];
    if (file) return localIcon(file, item);
    const inline = SKILL_ICON_INLINE[item.name];
    if (inline) return inline;
    return letterMark(item);
  }

  function skillChip(item) {
    return `<span class="skill-chip"><span class="skill-mark" aria-hidden="true">${skillIcon(item)}</span><span class="skill-name">${esc(item.name)}</span></span>`;
  }

  function renderSkills() {
    if (!skillsRoot) return;
    skillsRoot.innerHTML = CAREER.skillRows
      .map((row, index) => {
        const chips = row.items.map(skillChip).join("");
        const direction = index % 2 === 0 ? "is-ltr" : "is-rtl";
        return `
          <div class="skills-marquee ${direction}" data-label="${esc(row.label)}">
            <div class="skills-marquee__track" aria-hidden="true">
              <div class="skills-marquee__inner">${chips}</div>
              <div class="skills-marquee__inner">${chips}</div>
            </div>
            <div class="visually-hidden">${esc(row.label)}: ${row.items.map((i) => i.name).join(", ")}</div>
          </div>`;
      })
      .join("");

    const certEl = document.getElementById("skills-certs");
    if (certEl && CAREER.certifications?.length) {
      certEl.innerHTML = CAREER.certifications
        .map((c) => {
          const mark = c.icon
            ? `<span class="cert-mark" aria-hidden="true">${localIcon(c.icon, { name: c.issuer, mark: (c.issuer || "?").slice(0, 2).toUpperCase() })}</span>`
            : "";
          return `<li>${mark}<span class="cert-name">${esc(c.name)}</span><span class="cert-issuer">${esc(c.issuer)}</span></li>`;
        })
        .join("");
    }
  }

  function renderExperience() {
    if (!expRoot) return;
    expRoot.innerHTML = CAREER.experience
      .map((job, index) => {
        const statusLabel = job.status === "active" ? "Active" : "Done";
        const statusClass = job.status === "active" ? "is-active" : "is-done";
        const companyLink = job.url
          ? `<a class="exp-ext" href="${esc(job.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(job.company)} website">↗</a>`
          : "";
        const team = job.team ? `<span class="exp-team">${esc(job.team)}</span>` : "";
        const bullets = (job.bullets || [])
          .map((b) => `<li>${esc(b)}</li>`)
          .join("");
        const open = index === 0 ? "true" : "false";
        const initials = esc(job.company.slice(0, 2).toUpperCase());
        const companyAlt = esc(job.company);
        let logo;
        if (job.logo && job.logoDark) {
          logo = `<div class="exp-logo exp-logo--img">
            <img class="exp-logo__light" src="${esc(job.logo)}" alt="${companyAlt}" decoding="async">
            <img class="exp-logo__dark" src="${esc(job.logoDark)}" alt="" decoding="async" aria-hidden="true">
          </div>`;
        } else if (job.logo) {
          logo = `<div class="exp-logo exp-logo--img"><img src="${esc(job.logo)}" alt="${companyAlt}" decoding="async"></div>`;
        } else {
          logo = `<div class="exp-logo" aria-hidden="true">${initials}</div>`;
        }
        return `
          <article class="exp-card" data-open="${open}">
            <div class="exp-rail" aria-hidden="true"><span class="exp-node"></span></div>
            <div class="exp-panel">
              <header class="exp-head">
                <div class="exp-identity">
                  ${logo}
                  <div class="exp-titles">
                    <div class="exp-company-row">
                      <span class="exp-company">${esc(job.company)}</span>
                      ${companyLink}
                      <span class="exp-status ${statusClass}"><span class="exp-dot" aria-hidden="true"></span>${statusLabel}</span>
                    </div>
                    <p class="exp-role">${esc(job.role)}</p>
                    ${team}
                  </div>
                </div>
                <div class="exp-meta">
                  <time class="exp-dates">${esc(job.start)} — ${esc(job.end)}</time>
                  <span class="exp-loc">${esc(job.location || "")}</span>
                  <button type="button" class="exp-toggle" aria-expanded="${open}" aria-controls="exp-body-${esc(job.id)}">
                    <span class="exp-toggle-label">${open === "true" ? "Hide" : "Details"}</span>
                    <span class="exp-chevron" aria-hidden="true"></span>
                  </button>
                </div>
              </header>
              <div class="exp-body" id="exp-body-${esc(job.id)}" ${open === "true" ? "" : "hidden"}>
                <ul>${bullets}</ul>
              </div>
            </div>
          </article>`;
      })
      .join("");

    expRoot.querySelectorAll(".exp-card").forEach((card) => {
      const btn = card.querySelector(".exp-toggle");
      const body = card.querySelector(".exp-body");
      const label = card.querySelector(".exp-toggle-label");
      if (!btn || !body) return;
      btn.addEventListener("click", () => {
        const next = card.dataset.open !== "true";
        card.dataset.open = String(next);
        btn.setAttribute("aria-expanded", String(next));
        body.hidden = !next;
        if (label) label.textContent = next ? "Hide" : "Details";
      });
    });
  }

  function eduMark(ed) {
    if (ed.id === "uncc") {
      return `<div class="edu-mark edu-mark--pickaxe" aria-hidden="true" title="UNC Charlotte"><img src="assets/unc-charlotte-pickaxe.svg" alt="" decoding="async"></div>`;
    }
    const initials = (ed.school || "ED")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
    return `<div class="edu-mark" aria-hidden="true">${esc(initials || "ED")}</div>`;
  }

  function renderEducation() {
    if (!eduRoot || !CAREER.education?.length) return;
    eduRoot.innerHTML = CAREER.education
      .map((ed) => {
        const minor = ed.minor ? `<p class="edu-minor">Minor: ${esc(ed.minor)}</p>` : "";
        return `
          <article class="edu-card">
            ${eduMark(ed)}
            <div class="edu-copy">
              <div class="edu-top">
                <h3>${esc(ed.school)}</h3>
                <span class="exp-status is-done"><span class="exp-dot" aria-hidden="true"></span>Done</span>
              </div>
              <p class="edu-degree">${esc(ed.degree)}</p>
              ${minor}
              <p class="edu-dates">${esc(ed.start)} — ${esc(ed.end)}</p>
            </div>
          </article>`;
      })
      .join("");
  }

  renderSkills();
  renderExperience();
  renderEducation();
})();
