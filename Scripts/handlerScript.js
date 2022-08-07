const Links = {
    goToPage: function (index, PageIndex, Height) {
        let url = window.location.href;
        switch (index) {
            case 0:
                if (url.includes("mainPage.html")) {
                    window.scrollTo(0, Height);
                } else {
                    window.location.href = "mainPage.html";
                    window.scrollTo(0, Height);
                }
                
                break;
            case 1:
                if (url.includes("aboutMePage.html")) {
                    if (PageIndex != SAP.currentPage) {
                        if (SAP.headerChangeAnimationDone == true) {
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
        console.log(sessionStorage.getItem('currentPage'));
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
