// Copyright © 2025 Sam Analytic Solutions
// All rights reserved.

// GooeyNav Component - ReactBits style (Vanilla JavaScript)
class GooeyNav {
    constructor(options = {}) {
        this.options = {
            items: options.items || [
                { label: "Home", href: "#home" },
                { label: "About", href: "#about" },
                { label: "Projects", href: "#projects" },
                { label: "Contact", href: "#contact" }
            ],
            particleCount: options.particleCount || 15,
            particleDistances: options.particleDistances || [90, 10],
            particleR: options.particleR || 100,
            timeVariance: options.timeVariance || 300,
            colors: options.colors || [1, 2, 3, 1, 2, 3, 1, 4],
            initialActiveIndex: options.initialActiveIndex || 0,
            animationTime: options.animationTime || 600,
            ...options
        };

        this.container = null;
        this.nav = null;
        this.filter = null;
        this.text = null;
        this.activeIndex = this.options.initialActiveIndex;

        this.init();
        this.handleScroll();
    }

    init() {
        this.createContainer();
        this.attachEventListeners();
        this.updateActiveItem();
    }

    createContainer() {
        // Remove existing navbar
        const existingNav = document.querySelector('.navbar');
        if (existingNav) {
            existingNav.remove();
        }

        // Remove existing GooeyNav if it exists
        const existingGooeyNav = document.querySelector('.gooey-nav-container');
        if (existingGooeyNav) {
            existingGooeyNav.remove();
        }

        // Create container
        const container = document.createElement('div');
        container.className = 'gooey-nav-container';
        container.style.cssText = 'position: fixed; top: 1.5rem; left: 50%; transform: translateX(-50%); z-index: 1000;';

        // Create nav
        const nav = document.createElement('nav');
        const ul = document.createElement('ul');

        this.options.items.forEach((item, index) => {
            const li = document.createElement('li');
            if (index === this.activeIndex) {
                li.classList.add('active');
            }

            const a = document.createElement('a');
            a.href = item.href;
            a.textContent = item.label;
            a.addEventListener('click', (e) => this.handleClick(e, index));
            a.addEventListener('keydown', (e) => this.handleKeyDown(e, index));

            li.appendChild(a);
            ul.appendChild(li);
        });

        nav.appendChild(ul);

        // Create effect elements (disabled - gooey effect removed)
        const filter = document.createElement('span');
        filter.className = 'effect filter';
        filter.setAttribute('ref', 'filter');
        filter.style.display = 'none'; // Hide filter effect

        const text = document.createElement('span');
        text.className = 'effect text';
        text.setAttribute('ref', 'text');
        text.style.display = 'none'; // Hide text effect

        container.appendChild(nav);
        // Don't append filter and text to avoid gooey effect

        // Insert at beginning of body
        document.body.insertBefore(container, document.body.firstChild);

        this.container = container;
        this.nav = nav;
        this.filter = filter;
        this.text = text;
    }

    noise(n = 1) {
        return n / 2 - Math.random() * n;
    }

    getXY(distance, pointIndex, totalPoints) {
        const angle = ((360 + this.noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
        return [distance * Math.cos(angle), distance * Math.sin(angle)];
    }

    createParticle(i, t, d, r) {
        let rotate = this.noise(r / 10);
        return {
            start: this.getXY(d[0], this.options.particleCount - i, this.options.particleCount),
            end: this.getXY(d[1] + this.noise(7), this.options.particleCount - i, this.options.particleCount),
            time: t,
            scale: 1 + this.noise(0.2),
            color: this.options.colors[Math.floor(Math.random() * this.options.colors.length)],
            rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
        };
    }

    makeParticles(element) {
        const d = this.options.particleDistances;
        const r = this.options.particleR;
        const bubbleTime = this.options.animationTime * 2 + this.options.timeVariance;
        element.style.setProperty('--time', `${bubbleTime}ms`);

        for (let i = 0; i < this.options.particleCount; i++) {
            const t = this.options.animationTime * 2 + this.noise(this.options.timeVariance * 2);
            const p = this.createParticle(i, t, d, r);
            element.classList.remove('active');

            setTimeout(() => {
                const particle = document.createElement('span');
                const point = document.createElement('span');
                particle.classList.add('particle');
                particle.style.setProperty('--start-x', `${p.start[0]}px`);
                particle.style.setProperty('--start-y', `${p.start[1]}px`);
                particle.style.setProperty('--end-x', `${p.end[0]}px`);
                particle.style.setProperty('--end-y', `${p.end[1]}px`);
                particle.style.setProperty('--time', `${p.time}ms`);
                particle.style.setProperty('--scale', `${p.scale}`);
                particle.style.setProperty('--color', 'black');
                particle.style.setProperty('--rotate', `${p.rotate}deg`);

                point.classList.add('point');
                particle.appendChild(point);
                element.appendChild(particle);

                requestAnimationFrame(() => {
                    element.classList.add('active');
                });

                setTimeout(() => {
                    try {
                        element.removeChild(particle);
                    } catch (e) {
                        // Do nothing
                    }
                }, t);
            }, 30);
        }
    }

    updateEffectPosition(element) {
        if (!this.container || !this.filter || !this.text) return;

        const containerRect = this.container.getBoundingClientRect();
        const pos = element.getBoundingClientRect();

        const styles = {
            left: `${pos.x - containerRect.x}px`,
            top: `${pos.y - containerRect.y}px`,
            width: `${pos.width}px`,
            height: `${pos.height}px`
        };

        Object.assign(this.filter.style, styles);
        Object.assign(this.text.style, styles);
        this.text.textContent = element.textContent;
    }

    handleClick(e, index) {
        e.preventDefault();
        const liEl = e.currentTarget.closest('li');
        if (this.activeIndex === index) return;

        // Update active state
        const allLis = this.nav.querySelectorAll('li');
        allLis.forEach(li => li.classList.remove('active'));
        liEl.classList.add('active');
        this.activeIndex = index;

        // Smooth scroll to section
        const href = e.currentTarget.getAttribute('href');
        if (href.startsWith('#')) {
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        // Gooey effect disabled - no particles or effects
    }

    handleKeyDown(e, index) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const liEl = e.currentTarget.closest('li');
            if (liEl) {
                this.handleClick(e, index);
            }
        }
    }

    attachEventListeners() {
        // Resize observer (gooey effect disabled, so no need to update effect position)
        // Handle scroll to detect white backgrounds
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        this.handleScroll(); // Initial check
    }

    updateActiveItem() {
        if (!this.nav || !this.container) return;

        const activeLi = this.nav.querySelectorAll('li')[this.activeIndex];
        if (activeLi) {
            // Gooey effect disabled - just update active state
            const allLis = this.nav.querySelectorAll('li');
            allLis.forEach(li => li.classList.remove('active'));
            activeLi.classList.add('active');
        }
    }

    handleScroll() {
        if (!this.container) return;

        const navRect = this.container.getBoundingClientRect();
        const navCenterY = navRect.top + navRect.height / 2;

        // Check which section the nav is currently over
        const sections = document.querySelectorAll('section');
        let isOverLight = false;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            // Check if nav center is within this section
            if (navCenterY >= rect.top && navCenterY <= rect.bottom) {
                // Check if section has light background (white/light gray sections)
                const isLightBg = section.classList.contains('about') || 
                                 section.classList.contains('experience') || 
                                 section.classList.contains('projects') || 
                                 section.classList.contains('contact') ||
                                 section.classList.contains('expertise') ||
                                 section.classList.contains('education') ||
                                 section.classList.contains('technologies');
                
                if (isLightBg) {
                    isOverLight = true;
                }
            }
        });

        // Toggle class based on background
        if (isOverLight) {
            this.container.classList.add('over-light');
        } else {
            this.container.classList.remove('over-light');
        }
    }

    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

// Initialize GooeyNav when DOM is ready
let gooeyNav = null;
let isInitialized = false;

function initGooeyNav() {
    // Prevent duplicate initialization
    if (isInitialized) {
        console.log('GooeyNav already initialized, skipping...');
        return;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                if (isInitialized) return;
                isInitialized = true;
                gooeyNav = new GooeyNav({
                    items: [
                        { label: "Intro", href: "#intro" },
                        { label: "About", href: "#about" },
                        { label: "Projects", href: "#projects" },
                        { label: "Get in touch", href: "#contact" }
                    ],
                    particleCount: 15,
                    particleDistances: [90, 10],
                    particleR: 100,
                    initialActiveIndex: 0,
                    animationTime: 600,
                    timeVariance: 300,
                    colors: [1, 2, 3, 1, 2, 3, 1, 4]
                });
            }, 100);
        });
    } else {
        setTimeout(() => {
            if (isInitialized) return;
            isInitialized = true;
            gooeyNav = new GooeyNav({
                items: [
                    { label: "Intro", href: "#intro" },
                    { label: "About", href: "#about" },
                    { label: "Projects", href: "#projects" },
                    { label: "Get in touch", href: "#contact" }
                ],
                particleCount: 15,
                particleDistances: [90, 10],
                particleR: 100,
                initialActiveIndex: 0,
                animationTime: 600,
                timeVariance: 300,
                colors: [1, 2, 3, 1, 2, 3, 1, 4]
            });
        }, 100);
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (gooeyNav) {
        gooeyNav.destroy();
    }
});

// Start initialization
initGooeyNav();

