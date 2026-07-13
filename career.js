// Skills marquees, experience timeline, GitHub contribution calendar.
// Layout patterns adapted from manixh.dev; content from Swayam's résumé + GitHub.

(function mountCareerSections() {
  const skillsRoot = document.getElementById("skills-marquees");
  const expRoot = document.getElementById("experience-timeline");
  const eduRoot = document.getElementById("education-rail");
  const ghRoot = document.getElementById("github-activity");
  if (!skillsRoot && !expRoot && !ghRoot) return;
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

  function levelForCount(count, max) {
    if (!count) return 0;
    if (max <= 1) return 3;
    const ratio = count / max;
    if (ratio <= 0.25) return 1;
    if (ratio <= 0.5) return 2;
    if (ratio <= 0.75) return 3;
    return 4;
  }

  function monthLabel(dateStr) {
    const d = new Date(`${dateStr}T12:00:00Z`);
    return d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  }

  function renderGithub(data) {
    if (!ghRoot || !data?.weeks?.length) return;

    const weeks = data.weeks;
    const allDays = weeks.flat();
    const total = data.totalContributions ?? allDays.reduce((s, d) => s + (d.c || 0), 0);
    const max = Math.max(1, ...allDays.map((d) => d.c || 0));

    const cell = 11;
    const gap = 3;
    const labelH = 18;
    const leftPad = 28;
    const width = leftPad + weeks.length * (cell + gap);
    const height = labelH + 7 * (cell + gap);

    const weekdays = ["", "Mon", "", "Wed", "", "Fri", ""];
    const weekdayLabels = weekdays
      .map((label, i) => {
        if (!label) return "";
        const y = labelH + i * (cell + gap) + cell * 0.75;
        return `<text class="gh-axis" x="0" y="${y}">${label}</text>`;
      })
      .join("");

    let lastMonth = "";
    const monthLabels = [];
    weeks.forEach((week, wi) => {
      const first = week[0];
      if (!first?.d) return;
      const m = monthLabel(first.d);
      if (m !== lastMonth) {
        lastMonth = m;
        const x = leftPad + wi * (cell + gap);
        monthLabels.push(`<text class="gh-axis" x="${x}" y="12">${m}</text>`);
      }
    });

    const rects = weeks
      .map((week, wi) =>
        week
          .map((day, di) => {
            const x = leftPad + wi * (cell + gap);
            const y = labelH + di * (cell + gap);
            const level = levelForCount(day.c || 0, max);
            const title = `${day.d}: ${day.c || 0} contribution${day.c === 1 ? "" : "s"}`;
            return `<rect class="gh-cell level-${level}" x="${x}" y="${y}" width="${cell}" height="${cell}" data-count="${day.c || 0}" data-date="${esc(day.d)}"><title>${esc(title)}</title></rect>`;
          })
          .join("")
      )
      .join("");

    const login = CAREER.github?.login || "Swayyum";
    const profile = CAREER.github?.profileUrl || `https://github.com/${login}`;

    ghRoot.innerHTML = `
      <div class="gh-stats">
        <p class="gh-total">This year: <strong>${total.toLocaleString("en-US")}</strong> contributions on <a href="${esc(profile)}" target="_blank" rel="noopener noreferrer">@${esc(login)}</a></p>
        <div class="gh-legend" aria-hidden="true">
          <span>Less</span>
          <span class="gh-swatch level-0"></span>
          <span class="gh-swatch level-1"></span>
          <span class="gh-swatch level-2"></span>
          <span class="gh-swatch level-3"></span>
          <span class="gh-swatch level-4"></span>
          <span>More</span>
        </div>
      </div>
      <div class="gh-scroll" tabindex="0" role="img" aria-label="GitHub contribution calendar for ${esc(login)}, ${total} contributions in the last year">
        <svg class="gh-calendar" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" aria-hidden="true">
          ${monthLabels.join("")}
          ${weekdayLabels}
          ${rects}
        </svg>
      </div>
      <p class="gh-note">Calendar baked from the GitHub API for static Pages. Refresh via deploy when contribution totals change.</p>
    `;
  }

  async function loadGithub() {
    if (!ghRoot) return;
    ghRoot.innerHTML = `<p class="gh-loading">Loading contribution graph…</p>`;
    const url = CAREER.github?.dataUrl || "github-contributions.json";
    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      renderGithub(data);
    } catch (err) {
      const login = CAREER.github?.login || "Swayyum";
      ghRoot.innerHTML = `
        <p class="gh-error">Contribution graph unavailable offline. See <a href="https://github.com/${esc(login)}" target="_blank" rel="noopener noreferrer">github.com/${esc(login)}</a>.</p>
        <div class="gh-fallback">
          <img src="https://ghchart.rshah.org/1d4ed8/${esc(login)}" alt="GitHub contribution chart for ${esc(login)}" width="663" height="104" loading="lazy" />
        </div>`;
    }
  }

  renderSkills();
  renderExperience();
  renderEducation();
  loadGithub();
})();
