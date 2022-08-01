function adaptHeight() {
    const textContainer = document.getElementsByClassName("textContainer");
    const mainSection = document.getElementsByClassName("mainSection");
    let pageWidth = window.innerWidth;
    if (pageWidth < 330) {
        let height = textContainer[0].offsetHeight;
        mainSection[0].style.height = height + "px";
    } else {
        mainSection[0].style.height = "800px";
    }
}






//EventListener
window.addEventListener("load", adaptHeight)
window.addEventListener("resize", adaptHeight);
