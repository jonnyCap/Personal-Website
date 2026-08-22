/**
 * scroll-button.js
 * Floating scroll trigger and interactive canvas particle animations.
 */

const sDButton = {
    scrollAnimTicking: false,

    init: function () {
        const downBtn = document.querySelector(".scrollButton.down");
        const upBtn = document.querySelector(".scrollButton.up");

        if (downBtn) {
            downBtn.addEventListener("click", (e) => {
                e.preventDefault();
                sDButton.scrollDown();
            });
            downBtn.addEventListener("mouseenter", function () {
                buttonCanvas.finalButtonAdaption(0, "white", 0);
            });
            downBtn.addEventListener("mouseleave", function () {
                buttonCanvas.finalButtonAdaption(1, "white", 0);
            });
        }

        if (upBtn) {
            upBtn.addEventListener("click", (e) => {
                e.preventDefault();
                sDButton.scrollUp();
            });
            upBtn.addEventListener("mouseenter", function () {
                buttonCanvas.finalButtonAdaption(0, "lightBlue", 1);
            });
            upBtn.addEventListener("mouseleave", function () {
                buttonCanvas.finalButtonAdaption(1, "lightBlue", 1);
            });
        }

        // Monitor scroll position to keep top button rotation indicator in sync
        window.addEventListener("scroll", () => {
            if (!sDButton.scrollAnimTicking) {
                requestAnimationFrame(() => {
                    sDButton.syncStateFromScroll();
                    sDButton.scrollAnimTicking = false;
                });
                sDButton.scrollAnimTicking = true;
            }
        }, { passive: true });
    },

    syncStateFromScroll: function () {
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const downBtn = document.querySelector(".scrollButton.down");
        if (!(downBtn instanceof HTMLElement)) return;

        if (scrollY > 300) {
            downBtn.style.transform = "rotate(180deg)";
        } else if (scrollY < 100) {
            downBtn.style.transform = "rotate(0deg)";
        }
    },

    scrollDown: function () {
        const section = document.querySelector(".secondaryContentSection");
        if (typeof journyCanvas !== "undefined" && typeof journyCanvas.setUpJournyCanvas === "function") {
            journyCanvas.setUpJournyCanvas();
        }

        if (section) {
            const navHeight = 70;
            const targetY = section.getBoundingClientRect().top + window.pageYOffset - navHeight;
            window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
        } else {
            window.scrollTo({ top: 900, behavior: "smooth" });
        }
    },

    scrollUp: function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    },

    toggle: function () {
        const scrollY = window.scrollY || window.pageYOffset || 0;
        if (scrollY > 250) {
            sDButton.scrollUp();
        } else {
            sDButton.scrollDown();
        }
    },

    // Backward compatibility helper
    work: function () {
        sDButton.toggle();
    }
};

const buttonCanvas = {
    circleFractures: [],
    downArrows: [],
    expansionRadiusUpper: 0,
    expansionRadiusLower: 0,
    arrowExpansionUpper: 0,
    arrowExpansionLower: 0,
    centerX: 100,
    centerY: 100,
    colorUp: "white",
    colorDown: "lightBlue",

    /**
     * @param {number} index
     * @returns {CanvasRenderingContext2D | null}
     */
    gC: function (index) {
        if (index === 0) {
            const c = document.getElementById("clickAnimationCanvas");
            return c instanceof HTMLCanvasElement ? c.getContext("2d") : null;
        } else {
            const c = document.getElementById("clickAnimationCanvasUp");
            return c instanceof HTMLCanvasElement ? c.getContext("2d") : null;
        }
    },

    createFractures: function () {
        buttonCanvas.circleFractures = [];
        buttonCanvas.downArrows = [];

        buttonCanvas.circleFractures.push(new circleFracture(25, 0.4, 60, 1));
        buttonCanvas.circleFractures.push(new circleFracture(25, 0.2, 160, 2));
        buttonCanvas.circleFractures.push(new circleFracture(40, 0.7, 120, 2));
        buttonCanvas.circleFractures.push(new circleFracture(40, 0.5, 300, 1));
        buttonCanvas.circleFractures.push(new circleFracture(55, 0.4, 190, 2));
        buttonCanvas.circleFractures.push(new circleFracture(55, 0.7, 40, 1));

        buttonCanvas.downArrows.push(new Arrow(165));
        buttonCanvas.downArrows.push(new Arrow(185));
    },

    animate: function () {
        let isBtnVisible = true;
        let isBtnTabVisible = !document.hidden;
        let btnAnimId = null;

        function renderButtonCanvas() {
            if (!isBtnVisible || !isBtnTabVisible) {
                btnAnimId = null;
                return;
            }

            const ctxUp = buttonCanvas.gC(0);
            const ctxDown = buttonCanvas.gC(1);

            if (ctxUp) {
                ctxUp.clearRect(0, 0, 200, 250);
                for (let i = 0; i < buttonCanvas.circleFractures.length; i++) {
                    if (MediaRes.size800 === false && i < 2) {
                        buttonCanvas.colorUp = "#e6f5ff";
                    } else {
                        buttonCanvas.circleFractures[i].draw(0);
                    }
                }
                if (MediaRes.size800 === true) {
                    for (let i = 0; i < buttonCanvas.downArrows.length; i++) {
                        buttonCanvas.downArrows[i].draw(0);
                    }
                }
            }

            if (ctxDown) {
                ctxDown.clearRect(0, 0, 200, 250);
                for (let i = 0; i < buttonCanvas.circleFractures.length; i++) {
                    buttonCanvas.circleFractures[i].draw(1);
                }
                for (let i = 0; i < buttonCanvas.downArrows.length; i++) {
                    buttonCanvas.downArrows[i].draw(1);
                }
            }

            btnAnimId = requestAnimationFrame(renderButtonCanvas);
        }

        function startBtnAnim() {
            if (!btnAnimId && isBtnVisible && isBtnTabVisible) {
                btnAnimId = requestAnimationFrame(renderButtonCanvas);
            }
        }

        function stopBtnAnim() {
            if (btnAnimId) {
                cancelAnimationFrame(btnAnimId);
                btnAnimId = null;
            }
        }

        const btnElems = document.querySelectorAll(".scrollButton");
        const visibleButtons = new Set();
        if (btnElems.length > 0 && "IntersectionObserver" in window) {
            const btnObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        visibleButtons.add(entry.target);
                    } else {
                        visibleButtons.delete(entry.target);
                    }
                });
                isBtnVisible = visibleButtons.size > 0;
                if (isBtnVisible) {
                    startBtnAnim();
                } else {
                    stopBtnAnim();
                }
            });
            btnElems.forEach(el => btnObserver.observe(el));
        }

        document.addEventListener("visibilitychange", () => {
            isBtnTabVisible = !document.hidden;
            if (isBtnTabVisible) {
                startBtnAnim();
            } else {
                stopBtnAnim();
            }
        });

        startBtnAnim();
    },

    changeColor: function (color, index) {
        if (index === 0) {
            buttonCanvas.colorUp = (MediaRes.size800 === false) ? "#e6f5ff" : color;
        } else {
            buttonCanvas.colorDown = color;
        }
    },

    expandRadius: function (index) {
        if (index === 0) {
            buttonCanvas.expansionRadiusUpper = (MediaRes.size800 ? 30 : 10);
            buttonCanvas.arrowExpansionUpper = 12;
        } else {
            buttonCanvas.expansionRadiusLower = 30;
            buttonCanvas.arrowExpansionLower = 12;
        }
    },

    diminishRadius: function (index) {
        if (index === 0) {
            buttonCanvas.expansionRadiusUpper = 0;
            buttonCanvas.arrowExpansionUpper = 0;
        } else {
            buttonCanvas.expansionRadiusLower = 0;
            buttonCanvas.arrowExpansionLower = 0;
        }
    },

    finalButtonAdaption: function (outIN, color, index) {
        if (outIN === 0) {
            buttonCanvas.expandRadius(index);
        } else {
            buttonCanvas.diminishRadius(index);
        }
        buttonCanvas.changeColor(color, index);
    }
};

class circleFracture {
    constructor(radius, length, rotation, speed) {
        this.radius = radius;
        this.length = length;
        this.rotation = rotation;
        this.speed = speed;
    }

    draw(index) {
        const context = buttonCanvas.gC(index);
        if (!context) return;

        this.rotation += this.speed;
        const rad = this.rotation * Math.PI / 180;
        context.save();
        context.translate(buttonCanvas.centerX, buttonCanvas.centerY);
        context.rotate(rad);

        let expansion = (index === 0) ? buttonCanvas.expansionRadiusUpper : buttonCanvas.expansionRadiusLower;
        context.strokeStyle = (index === 0) ? buttonCanvas.colorUp : buttonCanvas.colorDown;

        context.beginPath();
        context.arc(0, 0, this.radius + expansion, 0, this.length * Math.PI, false);
        context.lineWidth = 3;
        context.stroke();
        context.restore();
    }
}

class Arrow {
    constructor(height) {
        this.height = height;
    }

    draw(index) {
        const ctx = buttonCanvas.gC(index);
        if (!ctx) return;

        const expansion = (index === 0) ? buttonCanvas.arrowExpansionUpper : buttonCanvas.arrowExpansionLower;
        ctx.strokeStyle = (index === 0) ? buttonCanvas.colorUp : buttonCanvas.colorDown;
        ctx.lineWidth = 5;

        ctx.beginPath();
        ctx.moveTo(buttonCanvas.centerX - 15, this.height + expansion);
        ctx.lineTo(buttonCanvas.centerX, this.height + 10 + expansion);
        ctx.lineTo(buttonCanvas.centerX + 15, this.height + expansion);
        ctx.stroke();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    sDButton.init();
    buttonCanvas.createFractures();
    buttonCanvas.animate();
});



