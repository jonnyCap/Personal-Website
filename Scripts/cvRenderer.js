/**
 * cvRenderer.js
 * Dynamically loads and renders CV data (Experience/Internships & Education) from data/cv.json.
 */

const CvRenderer = {
    cvData: null,

    init: async function () {
        const expContainer = document.getElementById("experienceTimeline");
        const eduContainer = document.getElementById("educationTimeline");
        if (!expContainer && !eduContainer) return;

        if (!this.cvData) {
            try {
                const response = await fetch("data/cv.json");
                if (!response.ok) {
                    throw new Error(`Failed to load data/cv.json (HTTP ${response.status})`);
                }
                this.cvData = await response.json();
            } catch (err) {
                console.error("Error fetching CV data from data/cv.json:", err);
                if (expContainer) expContainer.innerHTML = `<div class="cvEmptyState">No experience entries available.</div>`;
                if (eduContainer) eduContainer.innerHTML = `<div class="cvEmptyState">No education entries available.</div>`;
                return;
            }
        }

        if (expContainer) {
            const expItems = (this.cvData && Array.isArray(this.cvData.experience)) ? this.cvData.experience : [];
            if (expItems.length > 0) {
                this.renderTimeline(expContainer, expItems, "experience");
            } else {
                expContainer.innerHTML = `<div class="cvEmptyState">No experience entries available.</div>`;
            }
        }

        if (eduContainer) {
            const eduItems = (this.cvData && Array.isArray(this.cvData.education)) ? this.cvData.education : [];
            if (eduItems.length > 0) {
                this.renderTimeline(eduContainer, eduItems, "education");
            } else {
                eduContainer.innerHTML = `<div class="cvEmptyState">No education entries available.</div>`;
            }
        }
    },

    renderTimeline: function (container, items, type) {
        if (!items || items.length === 0) {
            container.innerHTML = `<div class="cvEmptyState">No entries available.</div>`;
            return;
        }

        container.innerHTML = "";

        const timelineList = document.createElement("div");
        timelineList.className = "cvTimelineList";

        items.forEach((item, index) => {
            const itemElement = document.createElement("div");
            itemElement.className = "cvTimelineItem";
            itemElement.setAttribute("data-type", type);
            itemElement.setAttribute("data-index", index);

            const isLast = index === items.length - 1;

            const skillsHtml = (item.skills && item.skills.length > 0)
                ? `<div class="cvSkillTags">
                    ${item.skills.map(s => `<span class="cvSkillTag">${this.escapeHtml(s)}</span>`).join("")}
                   </div>`
                : "";

            const honorsHtml = item.honors
                ? `<span class="cvBadge cvHonorBadge">
                    <svg class="cvBadgeIcon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    ${this.escapeHtml(item.honors)}
                   </span>`
                : "";

            const gradeHtml = item.grade
                ? `<span class="cvBadge cvGradeBadge">
                    <svg class="cvBadgeIcon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    ${this.escapeHtml(item.grade)}
                   </span>`
                : "";

            const headerTitle = type === "experience" ? item.title : item.degree;
            const subTitle = type === "experience" ? item.company : item.institution;
            const periodText = item.duration ? `${item.period} · ${item.duration}` : item.period;

            itemElement.innerHTML = `
                <div class="cvTimelineNode">
                    <div class="cvTimelineDot"></div>
                    ${!isLast ? '<div class="cvTimelineLine"></div>' : ''}
                </div>
                <div class="cvTimelineContent">
                    <div class="cvCardHeader">
                        <div class="cvTitleGroup">
                            <h3 class="cvItemTitle">${this.escapeHtml(headerTitle)}</h3>
                            <h4 class="cvItemSubtitle">${this.escapeHtml(subTitle)}</h4>
                        </div>
                        <div class="cvPeriodBadge">${this.escapeHtml(periodText)}</div>
                    </div>
                    <div class="cvMetaInfo">
                        <span class="cvLocation">
                            <svg class="cvMetaIcon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                            </svg>
                            ${this.escapeHtml(item.location || "")}
                        </span>
                        ${honorsHtml}
                        ${gradeHtml}
                    </div>
                    ${item.description ? `<p class="cvItemDesc">${this.escapeHtml(item.description)}</p>` : ''}
                    ${skillsHtml}
                </div>
            `;

            timelineList.appendChild(itemElement);
        });

        container.appendChild(timelineList);
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

document.addEventListener("DOMContentLoaded", () => {
    CvRenderer.init();
});
