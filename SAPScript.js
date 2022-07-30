const SAP = {
    currentPage: 0,
    lastPage: null,
    movingDivInterval: null,
    headerChangeAnimationDone: true,
    moveableDivTimeOut: null,
    finalMoveableDivDestination: 0,
    setEventListener: function () {
        const navElements = document.getElementsByClassName("secondaryNavList");
        for (let i = 0; i < navElements.length; i++) {
            navElements[i].addEventListener("click", function () {
                if (i != SAP.currentPage) {
                    if (SAP.headerChangeAnimationDone == true) {
                        SAP.headerChangeAnimationDone = false;
                        SAP.setPage(i);
                    }
                }
            });
        }
    },
    moveMoveableDiv: function () {
        console.log("function called");
        SAP.modifyButtonStyles();
        clearInterval(SAP.movingDivInterval);
        const element = document.getElementById("moveableBackground");
        const navElements = document.getElementsByClassName("secondaryNavList");

        let finalDestination = navElements[SAP.finalMoveableDivDestination].offsetTop + 5;
        let currentDestination = element.offsetTop;
        let movingVektor;
        
        // set Color
        //SAP.colorSelectedNavElement(SAP.finalMoveableDivDestination);
        SAP.movingDivInterval = setInterval(function () {
            finalDestination = navElements[SAP.finalMoveableDivDestination].offsetTop + 5;
            currentDestination = element.offsetTop;
            //movingVektor
            if (finalDestination > currentDestination) {
                movingVektor = 1;
            } else {
                movingVektor = -1;
            }
            finalDestination = navElements[SAP.finalMoveableDivDestination].offsetTop + 5;
            console.log("moving");
            if (Math.abs(finalDestination - currentDestination) < 1) {
                currentDestination = finalDestination;
            } else {
                currentDestination += movingVektor;
                element.style.top = currentDestination + "px";
            }
        }, 1);
    },
    setUpMoveableDiv: function () {
        
        const secondaryNav = document.getElementsByClassName("secondaryNavList");
        for (let i = 0; i < secondaryNav.length; i++) {
            secondaryNav[i].addEventListener("mouseover", function () {
                if (i != SAP.currentPage) {
                    if (SAP.headerChangeAnimationDone == true) {
                        secondaryNav[i].style.marginLeft = "30px";
                        SAP.finalMoveableDivDestination = i;
                    }
                }
            });
        }
        for (let i = 0; i < secondaryNav.length; i++) {
            secondaryNav[i].addEventListener("mouseout", function () {
                if (i != SAP.currentPage) {
                    if (SAP.headerChangeAnimationDone == true) {
                        secondaryNav[i].style.marginLeft = "20px";
                        SAP.finalMoveableDivDestination = SAP.currentPage;
                    }
                }
            });
        }
       
    },
    modifyButtonStyles: function (index) {
        const navElements = document.getElementsByClassName("secondaryNavList");
            //modify Styles of buttons
            navElements[SAP.currentPage].style.background = "white";
            navElements[SAP.currentPage].style.color = "#549bcf";
            navElements[SAP.currentPage].style.marginLeft = "30px";
            if (SAP.lastPage != null) {
                navElements[SAP.lastPage].style.background = "#549bcf";
                navElements[SAP.lastPage].style.color = "white";
                navElements[SAP.lastPage].style.marginLeft = "20px";
            }     
    },
    setPage: function (index) {
        this.lastPage = this.currentPage;
        this.currentPage = index;
        SAP.finalMoveableDivDestination = SAP.currentPage;
        //make it visuall that Button is pressed
        this.modifyButtonStyles();
        //animate Properties
        console.log(sDButton.clicked);
        if (sDButton.clicked == false) {
            //Closing Content Section
            sDButton.scrollUp();
            sDButton.clicked = true;
            sDButton.cooledDown = false;
            sDButton.coolDown();
        }
        setTimeout(SAP.animatePage, 500);
    },
    animatePage: function () {
        SAP.lessenFontSize();
        //chain Functions
    },
    lessenFontSize: function () {
        const header = document.getElementsByClassName("secondaryHeader");
        console.log(header.length);
        var style = window.getComputedStyle(header[0], null).getPropertyValue('font-size');
        var fontSize = parseFloat(style);
        let originalFontSize = fontSize;
        console.log(style);
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
SAP.moveMoveableDiv();