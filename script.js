// Swayam Mehta — industrial studio + GSAP motion

const CONTACT_EMAIL = "swayamehta1@gmail.com";
const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;

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
        targetBlank: !String(link.href || "").startsWith("mailto:"),
        doneLabel: label.includes("download") || label.includes("install") ? "Ready" : undefined,
      });
    })
    .join("");
}

function renderCtaActions() {
  const mount = document.getElementById("cta-actions");
  if (!mount || typeof createMicroButton !== "function") return;

  const mailIcon = window.MICRO_ICONS?.mail || "";

  mount.innerHTML = [
    createMicroButton({
      href: "assets/Swayam_Mehta_Resume.pdf",
      label: "Open Résumé",
      micro: "morph",
      icon: "download",
      icon2: "check",
      variant: "primary",
      size: "xl",
      targetBlank: true,
      doneLabel: "Opened",
    }),
    createMicroButton({
      href: "https://linkedin.com/in/swayam-mehta",
      label: "Connect on LinkedIn",
      micro: "slide-arrow",
      icon: "external",
      icon2: "arrow",
      variant: "ghost",
      size: "xl",
      targetBlank: true,
    }),
    `<a class="micro-btn is-ghost is-xl" href="${CONTACT_MAILTO}">
      <span class="micro-btn__inner">
        <span class="micro-btn__icon">${mailIcon}</span>
        <span class="micro-btn__label">Email Me</span>
      </span>
    </a>`,
  ].join("");
}

function initContactEmailFallback() {
  const section = document.getElementById("contact");
  if (!section || section.querySelector(".cta-email-fallback")) return;

  const fallback = document.createElement("div");
  fallback.className = "cta-email-fallback";
  fallback.innerHTML = `
    <span class="cta-email-label">Or email directly:</span>
    <a class="cta-email-address" href="${CONTACT_MAILTO}">${CONTACT_EMAIL}</a>
    <button type="button" class="cta-email-copy" aria-label="Copy email address to clipboard">Copy</button>
  `;
  section.appendChild(fallback);

  const copyBtn = fallback.querySelector(".cta-email-copy");
  copyBtn?.addEventListener("click", async () => {
    const original = copyBtn.textContent;
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      copyBtn.textContent = "Copied";
    } catch {
      const input = document.createElement("textarea");
      input.value = CONTACT_EMAIL;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.left = "-9999px";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
      copyBtn.textContent = "Copied";
    }
    window.setTimeout(() => {
      copyBtn.textContent = original;
    }, 2000);
  });
}

function renderTelemetry() {
  const mount = document.getElementById("telemetry-grid");
  if (!mount || typeof PRODUCTS === "undefined") return;

  const apps = PRODUCTS.filter((p) => p.kind === "app");
  const plugins = PRODUCTS.filter((p) => p.kind === "raycast");

  // Telemetry catalog is text-only; hero shots live in the stage stack below.
  const appCells = apps
    .map(
      (app) => {
        const stageHref = `#stage-${app.id}`;

        return `
      <article class="telem-cell is-app">
        <div class="telem-body">
          <div>
            <div class="telem-top">
              <span>${app.platform}</span>
              <span class="telem-status">${app.status}</span>
            </div>
            <h3 class="telem-name"><a href="${stageHref}">${app.name}</a></h3>
            <p class="telem-tag">${app.tagline}</p>
          </div>
          <div class="telem-actions">
            <a class="btn btn-ghost btn-sm" href="${stageHref}">View stage</a>
            ${linkButtons(app.links)}
          </div>
        </div>
      </article>`;
      }
    )
    .join("");

  const pluginCells = plugins
    .map(
      (plugin) => `
      <article class="telem-cell is-plugin">
        <div class="telem-body">
          <div>
            <div class="telem-top">
              <span>RAYCAST</span>
              <span class="telem-status">${plugin.status}</span>
            </div>
            <h3 class="telem-name">${plugin.name}</h3>
            <p class="telem-tag">${plugin.tagline}</p>
          </div>
          <div class="telem-actions">${linkButtons(plugin.links)}</div>
        </div>
      </article>`
    )
    .join("");

  mount.innerHTML = appCells + pluginCells;
}

function stackCardMeta(app) {
  return [app.platform, app.version ? `v${app.version}` : null].filter(Boolean).join(" · ");
}

function stackCardFeatures(app) {
  if (!app.features?.length) return "";
  const items = app.features.map((feature) => `<li>${feature}</li>`).join("");
  const license = app.licenseNote
    ? `<p class="stack-license">${app.licenseNote}</p>`
    : "";
  return `<ul class="stack-features" aria-label="${app.name} features">${items}</ul>${license}`;
}

function renderStageJump(featured) {
  const mount = document.getElementById("stage-jump");
  if (!mount) return;

  mount.innerHTML = featured
    .map(
      (app) => `
      <a class="stage-jump-link" href="#stage-${app.id}">
        <span class="stage-jump-name">${app.name}</span>
        <span class="stage-jump-meta">${app.platform}</span>
      </a>`
    )
    .join("");
}

function renderStackCards() {
  const mount = document.getElementById("stack-cards");
  if (!mount || typeof PRODUCTS === "undefined") return;

  const featured = PRODUCTS.filter((p) => p.kind === "app" && p.image);
  renderStageJump(featured);

  mount.innerHTML = featured
    .map(
      (app, index) => `
      <article class="stack-card" id="stage-${app.id}">
        <div class="stack-card-media media-scale">
          <img src="${app.image}" alt="${app.imageAlt || app.name}" loading="eager" fetchpriority="${index === 0 ? "high" : "auto"}" width="1440" height="900">
          <div class="halftone" aria-hidden="true"></div>
        </div>
        <div class="stack-card-body">
          <div>
            <div class="telem-top">
              <span>${stackCardMeta(app)}</span>
              <span class="telem-status">${app.status}</span>
            </div>
            <h3>${app.name}</h3>
            <p class="stack-tagline">${app.tagline}</p>
            <p>${app.description}</p>
            ${stackCardFeatures(app)}
          </div>
          <div class="telem-actions">${linkButtons(app.links)}</div>
        </div>
      </article>`
    )
    .join("");
}

function settleVisibleStackCards() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  gsap.utils.toArray(".stack-card").forEach((card) => {
    const rect = card.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.9 && rect.bottom > window.innerHeight * 0.05;
    if (!inView) return;

    const media = card.querySelector(".stack-card-media");
    gsap.set(card, { opacity: 1, scale: 1, y: 0, clearProps: "transform" });
    if (media) gsap.set(media, { opacity: 1, scale: 1, clearProps: "transform" });
  });
}

function primeStageMedia() {
  const stageImages = [...document.querySelectorAll(".stack-card-media img")];
  if (!stageImages.length) return;

  stageImages.forEach((img) => {
    img.loading = "eager";

    const refresh = () => {
      if (typeof ScrollTrigger === "undefined") return;
      ScrollTrigger.refresh();
      settleVisibleStackCards();
    };

    if (img.complete) {
      refresh();
      return;
    }

    img.addEventListener("load", refresh, { once: true });
  });
}

function initMotion() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.registerPlugin(ScrollTrigger);

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
      ".hero-bio",
      { y: 18, opacity: 0, duration: 0.45 },
      "-=0.35"
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
      ".hero-links a",
      {
        y: 12,
        opacity: 0,
        stagger: 0.08,
        duration: 0.4,
        ease: "power3.out",
        clearProps: "transform",
      },
      "-=0.22"
    )
    .from(
      ".hero-frame",
      {
        y: 42,
        scale: 0.9,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        clearProps: "transform",
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
  gsap.utils.toArray(".telemetry-head h2, .stack-pin h2, .rare-folder-copy h2").forEach((title) => {
    gsap.from(title, {
      x: -28,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
      clearProps: "transform",
      scrollTrigger: { trigger: title, start: "top 85%", once: true },
    });
  });

  // Catalog media — settle into place on scroll
  gsap.utils.toArray(".telem-media img").forEach((img) => {
    gsap.from(img, {
      scale: 1.06,
      opacity: 0.4,
      duration: 0.8,
      ease: "power3.out",
      clearProps: "transform",
      scrollTrigger: { trigger: img, start: "top 88%", once: true },
    });
  });

  // Active stage jump link while scrolling stages
  const stageCards = gsap.utils.toArray(".stack-card[id]");
  const jumpLinks = [...document.querySelectorAll(".stage-jump-link")];
  if (stageCards.length && jumpLinks.length && "IntersectionObserver" in window) {
    const stageObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        jumpLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
        });
      },
      { rootMargin: "-30% 0px -45%", threshold: [0.2, 0.5] }
    );
    stageCards.forEach((card) => stageObserver.observe(card));
  }

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
    const media = card.querySelector(".stack-card-media");

    gsap.fromTo(
      card,
      { y: 48 + index * 8, opacity: 0.2, scale: 0.97 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: "power3.out",
        clearProps: "transform",
        immediateRender: false,
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          once: true,
        },
      }
    );

    if (media) {
      gsap.fromTo(
        media,
        { scale: 0.96, opacity: 0.4 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.75,
          ease: "power3.out",
          clearProps: "transform",
          immediateRender: false,
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            once: true,
          },
        }
      );
    }
  });

  settleVisibleStackCards();

  // Career — skills / timeline / github
  gsap.from("#skills-marquees", {
    y: 24,
    opacity: 0,
    duration: 0.55,
    ease: "power2.out",
    clearProps: "transform",
    scrollTrigger: { trigger: "#skills", start: "top 78%", once: true },
  });
  gsap.from(".exp-card", {
    y: 28,
    opacity: 0,
    stagger: 0.12,
    duration: 0.55,
    ease: "power2.out",
    clearProps: "transform",
    scrollTrigger: { trigger: "#experience-timeline", start: "top 80%", once: true },
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
renderCtaActions();
initContactEmailFallback();
primeStageMedia();
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
