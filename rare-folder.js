// Rare UI — Folder component (vanilla + GSAP)
// Adapted from https://github.com/swamimalode07/rare-ui/blob/main/components/ui/folder-component.tsx

const RESUME_URL = "assets/Swayam_Mehta_Resume.pdf";

const FOLDER_FLAP_PATH =
  "M0 25C0 11.1929 11.1929 0 25 0H136.084C143.044 0 149.689 2.90139 154.42 8.00608L178.08 33.5343C182.811 38.639 189.456 41.5404 196.416 41.5404H296C309.807 41.5404 321 52.7333 321 66.5404V216C321 229.807 309.807 241 296 241H25C11.1929 241 0 229.807 0 216V25Z";

const CARD_POSES = {
  rest: [
    { x: 40, y: -8, rotate: 10 },
    { x: 3, y: -18, rotate: 2 },
    { x: -40, y: -22, rotate: -5 },
  ],
  hover: [
    { x: 40, y: -48, rotate: 14 },
    { x: 3, y: -54, rotate: -1 },
    { x: -40, y: -62, rotate: -9 },
  ],
  open: [
    { x: 70, y: -200, rotate: 18 },
    { x: 0, y: -220, rotate: -3 },
    { x: -65, y: -210, rotate: -14 },
  ],
};

function cardLinesMarkup(isResume) {
  const rows = Array.from({ length: 8 }, (_, i) => {
    if (i === 0) return `<span></span>`;
    return `<div style="display:flex;gap:6px"><span class="is-half"></span><span class="is-half"></span></div>`;
  }).join("");
  return `<div class="rare-folder__card-label">RÉSUMÉ</div>
    <div class="rare-folder__card-lines">${rows}</div>
    <div class="rare-folder__card-meta">${isResume ? "MEHTA · PDF" : "MEHTA · COPY"}</div>`;
}

function mountRareFolder(root) {
  if (!root) return;

  root.innerHTML = `
    <div class="rare-folder" data-state="rest">
      <div class="rare-folder__stage" role="button" tabindex="0" aria-label="Open dossier folder. Resume available.">
        <div class="rare-folder__back" aria-hidden="true"></div>
        <div class="rare-folder__cards">
          <div class="rare-folder__card is-resume" data-slot="1" data-doc="resume" title="Open resume PDF">
            <div class="rare-folder__card-face">${cardLinesMarkup(true)}</div>
          </div>
          <div class="rare-folder__card" data-slot="2" data-doc="archive">
            <div class="rare-folder__card-face">${cardLinesMarkup(false)}</div>
          </div>
          <div class="rare-folder__card" data-slot="3" data-doc="archive">
            <div class="rare-folder__card-face">${cardLinesMarkup(false)}</div>
          </div>
        </div>
        <div class="rare-folder__flap" aria-hidden="true">
          <div class="rare-folder__flap-blur"></div>
          <svg viewBox="0 0 321 241" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path class="rare-folder__flap-fill" d="${FOLDER_FLAP_PATH}"/>
            <path class="rare-folder__flap-stroke" d="M25 0.5H136.084C142.905 0.5 149.417 3.3431 154.054 8.3457L177.713 33.874C182.539 39.0808 189.317 42.04 196.416 42.04H296C309.531 42.04 320.5 53.0092 320.5 66.54V216C320.5 229.531 309.531 240.5 296 240.5H25C11.469 240.5 0.5 229.531 0.5 216V25C0.5 11.469 11.469 0.5 25 0.5Z"/>
          </svg>
        </div>
      </div>
    </div>
  `;

  const folder = root.querySelector(".rare-folder");
  const stage = root.querySelector(".rare-folder__stage");
  const flap = root.querySelector(".rare-folder__flap");
  const cards = [...root.querySelectorAll(".rare-folder__card")];
  let isOpen = false;
  let isHovered = false;

  function applyPose(poseName) {
    const poses = CARD_POSES[poseName];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const flapAngle = poseName === "open" ? -55 : poseName === "hover" ? -45 : -15;

    cards.forEach((card, index) => {
      const pose = poses[index];
      const delay =
        poseName === "open"
          ? [0.1, 0.05, 0][index]
          : poseName === "hover"
            ? [0.12, 0.06, 0][index]
            : 0;

      if (typeof gsap !== "undefined" && !reduce) {
        gsap.to(card, {
          x: pose.x,
          y: pose.y,
          rotation: pose.rotate,
          duration: 0.45,
          delay,
          ease: "power3.out",
          overwrite: "auto",
        });
      } else {
        card.style.transform = `translate3d(${pose.x}px, ${pose.y}px, 0) rotate(${pose.rotate}deg)`;
      }
    });

    if (typeof gsap !== "undefined" && !reduce) {
      gsap.to(flap, {
        rotateX: flapAngle,
        duration: 0.55,
        ease: "power3.out",
      });
    } else {
      flap.style.transform = `rotateX(${flapAngle}deg)`;
    }

    folder.dataset.state = poseName;
  }

  // Set initial GSAP transforms from CSS
  cards.forEach((card, index) => {
    const pose = CARD_POSES.rest[index];
    if (typeof gsap !== "undefined") {
      gsap.set(card, { x: pose.x, y: pose.y, rotation: pose.rotate });
    }
  });
  if (typeof gsap !== "undefined") {
    gsap.set(flap, { rotateX: -15, transformPerspective: 800 });
  }

  function openResume() {
    window.open(RESUME_URL, "_blank", "noopener,noreferrer");
  }

  stage.addEventListener("mouseenter", () => {
    isHovered = true;
    if (!isOpen) applyPose("hover");
  });

  stage.addEventListener("mouseleave", () => {
    isHovered = false;
    isOpen = false;
    applyPose("rest");
  });

  stage.addEventListener("click", (event) => {
    const resumeCard = event.target.closest('[data-doc="resume"]');
    if (resumeCard && (isOpen || isHovered)) {
      openResume();
      return;
    }

    isOpen = !isOpen;
    applyPose(isOpen ? "open" : isHovered ? "hover" : "rest");
  });

  stage.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      isOpen = !isOpen;
      applyPose(isOpen ? "open" : "rest");
    }
    if (event.key === "r" || event.key === "R") {
      openResume();
    }
  });

  const resumeBtn = document.getElementById("open-resume");
  if (resumeBtn) {
    resumeBtn.addEventListener("click", (event) => {
      event.preventDefault();
      openResume();
    });
  }
}

window.mountRareFolder = mountRareFolder;
window.RESUME_URL = RESUME_URL;
