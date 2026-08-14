const SPA = {
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
                if (i != SPA.currentPage) {
                    if (SPA.headerChangeAnimationDone == true) {
                        SPA.headerChangeAnimationDone = false;
                        SPA.setPage(i);
                    }
                }
            });
        }
    },
    moveMoveableDiv: function () {
        SPA.modifyButtonStyles();
        if (SPA.movingDivRaf) {
            cancelAnimationFrame(SPA.movingDivRaf);
        }
        const element = document.getElementById("moveableBackground");
        const navElements = document.getElementsByClassName("secondaryNavList");
        if (!element || navElements.length === 0 || !navElements[SPA.finalMoveableDivDestination]) return;

        function step() {
            let currentDestination = (MediaRes.size1400 == true) ? element.offsetTop : element.offsetLeft;
            let finalDestination = (MediaRes.size1400 == true) 
                ? navElements[SPA.finalMoveableDivDestination].offsetTop 
                : (navElements[SPA.finalMoveableDivDestination].offsetLeft + 30);

            let diff = finalDestination - currentDestination;
            if (Math.abs(diff) < 2) {
                if (MediaRes.size1400 == true) {
                    element.style.top = finalDestination + "px";
                } else {
                    element.style.left = finalDestination + "px";
                }
            } else {
                let speed = (diff > 0) ? Math.min(diff, Math.max(3, diff * 0.15)) : Math.max(diff, Math.min(-3, diff * 0.15));
                currentDestination += speed;
                if (MediaRes.size1400 == true) {
                    element.style.top = currentDestination + "px";
                } else {
                    element.style.left = currentDestination + "px";
                }
                SPA.movingDivRaf = requestAnimationFrame(step);
            }
        }
        SPA.movingDivRaf = requestAnimationFrame(step);
    },
    setUpContent: function () {
        SPA.changeContent();
        //Change inner HTML Content
        const header = document.getElementsByClassName("secondaryHeader");
        header[0].innerHTML = text.header[SPA.currentPage];

        const lowerHeader = document.getElementsByClassName("lowerHeader");
        lowerHeader[0].innerHTML = text.lowerHeader[SPA.currentPage];
        //Set final Destination for movable Div
        SPA.finalMoveableDivDestination = SPA.currentPage;

        //set Header Height
        SPA.setNewTop(false);
    },
    setUpMoveableDiv: function () {
        const secondaryNav = document.getElementsByClassName("secondaryNavList");
        for (let i = 0; i < secondaryNav.length; i++) {
            secondaryNav[i].addEventListener("mouseover", function () {
                if (i != SPA.currentPage) {
                    if (SPA.headerChangeAnimationDone == true) {
                        if (MediaRes.size1400 == true) {
                            secondaryNav[i].style.marginLeft = "30px";
                        } else {
                            secondaryNav[i].style.bottom = "6px";
                        }
                        SPA.finalMoveableDivDestination = i;
                    }
                }
            });
        }
        for (let i = 0; i < secondaryNav.length; i++) {
            secondaryNav[i].addEventListener("mouseout", function () {
                if (i != SPA.currentPage) {
                    if (SPA.headerChangeAnimationDone == true) {
                        if (MediaRes.size1400 == true) {
                            secondaryNav[i].style.marginLeft = "20px";
                        } else {
                            secondaryNav[i].style.bottom = "0px";
                        }
                        SPA.finalMoveableDivDestination = SPA.currentPage;
                    }
                }
            });
        }

    },
    modifyButtonStyles: function () {
        const navElements = document.getElementsByClassName("secondaryNavList");
        //modify Styles of buttons

        navElements[SPA.currentPage].style.background = "#e6faff";
        navElements[SPA.currentPage].style.color = "#549bcf";
        if (MediaRes.size1400 == true) {
            navElements[SPA.currentPage].style.bottom = "";
            navElements[SPA.currentPage].style.marginLeft = "30px";
        } else {
            navElements[SPA.currentPage].style.bottom = "6px";
            navElements[SPA.currentPage].style.marginLeft = "20px";
        }
        if (SPA.lastPage != null) {
            navElements[SPA.lastPage].style.background = "#549bcf";
            navElements[SPA.lastPage].style.color = "white";
            if (MediaRes.size1400 == true) {
                navElements[SPA.lastPage].style.bottom = "";
                navElements[SPA.lastPage].style.marginLeft = "20px";
            } else {
                navElements[SPA.lastPage].style.bottom = "";
                navElements[SPA.lastPage].style.marginLeft = "20px";
            }
        }
    },
    resetMoveableDivPosition: function () {
        let element = document.getElementById("moveableBackground"); 
        const navElements = document.getElementsByClassName("secondaryNavList");
        let finalHeight = (navElements[SPA.currentPage].offsetTop) + "px";
        let finalWidht = (navElements[SPA.currentPage].offsetLeft + 30) + "px";
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
        SPA.finalMoveableDivDestination = SPA.currentPage;
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
        setTimeout(SPA.animatePage, 500);
    },
    animatePage: function () {
        setTimeout(SPA.changeContent, 1000);
        SPA.lessenFontSize();
        //chain Functions
    },
    changeContent: function () {
        text.setContent(SPA.currentPage);
    },
    lessenFontSize: function () {
        const header = document.getElementsByClassName("secondaryHeader");
        if (header.length === 0) return;
        var style = window.getComputedStyle(header[0], null).getPropertyValue('font-size');
        var fontSize = parseFloat(style);
        let targetFontSize = fontSize * 0.5;
        function step() {
            if (fontSize <= targetFontSize) {
                header[0].style.fontSize = targetFontSize + "px";
                SPA.removeOldHeader();
            } else {
                fontSize = fontSize * 0.96;
                header[0].style.fontSize = fontSize + "px";
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
    },
    removeOldHeader: function () {
        const headerContainer = document.getElementsByClassName("secondaryHeaderContainer");
        if (headerContainer.length === 0) return;
        let left = headerContainer[0].offsetLeft;
        let acceleration = 1;
        function step() {
            if (left < -600) {
                SPA.changeInnerHtml();
            } else {
                left -= 12 + acceleration;
                acceleration += 0.8;
                headerContainer[0].style.left = left + "px";
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
    },
    changeInnerHtml: function () {
        const header = document.getElementsByClassName("secondaryHeader");
        if (header.length > 0) {
            header[0].innerHTML = text.header[SPA.currentPage];
        }

        const lowerHeader = document.getElementsByClassName("lowerHeader");
        if (lowerHeader.length > 0) {
            lowerHeader[0].innerHTML = text.lowerHeader[SPA.currentPage];
        }
        SPA.setNewTop();
    },
    setNewTop: function (index) {
        const headerContainer = document.getElementsByClassName("secondaryHeaderContainer");
        if (headerContainer.length === 0) return;
        if (MediaRes.size1400 == true) {
            if (/<br\s*\/?>/i.test(text.header[SPA.currentPage]) || text.header[SPA.currentPage].includes("</br>")) {
                headerContainer[0].style.top = "230px";
                headerContainer[0].style.lineHeight = "160px";
            } else {
                headerContainer[0].style.top = "350px";
                headerContainer[0].style.lineHeight = "";
            }
        } else if (MediaRes.size1400 == false) {
            if (/<br\s*\/?>/i.test(text.header[SPA.currentPage]) || text.header[SPA.currentPage].includes("</br>")) {
                headerContainer[0].style.top = "50px";
                headerContainer[0].style.lineHeight = "160px";
            } else {
                headerContainer[0].style.top = "200px";
                headerContainer[0].style.lineHeight = "";
            }
        }
        if (index != false) {
            SPA.addNewHeader();
        }
    },
    addNewHeader: function () {
        const headerContainer = document.getElementsByClassName("secondaryHeaderContainer");
        if (headerContainer.length === 0) return;
        headerContainer[0].style.left = "180%";
        let percent = 180;
        let acceleration = 2;
        function step() {
            if (percent <= 50) {
                headerContainer[0].style.left = "50%";
                SPA.enlargeFontSize();
            } else {
                percent -= 2 + acceleration;
                if (acceleration > 0) {
                    acceleration -= 0.05;
                }
                headerContainer[0].style.left = percent + "%";
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
    },
    enlargeFontSize: function () {
        const header = document.getElementsByClassName("secondaryHeader");
        if (header.length === 0) return;
        let fontSize = parseFloat(header[0].style.fontSize) || 40;
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
        function step() {
            if (fontSize >= originalFontSize) {
                header[0].style.fontSize = originalFontSize + "px";
                SPA.headerChangeAnimationDone = true;
            } else {
                fontSize = fontSize * 1.04;
                header[0].style.fontSize = fontSize + "px";
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
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
    privacyPolicy: "",
    setContent: function (index) {
        const content = document.getElementsByClassName("secondaryContentContainer");
        for (let i = 0; i < text.header.length; i++) {
            if (i == index) {
                journeyCanvas.chooseCanvas(index);         
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
    let x = SPA.savedLastPages.length;
    if (x > 0) {
        event.preventDefault();
    }
    SPA.savedLastPages.pop();
    let currentPage = SPA.savedLastPages[x - 1];
    SPA.currentPage = currentPage;
    browserStorage.savePage(currentPage);
    //do animation
    SPA.animatePage();
});
//Setup Page
browserStorage.setPage();
SPA.setUpContent();

//Do the rest
SPA.resizeStartSection();
SPA.setEventListener();
SPA.setUpMoveableDiv();
SPA.moveMoveableDiv();
SPA.modifyButtonStyles();

// Backward compatibility alias
const SAP = SPA;
