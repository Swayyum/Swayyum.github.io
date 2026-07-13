// Amicro-inspired micro-transitions for vanilla DOM
// Patterns adapted from Subhan-code/Amicro--Micro-transitions-

const MICRO_ICONS = {
  arrow: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>`,
  chevron: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>`,
  github: `<svg viewBox="0 0 24 24" data-fill="1" aria-hidden="true"><path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05A9.2 9.2 0 0112 6.84c.85.01 1.71.12 2.51.35 1.9-1.32 2.74-1.05 2.74-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .26.18.58.69.48A10.03 10.03 0 0022 12.26C22 6.58 17.52 2 12 2z"/></svg>`,
  star: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 18.9 6.2 21l1.1-6.5L2.6 9.8l6.5-.9L12 3z"/></svg>`,
  download: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12"/><path d="M7 11l5 5 5-5"/><path d="M5 21h14"/></svg>`,
  check: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>`,
  terminal: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 17l6-5-6-5"/><path d="M12 19h8"/></svg>`,
  raycast: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v6"/><path d="M12 15v6"/><path d="M3 12h6"/><path d="M15 12h6"/><path d="M6.3 6.3l4.2 4.2"/><path d="M13.5 13.5l4.2 4.2"/><path d="M17.7 6.3l-4.2 4.2"/><path d="M10.5 13.5l-4.2 4.2"/></svg>`,
  external: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6"/><path d="M10 14L20 4"/><path d="M20 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1h5"/></svg>`,
  grid: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h7v7H4z"/><path d="M13 4h7v7h-7z"/><path d="M4 13h7v7H4z"/><path d="M13 13h7v7h-7z"/></svg>`,
  spark: `<svg viewBox="0 0 24 24" data-fill="1" aria-hidden="true"><path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.6-6.2-4.5-6.2 4.5 2.4-7.6L2 9.6h7.6z"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-4.4-9.5-8.2C.6 9.7 2.2 6 5.6 6c2 0 3.3 1.2 4.1 2.2C10.5 7.2 11.8 6 13.8 6c3.4 0 5 3.7 3.1 6.8C19 16.6 12 21 12 21z"/></svg>`,
  refresh: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a9 9 0 10-2.6 6.3"/><path d="M21 4v6h-6"/></svg>`,
  bell: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9a6 6 0 0112 0c0 7 3 7 3 7H3s3 0 3-7"/><path d="M10 19a2 2 0 004 0"/></svg>`,
  bellRing: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9a6 6 0 0112 0c0 7 3 7 3 7H3s3 0 3-7"/><path d="M10 19a2 2 0 004 0"/><path d="M2 9c.5-2 1.5-3.5 3-4.5"/><path d="M22 9c-.5-2-1.5-3.5-3-4.5"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v12H4z"/><path d="M4 7l8 6 8-6"/></svg>`,
};

function iconMarkup(name) {
  return MICRO_ICONS[name] || MICRO_ICONS.arrow;
}

/**
 * Build a micro-transition button/link.
 * @param {object} opts
 */
function createMicroButton(opts) {
  const {
    href,
    label,
    micro = "slide-arrow",
    icon = "arrow",
    icon2,
    variant = "ghost",
    size = "",
    magnetic = true,
    targetBlank = false,
    className = "",
    doneLabel,
  } = opts;

  const classes = [
    "micro-btn",
    variant === "primary" ? "is-primary" : "",
    variant === "ghost" ? "is-ghost" : "",
    variant === "ink" ? "is-ink" : "",
    size === "sm" ? "is-sm" : "",
    size === "xl" ? "is-xl" : "",
    magnetic ? "is-magnetic" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const isMailto = typeof href === "string" && href.startsWith("mailto:");
  const openBlank = targetBlank && !isMailto;
  const second = icon2 || (micro === "slide-arrow" ? "arrow" : icon);
  const needsSecond = ["slide-arrow", "sparkle", "morph", "color-morph", "ring"].includes(micro);
  const sparkleBits =
    micro === "sparkle"
      ? `<span class="micro-spark is-1">${iconMarkup("spark")}</span><span class="micro-spark is-2">${iconMarkup("spark")}</span>`
      : "";
  const badge = micro === "ring" ? `<span class="micro-badge" aria-hidden="true"></span>` : "";

  const iconBlock = needsSecond
    ? `<span class="micro-btn__icon">
         <span class="micro-icon-slot is-a">${iconMarkup(icon)}</span>
         <span class="micro-icon-slot is-b">${iconMarkup(second)}</span>
         ${sparkleBits}${badge}
       </span>`
    : `<span class="micro-btn__icon">${iconMarkup(icon)}</span>`;

  const attrs = [
    `class="${classes}"`,
    `data-micro="${micro}"`,
    doneLabel ? `data-done-label="${doneLabel}"` : "",
    href ? `href="${href}"` : "",
    openBlank ? `target="_blank" rel="noopener noreferrer"` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const tag = href ? "a" : "button type=\"button\"";
  const close = href ? "a" : "button";

  return `<${tag} ${attrs}><span class="micro-btn__inner">${iconBlock}<span class="micro-btn__label">${label}</span></span></${close}>`;
}

function enhanceMagneticButtons(root = document) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  root.querySelectorAll(".micro-btn.is-magnetic").forEach((btn) => {
    if (btn.dataset.magneticBound) return;
    btn.dataset.magneticBound = "1";

    btn.addEventListener("pointermove", (event) => {
      const rect = btn.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
    });

    btn.addEventListener("pointerleave", () => {
      btn.style.transform = "";
    });
  });
}

function bindMorphDone(root = document) {
  root.querySelectorAll('.micro-btn[data-micro="morph"][data-done-label]').forEach((btn) => {
    if (btn.dataset.morphBound) return;
    btn.dataset.morphBound = "1";
    const label = btn.querySelector(".micro-btn__label");
    const original = label ? label.textContent : "";

    btn.addEventListener("mouseenter", () => {
      btn.classList.add("is-done");
      if (label) label.textContent = btn.dataset.doneLabel || original;
    });

    btn.addEventListener("mouseleave", () => {
      window.setTimeout(() => {
        btn.classList.remove("is-done");
        if (label) label.textContent = original;
      }, 420);
    });
  });
}

function openMailto(href) {
  window.location.assign(href);
}

function initMailtoLinks(root = document) {
  root.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    link.removeAttribute("target");
    link.removeAttribute("rel");
    if (link.dataset.mailtoBound) return;
    link.dataset.mailtoBound = "1";

    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href?.startsWith("mailto:")) return;
      event.preventDefault();
      openMailto(href);
    });
  });
}

function initMicroTransitions(root = document) {
  enhanceMagneticButtons(root);
  bindMorphDone(root);
  initMailtoLinks(root);
}

window.createMicroButton = createMicroButton;
window.initMicroTransitions = initMicroTransitions;
window.initMailtoLinks = initMailtoLinks;
window.openMailto = openMailto;
window.MICRO_ICONS = MICRO_ICONS;
