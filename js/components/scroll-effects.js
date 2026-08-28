/**
 * scroll-effects.js
 * In-place pinned crossfade transition and scroll-reveal observer.
 * Features a relaxed, slower transition pace and a generous dwell zone in the About Me section.
 */

document.addEventListener("DOMContentLoaded", () => {
    const isSecondaryPage = window.location.pathname.includes("about.html") || window.location.pathname.includes("aboutMePage.html") || window.location.href.includes("about.html") || window.location.href.includes("aboutMePage.html");
    const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isSecondaryPage) {
        // Observer for secondary page elements
        if (!("IntersectionObserver" in window)) {
            /** @type {NodeListOf<HTMLElement>} */
            const targets = document.querySelectorAll(".secondaryHeader, .lowerHeader, .scrollButton");
            targets.forEach(el => { el.style.opacity = "1"; });
            return;
        }

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target instanceof HTMLElement) {
                    entry.target.style.transition = "opacity 0.6s ease, transform 0.6s ease";
                    entry.target.style.opacity = "1";
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        });

        document.querySelectorAll(".secondaryHeader, .lowerHeader, .scrollButton").forEach(el => observer.observe(el));
        return;
    }

    // Index.html In-Place Crossfade Scroll Transition
    const heroWrapper = document.getElementById("heroScrollWrapper");
    const heroSection = document.getElementById("heroSection");
    const heroText = document.getElementById("heroTextContainer");
    const heroBg = document.getElementById("heroBgLayer");
    const heroOverlay = document.getElementById("heroOverlay");
    const aboutMeStageLayer = document.getElementById("aboutMeSection");
    const projectsContainer = document.querySelector(".projectsContainer");

    if (heroWrapper && heroSection && heroText && heroBg && aboutMeStageLayer && !prefersReducedMotion) {
        let isTicking = false;

        const updateInPlaceCrossfade = () => {
            const rect = heroWrapper.getBoundingClientRect();
            const scrollDistance = heroWrapper.offsetHeight - window.innerHeight;

            if (scrollDistance > 0) {
                const rawProgress = -rect.top / scrollDistance;
                const progress = Math.min(1, Math.max(0, rawProgress));

                // 1. Header text moves gently to the LEFT and fades out smoothly (starts after initial dwell)
                const textProgress = Math.min(1, Math.max(0, (progress - 0.06) / 0.22));
                const textOpacity = Math.max(0, 1 - textProgress);
                const textTranslateX = textProgress * 220; // pixels to the LEFT
                heroText.style.opacity = textOpacity.toFixed(3);
                heroText.style.transform = `translate(calc(-50% - ${textTranslateX.toFixed(1)}px), 0)`;

                // 2. Cloud background zooms in slightly and dissolves out smoothly
                const zoomProgress = Math.min(1, Math.max(0, (progress - 0.08) / 0.24));
                const bgScale = 1 + zoomProgress * 0.12;
                const bgOpacity = Math.max(0, 1 - zoomProgress);
                heroBg.style.transform = `scale(${bgScale.toFixed(3)})`;
                heroBg.style.opacity = bgOpacity.toFixed(3);

                // 3. Soft white overlay fade
                if (heroOverlay) {
                    const overlayOpacity = Math.min(1, Math.max(0, (progress - 0.08) / 0.22));
                    heroOverlay.style.opacity = overlayOpacity.toFixed(3);
                }

                // 4. Hero section container overall fade out
                const heroContainerOpacity = Math.max(0, 1 - Math.min(1, Math.max(0, (progress - 0.10) / 0.22)));
                heroSection.style.opacity = heroContainerOpacity.toFixed(3);

                // 5. About Me section fades IN gently from background (in-place)
                const aboutProgress = Math.min(1, Math.max(0, (progress - 0.14) / 0.21));
                const aboutScale = 0.97 + aboutProgress * 0.03;
                aboutMeStageLayer.style.opacity = aboutProgress.toFixed(3);
                aboutMeStageLayer.style.transform = `scale(${aboutScale.toFixed(3)})`;

                // 6. Pointer events & stacking context toggle between layers
                if (progress >= 0.22) {
                    heroSection.style.pointerEvents = "none";
                    aboutMeStageLayer.style.pointerEvents = "auto";
                    aboutMeStageLayer.style.zIndex = "4";
                    heroSection.style.zIndex = "1";
                } else {
                    heroSection.style.pointerEvents = "auto";
                    aboutMeStageLayer.style.pointerEvents = "none";
                    aboutMeStageLayer.style.zIndex = "1";
                    heroSection.style.zIndex = "4";
                }

                // 7. Drive Algorithm Playground 3-Stage Progression across the remaining scroll
                if (progress >= 0.30 && window.algorithmPlayground) {
                    const algoProgress = Math.min(1, Math.max(0, (progress - 0.30) / 0.70));
                    window.algorithmPlayground.setScrollProgress(algoProgress);
                }
            } else {
                // Fallback default
                heroText.style.opacity = "1";
                heroText.style.transform = "translate(-50%, 0)";
                heroBg.style.transform = "scale(1)";
                heroBg.style.opacity = "1";
                heroSection.style.opacity = "1";
                heroSection.style.pointerEvents = "auto";
                aboutMeStageLayer.style.opacity = "1";
                aboutMeStageLayer.style.transform = "none";
                aboutMeStageLayer.style.pointerEvents = "auto";
                if (window.algorithmPlayground) {
                    window.algorithmPlayground.setScrollProgress(0);
                }
            }

            isTicking = false;
        };

        const onScroll = () => {
            if (!isTicking) {
                window.requestAnimationFrame(updateInPlaceCrossfade);
                isTicking = true;
            }
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });

        // Run once on init
        updateInPlaceCrossfade();
    }

    // Scroll reveal observer for Projects section
    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target instanceof HTMLElement) {
                    entry.target.style.transition = "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
                    entry.target.style.opacity = "1";
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: "0px 0px -40px 0px"
        });

        if (projectsContainer) revealObserver.observe(projectsContainer);
    } else {
        if (projectsContainer instanceof HTMLElement) {
            projectsContainer.style.opacity = "1";
        }
    }
});
