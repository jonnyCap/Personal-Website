const Links = {
    goToPage: function (index, PageIndex, Height) {
        let url = window.location.href;
        switch (index) {
            case 0:
                if (url.includes("aboutMePage.html") == false) {
                    window.scrollTo({ top: Height, behavior: "smooth" });
                } else {
                    if (Height > 0) {
                        sessionStorage.setItem("targetScroll", Height);
                    }
                    window.location.href = "index.html";
                }
                break;
            case 1:
                if (url.includes("aboutMePage.html")) {
                    if (typeof SPA !== "undefined" && PageIndex != SPA.currentPage) {
                        if (SPA.headerChangeAnimationDone == true) {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                            SPA.headerChangeAnimationDone = false;
                            SPA.setPage(PageIndex);
                        }
                    } else {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                } else { 
                    browserStorage.savePage(PageIndex);
                    window.location.href = "aboutMePage.html";
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
            }
        }
    }
};

const email = {
    messageDisplayCounter: 0,
    confirmationTimeout: null,
    messageTimeout: null,
    clickEmailSubscription: function (event) {
        if (event && event.preventDefault) {
            event.preventDefault();
        }
        let input = document.getElementById("emailInputFooter");
        if (input) {
            input.value = "";
        }
        clearTimeout(email.confirmationTimeout);
        let confirmationText = document.getElementsByClassName("confirmationText");
        if (confirmationText.length > 0) {
            confirmationText[0].style.display = "inline";
            email.confirmationTimeout = setTimeout(function () {
                confirmationText[0].style.display = "";
            }, 3000);
        }
        return false;
    },
    sendMessage: function (event) {
        if (event && event.preventDefault) {
            event.preventDefault();
        }
        let contactSection = document.getElementsByClassName("contactSection");
        if (contactSection.length >= 2) {
            let emailInput = document.getElementById("emailInput");
            let textInput = document.getElementById("textInput");
            if (emailInput) emailInput.value = "";
            if (textInput) textInput.value = "";

            contactSection[0].style.display = "none";
            contactSection[1].style.display = "block";
            clearTimeout(email.messageTimeout);
            email.messageTimeout = setTimeout(function () {
                contactSection[0].style.display = "block";
                contactSection[1].style.display = "none";
            }, 3000);
        }
        return false;
    }
};

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

// EventListeners
let handlerResizeTicking = false;
window.addEventListener("resize", function () {
    if (!handlerResizeTicking) {
        requestAnimationFrame(() => {
            let url = window.location.href;
            sizeAdapter.adaptComponents();
            if (url.includes("aboutMePage.html") && typeof SPA !== "undefined") {
                SPA.setUpContent();
                SPA.resetMoveableDivPosition();
                SPA.adaptFontSizeOnStart();
            }
            handlerResizeTicking = false;
        });
        handlerResizeTicking = true;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    let url = window.location.href;
    sizeAdapter.adaptComponents();
    if (url.includes("aboutMePage.html") && typeof SPA !== "undefined") {
        SPA.setUpContent();
        SPA.resetMoveableDivPosition();
        SPA.adaptFontSizeOnStart();
    } else {
        let targetScroll = sessionStorage.getItem("targetScroll");
        if (targetScroll !== null && targetScroll !== undefined) {
            sessionStorage.removeItem("targetScroll");
            setTimeout(function () {
                window.scrollTo({ top: parseInt(targetScroll, 10), behavior: "smooth" });
            }, 150);
        }
    }
});