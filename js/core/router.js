/**
 * router.js
 * Client-side hash routing, history API synchronization, and section navigation.
 */

const PAGE_HASHES = ["#about", "#projects", "#contact", "#privacy"];

const SPA = {
    currentPage: 0,
    lastPage: null,
    renderTimer: null,

    init: function () {
        SPA.syncFromUrlOrStorage();
        SPA.setEventListener();
        SPA.updateActiveTabStyles();
        SPA.moveMoveableDiv();
        SPA.renderCurrentPage(false);
    },

    syncFromUrlOrStorage: function () {
        const hash = window.location.hash.toLowerCase();
        const hashIdx = PAGE_HASHES.indexOf(hash);
        if (hashIdx !== -1) {
            SPA.currentPage = hashIdx;
            browserStorage.savePage(hashIdx);
        } else {
            const saved = sessionStorage.getItem("currentPage");
            SPA.currentPage = saved !== null ? (parseInt(saved, 10) || 0) : 0;
            if (SPA.currentPage >= PAGE_HASHES.length || SPA.currentPage < 0) {
                SPA.currentPage = 0;
            }
        }
    },

    setEventListener: function () {
        const navElements = document.querySelectorAll(".secondaryNavList");
        navElements.forEach((btn, index) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                SPA.setPage(index);
            });
        });
    },

    moveMoveableDiv: function () {
        const pill = document.getElementById("moveableBackground");
        /** @type {NodeListOf<HTMLElement>} */
        const navElements = document.querySelectorAll(".secondaryNavList");
        if (!pill || navElements.length === 0) return;

        const targetBtn = navElements[SPA.currentPage] || navElements[0];
        if (!targetBtn) return;

        if (MediaRes.size1400) {
            pill.style.top = targetBtn.offsetTop + "px";
            pill.style.left = "150px";
            pill.style.bottom = "";
        } else {
            const leftPos = targetBtn.offsetLeft + (targetBtn.offsetWidth / 2) - 25;
            pill.style.left = leftPos + "px";
            pill.style.top = (targetBtn.offsetTop + targetBtn.offsetHeight + 6) + "px";
            pill.style.bottom = "";
        }
    },

    setUpMoveableDiv: function () {
        // Handled cleanly via CSS .secondaryNavList.active and :hover styles
    },

    updateActiveTabStyles: function () {
        /** @type {NodeListOf<HTMLElement>} */
        const navElements = document.querySelectorAll(".secondaryNavList");
        navElements.forEach((btn, index) => {
            // Remove lingering inline styles so CSS rules apply cleanly
            btn.style.background = "";
            btn.style.color = "";
            btn.style.marginLeft = "";
            btn.style.bottom = "";

            if (index === SPA.currentPage) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
    },

    resetMoveableDivPosition: function () {
        SPA.moveMoveableDiv();
    },

    setPage: function (index, pushHistory = true) {
        if (index < 0 || index >= text.header.length) return;

        if (SPA.renderTimer) {
            clearTimeout(SPA.renderTimer);
            SPA.renderTimer = null;
        }

        SPA.lastPage = SPA.currentPage;
        SPA.currentPage = index;
        browserStorage.savePage(index);

        if (pushHistory && window.location.hash !== PAGE_HASHES[index]) {
            history.pushState({ page: index }, "", PAGE_HASHES[index]);
        }

        SPA.updateActiveTabStyles();
        SPA.moveMoveableDiv();

        SPA.renderCurrentPage(true);
    },

    renderCurrentPage: function (animate = true) {
        const headerContainer = document.querySelector(".secondaryHeaderContainer");
        const header = document.querySelector(".secondaryHeader");
        const lowerHeader = document.querySelector(".lowerHeader");

        if (SPA.renderTimer) {
            clearTimeout(SPA.renderTimer);
            SPA.renderTimer = null;
        }

        if (!animate) {
            if (header) header.innerHTML = text.header[SPA.currentPage];
            if (lowerHeader) lowerHeader.innerHTML = text.lowerHeader[SPA.currentPage];
            text.setContent(SPA.currentPage);
            SPA.adjustHeaderPosition();
            if (headerContainer) {
                headerContainer.classList.remove("leaving", "entering");
                headerContainer.classList.add("active");
            }
            return;
        }

        if (headerContainer) {
            headerContainer.classList.remove("active", "entering");
            headerContainer.classList.add("leaving");
        }

        SPA.renderTimer = setTimeout(() => {
            if (header) header.innerHTML = text.header[SPA.currentPage];
            if (lowerHeader) lowerHeader.innerHTML = text.lowerHeader[SPA.currentPage];
            text.setContent(SPA.currentPage);
            SPA.adjustHeaderPosition();

            if (headerContainer) {
                headerContainer.classList.remove("leaving");
                headerContainer.classList.add("entering");

                requestAnimationFrame(() => {
                    headerContainer.classList.remove("entering");
                    headerContainer.classList.add("active");
                });
            }
            SPA.renderTimer = null;
        }, 120);
    },

    adjustHeaderPosition: function () {
        const headerContainer = document.querySelector(".secondaryHeaderContainer");
        if (!(headerContainer instanceof HTMLElement)) return;

        const hasBreak = /<br\s*\/?>/i.test(text.header[SPA.currentPage] || "");

        if (MediaRes.size1400) {
            headerContainer.style.top = hasBreak ? "230px" : "340px";
            headerContainer.style.lineHeight = "";
        } else {
            headerContainer.style.top = hasBreak ? "60px" : "180px";
            headerContainer.style.lineHeight = "";
        }
    },

    setUpContent: function () {
        SPA.renderCurrentPage(false);
    },

    resizeStartSection: function () {
        const element = document.querySelector(".secondaryStartSection");
        if (element instanceof HTMLElement) {
            element.style.minHeight = window.innerHeight + "px";
        }
    },

    adaptFontSizeOnStart: function () {}
};

const text = {
    header: [
        "About Me",
        "Projects",
        "Contact",
        "Privacy<br/>Policy"
    ],
    lowerHeader: [
        "My Experience so far...",
        "Featured engineering projects & open-source work",
        "Feel free to contact me at all times!",
        "Information about Data Privacy & Security"
    ],
    setContent: function (index) {
        /** @type {NodeListOf<HTMLElement>} */
        const containers = document.querySelectorAll(".secondaryContentContainer");
        containers.forEach((el, i) => {
            if (i === index) {
                el.style.display = "block";
                requestAnimationFrame(() => {
                    el.classList.add("active");
                });
                if (i === 0) {
                    if (typeof CvRenderer !== "undefined" && typeof CvRenderer.init === "function") {
                        CvRenderer.init();
                    }
                    if (typeof journeyCanvas !== "undefined" && journeyCanvas.chooseCanvas) {
                        journeyCanvas.chooseCanvas(0);
                    }
                }
                if (i === 1 && typeof ProjectsRenderer !== "undefined" && typeof ProjectsRenderer.init === "function") {
                    ProjectsRenderer.init();
                }
            } else {
                el.classList.remove("active");
                el.style.display = "none";
            }
        });
    }
};

// URL Hash & History Navigation
window.addEventListener("popstate", () => {
    SPA.syncFromUrlOrStorage();
    SPA.setPage(SPA.currentPage, false);
});

window.addEventListener("hashchange", () => {
    SPA.syncFromUrlOrStorage();
    SPA.setPage(SPA.currentPage, false);
});

document.addEventListener("DOMContentLoaded", () => {
    SPA.init();
});

// Backward compatibility alias
const SAP = SPA;

