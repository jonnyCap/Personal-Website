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
                    if (typeof SAP !== "undefined" && PageIndex != SAP.currentPage) {
                        if (SAP.headerChangeAnimationDone == true) {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                            SAP.headerChangeAnimationDone = false;
                            SAP.setPage(PageIndex);
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
            if (typeof SAP !== "undefined") {
                SAP.currentPage = 0;
            }
        } else {
            if (typeof SAP !== "undefined") {
                SAP.currentPage = parseInt(item, 10) || 0;
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
        let width = window.innerWidth;
        if (width > 1400) {
            MediaRes.size1400 = true;
            MediaRes.size1200 = true;
            MediaRes.size1000 = true;
            MediaRes.size800 = true;
            MediaRes.size400 = true;
        }
        if (width <= 1400 && width > 1200) {
            MediaRes.size1400 = false;
            MediaRes.size1200 = true;
            MediaRes.size1000 = true;
            MediaRes.size800 = true;
            MediaRes.size400 = true;
        }
        if (width <= 1200 && width > 1000) {
            MediaRes.size1400 = false;
            MediaRes.size1200 = false;
            MediaRes.size1000 = true;
            MediaRes.size800 = true;
            MediaRes.size400 = true;
        }
        if (width <= 1000 && width > 800) {
            MediaRes.size1400 = false;
            MediaRes.size1200 = false;
            MediaRes.size1000 = false;
            MediaRes.size800 = true;
            MediaRes.size400 = true;
        }
        if (width <= 800 && width > 420) {
            MediaRes.size1400 = false;
            MediaRes.size1200 = false;
            MediaRes.size1000 = false;
            MediaRes.size800 = false;
            MediaRes.size400 = true;
        }
        if (width <= 420) {
            MediaRes.size1400 = false;
            MediaRes.size1200 = false;
            MediaRes.size1000 = false;
            MediaRes.size800 = false;
            MediaRes.size400 = false;
        }
    }
};

// EventListeners
window.addEventListener("resize", function () {
    let url = window.location.href;
    sizeAdapter.adaptComponents();
    if (url.includes("aboutMePage.html") && typeof SAP !== "undefined") {
        SAP.setUpContent();
        SAP.resetMoveableDivPosition();
        SAP.adaptFontSizeOnStart();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    let url = window.location.href;
    sizeAdapter.adaptComponents();
    if (url.includes("aboutMePage.html") && typeof SAP !== "undefined") {
        SAP.setUpContent();
        SAP.resetMoveableDivPosition();
        SAP.adaptFontSizeOnStart();
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