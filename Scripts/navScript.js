// Sticky / Scrolled Navbar State Controller
function initNavbarScroll() {
    const navContainer = document.querySelector(".navContainer");
    const navInner = document.querySelector(".navInnerContainer");
    if (!navContainer) return;

    const SCROLL_ENTER_THRESHOLD = 20;
    const SCROLL_EXIT_THRESHOLD = 8;
    let isCurrentlyScrolled = false;

    function handleScroll() {
        const scrollY = window.scrollY || window.pageYOffset || 0;

        if (!isCurrentlyScrolled && scrollY > SCROLL_ENTER_THRESHOLD) {
            isCurrentlyScrolled = true;
            navContainer.classList.add("scrolled", "stickyOuter");
            if (navInner) navInner.classList.add("sticky");
        } else if (isCurrentlyScrolled && scrollY < SCROLL_EXIT_THRESHOLD) {
            isCurrentlyScrolled = false;
            navContainer.classList.remove("scrolled", "stickyOuter");
            if (navInner) navInner.classList.remove("sticky");
        }
    }

    let ticking = false;
    window.addEventListener("scroll", () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Initial check on load
    handleScroll();
}

// Dropdown click-to-open and click-to-close toggle
function initDropDownToggle() {
    const dropDownButtons = document.querySelectorAll(".dropDownButton");
    dropDownButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const parent = btn.closest(".dropDown");
            const content = parent ? parent.querySelector(".dropDownContent") : null;
            if (content) {
                const isShown = content.classList.toggle("show");
                btn.classList.toggle("active", isShown);
            }
        });
    });

    // Close when clicking any dropdown navigation item
    const dropLinks = document.querySelectorAll(".dropA");
    dropLinks.forEach(link => {
        link.addEventListener("click", () => {
            document.querySelectorAll(".dropDownContent.show").forEach(menu => {
                menu.classList.remove("show");
            });
            document.querySelectorAll(".dropDownButton.active").forEach(btn => {
                btn.classList.remove("active");
            });
        });
    });

    // Close when clicking anywhere outside the menu
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".dropDown")) {
            document.querySelectorAll(".dropDownContent.show").forEach(menu => {
                menu.classList.remove("show");
            });
            document.querySelectorAll(".dropDownButton.active").forEach(btn => {
                btn.classList.remove("active");
            });
        }
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        initNavbarScroll();
        initDropDownToggle();
    });
} else {
    initNavbarScroll();
    initDropDownToggle();
}
