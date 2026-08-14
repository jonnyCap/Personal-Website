
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
        if (url.includes("aboutMePage.html") == false) {
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
        const elements = document.getElementsByClassName(element);
        if (elements.length === 0) return;
        function fadeStep() {
            if (window.innerWidth < 1200 && element == "aboutMeContainer") {
                if (opacity >= 0.7) {
                    elements[0].style.opacity = "0.7";
                    return;
                }
            }
            if (opacity >= 1) {
                elements[0].style.opacity = "1";
                return;
            }
            opacity += 0.02;
            elements[0].style.opacity = opacity;
            requestAnimationFrame(fadeStep);
        }
        requestAnimationFrame(fadeStep);
    }
};

// EventListener
window.addEventListener("load", animatedText.animate);
let textScrollTicking = false;
window.addEventListener("scroll", () => {
    if (!textScrollTicking) {
        requestAnimationFrame(() => {
            animatedText.animate();
            textScrollTicking = false;
        });
        textScrollTicking = true;
    }
});
