
function checkPageHeight() {
    let pageHeight = window.pageYOffset;
    if (pageHeight < 500) {
        animatedText.mainHeader = true;
    }
    if(pageHeight > 200 && pageHeight < 1200) {
        animatedText.aboutMeContainer = true;
    }
    if (pageHeight > 750) {
        animatedText.sliderContainer = true;
    }
}
const animatedText = {
    mainHeader: false,
    mainHeaderAnimating: false,
    aboutMeContainer: false,
    aboutMeContainerAnimating: false,
    sliderContainer: false,
    sliderContainerAnimating: false,
    secondaryHeaderAnimating: false,
    animate: function () {
        checkPageHeight();
        let url = window.location.href;
        if (url.includes("mainPage.html")) {
            if (animatedText.mainHeader == true && animatedText.mainHeaderAnimating == false) {
                animatedText.mainHeaderAnimating = true;
                animatedText.setSpecificInterval("startContainer");
            }
            if (animatedText.aboutMeContainer == true && animatedText.aboutMeContainerAnimating == false) {
                animatedText.aboutMeContainerAnimating = true;
                animatedText.setSpecificInterval("aboutMeContainer");
            }
            if (animatedText.sliderContainer == true && animatedText.sliderContainerAnimating == false) {
                animatedText.sliderContainerAnimating = true;
                animatedText.setSpecificInterval("projectsContainer");
            }
        } else if (url.includes("aboutMePage.html")) {
            if (animatedText.secondaryHeaderAnimating == false) {
                animatedText.secondaryHeaderAnimating = true;
                animatedText.setSpecificInterval("secondaryHeader");
                animatedText.setSpecificInterval("lowerHeader");
                animatedText.setSpecificInterval("scrollButton"); 
            }
        }
        
    },
    setSpecificInterval: function (element) {
        let opacity = 0;
        let interval = setInterval(function () {
            if (window.pageXOffset < 1200 && element == "aboutMeContainer") {
                if (opacity >= 0.7) {
                    clearInterval(interval);
                }
            }
            if (opacity >= 1) {
                clearInterval(interval);
            }
            const elements = document.getElementsByClassName(element);
            elements[0].style.opacity = opacity;
            opacity += 0.01;
        }, 10);
    }
};

//EventListener
window.onload = animatedText.animate;
window.onscroll = animatedText.animate;
