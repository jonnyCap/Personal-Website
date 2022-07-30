 function navBarStick() {
    const navBarContainer = document.getElementsByClassName("navContainer");
    const navBar = document.getElementsByClassName("navInnerContainer");
    const section = document.getElementsByTagName("section");
    const logoContainer = document.getElementsByClassName("logo");
    const dropDownButton = document.getElementsByClassName("dropDownButton");

    let sticky = section[0].offsetTop + 1;

    if (window.pageYOffset >= sticky) {
        navBar[0].classList.add("sticky");
        navBarContainer[0].classList.add("sticky");

        logoContainer[0].style.width = "100px";
        logoContainer[0].style.transition = "width 0.5s";

        //dropDownButton[0].style.paddingTop = "10px";
        //dropDownButton[0].style.paddingBottom = "6px";
        

        lineHeight.upDownFactor = -1;
        lineHeight.targetPosition = 20;
        if (lineHeight.animating == false) {
            setLineHeight();
        }
    } else {
        navBar[0].classList.remove("sticky");
        navBarContainer[0].classList.remove("sticky");

        logoContainer[0].style.width = "200px";
        logoContainer[0].style.transition = "width 1s";

        //dropDownButton[0].style.paddingTop = "30px";
        //dropDownButton[0].style.paddingBottom = "25px";

        lineHeight.upDownFactor = 0.4;
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
        if (lineHeight.targetPosition == 20) {
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
        lineHeight.buttonBottom -= 0.5;
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
