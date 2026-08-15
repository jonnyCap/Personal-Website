/**
 * projectsRenderer.js
 * Dynamically fetches and renders public GitHub repositories into the project slider.
 */

const ProjectsRenderer = {
    projectsData: null,

    init: async function () {
        const track = document.getElementById("sliderTrack");
        const spaGrid = document.getElementById("spaProjectsGrid");
        if (!track && !spaGrid) return;

        // Reuse cached data if already loaded
        if (!this.projectsData) {
            if (window.location.protocol === "file:") {
                // In file:// protocol, Chrome security disallows relative fetch(). Use embedded data directly without console warnings.
                this.projectsData = this.getFallbackData();
            } else {
                try {
                    const response = await fetch("data/projects.json");
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    this.projectsData = await response.json();
                } catch (err) {
                    this.projectsData = this.getFallbackData();
                }
            }
        }

        const projects = (this.projectsData && this.projectsData.projects) ? this.projectsData.projects : [];

        if (track) {
            this.renderCards(track, projects, true);
            // Re-initialize slider with freshly rendered cards
            if (typeof slider !== "undefined" && typeof slider.init === "function") {
                slider.init();
            }
        }

        if (spaGrid) {
            this.renderCards(spaGrid, projects, false);
        }
    },

    renderCards: function (container, projects, isSlider = true) {
        if (!projects || projects.length === 0) return;

        container.innerHTML = "";

        projects.forEach((proj, idx) => {
            const card = document.createElement("div");
            card.className = isSlider ? "sliderElement projectCard" : "projectCard spaCardElement";
            card.setAttribute("data-index", idx);

            const tagsHtml = (proj.tags || []).map(tag => 
                `<span class="projectTag">${this.escapeHtml(tag)}</span>`
            ).join("");

            const languageBarHtml = (proj.languageStats && proj.languageStats.length > 1) ? `
                <div class="langBarWrapper" title="Language breakdown">
                    <div class="langBar">
                        ${proj.languageStats.map(l => `
                            <div class="langBarSegment" style="width: ${l.percentage}%; background-color: ${l.color};" title="${l.name}: ${l.percentage}%"></div>
                        `).join("")}
                    </div>
                    <div class="langBarLegend">
                        ${proj.languageStats.slice(0, 3).map(l => `
                            <span class="langLegendItem"><span class="langDot" style="background-color: ${l.color};"></span>${l.name} ${l.percentage}%</span>
                        `).join("")}
                    </div>
                </div>
            ` : "";

            card.innerHTML = `
                <div class="projectCardInner">
                    <div class="projectCardHeader">
                        <div class="projectMetaPill">
                            <span class="langDot" style="background-color: ${proj.primaryLanguageColor || '#549bcf'};"></span>
                            <span class="langName">${this.escapeHtml(proj.primaryLanguage || 'Code')}</span>
                        </div>
                        ${proj.featured ? '<span class="featuredBadge">Featured</span>' : ''}
                    </div>
                    <div class="projectCardBody">
                        <h3 class="projectCardTitle">${this.escapeHtml(proj.title)}</h3>
                        <h4 class="projectCardSubtitle">${this.escapeHtml(proj.subtitle)}</h4>
                        <p class="projectCardDesc">${this.escapeHtml(proj.description)}</p>
                        
                        <div class="projectTagsContainer">
                            ${tagsHtml}
                        </div>

                        ${languageBarHtml}
                    </div>
                    <div class="projectCardFooter">
                        <div class="projectStats">
                            ${proj.stars > 0 ? `<span class="statItem" title="Stars"><svg class="statIcon" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/></svg>${proj.stars}</span>` : ''}
                            ${proj.forks > 0 ? `<span class="statItem" title="Forks"><svg class="statIcon" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h4.5A2.25 2.25 0 0012.5 6.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zM10.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z"/></svg>${proj.forks}</span>` : ''}
                            <span class="statItem updatedDate">${proj.updatedAt ? `Updated ${proj.updatedAt}` : ''}</span>
                        </div>
                        <a href="${proj.githubUrl}" target="_blank" rel="noopener noreferrer" class="projectCardButton button-53" aria-label="View ${proj.title} on GitHub">
                            <span>GitHub</span>
                            <svg class="externalIcon" viewBox="0 0 24 24"><path d="M14 3h7v7h-2V6.414l-9.293 9.293-1.414-1.414L17.586 5H14V3zM5 5h6V3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-6h-2v6H5V5z"/></svg>
                        </a>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    },

    escapeHtml: function (str) {
        if (!str) return "";
        return str.replace(/[&<>"']/g, function (m) {
            switch (m) {
                case "&": return "&amp;";
                case "<": return "&lt;";
                case ">": return "&gt;";
                case '"': return "&quot;";
                case "'": return "&#039;";
                default: return m;
            }
        });
    },

    getFallbackData: function () {
        return {
            projects: [
                {
                    title: "QueueGo",
                    subtitle: "High-Performance Pub/Sub Broker",
                    description: "A lightweight Pub/Sub message broker written in Go over a custom TCP protocol (Blink). Supports persistent queues via BadgerDB and JWT-based authentication.",
                    githubUrl: "https://github.com/jonnyCap/QueueGo",
                    primaryLanguage: "Go",
                    primaryLanguageColor: "#00ADD8",
                    tags: ["Go", "Distributed Systems", "TCP", "BadgerDB", "JWT"],
                    featured: true,
                    updatedAt: "Aug 2026",
                    languageStats: [{ name: "Go", percentage: 100, color: "#00ADD8" }]
                },
                {
                    title: "Blink Protocol",
                    subtitle: "Lightweight TCP Messaging Protocol",
                    description: "A lightweight, language-agnostic TCP messaging protocol designed for high-performance publish/subscribe distributed systems with minimal network overhead.",
                    githubUrl: "https://github.com/jonnyCap/Blink",
                    primaryLanguage: "Python",
                    primaryLanguageColor: "#3572A5",
                    tags: ["Python", "TCP Protocol", "Pub/Sub", "Networking"],
                    featured: true,
                    updatedAt: "Aug 2026",
                    languageStats: [
                        { name: "Python", percentage: 36.4, color: "#3572A5" },
                        { name: "Go", percentage: 34.3, color: "#00ADD8" },
                        { name: "JavaScript", percentage: 29.3, color: "#F1E05A" }
                    ]
                },
                {
                    title: "LLM Assessment of Software Project Ideas",
                    subtitle: "Bachelor's Thesis Research Project",
                    description: "An automated evaluation pipeline leveraging Large Language Models (LLMs) to assess and score student project proposals in higher-education software project management courses.",
                    githubUrl: "https://github.com/jonnyCap/LLM-based-Assessment-of-Software-Project-Ideas",
                    primaryLanguage: "Jupyter Notebook",
                    primaryLanguageColor: "#DA5B0B",
                    tags: ["Python", "Jupyter", "LLMs", "NLP", "Research"],
                    featured: true,
                    updatedAt: "Mar 2026",
                    languageStats: [{ name: "Jupyter Notebook", percentage: 91.2, color: "#DA5B0B" }]
                },
                {
                    title: "Advanced Information Retrieval",
                    subtitle: "TU Graz Graduate Project",
                    description: "Information retrieval and ranking pipeline implementation exploring inverted index structures, BM25 scoring, neural dense retrieval, and evaluation metrics.",
                    githubUrl: "https://github.com/jonnyCap/AIR-Project",
                    primaryLanguage: "Jupyter Notebook",
                    primaryLanguageColor: "#DA5B0B",
                    tags: ["Python", "Jupyter", "IR", "Search Engines", "TU Graz"],
                    featured: false,
                    updatedAt: "Jan 2025",
                    languageStats: [{ name: "Jupyter Notebook", percentage: 100, color: "#DA5B0B" }]
                },
                {
                    title: "Business Intelligence & Data Analytics",
                    subtitle: "TU Vienna Course Project",
                    description: "Comprehensive data analytics workflows including data warehouse dimensional modeling, ETL pipelines, clustering, and predictive classification algorithms.",
                    githubUrl: "https://github.com/jonnyCap/BI---Data-Analytics",
                    primaryLanguage: "Jupyter Notebook",
                    primaryLanguageColor: "#DA5B0B",
                    tags: ["Python", "Jupyter", "Data Analytics", "ETL", "TU Vienna"],
                    featured: false,
                    updatedAt: "Jan 2026",
                    languageStats: [{ name: "Jupyter Notebook", percentage: 100, color: "#DA5B0B" }]
                },
                {
                    title: "Personal Portfolio & SPA",
                    subtitle: "Interactive Vanilla Web Architecture",
                    description: "Modern responsive portfolio website built with pure HTML5, CSS3, dynamic Canvas animations, and automated GitHub repository synchronization workflows.",
                    githubUrl: "https://github.com/jonnyCap/Personal-Website",
                    primaryLanguage: "JavaScript",
                    primaryLanguageColor: "#F1E05A",
                    tags: ["JavaScript", "HTML5", "CSS3", "Canvas API", "GitHub Actions"],
                    featured: false,
                    updatedAt: "Aug 2026",
                    languageStats: [{ name: "JavaScript", percentage: 100, color: "#F1E05A" }]
                },
                {
                    title: "Team Creator App",
                    subtitle: "Android Team Balancing Application",
                    description: "Native Android mobile application designed to generate balanced sports and game teams with custom player ratings and algorithmic distribution.",
                    githubUrl: "https://github.com/jonnyCap/Team-Creator",
                    primaryLanguage: "Java",
                    primaryLanguageColor: "#B07219",
                    tags: ["Java", "Android Studio", "Mobile Development", "Algorithms"],
                    featured: false,
                    updatedAt: "Sep 2022",
                    languageStats: [{ name: "Java", percentage: 100, color: "#B07219" }]
                }
            ]
        };
    }
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => ProjectsRenderer.init());
} else {
    ProjectsRenderer.init();
}

