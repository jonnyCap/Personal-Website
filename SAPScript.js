const SAP = {
    currentPage: 0,
    lastPage: 0,
    movingDivInterval: null,
    headerChangeAnimationDone: true,
    finalMoveableDivDestination: 0,
    setEventListener: function () {
        const navElements = document.getElementsByClassName("secondaryNavList");
        for (let i = 0; i < navElements.length; i++) {
            navElements[i].addEventListener("click", function () {
                if (SAP.headerChangeAnimationDone == true) {
                    SAP.setPage(i);
                    SAP.headerChangeAnimationDone = false;
                }
            });
        }
    },
    moveMoveableDiv: function () {
        console.log("function called");
        clearInterval(SAP.movingDivInterval);
        const element = document.getElementById("moveableBackground");
        const navElements = document.getElementsByClassName("secondaryNavList");

        let finalDestination = navElements[SAP.finalMoveableDivDestination].offsetLeft;
        let currentDestination = element.offsetLeft;
        let movingVektor;
        if (finalDestination > currentDestination) {
            movingVektor = 1;
        } else {
            movingVektor = -1;
        }

        let currentWidth = element.offsetWidth;
        let finalWidth = navElements[SAP.finalMoveableDivDestination].offsetWidth;
        let widthVektor;
        if (currentWidth > finalWidth) {
            widthVektor = -0.7;
        } else {
            widthVektor = 0.7;
        }
        SAP.movingDivInterval = setInterval(function () {
            console.log("moving");
            if (Math.abs(finalDestination - currentDestination) < 1) {
                //safty first make moveable div as long as navLi element
                element.style.width = finalWidth + "px";

                clearInterval(SAP.movingDivInterval);
                if (SAP.finalMoveableDivDestination != SAP.currentPage) {
                    SAP.finalMoveableDivDestination = SAP.currentPage;
                    setTimeout(SAP.moveMoveableDiv, 1200);
                }
            }
            currentDestination += movingVektor;
            element.style.left = currentDestination + "px";
            console.log(currentWidth);
            if (Math.abs(currentWidth - finalWidth) > 5) {
                currentWidth += widthVektor;
                element.style.width = currentWidth + "px";
            } else {
                element.style.width = finalWidth + "px";
            }
        }, 1);
    },
    setUpMoveableDiv: function () {
        const secondaryNav = document.getElementsByClassName("secondaryNavList");
        for (let i = 0; i < secondaryNav.length; i++) {
            secondaryNav[i].addEventListener("mouseover", function () {
                SAP.finalMoveableDivDestination = i;
                SAP.moveMoveableDiv();
            });
        }
        SAP.moveMoveableDiv();
    },
    setPage: function (index) {
        this.lastPage = this.currentPage;
        this.currentPage = index;
        console.log(sDButton.clicked);
        if (sDButton.clicked == false) {
            console.log("closing content");
            sDButton.scrollUp();
            sDButton.clicked = true;
            sDButton.cooledDown = false;
            sDButton.coolDown();
        }
        setTimeout(this.animatePage, 500);
    },
    animatePage: function () {
        SAP.lessenFontSize();
        //chain Functions
    },
    lessenFontSize: function () {
        const header = document.getElementsByClassName("secondaryHeader");
        console.log(header.length);
        let fontSizeLong = header[0].style.fontSize;
        let fontSize = fontSizeLong.replaceAll("px", "");
        let originalFontSize = fontSize;
        let lessenFontSizeInterval = setInterval(function () {
            if (fontSize < originalFontSize * 0.5) {
                clearInterval(lessenFontSizeInterval);
                SAP.removeOldHeader();
            } else {
                fontSize = fontSize * 0.99;
                header[0].style.fontSize = fontSize + "px";
            }
        }, 10);
    },
    removeOldHeader: function () {
        const headerContainer = document.getElementsByClassName("secondaryHeaderContainer");
        let left = headerContainer[0].offsetLeft;
        let width = headerContainer[0].style.width;
        let removeOldHeaderInterval = setInterval(function () {
            if (left < -600) {
                clearInterval(removeOldHeaderInterval);
                SAP.changeInnerHtml();
            } else {
                left -= 10;
                headerContainer[0].style.left = left + "px";
            }
        }, 10);
    },
    changeInnerHtml: function () {
        const header= document.getElementsByClassName("secondaryHeader");
        header[0].innerHTML = text.header[SAP.currentPage];
       //hier muss dann auch noch der Content gewechselt werden! 
        SAP.addNewHeader();
    },
    addNewHeader: function () {
        const headerContainer = document.getElementsByClassName("secondaryHeaderContainer");
        headerContainer[0].style.left = "100%";
        let percent = 100;
        let addNewHeaderInterval = setInterval(function () {
            if (percent <= 50) {
                clearInterval(addNewHeaderInterval);
                SAP.enlargeFontSize();
            } else {
                percent--;
                headerContainer[0].style.left = percent + "%";
            }
        }, 10);
    },
    enlargeFontSize: function () {
        const header = document.getElementsByClassName("secondaryHeader");
        console.log(header.length);
        let fontSizeLong = header[0].style.fontSize;
        let fontSize = fontSizeLong.replaceAll("px", "");
        let originalFontSize = fontSize;
        let enlargeFontSizeInterval = setInterval(function () {
            if (fontSize > originalFontSize * 2) {
                clearInterval(enlargeFontSizeInterval);
                //Hier werden dann animationen wieder möglich
                SAP.headerChangeAnimationDone = true;
            } else {
                fontSize = fontSize * 1.01;
                header[0].style.fontSize = fontSize + "px";
            }
        }, 10);
    }
};

const text = {
    header: ["About me", "Project 1", "Project 2", "Project 3", "Datenschutzerklearung"],
    content: [],
    aboutMeTxt: "",
    project1Txt: "",
    project2Txt: "",
    project3Txt: "",
    Datenschutzerklearung: "",
    setContent: function () {
        //funktioniert so nicht
        text.content.push(text.aboutMeTxt, text.project1Txt, text.project2Txt, text.project3Txt, text.Datenschutzerklearung);
    }
};





//Eventlistener
SAP.setEventListener();
SAP.setUpMoveableDiv();


