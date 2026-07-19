// Theme: light / dark with system preference + localStorage persistence
(() => {
  const STORAGE_KEY = "swayam-theme";
  const metaTheme = document.querySelector('meta[name="theme-color"]');

  function systemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function resolveTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return systemTheme();
  }

  function applyTheme(theme) {
    const next = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.style.colorScheme = next;
    if (metaTheme) {
      const color = getComputedStyle(document.documentElement).getPropertyValue("--theme-color").trim();
      metaTheme.setAttribute("content", color || (next === "dark" ? "#09090b" : "#f4f4f5"));
    }
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      const isDark = next === "dark";
      btn.setAttribute("aria-pressed", String(isDark));
      btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      btn.title = isDark ? "Light mode" : "Dark mode";
    });
  }

  function setTheme(theme, persist = true) {
    applyTheme(theme);
    if (persist) localStorage.setItem(STORAGE_KEY, theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || resolveTheme();
    setTheme(current === "dark" ? "light" : "dark", true);
  }

  // Apply immediately (also called from head inline script; safe to re-run)
  applyTheme(resolveTheme());

  window.addEventListener("DOMContentLoaded", () => {
    applyTheme(resolveTheme());
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      btn.addEventListener("click", toggleTheme);
    });
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (localStorage.getItem(STORAGE_KEY) === "light" || localStorage.getItem(STORAGE_KEY) === "dark") return;
    applyTheme(systemTheme());
  });

  window.__setTheme = setTheme;
  window.__toggleTheme = toggleTheme;
})();
