// CRT Screen Zoom entrance using Cyze ivory-classic rendered frames.
import { mountComputer } from "./crt-computer-scene.js";

const STORAGE_KEY = "swayam-crt-entered";

function shouldEnter() {
  const params = new URLSearchParams(location.search);
  if (params.get("crt") === "0") return false;
  if (params.get("crt") === "1") return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (navigator.webdriver) return false;
  try {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return false;
  } catch {
    /* ignore */
  }
  const connection = navigator.connection;
  if (connection && (connection.saveData || /2g/i.test(connection.effectiveType || ""))) {
    return false;
  }
  return true;
}

function markEntered() {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
}

function preloadFirstFrame() {
  const dark =
    document.documentElement.getAttribute("data-theme") === "dark" ||
    document.documentElement.classList.contains("dark");
  const size = innerWidth < 640 ? "-mobile" : innerWidth < 1440 ? "" : "-wide";
  const site = `site-${dark ? "dark" : "light"}${size}.webp`;
  const base = "assets/crt/ivory-classic/";
  [
    ["frames/case-1-9.webp", "fetch"],
    ["frames/glass-1-9.webp", "fetch"],
    [site, "image"],
  ].forEach(([file, as]) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = as;
    link.href = base + file;
    if (as === "fetch") link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  });
}

async function boot() {
  const entrance = document.querySelector("[data-computer-entrance]");
  if (!entrance) return;

  if (!shouldEnter()) {
    document.documentElement.classList.remove("computer-entry", "crt-entry");
    entrance.setAttribute("aria-hidden", "true");
    return;
  }

  document.documentElement.classList.add("computer-entry");
  document.documentElement.classList.remove("crt-entry");
  entrance.setAttribute("aria-hidden", "false");
  entrance.tabIndex = -1;
  entrance.focus({ preventScroll: true });

  const main = document.querySelector("body > main");
  const footer = document.querySelector("body > .site-footer");
  if (main) main.inert = true;
  if (footer) footer.inert = true;

  const controller = new AbortController();
  const { signal } = controller;
  let scene;
  let finished = false;

  function cleanupChrome() {
    if (main) {
      main.inert = false;
      Object.assign(main.style, { transform: "", transformOrigin: "", clipPath: "" });
    }
    if (footer) footer.inert = false;
    document.documentElement.classList.remove(
      "computer-entry",
      "computer-handover",
      "computer-zooming",
      "crt-entry"
    );
    entrance.setAttribute("aria-hidden", "true");
    window.dispatchEvent(new Event("resize"));
    document.dispatchEvent(new Event("crt:entered"));
  }

  async function enter(instant = false) {
    if (finished) return;
    finished = true;
    markEntered();

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canAnimate = !instant && !reduce && scene && main;

    document.documentElement.classList.add("computer-zooming");

    try {
      if (canAnimate) {
        await scene.enter(main);
      }
    } catch (err) {
      console.error("CRT enter failed", err);
    }

    controller.abort();
    scene?.dispose?.();
    cleanupChrome();
    window.scrollTo({ top: 0, behavior: "instant" });
    main?.focus?.({ preventScroll: true });
  }

  entrance.querySelectorAll("[data-computer-enter]").forEach((btn) => {
    btn.addEventListener("click", () => void enter(false), { signal });
  });
  entrance.querySelector("[data-crt-skip]")?.addEventListener(
    "click",
    () => void enter(true),
    { signal }
  );
  entrance.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape") void enter(true);
    },
    { signal }
  );

  // Failsafe — never trap the visitor.
  const failsafe = window.setTimeout(() => {
    if (!finished) void enter(true);
  }, 20000);
  signal.addEventListener("abort", () => clearTimeout(failsafe), { once: true });

  try {
    scene = await mountComputer(entrance, signal);
    if (finished || signal.aborted) {
      scene?.dispose?.();
      return;
    }
    entrance.dataset.ready = "true";
  } catch (err) {
    console.error("CRT computer unavailable", err);
    void enter(true);
  }
}

preloadFirstFrame();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => void boot(), { once: true });
} else {
  void boot();
}
