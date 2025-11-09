// Copyright © 2025 Sam Analytic Solutions
// All rights reserved.

const GITHUB_USERNAME = 'Swayyum';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`;

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// Animate stats on scroll
const animateStats = () => {
    const stats = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateNumber(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
};

const animateNumber = (element, target) => {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
};

// Fetch and display GitHub repositories
const fetchRepositories = async () => {
    try {
        const response = await fetch(GITHUB_API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }
        const repos = await response.json();
        displayProjects(repos);
    } catch (error) {
        console.error('Error fetching repositories:', error);
        displayError();
    }
};

const displayProjects = (repos) => {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;

    // Filter out forks and sort by stars/updated
    const filteredRepos = repos
        .filter(repo => !repo.fork)
        .sort((a, b) => {
            // Sort by stars first, then by updated date
            if (b.stargazers_count !== a.stargazers_count) {
                return b.stargazers_count - a.stargazers_count;
            }
            return new Date(b.updated_at) - new Date(a.updated_at);
        })
        .slice(0, 9); // Show top 9 projects

    projectsGrid.innerHTML = '';

    if (filteredRepos.length === 0) {
        projectsGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; color: var(--text-secondary);">No repositories found.</p>';
        return;
    }

    filteredRepos.forEach(repo => {
        const projectCard = createProjectCard(repo);
        projectsGrid.appendChild(projectCard);
    });
};

const createProjectCard = (repo) => {
    const card = document.createElement('div');
    card.className = 'project-card';

    const description = repo.description || 'No description available.';
    const topics = repo.topics || [];
    const language = repo.language || '';

    card.innerHTML = `
        <div class="project-header">
            <div>
                <h3 class="project-title">${escapeHtml(repo.name)}</h3>
            </div>
        </div>
        <p class="project-description">${escapeHtml(description)}</p>
        ${topics.length > 0 ? `
            <div class="project-topics">
                ${topics.slice(0, 3).map(topic => `<span class="topic-tag">${escapeHtml(topic)}</span>`).join('')}
            </div>
        ` : ''}
        <div class="project-footer">
            <div class="project-links">
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    View Code
                </a>
                ${repo.homepage ? `
                    <a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="project-link">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        Live Demo
                    </a>
                ` : ''}
            </div>
            <div class="project-stats">
                ${language ? `
                    <span class="project-stat">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="10"/>
                        </svg>
                        ${escapeHtml(language)}
                    </span>
                ` : ''}
                <span class="project-stat">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    ${repo.stargazers_count}
                </span>
            </div>
        </div>
    `;

    return card;
};

const displayError = () => {
    const projectsGrid = document.getElementById('projectsGrid');
    if (projectsGrid) {
        projectsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <p style="color: var(--text-secondary); margin-bottom: 1rem;">
                    Unable to load projects at the moment.
                </p>
                <button onclick="fetchRepositories()" class="btn btn-primary" style="margin-top: 1rem;">
                    Try Again
                </button>
            </div>
        `;
    }
};

const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

// Navbar background on scroll
const handleNavbarScroll = () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchRepositories();
    animateStats();
    window.addEventListener('scroll', handleNavbarScroll);
});

