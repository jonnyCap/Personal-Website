const Links = {
    goToPage: function (index, PageIndex, Height) {
        let url = window.location.href;
        switch (index) {
            case 0:
                if (url.includes("aboutMePage.html" == false)) {
                    window.scrollTo(0, Height);
                } else {
                    window.location.href = "index.html";
                    setTimeout(function () {
                        window.scrollTo(0, Height);
                    }, 200);
                }
                break;
            case 1:
                if (url.includes("aboutMePage.html")) {
                    if (PageIndex != SAP.currentPage) {
                        if (SAP.headerChangeAnimationDone == true) {
                            window.scrollTo(0, 0);
                            SAP.headerChangeAnimationDone = false;
                            SAP.setPage(PageIndex);
                        }
                    } else {
                        window.scrollTo(0, 0);
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
        if (sessionStorage.getItem('currentPage') == undefined) {
            sessionStorage.setItem('currentPage', 0);
        }
        SAP.currentPage = sessionStorage.getItem('currentPage');

    }
};

const email = {
    messageDisplayCounter: 0,
    confirmationTimeout: null,
    messageTimeout: null,
    clickEmailSubscription: function () {
        //clear Input Field
        let input = document.getElementById("emailInputFooter");
        input.value = "";
        //reset TImer
        clearTimeout(email.confirmationTimeout);
        let confirmationText = document.getElementsByClassName("confirmationText");
        confirmationText[0].style.display = "inline";
        email.confirmationTimeout = setTimeout(function () {
            confirmationText[0].style.display = "";
        }, 3000);
    },
    sendMessage: function (e) {
        let contactSection = document.getElementsByClassName("contactSection");
        contactSection[0].style.display = "none";
        contactSection[1].style.display = "block";
        email.messageTimeout = setTimeout(function () {
            contactSection[0].style.display = "block";
            contactSection[1].style.display = "none";
        }, 3000);
    }
};
const MediaRes = {
    size1400: true,
    size1200: true,
    size1000: true,
    size1800: true,
   size400: true,
}
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
        if (width < 1400 && width > 1200) {
            MediaRes.size1400 = false;
            MediaRes.size1200 = true;
            MediaRes.size1000 = true;
            MediaRes.size800 = true;
            MediaRes.size400 = true;
        }
        if (width < 1200 && width > 1000) {
            MediaRes.size1400 = false;
            MediaRes.size1200 = false;
            MediaRes.size1000 = true;
            MediaRes.size800 = true;
            MediaRes.size400 = true;
        }
        if (width < 1000 && width > 800) {
            MediaRes.size1400 = false;
            MediaRes.size1200 = false;
            MediaRes.size1000 = false;
            MediaRes.size800 = true;
            MediaRes.size400 = true;
        }
        if (width < 800 && width > 400) {
            MediaRes.size1400 = false;
            MediaRes.size1200 = false;
            MediaRes.size1000 = false;
            MediaRes.size800 = false;
            MediaRes.size400 = true;
        }
        if (width < 420) {
            MediaRes.size1400 = false;
            MediaRes.size1200 = false;
            MediaRes.size1000 = false;
            MediaRes.size800 = false;
            MediaRes.size400 = false;
        }
    }
};
//EventListener
window.onresize = function () {
    let url = window.location.href;
    sizeAdapter.adaptComponents();
    if (url.includes("aboutMePage.html")) {
        SAP.setUpContent();
        SAP.resetMoveableDivPosition();
        SAP.adaptFontSizeOnStart();
    }
};
document.addEventListener("DOMContentLoaded", function () {
    let url = window.location.href;
    sizeAdapter.adaptComponents();
    if (url.includes("aboutMePage.html")) {
        SAP.setUpContent();
        SAP.resetMoveableDivPosition();
        SAP.adaptFontSizeOnStart();
    }
});