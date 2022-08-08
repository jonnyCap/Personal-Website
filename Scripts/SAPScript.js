const SAP = {
    currentPage: 0,
    lastPage: null,
    savedLastPages: [],
    movingDivInterval: null,
    headerChangeAnimationDone: true,
    moveableDivTimeOut: null,
    finalMoveableDivDestination: 0,
    resizeStartSection: function () {
        const element = document.getElementsByClassName("secondaryStartSection");
        element[0].style.height = window.innerHeight + "px";
    },
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
        SAP.modifyButtonStyles();
        clearInterval(SAP.movingDivInterval);
        const element = document.getElementById("moveableBackground");
        const navElements = document.getElementsByClassName("secondaryNavList");
        let finalDestination;
        let currentDestination;
        let movingVektor;
        if (MediaRes.size1400 == true) {
            currentDestination = element.offsetTop;
        } else {
            currentDestination = element.offsetLeft;
        }

        //SAP.colorSelectedNavElement(SAP.finalMoveableDivDestination);
        SAP.movingDivInterval = setInterval(function () {

            if (MediaRes.size1400 == true) {
                currentDestination = element.offsetTop;
                finalDestination = navElements[SAP.finalMoveableDivDestination].offsetTop;
            } else {
                currentDestination = element.offsetLeft;
                finalDestination = navElements[SAP.finalMoveableDivDestination].offsetLeft + 30;
            }
            //movingVektor
            if (finalDestination > currentDestination) {
                movingVektor = 1;
            } else {
                movingVektor = -1;
            }
            if (Math.abs(finalDestination - currentDestination) < 1) {
                currentDestination = finalDestination;
            } else {
                currentDestination += movingVektor;
                if (MediaRes.size1400 == true) {
                    element.style.top = currentDestination + "px";
                } else {
                    element.style.left = currentDestination + "px";
                }
            }
        }, 1);
    },
    setUpContent: function () {
        SAP.changeContent();
        //Change inner HTML Content
        const header = document.getElementsByClassName("secondaryHeader");
        header[0].innerHTML = text.header[SAP.currentPage];

        const lowerHeader = document.getElementsByClassName("lowerHeader");
        lowerHeader[0].innerHTML = text.lowerHeader[SAP.currentPage];
        //Set final Destination for movable Div
        SAP.finalMoveableDivDestination = SAP.currentPage;

        //set Header Height
        SAP.setNewTop(false);
    },
    setUpMoveableDiv: function () {
        const secondaryNav = document.getElementsByClassName("secondaryNavList");
        for (let i = 0; i < secondaryNav.length; i++) {
            secondaryNav[i].addEventListener("mouseover", function () {
                if (i != SAP.currentPage) {
                    if (SAP.headerChangeAnimationDone == true) {
                        if (MediaRes.size1400 == true) {
                            secondaryNav[i].style.marginLeft = "30px";
                        } else {
                            secondaryNav[i].style.bottom = "6px";
                        }
                        SAP.finalMoveableDivDestination = i;
                    }
                }
            });
        }
        for (let i = 0; i < secondaryNav.length; i++) {
            secondaryNav[i].addEventListener("mouseout", function () {
                if (i != SAP.currentPage) {
                    if (SAP.headerChangeAnimationDone == true) {
                        if (MediaRes.size1400 == true) {
                            secondaryNav[i].style.marginLeft = "20px";
                        } else {
                            secondaryNav[i].style.bottom = "0px";
                        }
                        SAP.finalMoveableDivDestination = SAP.currentPage;
                    }
                }
            });
        }

    },
    modifyButtonStyles: function () {
        const navElements = document.getElementsByClassName("secondaryNavList");
        //modify Styles of buttons
        console.log("button " + SAP.currentPage + "is currently on");

        navElements[SAP.currentPage].style.background = "#e6faff";
        navElements[SAP.currentPage].style.color = "#549bcf";
        if (MediaRes.size1400 == true) {
            navElements[SAP.currentPage].style.bottom = "";
            navElements[SAP.currentPage].style.marginLeft = "30px";
        } else {
            navElements[SAP.currentPage].style.bottom = "6px";
            navElements[SAP.currentPage].style.marginLeft = "20px";
        }
        if (SAP.lastPage != null) {
            navElements[SAP.lastPage].style.background = "#549bcf";
            navElements[SAP.lastPage].style.color = "white";
            if (MediaRes.size1400 == true) {
                navElements[SAP.lastPage].style.bottom = "";
                navElements[SAP.lastPage].style.marginLeft = "20px";
            } else {
                navElements[SAP.lastPage].style.bottom = "";
                navElements[SAP.lastPage].style.marginLeft = "20px";
            }
        }
    },
    resetMoveableDivPosition: function () {
        let element = document.getElementById("moveableBackground"); 
        const navElements = document.getElementsByClassName("secondaryNavList");
        let finalHeight = (navElements[SAP.currentPage].offsetTop) + "px";
        let finalWidht = (navElements[SAP.currentPage].offsetLeft + 30) + "px";
        //1400
        if (MediaRes.size1400 == true) {
            element.style.left = "150px";
            element.style.top = finalHeight;
            element.style.bottom = "";
        } else if (MediaRes.size1400 == false && MediaRes.size800 == true) {
            element.style.left = finalWidht;
            element.style.bottom = "-30px";
            element.style.top = "";
        }
        //800
        else if (MediaRes.size800 == false && MediaRes.size400 == true) {
            element.style.left = finalWidht;
            element.style.bottom = "-85px";
            element.style.top = "";
        } else if (MediaRes.size400 == false) {
            element.style.left = finalWidht;
            element.style.bottom = "-160px";
            element.style.top = "";
        }
    },
    setPage: function (index) {
        //save currentPage in local Browser
        browserStorage.savePage(index);
        //save last page so you can go back
        this.lastPage = this.currentPage;
        this.savedLastPages.push(this.lastPage);
        this.currentPage = index;
        SAP.finalMoveableDivDestination = SAP.currentPage;
        //make it visual that Button is pressed
        this.modifyButtonStyles();
        //animate Properties
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
        setTimeout(SAP.changeContent, 1000);
        SAP.lessenFontSize();
        //chain Functions
    },
    changeContent: function () {
        text.setContent(SAP.currentPage);
    },
    lessenFontSize: function () {
        const header = document.getElementsByClassName("secondaryHeader");
        var style = window.getComputedStyle(header[0], null).getPropertyValue('font-size');
        var fontSize = parseFloat(style);
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
        let acceleration = 1;
        let removeOldHeaderInterval = setInterval(function () {
            if (left < -600) {
                clearInterval(removeOldHeaderInterval);
                SAP.changeInnerHtml();
            } else {
                left -= 10 + acceleration;
                acceleration++;
                headerContainer[0].style.left = left + "px";
            }
        }, 10);
    },
    changeInnerHtml: function () {
        const header = document.getElementsByClassName("secondaryHeader");
        header[0].innerHTML = text.header[SAP.currentPage];

        const lowerHeader = document.getElementsByClassName("lowerHeader");
        lowerHeader[0].innerHTML = text.lowerHeader[SAP.currentPage];
        SAP.setNewTop();
    },
    setNewTop: function (index) {
        const headerContainer = document.getElementsByClassName("secondaryHeaderContainer");
        if (MediaRes.size1400 == true) {
            if (text.header[SAP.currentPage].includes("</br>")) {
                headerContainer[0].style.top = "230px";
                headerContainer[0].style.lineHeight = "160px";
            } else {
                headerContainer[0].style.top = "350px";
                headerContainer[0].style.lineHeight = "";
            }
        } else if (MediaRes.size1400 == false) {
            if (text.header[SAP.currentPage].includes("</br>")) {
                headerContainer[0].style.top = "50px";
                headerContainer[0].style.lineHeight = "160px";
            } else {
                headerContainer[0].style.top = "200px";
                headerContainer[0].style.lineHeight = "";
            }
        }
        if (index != false) {
            SAP.addNewHeader();
        }
    },
    addNewHeader: function () {
        const headerContainer = document.getElementsByClassName("secondaryHeaderContainer");
        headerContainer[0].style.left = "180%";
        let percent = 180;
        let acceleration = 2;
        let addNewHeaderInterval = setInterval(function () {
            if (percent <= 50) {
                clearInterval(addNewHeaderInterval);
                SAP.enlargeFontSize();
            } else {
                percent -= 1 + acceleration;
                if (acceleration > 0) {
                    acceleration-= 0.03;
                }
                headerContainer[0].style.left = percent + "%";
            }
        }, 10);
    },
    enlargeFontSize: function () {
       
        const header = document.getElementsByClassName("secondaryHeader");
        let fontSizeLong = header[0].style.fontSize;
        let fontSize = fontSizeLong.replaceAll("px", "");
        let originalFontSize;
        if (MediaRes.size1400 == true) {
            originalFontSize = 170;
        } else if (MediaRes.size1000 == true) {
            originalFontSize = 130;
        } else if (MediaRes.size400 == true) {
            originalFontSize = 110;
        } else {
            originalFontSize = 60;
        }
        let enlargeFontSizeInterval = setInterval(function () {
            if (fontSize > originalFontSize) {
                clearInterval(enlargeFontSizeInterval);
                //Hier werden dann animationen wieder möglich
                SAP.headerChangeAnimationDone = true;
            } else {
                fontSize = fontSize * 1.01;
                header[0].style.fontSize = fontSize + "px";
            }
        }, 10);
    }, 
    adaptFontSizeOnStart: function () {
        let originalFontSize;
        const header = document.getElementsByClassName("secondaryHeader");
        if (MediaRes.size1400 == true) {
            originalFontSize = 170;
        } else if (MediaRes.size1000 == true) {
            originalFontSize = 130;
        } else if (MediaRes.size400 == true) {
            originalFontSize = 110;
        } else {
            originalFontSize = 60;
        }
        header[0].style.fontSize = originalFontSize + "px";
    }
};

const text = {
    header: ["About me", "Team Creator</br>App", "Personal</br>Website", "JS Mini-</br>Games","Contact", "Privacy</br>Policy"],
    lowerHeader: ["My Experience so far...", "Android Studio and Java", "My own Web-page with pure HTML, CSS and JavaScript", "Small crappy Games, no one wants to play...","Feel free to contact me at all times!", "Everything about your Data!"],
    Datenschutzerklearung: "",
    setContent: function (index) {
        const content = document.getElementsByClassName("secondaryContentContainer");
        for (let i = 0; i < text.header.length; i++) {
            if (i == index) {
                console.log("index is" + index);
                journyCanvas.chooseCanvas(index);         
                content[i].style.display = "block";    
            }
            else {
                content[i].style.display = "none";
            }
        }
    }
};


//Eventlistener
document.addEventListener('popstate', (event) => {
    //not working so far
    let x = SAP.savedLastPages.length;
    if (x > 0) {
        event.preventDefault();
    }
    SAP.savedLastPages.pop();
    let currentPage = SAP.savedLastPages[x - 1];
    SAP.currentPage = currentPage;
    browserStorage.savedPage(currentPage);
    //do animation
    SAP.animatePage();
});
//Setup Page
browserStorage.setPage();
SAP.setUpContent();

//Do the rest
SAP.resizeStartSection();
SAP.setEventListener();
SAP.setUpMoveableDiv();
SAP.moveMoveableDiv();
SAP.modifyButtonStyles();
