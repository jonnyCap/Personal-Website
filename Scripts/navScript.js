function navBarStick() {
    const navBarContainer = document.getElementsByClassName("navContainer");
    const navBar = document.getElementsByClassName("navInnerContainer");
    const section = document.getElementsByTagName("section");
    const logoContainer = document.getElementsByClassName("logo");
    const navButtons = document.getElementsByClassName("button-53");

    if (navBar.length === 0 || section.length === 0 || logoContainer.length === 0) return;

    let sticky = section[0].offsetTop + 1;
    let isSticky = window.pageYOffset >= sticky;

    if (isSticky) {
        if (!navBar[0].classList.contains("sticky")) {
            navBar[0].classList.add("sticky");
            if (navBarContainer.length > 0) {
                navBarContainer[0].classList.add("stickyOuter");
            }
            logoContainer[0].style.transition = "width 0.1s ease";
            logoContainer[0].style.width = "100px";

            if (section.length > 1) {
                section[1].style.paddingTop = "50px";
            }

            for (let i = 0; i < Math.min(4, navButtons.length); i++) {
                navButtons[i].style.padding = "6px 10px";
            }

            lineHeight.upDownFactor = -1;
            lineHeight.targetPosition = 24;
            if (lineHeight.animating == false) {
                setLineHeight();
            }
        }
    } else {
        if (navBar[0].classList.contains("sticky")) {
            navBar[0].classList.remove("sticky");
            if (navBarContainer.length > 0) {
                navBarContainer[0].classList.remove("stickyOuter");
            }

            logoContainer[0].style.width = "200px";
            logoContainer[0].style.transition = "";

            if (section.length > 1) {
                section[1].style.paddingTop = "0";
            }

            for (let i = 0; i < Math.min(4, navButtons.length); i++) {
                navButtons[i].style.padding = "12px 10px";
            }

            lineHeight.upDownFactor = 0.5;
            lineHeight.targetPosition = 60;
            if (lineHeight.animating == false) {
                setLineHeight();
            }
        }
    }
}

function adaptToWidth() {
    const elem = document.getElementsByClassName("navContainer");
    if (elem.length > 0) {
        if (window.innerWidth < 250 && window.pageYOffset < 1) { 
            elem[0].style.height = "500px";
        } else {
            elem[0].style.height = "";
        }
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
    lineHeight.animating = true;

    function step() {
        if (lineHeight.targetPosition == 24) {
            if (position <= 24) {
                position = 24;
                adaptLineHeight(24);
                setButtonHeightLower();
                lineHeight.animating = false;
                return;
            }
            position += lineHeight.upDownFactor * 2;
            setButtonHeightLower();
            adaptLineHeight(position);
            requestAnimationFrame(step);
        } else if (lineHeight.targetPosition == 60) {
            if (position >= 60) {
                position = 60;
                adaptLineHeight(60);
                setButtonHeightHigher();
                lineHeight.animating = false;
                return;
            }
            position += lineHeight.upDownFactor * 2;
            setButtonHeightHigher();
            adaptLineHeight(position);
            requestAnimationFrame(step);
        }
    }
    requestAnimationFrame(step);
}

function adaptLineHeight(position) {
    lineHeight.animating = true;
    const navLiElements = document.getElementsByTagName("ul");
    if (navLiElements.length > 0) {
        navLiElements[0].style.lineHeight = position + "px";
    }
    lineHeight.currentUlPosition = position;
}

function setButtonHeightLower() {
    const button = document.getElementsByClassName("dropDownButton");
    if (button.length === 0) return;
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
    if (button.length === 0) return;
    if (lineHeight.buttonBottom <= 25) {
        lineHeight.buttonBottom += 0.5;
        button[0].style.paddingBottom = lineHeight.buttonBottom + "px";
    }
    if (lineHeight.buttonTop <= 30) {
        lineHeight.buttonTop += 0.5;
        button[0].style.paddingTop = lineHeight.buttonTop + "px";
    }
}

let navScrollTicking = false;
window.addEventListener("scroll", () => {
    if (!navScrollTicking) {
        requestAnimationFrame(() => {
            navBarStick();
            navScrollTicking = false;
        });
        navScrollTicking = true;
    }
});
