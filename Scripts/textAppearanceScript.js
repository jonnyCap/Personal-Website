/**
 * textAppearanceScript.js
 * Clean, lightweight scroll reveal observer using IntersectionObserver.
 */

document.addEventListener("DOMContentLoaded", () => {
    const isSecondaryPage = window.location.pathname.includes("aboutMePage.html") || window.location.href.includes("aboutMePage.html");

    if (!("IntersectionObserver" in window)) {
        // Fallback for older browsers
        const targets = document.querySelectorAll(".startContainer, .aboutMeContainer, .projectsContainer, .secondaryHeader, .lowerHeader");
        targets.forEach(el => el.style.opacity = "1");
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transition = "opacity 0.6s ease, transform 0.6s ease";
                entry.target.style.opacity = (entry.target.classList.contains("aboutMeContainer") && window.innerWidth < 1200) ? "0.85" : "1";
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    const selector = isSecondaryPage 
        ? ".secondaryHeader, .lowerHeader, .scrollButton" 
        : ".startContainer, .aboutMeContainer, .projectsContainer";

    document.querySelectorAll(selector).forEach(el => observer.observe(el));
});
