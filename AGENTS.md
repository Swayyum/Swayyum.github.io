## Learned User Preferences

- Prefer the Swiss/industrial brutalist look for this site; explicitly rejected a softer Apple-like redesign and asked to restore the prior industrial style.
- Dislike placeholder, demo chrome, and AI-slop intros (e.g. “ACTIVE PAYLOAD”, “CANDIDATE PROFILE”, generic career/dossier lead blurbs); want clear, site-native product language.
- Use the personal name “Swayam Mehta” on the site (not only the Swayyum handle).
- Prefer a personal portrait in the hero rather than a product/Fluxon screenshot as the main image.
- Keep the rare-ui folder/dossier wired so it opens the live resume PDF.
- Site should showcase Fluxon, Typatro, Lumen, Raycast plugins, and stay easy to extend for future apps; prefer a clear app-catalog presentation (macapp.supply-like).

## Learned Workspace Facts

- This repo is the Swayyum / Swayam Mehta product-studio landing page (vanilla HTML/CSS/JS + GSAP).
- Product catalog is driven by `products.js` (`kind: "app"` or `"raycast"`); shipped items include Fluxon, Typatro, Lumen, IP Finder, and Bhagavad Gita Quotes.
- Lumen (display name; catalog id `lumen`) links should use the public repo/releases (`Swayyum/oura-menu-bar`), which hosts the DMG — not a private repo.
- Career sections (skills, experience, education, GitHub contributions) are driven by `career-data.js`; experience includes McKim & Creed (AI Specialist I, Apr 2026–Present) and SAM Analytic Solutions / SSAM (Junior AI & Systems Engineer, May 2024–Apr 2026) with light/dark logo pairs. Resume PDF at `assets/Swayam_Mehta_Resume.pdf` is the content source of truth.
- Hero and page title/meta position Swayam as an AI & Systems Engineer (aligned with the resume), not generic founder/product-studio framing.
- Theme switching uses `html[data-theme="light"|"dark"]` via `theme.js` (storage key `swayam-theme`); the header toggle is LiquidMetal (`theme-toggle-liquid.js`) with crisp sun/moon destination glyphs over the metal plate.
- Contact email on the site is `swayamehta1@gmail.com` (`mailto:` links / `CONTACT_EMAIL` in `script.js`).
- GitHub user/org is `Swayyum`; Raycast store links use `swayam_mehta`.
- Resume PDF lives at `assets/Swayam_Mehta_Resume.pdf` and is opened via the dossier folder UI (`rare-folder.js`).
- Amicro micro-transitions and rare-ui pieces (folder, scroll progress) were ported into this vanilla site rather than kept as separate app deps.
