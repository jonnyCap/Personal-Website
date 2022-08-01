 function navBarStick() {
    const navBarContainer = document.getElementsByClassName("navContainer");
    const navBar = document.getElementsByClassName("navInnerContainer");
    const section = document.getElementsByTagName("section");
    const logoContainer = document.getElementsByClassName("logo");
    const navButtons = document.getElementsByClassName("button-53");

    let sticky = section[0].offsetTop + 1;

    if (window.pageYOffset >= sticky) {
        navBar[0].classList.add("sticky");
        navBarContainer[0].classList.add("stickyOuter");
        //adapt the transition of logo
        logoContainer[0].style.transition = "width 0.1s ease";
        logoContainer[0].style.width = "100px";

        //to avoid this little jump the start section gets a margin-top while navbar is sticky
        section[1].style.paddingTop = "50px";

        for (let i = 0; i < 4; i++) {
            navButtons[i].style.padding = "6px 10px";
        }

        lineHeight.upDownFactor = -1;
        lineHeight.targetPosition = 24;
        if (lineHeight.animating == false) {
            setLineHeight();
        }
    } else {
        navBar[0].classList.remove("sticky");
        navBarContainer[0].classList.remove("stickyOuter");

        logoContainer[0].style.width = "200px";
        logoContainer[0].style.transition = "";

        section[1].style.paddingTop = "0";
        for (let i = 0; i < 4; i++) {
            setTimeout(function () { navButtons[i].style.padding = "7px 10px" }, 100);
            setTimeout(function () { navButtons[i].style.padding = "8px 10px" }, 200);
            setTimeout(function () { navButtons[i].style.padding = "9px 10px" }, 300);
            setTimeout(function () { navButtons[i].style.padding = "10px 10px" }, 400);
            setTimeout(function () { navButtons[i].style.padding = "11px 10px" }, 500);
            setTimeout(function () { navButtons[i].style.padding = "12px 10px" }, 600);
        }

        lineHeight.upDownFactor = 0.2;
        lineHeight.targetPosition = 60;
        if (lineHeight.animating == false) {
                setLineHeight();
        }
    }

}
function adaptToWidth() {
    const elem = document.getElementsByClassName("navContainer");
    if (window.innerWidth < 250 && windowPage.offsetTop < 1) { 
        elem[0].style.height = "500px";
    } else {
        elem[0].style.height = "";
    }
}
const lineHeight = {
    currentlyGoingHigher: false,
    animating: false,
    currentUlPosition: 50,
    buttonTop: 30,
    buttonBottom: 25,
    targetPosition: 60,
    upDownFactor: 0,
};
function setLineHeight() {    
    let position = lineHeight.currentUlPosition;
    let interval = setInterval(function () {
        if (lineHeight.targetPosition == 24) {
            if (position <= lineHeight.targetPosition) {
                clearInterval(interval);
                lineHeight.animating = false;
            } else {
                setButtonHeightLower();
                adaptLineHeight(position);
                position += lineHeight.upDownFactor;
            }
        }else if (lineHeight.targetPosition == 60) {
            if (position >= lineHeight.targetPosition) {
                clearInterval(interval);
                lineHeight.animating = false;
            } else {
                setButtonHeightHigher();
                adaptLineHeight(position);
                position += lineHeight.upDownFactor;
            }
        }
        
    }, 1);
}
function adaptLineHeight(position) {
    lineHeight.animating = true;
    const navLiElements = document.getElementsByTagName("ul");
    navLiElements[0].style.lineHeight = position + "px";
    lineHeight.currentUlPosition = position;
}
function setButtonHeightLower() {
    const button = document.getElementsByClassName("dropDownButton");
    if (lineHeight.buttonBottom >= 6) {
        lineHeight.buttonBottom -= 2;
        button[0].style.paddingBottom = lineHeight.buttonBottom + "px";
    }
    if (lineHeight.buttonTop >= 10) {
        lineHeight.buttonTop -= 0.5;
        button[0].style.paddingTop = lineHeight.buttonTop + "px";
    }
}
function setButtonHeightHigher() {
    const button = document.getElementsByClassName("dropDownButton");
    if (lineHeight.buttonBottom <= 25) {
        lineHeight.buttonBottom += 0.2;
        button[0].style.paddingBottom = lineHeight.buttonBottom + "px";
    }
    if (lineHeight.buttonTop <= 30) {
        lineHeight.buttonTop += 0.2;
        button[0].style.paddingTop = lineHeight.buttonTop + "px";
    }
}




window.addEventListener("scroll", navBarStick);
//window.addEventListener("resize", adaptToWidth); //muss hier geändert werde
