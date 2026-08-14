function adaptHeight() {
    const textContainer = document.getElementsByClassName("textContainer");
    const mainSection = document.getElementsByClassName("mainSection");
    if (textContainer.length === 0 || mainSection.length === 0) return;
    let pageWidth = window.innerWidth;
    if (pageWidth < 330) {
        let height = textContainer[0].offsetHeight;
        mainSection[0].style.height = height + "px";
    } else {
        mainSection[0].style.height = "800px";
    }
}

// EventListener
window.addEventListener("load", adaptHeight);
let adaptHeightResizeTicking = false;
window.addEventListener("resize", () => {
    if (!adaptHeightResizeTicking) {
        requestAnimationFrame(() => {
            adaptHeight();
            adaptHeightResizeTicking = false;
        });
        adaptHeightResizeTicking = true;
    }
});
