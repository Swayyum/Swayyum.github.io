// Swayam Mehta — industrial studio + GSAP motion

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const clockEl = document.getElementById("clock");
function tickClock() {
  if (!clockEl) return;
  const now = new Date();
  clockEl.textContent = now.toTimeString().slice(0, 8);
}
tickClock();
setInterval(tickClock, 1000);

const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.getElementById("mobile-nav");
if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("is-open");
    mobileNav.hidden = !open;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("is-open");
      mobileNav.hidden = true;
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || mobileNav.hidden) return;
    mobileNav.classList.remove("is-open");
    mobileNav.hidden = true;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    menuToggle.focus();
  });
}

const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
if ("IntersectionObserver" in window && navLinks.length) {
  const sections = navLinks.map((link) => document.querySelector(link.hash)).filter(Boolean);
  const navObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => {
        const active = link.hash === `#${visible.target.id}`;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-20% 0px -65%", threshold: [0, 0.2, 0.5] }
  );
  sections.forEach((section) => navObserver.observe(section));
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const href = anchor.getAttribute("href");
    if (!href || href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

function linkButtons(links, sizeClass = "sm") {
  if (typeof createMicroButton !== "function") {
    return (links || [])
      .map((link) => {
        const cls = link.primary ? "btn btn-primary btn-sm" : "btn btn-ghost btn-sm";
        return `<a class="${cls}" href="${link.href}" target="_blank" rel="noopener noreferrer">${link.label}</a>`;
      })
      .join("");
  }

  return (links || [])
    .map((link) => {
      const label = link.label.toLowerCase();
      let micro = "slide-arrow";
      let icon = "external";
      let icon2 = "arrow";

      if (label.includes("download")) {
        micro = "morph";
        icon = "download";
        icon2 = "check";
      } else if (label.includes("install")) {
        micro = label.includes("raycast") ? "ring" : "morph";
        icon = label.includes("raycast") ? "raycast" : "terminal";
        icon2 = label.includes("raycast") ? "bellRing" : "check";
      } else if (label.includes("github") || label.includes("releases")) {
        micro = "sparkle";
        icon = "github";
        icon2 = "star";
      }

      return createMicroButton({
        href: link.href,
        label: link.label,
        micro,
        icon,
        icon2,
        variant: link.primary ? "primary" : "ghost",
        size: sizeClass,
        targetBlank: true,
        doneLabel: label.includes("download") || label.includes("install") ? "Ready" : undefined,
      });
    })
    .join("");
}

function renderCtaActions() {
  const mount = document.getElementById("cta-actions");
  if (!mount || typeof createMicroButton !== "function") return;

  mount.innerHTML = [
    createMicroButton({
      href: "https://github.com/Swayyum/fluxon-releases/releases",
      label: "Download Fluxon",
      micro: "morph",
      icon: "download",
      icon2: "check",
      variant: "primary",
      size: "xl",
      targetBlank: true,
      doneLabel: "Fetched",
    }),
    createMicroButton({
      href: "https://pypi.org/project/typatro/",
      label: "Install Typatro",
      micro: "slide-arrow",
      icon: "terminal",
      icon2: "arrow",
      variant: "ghost",
      size: "xl",
      targetBlank: true,
    }),
  ].join("");
}

function renderTelemetry() {
  const mount = document.getElementById("telemetry-grid");
  if (!mount || typeof PRODUCTS === "undefined") return;

  const apps = PRODUCTS.filter((p) => p.kind === "app");
  const plugins = PRODUCTS.filter((p) => p.kind === "raycast");

  const appCells = apps
    .map(
      (app, index) => `
      <article class="telem-cell is-app">
        <div>
          <div class="telem-top">
            <span>[ UNIT / ${String(index + 1).padStart(2, "0")} ]</span>
            <span class="telem-status">${app.status}</span>
          </div>
          <h3 class="telem-name">${app.name}</h3>
          <p class="telem-tag">${app.tagline}</p>
        </div>
        <div class="telem-actions">${linkButtons(app.links)}</div>
      </article>`
    )
    .join("");

  const pluginCells = plugins
    .map(
      (plugin, index) => `
      <article class="telem-cell is-plugin">
        <div>
          <div class="telem-top">
            <span>[ EXT / ${String(index + 1).padStart(2, "0")} ]</span>
            <span class="telem-status">${plugin.platform}</span>
          </div>
          <h3 class="telem-name">${plugin.name}</h3>
          <p class="telem-tag">${plugin.tagline}</p>
        </div>
        <div class="telem-actions">${linkButtons(plugin.links)}</div>
      </article>`
    )
    .join("");

  const upcomingCell =
    typeof UPCOMING !== "undefined" && UPCOMING.length
      ? `
    <article class="telem-cell is-wide">
      <div>
        <div class="telem-top">
          <span>[ BAY / NEXT ]</span>
          <span class="telem-status">STANDBY</span>
        </div>
        <h3 class="telem-name">${UPCOMING[0].name}</h3>
        <p class="telem-tag">${UPCOMING[0].tagline}</p>
      </div>
    </article>`
      : "";

  mount.innerHTML = appCells + pluginCells + upcomingCell;

  const appStat = document.getElementById("stat-apps");
  const pluginStat = document.getElementById("stat-plugins");
  if (appStat) appStat.textContent = String(apps.length).padStart(2, "0");
  if (pluginStat) pluginStat.textContent = String(plugins.length).padStart(2, "0");
}

function renderStackCards() {
  const mount = document.getElementById("stack-cards");
  if (!mount || typeof PRODUCTS === "undefined") return;

  const featured = PRODUCTS.filter((p) => p.kind === "app" && p.image);
  mount.innerHTML = featured
    .map(
      (app) => `
      <article class="stack-card">
        <div class="stack-card-media">
          <img src="${app.image}" alt="${app.imageAlt || app.name}" loading="lazy" width="1200" height="750">
          <div class="halftone" aria-hidden="true"></div>
        </div>
        <div class="stack-card-body">
          <div>
            <div class="telem-top">
              <span>${app.platform}</span>
              <span class="telem-status">${app.status}</span>
            </div>
            <h3>${app.name}</h3>
            <p>${app.description}</p>
          </div>
          <div class="telem-actions">${linkButtons(app.links)}</div>
        </div>
      </article>`
    )
    .join("");
}

function renderAccordion() {
  const mount = document.getElementById("accordion");
  if (!mount || typeof PRODUCTS === "undefined") return;

  const plugins = PRODUCTS.filter((p) => p.kind === "raycast");
  mount.innerHTML = plugins
    .map(
      (plugin, index) => `
      <article class="accordion-item${index === 0 ? " is-open" : ""}" tabindex="0" role="button" aria-expanded="${index === 0 ? "true" : "false"}">
        <div>
          <p class="accordion-meta">[ SLOT / ${String(index + 1).padStart(2, "0")} ] // ${plugin.platform}</p>
          <h3>${plugin.name}</h3>
        </div>
        <div class="accordion-body">
          <p>${plugin.description}</p>
          <div class="telem-actions">${linkButtons(plugin.links)}</div>
        </div>
      </article>`
    )
    .join("");

  const items = [...mount.querySelectorAll(".accordion-item")];
  items.forEach((item) => {
    const activate = () => {
      items.forEach((el) => {
        el.classList.remove("is-open");
        el.setAttribute("aria-expanded", "false");
      });
      item.classList.add("is-open");
      item.setAttribute("aria-expanded", "true");
    };
    item.addEventListener("mouseenter", activate);
    item.addEventListener("focus", activate);
    item.addEventListener("click", activate);
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activate();
      }
    });
  });
}

function initMotion() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.registerPlugin(ScrollTrigger);

  // Marquee — linear loop (constant speed by design)
  const track = document.querySelector(".marquee-track");
  if (track) {
    const width = track.scrollWidth / 2;
    gsap.to(track, {
      x: -width,
      duration: 28,
      ease: "none",
      repeat: -1,
    });
  }

  // Hero orchestration — stagger + spring + scale-in
  const heroTl = gsap.timeline({
    defaults: { ease: "power3.out" },
  });
  heroTl
    .from(".hero-meta span", {
      y: 14,
      opacity: 0,
      stagger: 0.07,
      duration: 0.45,
    })
    .from(
      ".hero-kicker",
      { y: 18, opacity: 0, duration: 0.4 },
      "-=0.15"
    )
    .from(
      ".hero-title",
      {
        y: 48,
        opacity: 0,
        duration: 0.85,
        ease: "power4.out",
      },
      "-=0.2"
    )
    .from(
      ".hero-line",
      { y: 22, opacity: 0, duration: 0.5 },
      "-=0.4"
    )
    .from(
      ".hero-actions .micro-btn",
      {
        y: 18,
        opacity: 0,
        stagger: 0.1,
        duration: 0.45,
        ease: "power3.out",
        clearProps: "transform",
      },
      "-=0.28"
    )
    .from(
      ".hero-frame",
      {
        y: 42,
        scale: 0.9,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      },
      "-=0.55"
    );

  // Parallax — hero frame vs copy
  const heroFrame = document.querySelector(".hero-frame");
  if (heroFrame) {
    gsap.to(heroFrame, {
      yPercent: 12,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  // Scroll-driven image scale / fade
  gsap.utils.toArray(".media-scale, .stack-card-media").forEach((el) => {
    gsap.fromTo(
      el,
      { scale: 0.88, opacity: 0.35 },
      {
        scale: 1,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          end: "bottom 20%",
          scrub: true,
        },
      }
    );
  });

  // Scrubbing text reveal (word stagger tied to scroll)
  const scrub = document.querySelector(".scrub-text");
  if (scrub && !scrub.querySelector(".scrub-word")) {
    const words = scrub.textContent.trim().split(/\s+/);
    scrub.innerHTML = words
      .map((w) => `<span class="scrub-word">${w}</span>`)
      .join(" ");
    gsap.fromTo(
      scrub.querySelectorAll(".scrub-word"),
      { opacity: 0.12 },
      {
        opacity: 1,
        stagger: 0.04,
        ease: "none",
        scrollTrigger: {
          trigger: scrub,
          start: "top 80%",
          end: "bottom 45%",
          scrub: true,
        },
      }
    );
  }

  // Scroll reveal + stagger — telemetry cells (pop-in cascade)
  gsap.fromTo(
    ".telem-cell",
    { y: 36, opacity: 0, scale: 0.97 },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.65,
      stagger: 0.09,
      ease: "power3.out",
      clearProps: "transform",
      scrollTrigger: {
        trigger: "#telemetry-grid",
        start: "top 78%",
        once: true,
      },
      onComplete: () => {
        initTelemHoverTilt();
      },
    },
  );

  // Section titles — slide in from left
  gsap.utils.toArray(".telemetry-head h2, .raycast-head h2, .stack-pin h2, .rare-folder-copy h2, .manifest-copy h2").forEach((title) => {
    gsap.from(title, {
      x: -28,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
      clearProps: "transform",
      scrollTrigger: { trigger: title, start: "top 85%", once: true },
    });
  });

  // Scroll pinning + card stacking
  const pin = document.querySelector(".stack-pin");
  const cards = gsap.utils.toArray(".stack-card");

  if (pin && window.matchMedia("(min-width: 961px)").matches) {
    ScrollTrigger.create({
      trigger: ".stack-layout",
      start: "top 12%",
      end: "bottom 75%",
      pin: pin,
      pinSpacing: true,
    });
  }

  cards.forEach((card, index) => {
    gsap.fromTo(
      card,
      { y: 90 + index * 24, opacity: 0.12, scale: 0.94 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          end: "top 42%",
          scrub: true,
        },
      }
    );
  });

  // Accordion — slide in + stagger
  gsap.from(".accordion-item", {
    x: 28,
    opacity: 0,
    stagger: 0.14,
    duration: 0.6,
    ease: "power2.out",
    clearProps: "transform",
    scrollTrigger: {
      trigger: "#accordion",
      start: "top 80%",
      once: true,
    },
  });

  // Dossier — scroll reveal
  gsap.from(".rare-folder-copy > *", {
    y: 24,
    opacity: 0,
    stagger: 0.1,
    duration: 0.55,
    ease: "power2.out",
    clearProps: "transform",
    scrollTrigger: { trigger: "#dossier", start: "top 75%", once: true },
  });

  gsap.from("#rare-folder-root", {
    scale: 0.92,
    opacity: 0,
    duration: 0.65,
    ease: "power3.out",
    clearProps: "transform",
    scrollTrigger: { trigger: "#rare-folder-root", start: "top 80%", once: true },
  });

  // Manifest links — stagger cascade
  gsap.from(".manifest-links a", {
    x: 20,
    opacity: 0,
    stagger: 0.1,
    duration: 0.45,
    ease: "power2.out",
    clearProps: "transform",
    scrollTrigger: { trigger: ".manifest-grid", start: "top 80%", once: true },
  });

  // CTA — slide in
  gsap.from(".cta-kicker", {
    x: -16,
    opacity: 0,
    duration: 0.4,
    clearProps: "transform",
    scrollTrigger: { trigger: ".cta-band", start: "top 72%", once: true },
  });
  gsap.from(".cta-title", {
    x: -48,
    opacity: 0,
    duration: 0.75,
    ease: "power3.out",
    clearProps: "transform",
    scrollTrigger: { trigger: ".cta-band", start: "top 70%", once: true },
  });
  gsap.from(".cta-actions .micro-btn", {
    y: 20,
    opacity: 0,
    scale: 0.96,
    stagger: 0.12,
    duration: 0.5,
    ease: "power3.out",
    clearProps: "transform",
    scrollTrigger: { trigger: ".cta-actions", start: "top 85%", once: true },
  });

  // Number ticker — stats count up on enter
  animateStatTickers();
}

function animateStatTickers() {
  const nodes = [
    document.getElementById("stat-apps"),
    document.getElementById("stat-plugins"),
  ].filter(Boolean);

  nodes.forEach((el) => {
    const target = parseInt(el.textContent, 10);
    if (Number.isNaN(target)) return;
    el.textContent = "00";

    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () => {
        const state = { val: 0 };
        gsap.to(state, {
          val: target,
          duration: 0.9,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = String(Math.round(state.val)).padStart(2, "0");
          },
        });
      },
    });
  });
}

function initRippleFeedback() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.addEventListener(
    "pointerdown",
    (event) => {
      const btn = event.target.closest(".micro-btn");
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement("span");
      ripple.className = "micro-ripple";
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    },
    { passive: true }
  );
}

function initTelemHoverTilt() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (typeof gsap === "undefined") return;
  if (initTelemHoverTilt.bound) return;
  initTelemHoverTilt.bound = true;

  document.querySelectorAll(".telem-cell").forEach((cell) => {
    cell.addEventListener("pointermove", (event) => {
      const rect = cell.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      gsap.to(cell, {
        rotateX: y * -4,
        rotateY: x * 5,
        transformPerspective: 800,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
    cell.addEventListener("pointerleave", () => {
      gsap.to(cell, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.45,
        ease: "power3.out",
        overwrite: "auto",
        onComplete: () => gsap.set(cell, { clearProps: "transform" }),
      });
    });
  });
}

renderTelemetry();
renderStackCards();
renderAccordion();
renderCtaActions();
initMotion();
initRippleFeedback();
if (typeof initMicroTransitions === "function") {
  initMicroTransitions();
}
if (typeof mountRareFolder === "function") {
  mountRareFolder(document.getElementById("rare-folder-root"));
}
if (typeof mountRareScrollProgress === "function") {
  mountRareScrollProgress();
}
