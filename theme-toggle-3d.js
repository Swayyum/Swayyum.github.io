/**
 * Animated Penrose stairs for the theme toggle.
 * Classic impossible-staircase SVG topology (closed loop by construction) —
 * industrial cobalt/zinc stamp at ~40px. Sun/moon SVG remains if mount fails.
 */

const VIEW = 40;

/**
 * Topology from Wikimedia Commons “Impossible staircase.svg”
 * (Sakurambo / free reuse), retuned for a 40×40 industrial stamp:
 * tight crop, thick strokes, continuous zinc tread ribbon.
 */
const PENROSE_MARKUP = `
  <defs>
    <path id="penrose-tread" d="M0 0 L37 18 L0 36 L-37 18 Z"/>
  </defs>
  <g class="penrose-stairs" transform="translate(-1.2 -0.4) scale(0.112)">
    <path class="penrose-wall penrose-wall--a" d="M279 36 L242 54 V46 L205 64 V56 L168 74 V66 L131 84 V76 L94 94 V171 H279 Z"/>
    <path class="penrose-wall penrose-wall--b" d="M316 61 V68 L279 86 V79 Z"/>
    <path class="penrose-wall penrose-wall--c" d="M316 104 L279 86 V79 L242 61 V160 H316 Z"/>
    <path class="penrose-wall penrose-wall--d" d="M353 86 L316 104 V111 L279 129 V136 L242 154 V267 L353 213 Z"/>
    <path class="penrose-wall penrose-wall--e" d="M20 159 V86 L57 104 V96 L94 114 V106 L131 124 V116 L168 134 V126 L205 144 V136 L242 154 V267 Z"/>

    <g class="penrose-step" data-index="0"><use href="#penrose-tread" x="242" y="18"/></g>
    <g class="penrose-step" data-index="1"><use href="#penrose-tread" x="205" y="28"/></g>
    <g class="penrose-step" data-index="2"><use href="#penrose-tread" x="168" y="38"/></g>
    <g class="penrose-step" data-index="3"><use href="#penrose-tread" x="131" y="48"/></g>
    <g class="penrose-step" data-index="4"><use href="#penrose-tread" x="94" y="58"/></g>
    <g class="penrose-step" data-index="5"><use href="#penrose-tread" x="57" y="68"/></g>
    <g class="penrose-step" data-index="6"><use href="#penrose-tread" x="279" y="43"/></g>
    <g class="penrose-step" data-index="7"><use href="#penrose-tread" x="94" y="78"/></g>
    <g class="penrose-step" data-index="8"><use href="#penrose-tread" x="131" y="88"/></g>
    <g class="penrose-step" data-index="9"><use href="#penrose-tread" x="168" y="98"/></g>
    <g class="penrose-step" data-index="10"><use href="#penrose-tread" x="205" y="108"/></g>
    <g class="penrose-step" data-index="11"><use href="#penrose-tread" x="242" y="118"/></g>
    <g class="penrose-step" data-index="12"><use href="#penrose-tread" x="279" y="93"/></g>
    <g class="penrose-step" data-index="13"><use href="#penrose-tread" x="316" y="68"/></g>
  </g>
`.trim();

function createSvg() {
  const parsed = new DOMParser().parseFromString(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW} ${VIEW}" width="${VIEW}" height="${VIEW}" aria-hidden="true" focusable="false" class="theme-toggle__penrose" shape-rendering="geometricPrecision">${PENROSE_MARKUP}</svg>`,
    "image/svg+xml"
  );
  const svg = parsed.documentElement;
  if (svg.querySelector("parsererror")) {
    throw new Error("Penrose SVG parse failed");
  }
  const live = document.importNode(svg, true);
  const stepEls = [...live.querySelectorAll(".penrose-step")];
  return { svg: live, stepEls, total: stepEls.length };
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function initToggle(button) {
  const host = button.querySelector("[data-theme-3d]");
  if (!host) return null;

  let svg;
  let stepEls;
  let total;
  try {
    ({ svg, stepEls, total } = createSvg());
    if (!total) throw new Error("No penrose steps");
    host.replaceChildren(svg);
  } catch (err) {
    console.warn("Theme toggle Penrose SVG failed:", err);
    return null;
  }

  const state = {
    reduced: prefersReducedMotion(),
    visible: true,
    running: false,
    raf: 0,
  };

  function applyPulse(phase) {
    for (let i = 0; i < stepEls.length; i++) {
      const p = ((i / total - phase) % 1 + 1) % 1;
      const wave = Math.max(0, 1 - Math.min(p, 1 - p) * 4.5);
      stepEls[i].style.setProperty("--penrose-lit", wave.toFixed(3));
    }
  }

  function tick(now) {
    state.raf = 0;
    if (!state.running) return;

    if (!state.reduced && state.visible && !document.hidden) {
      const t = (now || performance.now()) * 0.001;
      applyPulse((t * 0.24) % 1);
      svg.style.setProperty("--penrose-yaw", `${(Math.sin(t * 0.4) * 2.2).toFixed(2)}deg`);
    }

    if (!state.reduced && state.visible && !document.hidden) {
      state.raf = requestAnimationFrame(tick);
    } else {
      state.running = false;
    }
  }

  function startLoop() {
    if (state.running || state.reduced) return;
    state.running = true;
    state.raf = requestAnimationFrame(tick);
  }

  function stopLoop() {
    state.running = false;
    if (state.raf) {
      cancelAnimationFrame(state.raf);
      state.raf = 0;
    }
  }

  function syncMotion() {
    state.reduced = prefersReducedMotion();
    if (state.reduced) {
      applyPulse(0);
      svg.style.setProperty("--penrose-yaw", "0deg");
      stopLoop();
    } else {
      startLoop();
    }
  }

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  motionQuery.addEventListener("change", syncMotion);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopLoop();
    else if (!state.reduced) startLoop();
  });

  let io;
  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver(
      ([entry]) => {
        state.visible = entry.isIntersecting;
        if (state.visible && !state.reduced) startLoop();
        else if (!state.visible) stopLoop();
      },
      { threshold: 0.01 }
    );
    io.observe(button);
  }

  button.classList.add("has-theme-3d");
  syncMotion();

  return () => {
    stopLoop();
    motionQuery.removeEventListener("change", syncMotion);
    io?.disconnect();
    host.replaceChildren();
    button.classList.remove("has-theme-3d");
  };
}

function boot() {
  const button = document.querySelector("[data-theme-toggle]");
  if (!button) return;
  try {
    initToggle(button);
  } catch (err) {
    console.warn("Theme toggle Penrose unavailable:", err);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
