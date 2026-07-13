// Rare UI — Scroll Progress (vanilla port)
// Adapted from https://github.com/swamimalode07/rare-ui

const SCROLL_SECTIONS = [
  { id: "top", label: "Intro" },
  { id: "units", label: "Units" },
  { id: "stack", label: "Stack" },
  { id: "career", label: "Career" },
  { id: "dossier", label: "Dossier" },
  { id: "raycast", label: "Raycast" },
  { id: "manifest", label: "Manifest" },
];

function mountRareScrollProgress() {
  if (document.querySelector(".rare-scroll")) return;

  const root = document.createElement("div");
  root.className = "rare-scroll";
  root.innerHTML = `
    <div class="rare-scroll__menu" role="menu">
      ${SCROLL_SECTIONS.map(
        (s) => `<a href="#${s.id}" data-section="${s.id}" role="menuitem">${s.label}</a>`
      ).join("")}
    </div>
    <button type="button" class="rare-scroll__pill" aria-expanded="false" aria-label="Scroll progress and sections">
      <svg class="rare-scroll__ring" viewBox="0 0 24 24" aria-hidden="true">
        <circle class="track" cx="12" cy="12" r="10"></circle>
        <circle class="bar" cx="12" cy="12" r="10"></circle>
      </svg>
      <span class="rare-scroll__label">Intro</span>
    </button>
  `;
  document.body.appendChild(root);

  const pill = root.querySelector(".rare-scroll__pill");
  const label = root.querySelector(".rare-scroll__label");
  const bar = root.querySelector(".rare-scroll__ring .bar");
  const links = [...root.querySelectorAll(".rare-scroll__menu a")];
  const circumference = 2 * Math.PI * 10;

  function setProgress() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    bar.style.strokeDashoffset = String(circumference * (1 - p));
  }

  function setActive() {
    const anchor = 120;
    let active = SCROLL_SECTIONS[0];
    for (const section of SCROLL_SECTIONS) {
      const el = document.getElementById(section.id);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= anchor) active = section;
    }
    label.textContent = active.label;
    links.forEach((link) => {
      link.classList.toggle("is-active", link.dataset.section === active.id);
    });
  }

  function onScroll() {
    setProgress();
    setActive();
  }

  pill.addEventListener("click", () => {
    const open = root.classList.toggle("is-open");
    pill.setAttribute("aria-expanded", String(open));
  });

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const target = document.getElementById(link.dataset.section);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      root.classList.remove("is-open");
      pill.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (event) => {
    if (!root.contains(event.target)) {
      root.classList.remove("is-open");
      pill.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      root.classList.remove("is-open");
      pill.setAttribute("aria-expanded", "false");
    }
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
}

window.mountRareScrollProgress = mountRareScrollProgress;
