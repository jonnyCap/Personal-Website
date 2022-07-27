
const startScreen = {
    buttonDiameter: 200,
    resizeStartSection: function () {
        startScreen.resizeBackground();
        startScreen.resizeHeader();
        startScreen.resizeButton();
    },
    resizeBackground: function () {
        let startSection = document.getElementsByClassName("secondaryStartSection");
        let nav = document.getElementsByClassName("navContainer");
        let navHeight = nav[0].offsetHeight;
        console.log(navHeight);
        let height = window.innerHeight - navHeight;
        startSection[0].style.height = height + "px";
    },
    resizeHeader: function () {
        let header = document.getElementsByClassName("secondaryHeader");
        let headerContainer = document.getElementsByClassName("secondaryHeaderContainer");
        let textSize = window.innerHeight * 0.2;
        let top = window.innerHeight * 0.2;
        header[0].style.fontSize = textSize + "px";
        headerContainer[0].style.top = top + "px";
    },
    resizeButton: function () {
        //let button = document.getElementsByClassName("scrollButton");
        //let startSection = document.getElementsByClassName("secondaryStartSection");
        //let startSectionHeight = startSection[0].offsetHeight - startScreen.buttonDiameter;
        //button[0].style.top = startSectionHeight + "px";
    },
    resizeCanvas: function () {
        let mainCanvas = document.getElementById("secondaryCanvas");
        let startSection = document.getElementsByClassName("secondaryStartSection");
        let startSectionHeight = (startSection[0].offsetHeight - 900) / 2;
        mainCanvas.style.top = startSectionHeight + "px";
    }
}


//EventListener
window.addEventListener("resize", startScreen.resizeStartSection);
window.addEventListener("load", startScreen.resizeStartSection);
