/**
 * Animation regression tests
 *
 * Reproduces broken scroll-reveal / GSAP+CSS transform conflicts:
 * telem cells (and similar) must not remain stuck mid-tween
 * (e.g. opacity 1 with scale 0.97 + translateY 36).
 */

const { test, expect } = require("@playwright/test");

const BASE = process.env.SITE_URL || "http://127.0.0.1:8000";

function parseMatrix(transform) {
  if (!transform || transform === "none") {
    return { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 };
  }
  const m2 = transform.match(/matrix\(([^)]+)\)/);
  if (m2) {
    const [a, b, c, d, tx, ty] = m2[1].split(",").map(Number);
    return { a, b, c, d, tx, ty };
  }
  const m3 = transform.match(/matrix3d\(([^)]+)\)/);
  if (m3) {
    const v = m3[1].split(",").map(Number);
    return { a: v[0], b: v[1], c: v[4], d: v[5], tx: v[12], ty: v[13] };
  }
  return { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 };
}

test.describe("scroll reveal animations", () => {
  test("telem cells settle to identity transform after reveal", async ({
    page,
  }) => {
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);

    await page.locator("#telemetry-grid").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.evaluate(() => {
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    });
    await page.waitForTimeout(800);

    const states = await page.$$eval(".telem-cell", (els) =>
      els.map((el) => {
        const s = getComputedStyle(el);
        return {
          opacity: parseFloat(s.opacity),
          transform: s.transform,
        };
      })
    );

    expect(states.length).toBeGreaterThan(0);

    for (const state of states) {
      expect(state.opacity).toBeGreaterThan(0.95);
      const m = parseMatrix(state.transform);
      // Must not remain stuck at gsap.from() start values (scale 0.97, y 36)
      expect(Math.abs(m.a - 1)).toBeLessThan(0.02);
      expect(Math.abs(m.d - 1)).toBeLessThan(0.02);
      expect(Math.abs(m.ty)).toBeLessThan(2);
      expect(Math.abs(m.tx)).toBeLessThan(2);
    }
  });

  test("hero portrait is fully visible on load without scroll", async ({
    page,
  }) => {
    await page.goto(BASE, { waitUntil: "networkidle" });

    await page.waitForFunction(() => {
      const el = document.querySelector(".hero-frame--portrait");
      if (!el) return false;
      return parseFloat(getComputedStyle(el).opacity) > 0.95;
    });

    const portrait = await page.$eval(".hero-frame--portrait", (el) => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const m = (() => {
        const t = s.transform;
        if (!t || t === "none") return { a: 1, d: 1 };
        const m2 = t.match(/matrix\(([^)]+)\)/);
        if (!m2) return { a: 1, d: 1 };
        const [a, , , d] = m2[1].split(",").map(Number);
        return { a, d };
      })();
      return {
        opacity: parseFloat(s.opacity),
        visible: r.width > 0 && r.height > 0,
        scaleA: m.a,
        scaleD: m.d,
      };
    });

    expect(portrait.visible).toBe(true);
    expect(portrait.opacity).toBeGreaterThan(0.95);
    expect(Math.abs(portrait.scaleA - 1)).toBeLessThan(0.05);
    expect(Math.abs(portrait.scaleD - 1)).toBeLessThan(0.05);
  });

  test("hero CTAs are visible after entrance orchestration", async ({
    page,
  }) => {
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);

    const btns = await page.$$eval(".hero-actions .micro-btn", (els) =>
      els.map((el) => {
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
          opacity: parseFloat(s.opacity),
          visible: r.width > 0 && r.height > 0 && r.bottom > 0,
        };
      })
    );

    expect(btns.length).toBeGreaterThan(0);
    for (const btn of btns) {
      expect(btn.opacity).toBeGreaterThan(0.95);
      expect(btn.visible).toBe(true);
    }
  });

  test("folder cards move on hover (spring fan-out)", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.locator("#dossier").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.evaluate(() => {
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    });
    await page.waitForTimeout(500);

    // Wait until folder reveal has settled (no ongoing scale tween)
    await page.waitForFunction(() => {
      const root = document.getElementById("rare-folder-root");
      if (!root) return false;
      const t = getComputedStyle(root).transform;
      return parseFloat(getComputedStyle(root).opacity) > 0.95 && (t === "none" || t.includes("1,"));
    });

    const before = await page.$eval(
      '.rare-folder__card[data-slot="1"]',
      (el) => getComputedStyle(el).transform
    );

    await page.locator(".rare-folder__stage").hover({ force: true });
    await page.waitForTimeout(500);

    const after = await page.$eval(
      '.rare-folder__card[data-slot="1"]',
      (el) => getComputedStyle(el).transform
    );

    expect(after).not.toBe(before);

    const folderOpacity = await page.$eval("#rare-folder-root", (el) =>
      parseFloat(getComputedStyle(el).opacity)
    );
    expect(folderOpacity).toBeGreaterThan(0.95);
  });

  test("stack stage images fully visible when card enters viewport", async ({
    page,
  }) => {
    await page.goto(BASE, { waitUntil: "networkidle" });

    await page.locator("#stage-fluxon").scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    await page.evaluate(() => {
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    });
    await page.waitForTimeout(400);

    const stages = await page.$$eval(".stack-card[id] .stack-card-media", (els) =>
      els.map((el) => {
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        const m = (() => {
          const t = s.transform;
          if (!t || t === "none") return { a: 1, d: 1 };
          const m2 = t.match(/matrix\(([^)]+)\)/);
          if (!m2) return { a: 1, d: 1 };
          const [a, , , d] = m2[1].split(",").map(Number);
          return { a, d };
        })();
        const inView = r.bottom > 0 && r.top < window.innerHeight;
        return {
          id: el.closest(".stack-card")?.id,
          inView,
          opacity: parseFloat(s.opacity),
          scaleA: m.a,
          scaleD: m.d,
        };
      })
    );

    expect(stages.length).toBeGreaterThanOrEqual(3);

    for (const stage of stages.filter((s) => s.inView)) {
      expect(stage.opacity).toBeGreaterThan(0.95);
      expect(Math.abs(stage.scaleA - 1)).toBeLessThan(0.05);
      expect(Math.abs(stage.scaleD - 1)).toBeLessThan(0.05);
    }

    const fluxon = stages.find((s) => s.id === "stage-fluxon");
    expect(fluxon).toBeTruthy();
    expect(fluxon.opacity).toBeGreaterThan(0.95);
  });

  test("no in-viewport reveal targets stuck at opacity 0", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "networkidle" });

    const selectors = [
      "#telemetry-grid",
      "#stack",
      "#dossier",
      "#contact",
      ".cta-band",
    ];

    for (const sel of selectors) {
      await page.locator(sel).scrollIntoViewIfNeeded();
      await page.waitForTimeout(700);
    }

    await page.evaluate(() => {
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    });
    await page.waitForTimeout(400);

    const stuck = await page.evaluate(() => {
      const targets = document.querySelectorAll(
        ".telem-cell, #rare-folder-root, .cta-actions .micro-btn, .hero-links a, .hero-actions .micro-btn, .hero-frame--portrait, .stack-card[id], .stack-card-media"
      );
      return [...targets]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          const inRoughView = r.bottom > 0 && r.top < window.innerHeight * 2;
          return inRoughView && parseFloat(getComputedStyle(el).opacity) < 0.1;
        })
        .map((el) => el.className || el.id);
    });

    expect(stuck).toEqual([]);
  });
});

test.describe("mailto contact links", () => {
  test("hero and contact email links use swayamehta1@gmail.com without target blank", async ({
    page,
  }) => {
    await page.goto(BASE, { waitUntil: "networkidle" });

    const links = await page.evaluate(() =>
      [...document.querySelectorAll('a[href^="mailto:"]')].map((el) => ({
        href: el.getAttribute("href"),
        target: el.getAttribute("target"),
        bound: el.dataset.mailtoBound === "1",
        isMicroBtn: el.classList.contains("micro-btn"),
      }))
    );

    expect(links.length).toBeGreaterThanOrEqual(3);
    for (const link of links) {
      expect(link.href).toBe("mailto:swayamehta1@gmail.com");
      expect(link.target).toBeNull();
      if (!link.isMicroBtn) {
        expect(link.bound).toBe(false);
      }
    }

    const heroMailto = links.find((link) => !link.isMicroBtn);
    expect(heroMailto).toBeTruthy();
    expect(heroMailto.bound).toBe(false);
  });

  test("openMailto uses a programmatic anchor click", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "networkidle" });

    const clicked = await page.evaluate(() => {
      let mailtoClicked = false;
      const originalAppend = document.body.appendChild.bind(document.body);
      document.body.appendChild = (node) => {
        if (node instanceof HTMLAnchorElement && node.href.startsWith("mailto:")) {
          node.click = () => {
            mailtoClicked = true;
          };
        }
        return originalAppend(node);
      };

      window.openMailto("mailto:swayamehta1@gmail.com");
      return mailtoClicked;
    });

    expect(clicked).toBe(true);
  });

  test("contact email fallback copies swayamehta1@gmail.com", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.locator("#contact").scrollIntoViewIfNeeded();

    const fallback = page.locator(".cta-email-fallback");
    await expect(fallback).toBeVisible();
    await expect(fallback.locator(".cta-email-address")).toHaveText("swayamehta1@gmail.com");
    await expect(fallback.locator(".cta-email-address")).toHaveAttribute(
      "href",
      "mailto:swayamehta1@gmail.com"
    );

    await fallback.locator(".cta-email-copy").click();
    await expect(fallback.locator(".cta-email-copy")).toHaveText("Copied");

    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toBe("swayamehta1@gmail.com");
  });
});
