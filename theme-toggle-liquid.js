/**
 * Hybrid LiquidMetal theme toggle.
 * Animated diamond metal plate (Paper shaders) + crisp SVG sun/moon glyph on top.
 *
 * State mapping (matches aria-label / title): icon = what you switch *to*
 *   light mode → moon  → "Switch to dark mode"
 *   dark mode  → sun   → "Switch to light mode"
 *
 * Fallback stroke SVGs in index.html remain if WebGL fails.
 */

import {
  ShaderMount,
  liquidMetalFragmentShader,
  LiquidMetalShapes,
  ShaderFitOptions,
  getShaderColorFromString,
} from "https://esm.sh/@paper-design/shaders@0.0.77";

/**
 * Distinct light ↔ dark metal plates.
 * Light: user's original chrome diamond (#AAAAAC / #ffffff).
 * Dark: deep zinc-cobalt back + warm luminous tint.
 */
const THEME_PALETTES = {
  light: {
    colorBack: "#AAAAAC",
    colorTint: "#ffffff",
    shiftRed: 0.22,
    shiftBlue: 0.22,
    contour: 0.32,
  },
  dark: {
    // Deep zinc-cobalt plate — clearly darker than light chrome
    colorBack: "#12161f",
    colorTint: "#d4c4a0",
    shiftRed: 0.28,
    shiftBlue: 0.32,
    contour: 0.38,
  },
};

/** User's original diamond geometry / motion (scale bumped so metal peeks around glyph). */
const DIAMOND_BASE = {
  u_shape: LiquidMetalShapes.diamond,
  u_isImage: false,
  u_image: undefined,
  u_repetition: 2,
  u_softness: 0.06,
  u_distortion: 0.07,
  u_angle: 70,
  u_fit: ShaderFitOptions.contain,
  u_scale: 0.88,
  u_rotation: 0,
  u_offsetX: 0,
  u_offsetY: 0,
  u_originX: 0.5,
  u_originY: 0.5,
  u_worldWidth: 0,
  u_worldHeight: 0,
};

const SPEED = 1;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function currentTheme() {
  const t = document.documentElement.getAttribute("data-theme");
  return t === "dark" ? "dark" : "light";
}

function paletteFor(theme) {
  return THEME_PALETTES[theme] || THEME_PALETTES.light;
}

function themeUniforms(theme) {
  const { colorBack, colorTint, shiftRed, shiftBlue, contour } = paletteFor(theme);
  return {
    u_colorBack: getShaderColorFromString(colorBack),
    u_colorTint: getShaderColorFromString(colorTint),
    u_shiftRed: shiftRed,
    u_shiftBlue: shiftBlue,
    u_contour: contour,
  };
}

function buildUniforms(theme) {
  return {
    ...DIAMOND_BASE,
    ...themeUniforms(theme),
  };
}

function desiredSpeed() {
  return prefersReducedMotion() ? 0 : SPEED;
}

function initToggle(button) {
  const host = button.querySelector("[data-theme-shader]");
  if (!host) return null;

  const theme = currentTheme();
  let mount;

  try {
    mount = new ShaderMount(
      host,
      liquidMetalFragmentShader,
      buildUniforms(theme),
      undefined,
      desiredSpeed(),
      0,
      2
    );
  } catch (err) {
    console.warn("Theme toggle LiquidMetal failed:", err);
    host.replaceChildren();
    return null;
  }

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onMotionChange = () => {
    mount.setSpeed(desiredSpeed());
  };
  motionQuery.addEventListener("change", onMotionChange);

  const applyTheme = () => {
    mount.setUniforms(themeUniforms(currentTheme()));
  };

  const themeObserver = new MutationObserver(applyTheme);
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  button.classList.add("has-theme-shader");

  return () => {
    motionQuery.removeEventListener("change", onMotionChange);
    themeObserver.disconnect();
    try {
      mount.dispose();
    } catch (_) {
      /* ignore */
    }
    host.replaceChildren();
    button.classList.remove("has-theme-shader");
  };
}

function boot() {
  const button = document.querySelector("[data-theme-toggle]");
  if (!button) return;

  try {
    initToggle(button);
  } catch (err) {
    console.warn("Theme toggle LiquidMetal unavailable:", err);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
