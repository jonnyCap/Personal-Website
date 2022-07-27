const slider = {
    sliderElements: [],
    slideAnimationPossible: true,
    slideIndex: 0,
    showSliderIndex: 3,
    startPosition: 75,
    collectSlides: function () {
        const slides = document.getElementsByClassName("sliderElement");
        slider.sliderElements = slides;
    },
    startShowSlides: function(){
        for(let i = 0; i < slider.sliderElements.length; i++) {
            slider.sliderElements[i].style.display = "inline-block";
            let currentPosition = 350 * i + slider.startPosition;
            slider.sliderElements[i].style.left =  currentPosition + "px";
        }
        slider.showSlides();
    },
    showSlides: function () {
        //Responsive Layout - Wenn letzte Slides ausgewählt ist soll der index zurücksprigen wenn das Fenster wieder vergrößert wird
        if (slider.slideIndex == 4 && slider.showSliderIndex == 2) {
            slider.slideIndex = 3;
            slider.reposition(3);
        }
        else if (slider.slideIndex == 4 && slider.showSliderIndex == 3) {
            slider.slideIndex = 2;
            slider.reposition(2);
        }
        else if (slider.slideIndex == 3 && slider.showSliderIndex == 2) {
            slider.slideIndex = 3;
            slider.reposition(3);
        }
        else if (slider.slideIndex == 3 && slider.showSliderIndex == 3) {
            slider.slideIndex = 2;
            slider.reposition(2);
        }
        else if (slider.slideIndex == 2 && slider.showSliderIndex == 2) {
            slider.slideIndex = 2;
            slider.reposition(2);
        }
        else if (slider.slideIndex == 2 && slider.showSliderIndex == 3) {
            slider.slideIndex = 2;
            slider.reposition(2);
        }
        else if (slider.slideIndex == 1 && slider.showSliderIndex == 2) {
            slider.slideIndex = 1;
            slider.reposition(1);
        }
        else if (slider.slideIndex == 1 && slider.showSliderIndex == 3) {
            slider.slideIndex = 1;
            slider.reposition(1);
        }
        else if (slider.slideIndex == 0 && slider.showSliderIndex == 2) {
            slider.slideIndex = 0;
            slider.reposition(0);
        }
        else if (slider.slideIndex == 0 && slider.showSliderIndex == 3) {
            slider.slideIndex = 0;
            slider.reposition(0);
        }
      
        for (let i = 0; i < slider.sliderElements.length; i++) {
            if (i == slider.slideIndex) {
                for (let j = i; j < i + slider.showSliderIndex - 1; j++) {
                    slider.sliderElements[i].style.display = "inline-block";
                }
                i += slider.showSliderIndex - 1;
            }
            else {
                slider.sliderElements[i].style.display = "none";
            }         
        }
    },
    setAllSlidesVisible() {
        for (let i = 0; i < slider.sliderElements.length; i++) {
            slider.sliderElements[i].style.display = "inline-block";
        }
    },
    goNextSlide: function () {
        if (slider.slideIndex < slider.sliderElements.length - slider.showSliderIndex && slider.slideAnimationPossible == true) {
            slider.slideIndex++;
            slider.slideAnimationPossible = false;
            slider.doAnimation(2);
        } else {
            slider.doEndAnimation();
        }  
    },
    goPreviousSlide: function () {
        if (slider.slideIndex > 0 && slider.slideAnimationPossible == true) {
            slider.slideIndex--;
            slider.slideAnimationPossible = false;
            slider.doAnimation(-2);
        } else {
            slider.doEndAnimation();
        }
    },
    doAnimation: function(direction) {
        slider.setAllSlidesVisible();
            let position = 0;
            let myInterval = setInterval(function () {
                if (position >= 350) {
                    slider.slideAnimationPossible = true;
                    slider.showSlides();
                    clearInterval(myInterval);                  
                } else {
                    for (let i = 0; i < slider.sliderElements.length; i++) {
                        let left = slider.sliderElements[i].offsetLeft;
                        let newPosition = left - direction;
                        slider.sliderElements[i].style.left = newPosition + "px";
                    }
                    position += 2;
                }
            }, 1);
       
    },
    reposition(x) {
        slider.setAllSlidesVisible();
        switch (x) {
            case 0:
                for (let i = 0; i < slider.sliderElements.length; i++) {
                    let currentPosition = 350 * i + slider.startPosition;
                    slider.sliderElements[i].style.left = currentPosition + "px";
                }
                break;
            case 1:
                for (let i = 0; i < slider.sliderElements.length; i++) {
                    let currentPosition = 350 * i - (350 *1) + slider.startPosition;
                    slider.sliderElements[i].style.left = currentPosition + "px";
                }
                break;
            case 2:
                for (let i = 0; i < slider.sliderElements.length; i++) {
                    let currentPosition = 350 * i - (350 * 2) + slider.startPosition;
                    slider.sliderElements[i].style.left = currentPosition + "px";
                }
                break;
            case 3:
                for (let i = 0; i < slider.sliderElements.length; i++) {
                    let currentPosition = 350 * i - (350 * 3) + slider.startPosition;
                    slider.sliderElements[i].style.left = currentPosition + "px";
                }
                break;
            case 4:
                for (let i = 0; i < slider.sliderElements.length; i++) {
                    let currentPosition = 350 * i - (350 * 4) + slider.startPosition;
                    slider.sliderElements[i].style.left = currentPosition + "px";
                }
                break;
        }
    },
    checkForShownSliderAmount: function () {
        const width = window.innerWidth;
        let currentStartPosition = slider.startPosition;
        //set Startposition
        if (width <= 500 && width > 450) {
            slider.startPosition = 100;
        }else if (width <= 450 && width > 400) {
            slider.startPosition = 70;
        }else if (width <= 400 && width > 350) {
            slider.startPosition = 45;
        }else if (width <= 350 && width > 300) {
            slider.startPosition = 30;
        }else if (width <= 300 && width > 250) {
            slider.startPosition = 14;
        } else if (width <= 250 && width > 220) {
            slider.startPosition = 8;
        }else if (width <= 220) {
            slider.startPosition = 0;
        }else {
            slider.startPosition = 75;
        }
        if (currentStartPosition != slider.startPosition) {
            slider.reposition(slider.slideIndex);
        }
        
        //set sliderIndex t0 show right amount of SLides
        
        if (width > 1200) {
            slider.showSliderIndex = 3;
            slider.showSlides();
        }
        else if (width <= 1200 && width > 900) {
            slider.showSliderIndex = 2;
            slider.showSlides();
        } else if (width <= 900) {
            slider.showSliderIndex = 1;
            slider.showSlides();
        }
        
    },

    doEndAnimation() {
        
    }
};

//EventListener
window.addEventListener("resize", slider.checkForShownSliderAmount );

document.addEventListener('DOMContentLoaded', function () {
    slider.checkForShownSliderAmount();
    slider.collectSlides();
    slider.startShowSlides();
}, false);

let nextButton = document.getElementById("nextButton");
nextButton.addEventListener("click", (event) => {
    slider.goNextSlide();
});
let prevButton = document.getElementById("prevButton");
prevButton.addEventListener("click", (event) => {
    slider.goPreviousSlide();
});
let secondNextButton = document.getElementById("secondNextButton");
secondNextButton.addEventListener("click", (event) => {
    slider.goNextSlide();
});
let secondPrevButton = document.getElementById("secondPrevButton");
secondPrevButton.addEventListener("click", (event) => {
    slider.goPreviousSlide();
});

