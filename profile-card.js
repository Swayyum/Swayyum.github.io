// Copyright © 2025 Sam Analytic Solutions
// All rights reserved.

// ProfileCard Component - Vanilla JavaScript version
const DEFAULT_INNER_GRADIENT = 'linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)';

const ANIMATION_CONFIG = {
    INITIAL_DURATION: 1200,
    INITIAL_X_OFFSET: 70,
    INITIAL_Y_OFFSET: 60,
    DEVICE_BETA_OFFSET: 20,
    ENTER_TRANSITION_MS: 180
};

function clamp(v, min = 0, max = 100) {
    return Math.min(Math.max(v, min), max);
}

function round(v, precision = 3) {
    return parseFloat(v.toFixed(precision));
}

function adjust(v, fMin, fMax, tMin, tMax) {
    return round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));
}

class ProfileCard {
    constructor(options = {}) {
        this.options = {
            avatarUrl: options.avatarUrl || 'https://via.placeholder.com/200',
            iconUrl: options.iconUrl || '',
            grainUrl: options.grainUrl || '',
            innerGradient: options.innerGradient || DEFAULT_INNER_GRADIENT,
            behindGlowEnabled: options.behindGlowEnabled !== false,
            behindGlowColor: options.behindGlowColor || 'rgba(125, 190, 255, 0.67)',
            behindGlowSize: options.behindGlowSize || '50%',
            enableTilt: options.enableTilt !== false,
            enableMobileTilt: options.enableMobileTilt || false,
            mobileTiltSensitivity: options.mobileTiltSensitivity || 5,
            miniAvatarUrl: options.miniAvatarUrl || options.avatarUrl,
            name: options.name || 'Swayam Mehta',
            title: options.title || 'Software Engineer',
            handle: options.handle || 'Swayyum',
            status: options.status || 'Online',
            contactText: options.contactText || 'Contact Me',
            showUserInfo: options.showUserInfo !== false,
            onContactClick: options.onContactClick || (() => {}),
            className: options.className || ''
        };

        this.wrapRef = null;
        this.shellRef = null;
        this.enterTimerRef = null;
        this.leaveRafRef = null;
        this.tiltEngine = null;
        this.element = null;

        this.init();
    }

    init() {
        this.createTiltEngine();
        this.createElement();
        this.attachEventListeners();
    }

    createTiltEngine() {
        if (!this.options.enableTilt) return;

        let rafId = null;
        let running = false;
        let lastTs = 0;
        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;
        const DEFAULT_TAU = 0.14;
        const INITIAL_TAU = 0.6;
        let initialUntil = 0;

        const setVarsFromXY = (x, y) => {
            const shell = this.shellRef;
            const wrap = this.wrapRef;
            if (!shell || !wrap) return;

            const width = shell.clientWidth || 1;
            const height = shell.clientHeight || 1;
            const percentX = clamp((100 / width) * x);
            const percentY = clamp((100 / height) * y);
            const centerX = percentX - 50;
            const centerY = percentY - 50;

            const properties = {
                '--pointer-x': `${percentX}%`,
                '--pointer-y': `${percentY}%`,
                '--background-x': `${adjust(percentX, 0, 100, 35, 65)}%`,
                '--background-y': `${adjust(percentY, 0, 100, 35, 65)}%`,
                '--pointer-from-center': `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
                '--pointer-from-top': `${percentY / 100}`,
                '--pointer-from-left': `${percentX / 100}`,
                '--rotate-x': `${round(-(centerX / 5))}deg`,
                '--rotate-y': `${round(centerY / 4)}deg`
            };

            for (const [k, v] of Object.entries(properties)) {
                wrap.style.setProperty(k, v);
            }
        };

        const step = (ts) => {
            if (!running) return;
            if (lastTs === 0) lastTs = ts;
            const dt = (ts - lastTs) / 1000;
            lastTs = ts;
            const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
            const k = 1 - Math.exp(-dt / tau);
            currentX += (targetX - currentX) * k;
            currentY += (targetY - currentY) * k;
            setVarsFromXY(currentX, currentY);
            const stillFar = Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05;
            if (stillFar || document.hasFocus()) {
                rafId = requestAnimationFrame(step);
            } else {
                running = false;
                lastTs = 0;
                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
            }
        };

        const start = () => {
            if (running) return;
            running = true;
            lastTs = 0;
            rafId = requestAnimationFrame(step);
        };

        this.tiltEngine = {
            setImmediate: (x, y) => {
                currentX = x;
                currentY = y;
                setVarsFromXY(currentX, currentY);
            },
            setTarget: (x, y) => {
                targetX = x;
                targetY = y;
                start();
            },
            toCenter: () => {
                const shell = this.shellRef;
                if (!shell) return;
                targetX = shell.clientWidth / 2;
                targetY = shell.clientHeight / 2;
                start();
            },
            beginInitial: (durationMs) => {
                initialUntil = performance.now() + durationMs;
                start();
            },
            getCurrent: () => {
                return { x: currentX, y: currentY, tx: targetX, ty: targetY };
            },
            cancel: () => {
                if (rafId) cancelAnimationFrame(rafId);
                rafId = null;
                running = false;
                lastTs = 0;
            }
        };
    }

    getOffsets(evt, el) {
        const rect = el.getBoundingClientRect();
        return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
    }

    handlePointerMove = (event) => {
        const shell = this.shellRef;
        if (!shell || !this.tiltEngine) return;
        const { x, y } = this.getOffsets(event, shell);
        this.tiltEngine.setTarget(x, y);
    };

    handlePointerEnter = (event) => {
        const shell = this.shellRef;
        if (!shell || !this.tiltEngine) return;
        shell.classList.add('active');
        shell.classList.add('entering');
        if (this.enterTimerRef) window.clearTimeout(this.enterTimerRef);
        this.enterTimerRef = window.setTimeout(() => {
            shell.classList.remove('entering');
        }, ANIMATION_CONFIG.ENTER_TRANSITION_MS);
        const { x, y } = this.getOffsets(event, shell);
        this.tiltEngine.setTarget(x, y);
    };

    handlePointerLeave = () => {
        const shell = this.shellRef;
        if (!shell || !this.tiltEngine) return;
        this.tiltEngine.toCenter();
        const checkSettle = () => {
            const { x, y, tx, ty } = this.tiltEngine.getCurrent();
            const settled = Math.hypot(tx - x, ty - y) < 0.6;
            if (settled) {
                shell.classList.remove('active');
                this.leaveRafRef = null;
            } else {
                this.leaveRafRef = requestAnimationFrame(checkSettle);
            }
        };
        if (this.leaveRafRef) cancelAnimationFrame(this.leaveRafRef);
        this.leaveRafRef = requestAnimationFrame(checkSettle);
    };

    handleDeviceOrientation = (event) => {
        const shell = this.shellRef;
        if (!shell || !this.tiltEngine) return;
        const { beta, gamma } = event;
        if (beta == null || gamma == null) return;
        const centerX = shell.clientWidth / 2;
        const centerY = shell.clientHeight / 2;
        const x = clamp(centerX + gamma * this.options.mobileTiltSensitivity, 0, shell.clientWidth);
        const y = clamp(
            centerY + (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * this.options.mobileTiltSensitivity,
            0,
            shell.clientHeight
        );
        this.tiltEngine.setTarget(x, y);
    };

    attachEventListeners() {
        if (!this.options.enableTilt || !this.tiltEngine) return;
        const shell = this.shellRef;
        if (!shell) return;

        shell.addEventListener('pointerenter', this.handlePointerEnter);
        shell.addEventListener('pointermove', this.handlePointerMove);
        shell.addEventListener('pointerleave', this.handlePointerLeave);

        const handleClick = () => {
            if (!this.options.enableMobileTilt || location.protocol !== 'https:') return;
            const anyMotion = window.DeviceMotionEvent;
            if (anyMotion && typeof anyMotion.requestPermission === 'function') {
                anyMotion
                    .requestPermission()
                    .then(state => {
                        if (state === 'granted') {
                            window.addEventListener('deviceorientation', this.handleDeviceOrientation);
                        }
                    })
                    .catch(console.error);
            } else {
                window.addEventListener('deviceorientation', this.handleDeviceOrientation);
            }
        };

        shell.addEventListener('click', handleClick);

        const initialX = (shell.clientWidth || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET;
        const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
        this.tiltEngine.setImmediate(initialX, initialY);
        this.tiltEngine.toCenter();
        this.tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);
    }

    createElement() {
        const wrap = document.createElement('div');
        wrap.className = `pc-card-wrapper ${this.options.className}`.trim();
        wrap.style.setProperty('--icon', this.options.iconUrl ? `url(${this.options.iconUrl})` : 'none');
        wrap.style.setProperty('--grain', this.options.grainUrl ? `url(${this.options.grainUrl})` : 'none');
        wrap.style.setProperty('--inner-gradient', this.options.innerGradient);
        wrap.style.setProperty('--behind-glow-color', this.options.behindGlowColor);
        wrap.style.setProperty('--behind-glow-size', this.options.behindGlowSize);

        if (this.options.behindGlowEnabled) {
            const behind = document.createElement('div');
            behind.className = 'pc-behind';
            wrap.appendChild(behind);
        }

        const shell = document.createElement('div');
        shell.className = 'pc-card-shell';
        this.shellRef = shell;

        const card = document.createElement('section');
        card.className = 'pc-card';

        const inside = document.createElement('div');
        inside.className = 'pc-inside';

        const shine = document.createElement('div');
        shine.className = 'pc-shine';
        inside.appendChild(shine);

        const glare = document.createElement('div');
        glare.className = 'pc-glare';
        inside.appendChild(glare);

        // Avatar content
        const avatarContent = document.createElement('div');
        avatarContent.className = 'pc-content pc-avatar-content';

        const avatar = document.createElement('img');
        avatar.className = 'avatar';
        avatar.src = this.options.avatarUrl;
        avatar.alt = `${this.options.name} avatar`;
        avatar.loading = 'lazy';
        avatar.onerror = (e) => {
            e.target.style.display = 'none';
        };
        avatarContent.appendChild(avatar);

        if (this.options.showUserInfo) {
            const userInfo = document.createElement('div');
            userInfo.className = 'pc-user-info';

            const userDetails = document.createElement('div');
            userDetails.className = 'pc-user-details';

            const miniAvatar = document.createElement('div');
            miniAvatar.className = 'pc-mini-avatar';
            const miniImg = document.createElement('img');
            miniImg.src = this.options.miniAvatarUrl || this.options.avatarUrl;
            miniImg.alt = `${this.options.name} mini avatar`;
            miniImg.loading = 'lazy';
            miniImg.onerror = (e) => {
                e.target.style.opacity = '0.5';
                e.target.src = this.options.avatarUrl;
            };
            miniAvatar.appendChild(miniImg);
            userDetails.appendChild(miniAvatar);

            const userText = document.createElement('div');
            userText.className = 'pc-user-text';
            const handle = document.createElement('div');
            handle.className = 'pc-handle';
            handle.textContent = `@${this.options.handle}`;
            userText.appendChild(handle);
            const status = document.createElement('div');
            status.className = 'pc-status';
            status.textContent = this.options.status;
            userText.appendChild(status);
            userDetails.appendChild(userText);
            userInfo.appendChild(userDetails);

            const contactBtn = document.createElement('button');
            contactBtn.className = 'pc-contact-btn';
            contactBtn.textContent = this.options.contactText;
            contactBtn.type = 'button';
            contactBtn.setAttribute('aria-label', `Contact ${this.options.name}`);
            contactBtn.style.pointerEvents = 'auto';
            contactBtn.onclick = this.options.onContactClick;
            userInfo.appendChild(contactBtn);

            avatarContent.appendChild(userInfo);
        }

        inside.appendChild(avatarContent);

        // Details content
        const detailsContent = document.createElement('div');
        detailsContent.className = 'pc-content';
        const details = document.createElement('div');
        details.className = 'pc-details';
        const name = document.createElement('h3');
        name.textContent = this.options.name;
        details.appendChild(name);
        const title = document.createElement('p');
        title.textContent = this.options.title;
        details.appendChild(title);
        detailsContent.appendChild(details);
        inside.appendChild(detailsContent);

        card.appendChild(inside);
        shell.appendChild(card);
        wrap.appendChild(shell);

        this.wrapRef = wrap;
        this.element = wrap;
    }

    getElement() {
        return this.element;
    }

    destroy() {
        if (this.enterTimerRef) window.clearTimeout(this.enterTimerRef);
        if (this.leaveRafRef) cancelAnimationFrame(this.leaveRafRef);
        if (this.tiltEngine) this.tiltEngine.cancel();
        if (this.shellRef) {
            this.shellRef.classList.remove('entering');
        }
    }
}

// Initialize ProfileCard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.querySelector('.hero-content');
    if (heroSection) {
        const profileCard = new ProfileCard({
            name: 'Swayam Mehta',
            title: 'Software Engineer',
            handle: 'Swayyum',
            status: 'Online',
            contactText: 'Contact Me',
            avatarUrl: 'https://github.com/Swayyum.png',
            enableTilt: true,
            enableMobileTilt: false,
            onContactClick: () => {
                window.location.href = '#contact';
            }
        });

        // Insert profile card into hero section
        const cardContainer = document.createElement('div');
        cardContainer.className = 'profile-card-container';
        cardContainer.appendChild(profileCard.getElement());
        heroSection.appendChild(cardContainer);
    }
});

