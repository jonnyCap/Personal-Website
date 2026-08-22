/**
 * navigation.js
 * Global page transitions, session storage persistence, responsive size adapters, and contact form handling.
 */

const PAGE_HASH_NAMES = ["#about", "#projects", "#contact", "#privacy"];

const Links = {
    goToPage: function (index, PageIndex, Height) {
        const isAboutMe = window.location.pathname.includes("about.html") || window.location.pathname.includes("aboutMePage.html") || window.location.href.includes("about.html") || window.location.href.includes("aboutMePage.html");
        
        switch (index) {
            case 0: // Home page navigation
                if (!isAboutMe) {
                    if (Height === 0) {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    } else if (Height >= 1400) {
                        const proj = document.getElementById("projectsSection");
                        if (proj) proj.scrollIntoView({ behavior: "smooth" });
                        else window.scrollTo({ top: Height, behavior: "smooth" });
                    } else {
                        const about = document.getElementById("aboutMeSection");
                        if (about) about.scrollIntoView({ behavior: "smooth" });
                        else window.scrollTo({ top: Height, behavior: "smooth" });
                    }
                } else {
                    if (Height > 0) {
                        sessionStorage.setItem("targetScroll", Height);
                    }
                    window.location.href = "index.html";
                }
                break;

            case 1: // About Me / Contact / Privacy navigation
                const safeIndex = (typeof PageIndex === "number" && PageIndex >= 0 && PageIndex < PAGE_HASH_NAMES.length) ? PageIndex : 0;
                const targetHash = PAGE_HASH_NAMES[safeIndex] || "#about";
                
                if (isAboutMe) {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    if (typeof SPA !== "undefined") {
                        SPA.setPage(safeIndex);
                    }
                } else { 
                    browserStorage.savePage(safeIndex);
                    window.location.href = "about.html" + targetHash;
                }
                break;
        }
    }
};

const browserStorage = {
    savedPage: 0,
    savePage: function (currentPage) {
        sessionStorage.setItem('currentPage', currentPage);
    },
    setPage: function () {
        const item = sessionStorage.getItem('currentPage');
        if (item === null || item === undefined) {
            sessionStorage.setItem('currentPage', '0');
            if (typeof SPA !== "undefined") {
                SPA.currentPage = 0;
            }
        } else {
            if (typeof SPA !== "undefined") {
                SPA.currentPage = parseInt(item, 10) || 0;
                if (SPA.currentPage >= PAGE_HASH_NAMES.length) {
                    SPA.currentPage = 0;
                }
            }
        }
    }
};

const emailHandler = {
    messageTimeout: null,
    isSending: false,
    recipient: "maier.jonathanelias@gmail.com",
    
    sendMessage: function (event) {
        if (event) {
            if (event.preventDefault) event.preventDefault();
            if (event.stopPropagation) event.stopPropagation();
        }
        if (emailHandler.isSending) return false;

        const emailInput = document.getElementById("emailInput");
        const textInput = document.getElementById("textInput");
        const sendBtn = document.getElementById("emailSendButton");
        const senderEmail = emailInput ? emailInput.value.trim() : "";
        const senderMessage = textInput ? textInput.value.trim() : "";

        if (!senderEmail || !senderMessage) return false;

        emailHandler.isSending = true;
        if (emailInput) emailInput.value = "";
        if (textInput) textInput.value = "";
        if (sendBtn) {
            sendBtn.disabled = true;
            sendBtn.innerText = "Sending...";
        }

        // Asynchronously dispatch contact form message via FormSubmit AJAX API
        fetch("https://formsubmit.co/ajax/" + emailHandler.recipient, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                email: senderEmail,
                message: senderMessage,
                _subject: "New Message from Portfolio Website: " + senderEmail
            })
        }).catch(function () {}).finally(function () {
            emailHandler.isSending = false;
            if (sendBtn) {
                sendBtn.disabled = false;
                sendBtn.innerText = "Send";
            }
            const contactSection = document.getElementsByClassName("contactSection");
            if (contactSection.length >= 2) {
                contactSection[0].style.display = "none";
                contactSection[1].style.display = "block";
                clearTimeout(emailHandler.messageTimeout);
                emailHandler.messageTimeout = setTimeout(function () {
                    contactSection[0].style.display = "block";
                    contactSection[1].style.display = "none";
                }, 5000);
            }
        });

        return false;
    }
};
window.emailHandler = emailHandler;

const MediaRes = {
    size1400: true,
    size1200: true,
    size1000: true,
    size800: true,
    size400: true,
};

const sizeAdapter = {
    adaptComponents: function () {
        MediaRes.size1400 = window.matchMedia("(min-width: 1401px)").matches;
        MediaRes.size1200 = window.matchMedia("(min-width: 1201px)").matches;
        MediaRes.size1000 = window.matchMedia("(min-width: 1001px)").matches;
        MediaRes.size800 = window.matchMedia("(min-width: 801px)").matches;
        MediaRes.size400 = window.matchMedia("(min-width: 421px)").matches;
    }
};

// Responsive Resize & Load Listeners
let handlerResizeTicking = false;
window.addEventListener("resize", function () {
    if (!handlerResizeTicking) {
        requestAnimationFrame(() => {
            sizeAdapter.adaptComponents();
            if (typeof SPA !== "undefined" && typeof SPA.moveMoveableDiv === "function") {
                SPA.moveMoveableDiv();
                SPA.adjustHeaderPosition();
            }
            handlerResizeTicking = false;
        });
        handlerResizeTicking = true;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    sizeAdapter.adaptComponents();
    
    const targetScroll = sessionStorage.getItem("targetScroll");
    if (targetScroll !== null && targetScroll !== undefined) {
        sessionStorage.removeItem("targetScroll");
        setTimeout(function () {
            const scrollVal = parseInt(targetScroll, 10);
            if (scrollVal >= 1400) {
                const proj = document.getElementById("projectsSection");
                if (proj) proj.scrollIntoView({ behavior: "smooth" });
                else window.scrollTo({ top: scrollVal, behavior: "smooth" });
            } else if (scrollVal > 0) {
                const about = document.getElementById("aboutMeSection");
                if (about) about.scrollIntoView({ behavior: "smooth" });
                else window.scrollTo({ top: scrollVal, behavior: "smooth" });
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }, 150);
    }
});