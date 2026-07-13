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

  function skillChip(item) {
    return `<span class="skill-chip"><span class="skill-mark" aria-hidden="true">${esc(item.mark)}</span><span class="skill-name">${esc(item.name)}</span></span>`;
  }

  function renderSkills() {
    const intro = document.getElementById("skills-intro");
    if (intro && CAREER.skillsIntro) intro.textContent = CAREER.skillsIntro;
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
        .map(
          (c) =>
            `<li><span class="cert-name">${esc(c.name)}</span><span class="cert-issuer">${esc(c.issuer)}</span></li>`
        )
        .join("");
    }
  }

  function renderExperience() {
    const intro = document.getElementById("experience-intro");
    if (intro && CAREER.experienceIntro) intro.textContent = CAREER.experienceIntro;
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
        return `
          <article class="exp-card" data-open="${open}">
            <div class="exp-rail" aria-hidden="true"><span class="exp-node"></span></div>
            <div class="exp-panel">
              <header class="exp-head">
                <div class="exp-identity">
                  <div class="exp-logo" aria-hidden="true">${esc(job.company.slice(0, 2).toUpperCase())}</div>
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

  function renderEducation() {
    if (!eduRoot || !CAREER.education?.length) return;
    eduRoot.innerHTML = CAREER.education
      .map((ed) => {
        const minor = ed.minor ? `<p class="edu-minor">Minor: ${esc(ed.minor)}</p>` : "";
        return `
          <article class="edu-card">
            <div class="edu-mark" aria-hidden="true">ED</div>
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
