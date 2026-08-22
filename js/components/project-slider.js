/**
 * project-slider.js
 * Hardware-accelerated touch & gesture slider for dynamic project cards.
 */

const slider = {
    currentIndex: 0,
    cardsVisible: 3,
    cardWidth: 350,
    totalCards: 0,
    isAnimating: false,
    
    // Touch & swipe state
    touchStartX: 0,
    touchDeltaX: 0,
    isDragging: false,

    init: function () {
        this.updateDimensions();
        this.setupEventListeners();
        this.renderDots();
        this.updateSlidePosition(false);
    },

    getTrack: function () {
        return document.getElementById("sliderTrack");
    },

    /**
     * @returns {NodeListOf<HTMLElement>}
     */
    getSlides: function () {
        return /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll(".sliderElement"));
    },

    updateDimensions: function () {
        const width = window.innerWidth;
        const slides = this.getSlides();
        const track = this.getTrack();
        this.totalCards = slides.length;

        if (width > 1200) {
            this.cardsVisible = 3;
        } else if (width > 768) {
            this.cardsVisible = 2;
        } else {
            this.cardsVisible = 1;
        }

        if (slides.length > 0) {
            const firstSlide = slides[0];
            let gap = 30;
            if (track) {
                const trackStyle = window.getComputedStyle(track);
                const parsedGap = parseFloat(trackStyle.gap || trackStyle.columnGap);
                if (!isNaN(parsedGap)) gap = parsedGap;
            }
            this.cardWidth = (firstSlide ? firstSlide.offsetWidth : 350) + gap;
            if (this.cardWidth <= 0) this.cardWidth = 350;
        }

        const maxIndex = Math.max(0, this.totalCards - this.cardsVisible);
        if (this.currentIndex > maxIndex) {
            this.currentIndex = maxIndex;
        }
    },

    maxSlideIndex: function () {
        return Math.max(0, this.totalCards - this.cardsVisible);
    },

    updateSlidePosition: function (animate = true) {
        const track = this.getTrack();
        if (!track) return;

        const maxIdx = this.maxSlideIndex();
        if (this.currentIndex > maxIdx) this.currentIndex = maxIdx;
        if (this.currentIndex < 0) this.currentIndex = 0;

        const offset = -(this.currentIndex * this.cardWidth);
        track.style.transition = animate ? "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)" : "none";
        track.style.transform = `translateX(${offset}px)`;

        this.updateDots();
        this.updateButtonStates();
    },

    goNextSlide: function () {
        if (this.currentIndex < this.maxSlideIndex()) {
            this.currentIndex++;
            this.updateSlidePosition(true);
        } else {
            // Elastic bounce effect at the end
            this.bounceTrack(-25);
        }
    },

    goPreviousSlide: function () {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateSlidePosition(true);
        } else {
            // Elastic bounce effect at the start
            this.bounceTrack(25);
        }
    },

    goToSlide: function (index) {
        const maxIdx = this.maxSlideIndex();
        this.currentIndex = Math.max(0, Math.min(index, maxIdx));
        this.updateSlidePosition(true);
    },

    bounceTrack: function (amount) {
        const track = this.getTrack();
        if (!track) return;
        const currentOffset = -(this.currentIndex * this.cardWidth);
        track.style.transition = "transform 0.15s ease-out";
        track.style.transform = `translateX(${currentOffset + amount}px)`;
        setTimeout(() => {
            track.style.transition = "transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)";
            track.style.transform = `translateX(${currentOffset}px)`;
        }, 150);
    },

    renderDots: function () {
        const container = document.getElementById("sliderDots");
        if (!container) return;

        container.innerHTML = "";
        const pagesCount = this.maxSlideIndex() + 1;
        if (pagesCount <= 1) return;

        for (let i = 0; i < pagesCount; i++) {
            const dot = document.createElement("button");
            dot.className = `sliderDot ${i === this.currentIndex ? 'active' : ''}`;
            dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
            dot.addEventListener("click", () => this.goToSlide(i));
            container.appendChild(dot);
        }
    },

    updateDots: function () {
        const dots = document.querySelectorAll(".sliderDot");
        dots.forEach((dot, idx) => {
            if (idx === this.currentIndex) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });
    },

    updateButtonStates: function () {
        /** @type {NodeListOf<HTMLElement>} */
        const prevBtns = document.querySelectorAll("#prevButton, #secondPrevButton");
        /** @type {NodeListOf<HTMLElement>} */
        const nextBtns = document.querySelectorAll("#nextButton, #secondNextButton");

        prevBtns.forEach(btn => {
            btn.style.opacity = this.currentIndex === 0 ? "0.4" : "1";
            btn.style.pointerEvents = this.currentIndex === 0 ? "none" : "auto";
        });

        nextBtns.forEach(btn => {
            const isAtEnd = this.currentIndex >= this.maxSlideIndex();
            btn.style.opacity = isAtEnd ? "0.4" : "1";
            btn.style.pointerEvents = isAtEnd ? "none" : "auto";
        });
    },

    setupEventListeners: function () {
        const track = this.getTrack();
        const outer = document.querySelector(".outerSliderContainer") || track;

        // Button Listeners
        const nextBtns = ["nextButton", "secondNextButton"];
        nextBtns.forEach(id => {
            const el = document.getElementById(id);
            if (el && !el.dataset.listenerAttached) {
                el.dataset.listenerAttached = "true";
                el.addEventListener("click", () => slider.goNextSlide());
            }
        });

        const prevBtns = ["prevButton", "secondPrevButton"];
        prevBtns.forEach(id => {
            const el = document.getElementById(id);
            if (el && !el.dataset.listenerAttached) {
                el.dataset.listenerAttached = "true";
                el.addEventListener("click", () => slider.goPreviousSlide());
            }
        });

        // Touch & Swipe Support
        if (outer instanceof HTMLElement && !outer.dataset.touchAttached) {
            outer.dataset.touchAttached = "true";

            outer.addEventListener("touchstart", (e) => {
                if (e.touches && e.touches[0]) {
                    slider.touchStartX = e.touches[0].clientX;
                    slider.touchDeltaX = 0;
                    slider.isDragging = true;
                }
            }, { passive: true });

            outer.addEventListener("touchmove", (e) => {
                if (!slider.isDragging) return;
                if (e.touches && e.touches[0]) {
                    slider.touchDeltaX = e.touches[0].clientX - slider.touchStartX;
                }
            }, { passive: true });

            outer.addEventListener("touchend", () => {
                if (!slider.isDragging) return;
                slider.isDragging = false;
                if (slider.touchDeltaX < -40) {
                    slider.goNextSlide();
                } else if (slider.touchDeltaX > 40) {
                    slider.goPreviousSlide();
                }
            });
        }
    }
};

// Resize throttling
let sliderResizeTimer;
window.addEventListener("resize", () => {
    clearTimeout(sliderResizeTimer);
    sliderResizeTimer = setTimeout(() => {
        slider.updateDimensions();
        slider.renderDots();
        slider.updateSlidePosition(false);
    }, 100);
});
