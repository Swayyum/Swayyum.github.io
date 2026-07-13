## Learned User Preferences

- Prefer the Swiss/industrial brutalist look for this site; explicitly rejected a softer Apple-like redesign and asked to restore the prior industrial style.
- Dislike placeholder or demo chrome copy (e.g. “ACTIVE PAYLOAD”, “RARE UI / FOLDER”, generic hover/fan instructions); want clear, site-native product language.
- Use the personal name “Swayam Mehta” on the site (not only the Swayyum handle).
- Keep the rare-ui folder/dossier wired so it opens the live resume PDF.
- Site should showcase Fluxon, Typatro, Raycast plugins, and stay easy to extend for future apps.

## Learned Workspace Facts

- This repo is the Swayyum / Swayam Mehta product-studio landing page (vanilla HTML/CSS/JS + GSAP).
- Product catalog is driven by `products.js` (`kind: "app"` or `"raycast"`); shipped items include Fluxon, Typatro, IP Finder, and Bhagavad Gita Quotes.
- GitHub user/org is `Swayyum`; Raycast store links use `swayam_mehta`.
- Resume PDF lives at `assets/Swayam_Mehta_Resume.pdf` and is opened via the dossier folder UI (`rare-folder.js`).
- Amicro micro-transitions and rare-ui pieces (folder, scroll progress) were ported into this vanilla site rather than kept as separate app deps.
