// Copyright © 2025 Sam Analytic Solutions
// All rights reserved.

// GlassIcons Component - Vanilla JavaScript version

const gradientMapping = {
    blue: 'linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))',
    purple: 'linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))',
    red: 'linear-gradient(hsl(3, 90%, 50%), hsl(348, 90%, 50%))',
    indigo: 'linear-gradient(hsl(253, 90%, 50%), hsl(238, 90%, 50%))',
    orange: 'linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))',
    green: 'linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))'
};

// SVG Icons
const icons = {
    home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>`,
    about: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 16v-4"></path>
        <path d="M12 8h.01"></path>
    </svg>`,
    projects: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
    </svg>`,
    contact: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
    </svg>`,
    github: `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>`,
    linkedin: `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>`
};

function getBackgroundStyle(color) {
    if (gradientMapping[color]) {
        return { background: gradientMapping[color] };
    }
    return { background: color };
}

function createGlassIcons(items, className = '') {
    const container = document.createElement('div');
    container.className = `icon-btns ${className}`.trim();

    items.forEach((item, index) => {
        const button = document.createElement('button');
        button.className = `icon-btn ${item.customClass || ''}`;
        button.setAttribute('aria-label', item.label);
        button.type = 'button';
        
        if (item.onClick) {
            button.addEventListener('click', item.onClick);
        }

        // Back layer
        const back = document.createElement('span');
        back.className = 'icon-btn__back';
        Object.assign(back.style, getBackgroundStyle(item.color));
        button.appendChild(back);

        // Front layer
        const front = document.createElement('span');
        front.className = 'icon-btn__front';
        const icon = document.createElement('span');
        icon.className = 'icon-btn__icon';
        icon.setAttribute('aria-hidden', 'true');
        
        // Handle icon (can be SVG string or element)
        if (typeof item.icon === 'string') {
            icon.innerHTML = item.icon;
        } else if (item.icon) {
            icon.appendChild(item.icon);
        }
        
        front.appendChild(icon);
        button.appendChild(front);

        // Label
        const label = document.createElement('span');
        label.className = 'icon-btn__label';
        label.textContent = item.label;
        button.appendChild(label);

        container.appendChild(button);
    });

    return container;
}

// Initialize navbar icons
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar .container');
    if (navbar) {
        const navLinks = navbar.querySelector('.nav-links');
        if (navLinks) {
            // Create glass icons for navigation
            const navItems = [
                {
                    icon: icons.home,
                    color: 'blue',
                    label: 'Home',
                    onClick: () => {
                        document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth' });
                    }
                },
                {
                    icon: icons.about,
                    color: 'purple',
                    label: 'About',
                    onClick: () => {
                        document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
                    }
                },
                {
                    icon: icons.projects,
                    color: 'indigo',
                    label: 'Projects',
                    onClick: () => {
                        document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
                    }
                },
                {
                    icon: icons.contact,
                    color: 'orange',
                    label: 'Contact',
                    onClick: () => {
                        document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            ];

            const glassIcons = createGlassIcons(navItems, 'nav-glass-icons');
            // Replace text links with glass icons
            navLinks.innerHTML = '';
            navLinks.appendChild(glassIcons);
        }
    }

    // Add glass icons to contact section
    const contactSection = document.querySelector('#contact .contact-links');
    if (contactSection) {
        const contactItems = [
            {
                icon: icons.github,
                color: 'purple',
                label: 'GitHub',
                onClick: () => window.open('https://github.com/Swayyum', '_blank')
            },
            {
                icon: icons.linkedin,
                color: 'blue',
                label: 'LinkedIn',
                onClick: () => window.open('https://linkedin.com/in/swayam-mehta', '_blank')
            }
        ];

        const contactGlassIcons = createGlassIcons(contactItems, 'contact-glass-icons');
        contactSection.appendChild(contactGlassIcons);
    }
});

// Export for use in other parts of the site
window.GlassIcons = {
    create: createGlassIcons,
    icons: icons
};

