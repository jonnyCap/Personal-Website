/**
 * @typedef {import('../../types/projects').Project} Project
 * @typedef {import('../../types/projects').ProjectsData} ProjectsData
 */

const ProjectsRenderer = {
    /** @type {ProjectsData | null} */
    projectsData: null,
    /** @type {any | null} */
    homelabData: null,

    /**
     * Initializes project & app rendering into the slider and SPA grids.
     * @returns {Promise<void>}
     */
    init: async function () {
        const track = document.getElementById("sliderTrack");
        const spaGrid = document.getElementById("spaProjectsGrid");
        const spaAppsGrid = document.getElementById("spaAppsGrid");
        if (!track && !spaGrid && !spaAppsGrid) return;

        // Fetch Projects Data
        if (!this.projectsData && (track || spaGrid)) {
            try {
                const response = await fetch("data/projects.json");
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                this.projectsData = await response.json();
            } catch (err) {
                console.error("Error fetching projects from data/projects.json:", err);
                if (track) track.innerHTML = `<div class="projectEmptyState">No projects available.</div>`;
                if (spaGrid) spaGrid.innerHTML = `<div class="projectEmptyState">No projects available.</div>`;
            }
        }

        // Fetch Homelab Apps Data
        if (!this.homelabData && spaAppsGrid) {
            try {
                const response = await fetch("data/homelab.json");
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                this.homelabData = await response.json();
            } catch (err) {
                console.error("Error fetching applications from data/homelab.json:", err);
                if (spaAppsGrid) spaAppsGrid.innerHTML = `<div class="projectEmptyState">No applications available.</div>`;
            }
        }

        const projects = (this.projectsData && Array.isArray(this.projectsData.projects)) ? this.projectsData.projects : [];
        const apps = (this.homelabData && Array.isArray(this.homelabData.applications)) ? this.homelabData.applications : [];

        if (track) {
            if (projects.length > 0) {
                this.renderCards(track, projects, true);
                if (typeof slider !== "undefined" && typeof slider.init === "function") {
                    slider.init();
                }
            } else {
                track.innerHTML = `<div class="projectEmptyState">No projects available.</div>`;
            }
        }

        if (spaGrid) {
            if (projects.length > 0) {
                this.renderCards(spaGrid, projects, false);
            } else {
                spaGrid.innerHTML = `<div class="projectEmptyState">No projects available.</div>`;
            }
        }

        if (spaAppsGrid) {
            if (apps.length > 0) {
                this.renderAppCards(spaAppsGrid, apps);
            } else {
                spaAppsGrid.innerHTML = `<div class="projectEmptyState">No applications available.</div>`;
            }
        }
    },

    /**
     * Renders an array of project items into the target container.
     * @param {HTMLElement} container
     * @param {any[]} projects
     * @param {boolean} [isSlider=true]
     * @returns {void}
     */
    renderCards: function (container, projects, isSlider = true) {
        if (!projects || projects.length === 0) {
            container.innerHTML = `<div class="projectEmptyState">No projects available.</div>`;
            return;
        }

        container.innerHTML = "";

        projects.forEach((proj, idx) => {
            const card = document.createElement("div");
            card.className = isSlider ? "sliderElement projectCard" : "projectCard spaCardElement";
            card.setAttribute("data-index", String(idx));

            const tagsHtml = (proj.tags || []).map(tag => 
                `<span class="projectTag">${this.escapeHtml(tag)}</span>`
            ).join("");

            const languageBarHtml = (proj.languageStats && proj.languageStats.length > 1) ? `
                <div class="langBarWrapper" title="Language breakdown">
                    <div class="langBar">
                        ${proj.languageStats.map(ls => `
                            <div class="langBarSegment" style="width: ${ls.percentage}%; background-color: ${ls.color || '#549bcf'};" title="${this.escapeHtml(ls.name)}: ${ls.percentage}%"></div>
                        `).join("")}
                    </div>
                    <div class="langBarLegend">
                        ${proj.languageStats.map(ls => `
                            <span class="langLegendItem">
                                <span class="langDot" style="background-color: ${ls.color || '#549bcf'};"></span>
                                <span>${this.escapeHtml(ls.name)} ${ls.percentage}%</span>
                            </span>
                        `).join("")}
                    </div>
                </div>
            ` : "";

            const subtitleHtml = proj.subtitle ? `<div class="projectCardSubtitle">${this.escapeHtml(proj.subtitle)}</div>` : "";
            const featuredBadge = proj.featured ? `<span class="featuredBadge">Featured</span>` : "";

            card.innerHTML = `
                <div class="projectCardInner">
                    <div class="projectCardHeader">
                        <div class="projectMetaPill">
                            <span class="langDot" style="background-color: ${proj.primaryLanguageColor || '#549bcf'};"></span>
                            <span>${this.escapeHtml(proj.primaryLanguage || 'Software')}</span>
                        </div>
                        ${featuredBadge}
                    </div>
                    <div class="projectCardBody">
                        <h3 class="projectCardTitle">${this.escapeHtml(proj.title)}</h3>
                        ${subtitleHtml}
                        <p class="projectCardDesc">${this.escapeHtml(proj.description || 'Open source software project.')}</p>
                        <div class="projectTagsContainer">${tagsHtml}</div>
                        ${languageBarHtml}
                    </div>
                    <div class="projectCardFooter">
                        <div class="projectStats">
                            ${proj.updatedAt ? `<span class="statItem" title="Last updated"><svg class="statIcon" viewBox="0 0 16 16"><path d="M8 0a8 8 0 100 16A8 8 0 008 0zm.5 4.75a.75.75 0 00-1.5 0v3.5c0 .2.08.39.22.53l2.5 2.5a.75.75 0 001.06-1.06L8.5 8.94V4.75z"/></svg>${this.escapeHtml(proj.updatedAt)}</span>` : ''}
                        </div>
                        <a href="${this.escapeHtml(proj.githubUrl)}" target="_blank" rel="noopener noreferrer" class="button-53 projectCardButton" aria-label="View ${this.escapeHtml(proj.title)} repository">
                            <span>Code</span>
                            <svg class="externalIcon" viewBox="0 0 16 16"><path d="M3.75 2h3.5a.75.75 0 010 1.5h-3.5a.25.25 0 00-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 00.25-.25v-3.5a.75.75 0 011.5 0v3.5A1.75 1.75 0 0112.25 14h-8.5A1.75 1.75 0 012 12.25v-8.5C2 2.784 2.784 2 3.75 2zm6.5.75a.75.75 0 01.75-.75h3.25a.75.75 0 01.75.75v3.25a.75.75 0 01-1.5 0V4.06l-4.72 4.72a.75.75 0 01-1.06-1.06l4.72-4.72H11a.75.75 0 01-.75-.75z"/></svg>
                        </a>
                    </div>
                </div>
            `;

            container.appendChild(card);
        });
    },

    /**
     * Renders deployed application cards into the target container.
     * @param {HTMLElement} container
     * @param {any[]} apps
     * @returns {void}
     */
    renderAppCards: function (container, apps) {
        if (!apps || apps.length === 0) {
            container.innerHTML = `<div class="projectEmptyState">No applications available.</div>`;
            return;
        }

        container.innerHTML = "";

        apps.forEach((app, idx) => {
            const card = document.createElement("div");
            card.className = "projectCard spaCardElement";
            card.setAttribute("data-index", String(idx));

            const tagsHtml = (app.tags || []).map(tag => 
                `<span class="projectTag">${this.escapeHtml(tag)}</span>`
            ).join("");

            const hasLogo = Boolean(app.logoImage);

            card.innerHTML = `
                <div class="projectCardInner">
                    <div class="projectCardHeader">
                        <div class="projectMetaPill">
                            <span class="langDot" style="background-color: #10b981;"></span>
                            <span>Live Application</span>
                        </div>
                    </div>
                    <div class="projectCardBody">
                        <div class="appCardTitleRow">
                            <div class="appCardLogoWrapper" style="background: ${app.logoBg || '#ffffff'};">
                                ${hasLogo ? `
                                    <img class="appCardLogoImg" src="${this.escapeHtml(app.logoImage)}" alt="${this.escapeHtml(app.name)} Logo" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='block';">
                                    <span class="appCardLogoText" style="display:none;">${this.escapeHtml(app.logoText || app.name.slice(0, 2).toUpperCase())}</span>
                                ` : `
                                    <span class="appCardLogoText">${this.escapeHtml(app.logoText || app.name.slice(0, 2).toUpperCase())}</span>
                                `}
                            </div>
                            <div class="appCardTitleMeta">
                                <h3 class="projectCardTitle">${this.escapeHtml(app.name)}</h3>
                                <div class="projectCardSubtitle">${this.escapeHtml(app.category)}</div>
                            </div>
                        </div>
                        <p class="projectCardDesc">${this.escapeHtml(app.description)}</p>
                        <div class="projectTagsContainer">${tagsHtml}</div>
                    </div>
                    <div class="projectCardFooter">
                        <div class="projectStats">
                            <a href="${this.escapeHtml(app.url)}" target="_blank" rel="noopener noreferrer" class="appSubdomainPill" title="${this.escapeHtml(app.subdomain)}">
                                <svg class="statIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                                <span>${this.escapeHtml(app.subdomain)}</span>
                            </a>
                        </div>
                        <a href="${this.escapeHtml(app.url)}" target="_blank" rel="noopener noreferrer" class="button-53 projectCardButton" aria-label="Launch ${this.escapeHtml(app.name)}">
                            <span>Launch</span>
                            <svg class="externalIcon" viewBox="0 0 16 16"><path d="M3.75 2h3.5a.75.75 0 010 1.5h-3.5a.25.25 0 00-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 00.25-.25v-3.5a.75.75 0 011.5 0v3.5A1.75 1.75 0 0112.25 14h-8.5A1.75 1.75 0 012 12.25v-8.5C2 2.784 2.784 2 3.75 2zm6.5.75a.75.75 0 01.75-.75h3.25a.75.75 0 01.75.75v3.25a.75.75 0 01-1.5 0V4.06l-4.72 4.72a.75.75 0 01-1.06-1.06l4.72-4.72H11a.75.75 0 01-.75-.75z"/></svg>
                        </a>
                    </div>
                </div>
            `;

            container.appendChild(card);
        });
    },

    escapeHtml: function (text) {
        if (!text) return "";
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => ProjectsRenderer.init());
} else {
    ProjectsRenderer.init();
}
