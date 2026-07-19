## Learned User Preferences

- Prefer the Swiss/industrial brutalist look for this site; explicitly rejected a softer Apple-like redesign and asked to restore the prior industrial style.
- Dislike placeholder or demo chrome copy (e.g. “ACTIVE PAYLOAD”, “RARE UI / FOLDER”, generic hover/fan instructions); want clear, site-native product language.
- Use the personal name “Swayam Mehta” on the site (not only the Swayyum handle).
- Prefer a personal portrait in the hero rather than a product/Fluxon screenshot as the main image.
- Keep the rare-ui folder/dossier wired so it opens the live resume PDF.
- Site should showcase Fluxon, Typatro, Oura Menu Bar, Raycast plugins, and stay easy to extend for future apps; prefer a clear app-catalog presentation (macapp.supply-like).

## Learned Workspace Facts

- This repo is the Swayyum / Swayam Mehta product-studio landing page (vanilla HTML/CSS/JS + GSAP).
- Product catalog is driven by `products.js` (`kind: "app"` or `"raycast"`); shipped items include Fluxon, Typatro, Oura Menu Bar, IP Finder, and Bhagavad Gita Quotes.
- Oura Menu Bar links should use the public repo/releases (`Swayyum/oura-menu-bar`), which hosts the DMG — not a private repo.
- Career sections (skills, experience, education, GitHub contributions) are driven by `career-data.js`; experience includes McKim & Creed and SAM Analytic Solutions with light/dark logo pairs.
- Theme switching uses `html[data-theme="light"|"dark"]` via `theme.js` (storage key `swayam-theme`), with a 3D theme toggle in `theme-toggle-3d.js`.
- Contact email on the site is `swayamehta1@gmail.com` (`mailto:` links / `CONTACT_EMAIL` in `script.js`).
- GitHub user/org is `Swayyum`; Raycast store links use `swayam_mehta`.
- Resume PDF lives at `assets/Swayam_Mehta_Resume.pdf` and is opened via the dossier folder UI (`rare-folder.js`).
- Amicro micro-transitions and rare-ui pieces (folder, scroll progress) were ported into this vanilla site rather than kept as separate app deps.
