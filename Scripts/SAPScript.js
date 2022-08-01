const SAP = {
    currentPage: 0,
    lastPage: null,
    savedLastPages: [],
    movingDivInterval: null,
    headerChangeAnimationDone: true,
    moveableDivTimeOut: null,
    finalMoveableDivDestination: 0,
    resizeStartSection: function () {
        document.addEventListener('DOMContentLoaded', function () {
            const element = document.getElementsByClassName("secondaryStartSection");
            element[0].style.height = window.innerHeight + "px";
        });
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

        let finalDestination = navElements[SAP.finalMoveableDivDestination].offsetTop + 5;
        let currentDestination = element.offsetTop;
        let movingVektor;

        //SAP.colorSelectedNavElement(SAP.finalMoveableDivDestination);
        SAP.movingDivInterval = setInterval(function () {
            finalDestination = navElements[SAP.finalMoveableDivDestination].offsetTop;
            currentDestination = element.offsetTop;
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
                element.style.top = currentDestination + "px";
            }
        }, 1);
    },
    setUpContent: function () {
        SAP.changeContent();
        //Change inner Html Content
        const header = document.getElementsByClassName("secondaryHeader");
        header[0].innerHTML = text.header[SAP.currentPage];

        const lowerHeader = document.getElementsByClassName("lowerHeader");
        lowerHeader[0].innerHTML = text.lowerHeader[SAP.currentPage];
        //Set final Destination for movable Div
        SAP.finalMoveableDivDestination = SAP.currentPage;
        //set Canvas
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
    modifyButtonStyles: function () {
        const navElements = document.getElementsByClassName("secondaryNavList");
            //modify Styles of buttons
        console.log("button " + SAP.currentPage + "is currently on");

            navElements[SAP.currentPage].style.background = "#e6faff";
            navElements[SAP.currentPage].style.color = "#549bcf";
            navElements[SAP.currentPage].style.marginLeft = "30px";
            if (SAP.lastPage != null) {
                navElements[SAP.lastPage].style.background = "#549bcf";
                navElements[SAP.lastPage].style.color = "white";
                navElements[SAP.lastPage].style.marginLeft = "20px";
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
        //make it visuall that Button is pressed
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
        SAP.changeContent();
        SAP.lessenFontSize();
        //chain Functions
    },
    changeContent: function () {
        //hier muss dann auch noch der Content gewechselt werden! 
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
        const header = document.getElementsByClassName("secondaryHeader");
        header[0].innerHTML = text.header[SAP.currentPage];

        const lowerHeader = document.getElementsByClassName("lowerHeader");
        lowerHeader[0].innerHTML = text.lowerHeader[SAP.currentPage];
        SAP.addNewHeader();
    },
    addNewHeader: function () {
        const headerContainer = document.getElementsByClassName("secondaryHeaderContainer");
        headerContainer[0].style.left = "180%";
        let percent = 180;
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
        let fontSizeLong = header[0].style.fontSize;
        let fontSize = fontSizeLong.replaceAll("px", "");
        let originalFontSize = fontSize;
        let enlargeFontSizeInterval = setInterval(function () {
            if (fontSize > originalFontSize * 2) {
                clearInterval(enlargeFontSizeInterval);
                //Hier werden dann animationen wieder m�glich
                SAP.headerChangeAnimationDone = true;
            } else {
                fontSize = fontSize * 1.01;
                header[0].style.fontSize = fontSize + "px";
            }
        }, 10);
    }
};

const text = {
    header: ["About me", "Team-</br>Selector App", "Personal</br>Website", "Documents","Contact", "Privacy</br>Policy"],
    lowerHeader: ["My Experience so far...", "Android Studio, Team-Selector", "My own Webpage with pure HTML, CSS and Javascript", "CV and Higher School Certificate","Feel free to contact me all the time!", "Everything about your Data!"],
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
const browserStorage = {
    savedPage: 0,
    savePage: function (currentPage) {
        sessionStorage.setItem('currentPage', currentPage);
        console.log(sessionStorage.getItem('currentPage'));
    },
    setPage: function () {
        SAP.currentPage = sessionStorage.getItem('currentPage');
        console.log(sessionStorage.getItem('currentPage'));
    }
};

//Eventlistener
addEventListener('popstate', (event) => {
    //not working so far
    let x = SAP.savedLastPages.length;
    if (x > 0) {
        preventDefault();
    }   
    let currentPage = SAP.savedLastPages[x - 1];
    SAP.currentPage = currentPage;
    browserStorage.savedPage(currentPage);
    //do animation
    SAP.animatePage();
});

document.addEventListener('DOMContentLoaded', function () {
    //�bergangsl�sung bis alle Links funktionieren und dann die "currentPage" angeben
    //browserStorage.savedPage(0);

    //Show right content
    browserStorage.setPage();
    SAP.setUpContent();

    //Do the rest
    SAP.resizeStartSection();
    SAP.setEventListener();
    SAP.setUpMoveableDiv();
    SAP.moveMoveableDiv();
    SAP.modifyButtonStyles(); 
});