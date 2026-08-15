const PAGE_HASHES = ["#about", "#projects", "#contact", "#privacy"];

const SPA = {
    currentPage: 0,
    lastPage: null,
    isTransitioning: false,

    init: function () {
        SPA.syncFromUrlOrStorage();
        SPA.setEventListener();
        SPA.setUpMoveableDiv();
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
            if (SPA.currentPage >= PAGE_HASHES.length) {
                SPA.currentPage = 0;
            }
        }
    },

    setEventListener: function () {
        const navElements = document.querySelectorAll(".secondaryNavList");
        navElements.forEach((btn, index) => {
            btn.addEventListener("click", () => {
                if (index !== SPA.currentPage) {
                    SPA.setPage(index);
                }
            });
        });
    },

    moveMoveableDiv: function () {
        const pill = document.getElementById("moveableBackground");
        const navElements = document.querySelectorAll(".secondaryNavList");
        const targetBtn = navElements[SPA.currentPage];
        if (!pill || !targetBtn) return;

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
        const secondaryNav = document.querySelectorAll(".secondaryNavList");
        secondaryNav.forEach((btn, i) => {
            btn.addEventListener("mouseenter", () => {
                if (i !== SPA.currentPage) {
                    if (MediaRes.size1400) {
                        btn.style.marginLeft = "30px";
                    } else {
                        btn.style.bottom = "6px";
                    }
                }
            });
            btn.addEventListener("mouseleave", () => {
                if (i !== SPA.currentPage) {
                    btn.style.marginLeft = "20px";
                    btn.style.bottom = "";
                }
            });
        });
    },

    updateActiveTabStyles: function () {
        const navElements = document.querySelectorAll(".secondaryNavList");
        navElements.forEach((btn, index) => {
            btn.style.transform = "rotate(-3deg)";
            if (index === SPA.currentPage) {
                btn.style.background = "#e6faff";
                btn.style.color = "#549bcf";
                if (MediaRes.size1400) {
                    btn.style.marginLeft = "30px";
                    btn.style.bottom = "";
                } else {
                    btn.style.marginLeft = "20px";
                    btn.style.bottom = "6px";
                }
            } else {
                btn.style.background = "#549bcf";
                btn.style.color = "#ffffff";
                btn.style.marginLeft = "20px";
                btn.style.bottom = "";
            }
        });
    },

    resetMoveableDivPosition: function () {
        SPA.moveMoveableDiv();
    },

    setPage: function (index, pushHistory = true) {
        if (index < 0 || index >= text.header.length) return;

        SPA.lastPage = SPA.currentPage;
        SPA.currentPage = index;
        browserStorage.savePage(index);

        if (pushHistory && window.location.hash !== PAGE_HASHES[index]) {
            history.pushState({ page: index }, "", PAGE_HASHES[index]);
        }

        SPA.updateActiveTabStyles();
        SPA.moveMoveableDiv();

        // Close expandable content section if open
        if (typeof sDButton !== "undefined" && sDButton.clicked === false) {
            sDButton.scrollUp();
            sDButton.clicked = true;
            sDButton.cooledDown = false;
            sDButton.coolDown();
        }

        SPA.renderCurrentPage(true);
    },

    renderCurrentPage: function (animate = true) {
        const headerContainer = document.querySelector(".secondaryHeaderContainer");
        const header = document.querySelector(".secondaryHeader");
        const lowerHeader = document.querySelector(".lowerHeader");

        if (!animate) {
            if (header) header.innerHTML = text.header[SPA.currentPage];
            if (lowerHeader) lowerHeader.innerHTML = text.lowerHeader[SPA.currentPage];
            text.setContent(SPA.currentPage);
            SPA.adjustHeaderPosition();
            return;
        }

        if (headerContainer) {
            headerContainer.classList.remove("active", "entering");
            headerContainer.classList.add("leaving");
        }

        setTimeout(() => {
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
        }, 150);
    },

    adjustHeaderPosition: function () {
        const headerContainer = document.querySelector(".secondaryHeaderContainer");
        if (!headerContainer) return;

        const hasBreak = /<br\s*\/?>/i.test(text.header[SPA.currentPage]);

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
        if (element) {
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
