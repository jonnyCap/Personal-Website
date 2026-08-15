// secondaryCanvas - Responsive Full-Width Background Animation

const c = {
    gC: function () {
        let secondaryCanvas = document.getElementById("secondaryCanvas");
        return secondaryCanvas ? secondaryCanvas.getContext("2d") : null;
    },
    getRandomNumber: function (min, max) {
        return Math.random() * (max - min) + min;
    },
    getScaleFactor: function (a, b, c, d) {
        let gK = c - a;
        let aK = d - b;
        let solution = (Math.sqrt((gK * gK) + (aK * aK))) / 1000;
        return solution;
    }
};

const secondaryCanvas = {
    drawnObjects: [],
    drawnObjectsCounter: 50,
    addedObjects: [],
    removedObjects: [],
    mainX: 1100,
    mainY: 475,
    rotationVelocity: 0.02,

    resizeCanvas: function () {
        const can = document.getElementById("secondaryCanvas");
        const parent = document.querySelector(".secondaryStartSection");
        if (can && parent) {
            const w = parent.offsetWidth || window.innerWidth;
            const h = parent.offsetHeight || 900;
            if (can.width !== w || can.height !== h) {
                can.width = w;
                can.height = h;
            }
            secondaryCanvas.relocateMainPoints();
        }
    },

    relocateMainPoints: function () {
        const btn = document.querySelector(".scrollButton.down");
        const can = document.getElementById("secondaryCanvas");
        if (btn && can) {
            const btnBounds = btn.getBoundingClientRect();
            const canBounds = can.getBoundingClientRect();
            secondaryCanvas.mainX = (btnBounds.left + btnBounds.width / 2) - canBounds.left;
            secondaryCanvas.mainY = (btnBounds.top + btnBounds.height / 2) - canBounds.top;
        } else {
            secondaryCanvas.mainX = 1100;
            secondaryCanvas.mainY = 475;
        }
    },

    createAll: function () {
        secondaryCanvas.resizeCanvas();
        secondaryCanvas.drawnObjects = [];
        const can = document.getElementById("secondaryCanvas");
        const w = can ? can.width : window.innerWidth;
        const h = can ? can.height : 900;

        // Populate particles across the entire full width and height of the canvas
        for (let i = 0; i < 50; i++) {
            let x = c.getRandomNumber(30, w - 30);
            let y = c.getRandomNumber(30, h - 30);
            let circle = new circleLine(x, y, x, y);
            secondaryCanvas.drawnObjects.push(circle);
        }
    },

    checkForCloseObjects: function () {
        let index = 0;
        for (let i = 0; i < secondaryCanvas.drawnObjects.length; i++) {
            for (let j = index; j < secondaryCanvas.drawnObjects.length; j++) {
                if (i !== j) {
                    if (Math.abs(secondaryCanvas.drawnObjects[i].currentX - secondaryCanvas.drawnObjects[j].currentX) < 70 &&
                        Math.abs(secondaryCanvas.drawnObjects[i].currentY - secondaryCanvas.drawnObjects[j].currentY) < 70) {
                        secondaryCanvas.drawLine(
                            secondaryCanvas.drawnObjects[i].currentX,
                            secondaryCanvas.drawnObjects[i].currentY,
                            secondaryCanvas.drawnObjects[j].currentX,
                            secondaryCanvas.drawnObjects[j].currentY
                        );
                    }
                }
            }
            index++;
        }
    },

    animateObjects: function () {
        secondaryCanvas.clearsecondaryCanvas();
        secondaryCanvas.checkForCloseObjects();
        for (let i = 0; i < secondaryCanvas.drawnObjects.length; i++) {
            secondaryCanvas.drawnObjects[i].drawRandom();
        }
        for (let i = 0; i < secondaryCanvas.addedObjects.length; i++) {
            if (secondaryCanvas.addedObjects[i].drawToEndPosition()) {
                secondaryCanvas.drawnObjects.push(secondaryCanvas.addedObjects[i]);
                secondaryCanvas.addedObjects.splice(i, 1);
                i--;
            }
        }
        for (let i = 0; i < secondaryCanvas.removedObjects.length; i++) {
            if (secondaryCanvas.removedObjects[i].drawToStartPosition()) {
                secondaryCanvas.removedObjects.splice(i, 1);
                i--;
            }
        }
    },

    refreshPage: function () {
        secondaryCanvas.clearsecondaryCanvas();
        secondaryCanvas.animateObjects();
    },

    createCircleOnClick: function (x, y) {
        let circle = new circleLine(x, y, secondaryCanvas.mainX, secondaryCanvas.mainY);
        secondaryCanvas.drawnObjects.push(circle);
    },

    removeObject: function () {
        secondaryCanvas.drawnObjects.shift();
    },

    clearsecondaryCanvas: function () {
        let can = document.getElementById("secondaryCanvas");
        let ctx = c.gC();
        if (can && ctx) {
            ctx.clearRect(0, 0, can.width, can.height);
        }
    },

    addAnimatedObject: function (endX, endY) {
        const circle = new circleLine(endX, endY, secondaryCanvas.mainX, secondaryCanvas.mainY);
        secondaryCanvas.addedObjects.push(circle);
        if (secondaryCanvas.drawnObjects.length > 0) {
            secondaryCanvas.removedObjects.push(secondaryCanvas.drawnObjects[0]);
            secondaryCanvas.drawnObjects.shift();
        }
    },

    drawLine: function (startX, startY, endX, endY) {
        let ctx = c.gC();
        if (!ctx) return;
        ctx.lineWidth = 2;
        let opacity = 1 - (c.getScaleFactor(startX, startY, endX, endY) * 10);

        ctx.save();
        ctx.strokeStyle = "#d7e8f4";
        ctx.globalAlpha = Math.max(0, opacity);
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.restore();
    }
};

class circleLine {
    constructor(startX, startY, currentX, currentY) {
        this.startX = startX;
        this.startY = startY;
        this.currentX = currentX;
        this.currentY = currentY;
        this.sinValue = c.getRandomNumber(1, 360);
        this.radians = c.getRandomNumber(1, 100);
    }

    draw(x, y) {
        let scaleFactor = c.getScaleFactor(x, y, secondaryCanvas.mainX, secondaryCanvas.mainY);
        let ctx = c.gC();
        if (!ctx) return;

        // Line to center
        ctx.lineWidth = 2;
        let grad = ctx.createRadialGradient(secondaryCanvas.mainX, secondaryCanvas.mainY, 200, secondaryCanvas.mainX, secondaryCanvas.mainY, 100);
        grad.addColorStop(0, "#98c6e6");
        grad.addColorStop(1, "#98c6e6");
        ctx.strokeStyle = grad;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(secondaryCanvas.mainX, secondaryCanvas.mainY);
        ctx.stroke();

        // Endcircle
        let grad2 = ctx.createRadialGradient(secondaryCanvas.mainX, secondaryCanvas.mainY, 600, secondaryCanvas.mainX, secondaryCanvas.mainY, 400);
        grad2.addColorStop(0, "#d6e8f5");
        grad2.addColorStop(1, "#eaf4fa");

        ctx.strokeStyle = grad2;
        ctx.fillStyle = grad2;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(2, (3 - (scaleFactor * 2)) * 6), 0, Math.PI * 2, false);
        ctx.fill();
        ctx.stroke();
    }

    drawRandom() {
        this.sinValue += 1;
        let movingFactor = 0.005 * Math.sin(0.05 * this.sinValue);
        let finalVektorX = this.startX - secondaryCanvas.mainX;
        let finalVektorY = this.startY - secondaryCanvas.mainY;

        this.currentX += finalVektorX * (movingFactor / 2);
        this.currentY += finalVektorY * (movingFactor / 2);
        this.radians += secondaryCanvas.rotationVelocity;
        this.currentX += Math.cos(this.radians);
        this.currentY += Math.sin(this.radians);

        this.draw(this.currentX, this.currentY);
    }

    drawToEndPosition() {
        let finalVektorX = this.startX - secondaryCanvas.mainX;
        let finalVektorY = this.startY - secondaryCanvas.mainY;

        let finalLengthVektor = Math.sqrt((finalVektorX * finalVektorX) + (finalVektorY * finalVektorY));
        let currentVektorX = this.currentX - secondaryCanvas.mainX;
        let currentVektorY = this.currentY - secondaryCanvas.mainY;
        let currentLengthVektor = Math.sqrt((currentVektorX * currentVektorX) + (currentVektorY * currentVektorY));
        if (currentLengthVektor > finalLengthVektor) {
            return true;
        } else {
            this.currentX += finalVektorX / 30;
            this.currentY += finalVektorY / 30;
            this.draw(this.currentX, this.currentY);
            return false;
        }
    }

    drawToStartPosition() {
        let finalVektorX = this.startX - secondaryCanvas.mainX;
        let finalVektorY = this.startY - secondaryCanvas.mainY;
        let finalLengthVektor = Math.sqrt((finalVektorX * finalVektorX) + (finalVektorY * finalVektorY));
        if (finalLengthVektor < 5) {
            return true;
        } else {
            this.startX -= finalVektorX / 10;
            this.startY -= finalVektorY / 10;
            this.draw(this.startX, this.startY);
            return false;
        }
    }
}

// Initial setup & resize handling
window.addEventListener("load", function () {
    setTimeout(secondaryCanvas.createAll, 100);
});

let secResizeTicking = false;
window.addEventListener("resize", () => {
    if (!secResizeTicking) {
        requestAnimationFrame(() => {
            secondaryCanvas.resizeCanvas();
            secResizeTicking = false;
        });
        secResizeTicking = true;
    }
});

let canSec = document.getElementById("secondaryCanvas");
let secStartSection = document.querySelector(".secondaryStartSection");

function spawnSecondaryObject(event) {
    if (!canSec) return;
    if (event.target.closest("button") || event.target.closest("a") || event.target.closest(".secondaryNavList") || event.target.closest(".scrollButton") || event.target.closest("#moveableBackground")) {
        return;
    }
    let bounds = canSec.getBoundingClientRect();
    let scaleX = canSec.width / bounds.width;
    let scaleY = canSec.height / bounds.height;
    let realX = (event.clientX - bounds.left) * scaleX;
    let realY = (event.clientY - bounds.top) * scaleY;
    secondaryCanvas.addAnimatedObject(realX, realY);
}

if (secStartSection) {
    secStartSection.addEventListener("click", spawnSecondaryObject);
} else if (canSec) {
    canSec.addEventListener("click", spawnSecondaryObject);
}

let isSecCanvasVisible = true;
let isSecTabVisible = !document.hidden;
let secCanvasAnimId = null;

function runSecCanvasLoop() {
    if (isSecCanvasVisible && isSecTabVisible) {
        secondaryCanvas.animateObjects();
        secCanvasAnimId = requestAnimationFrame(runSecCanvasLoop);
    } else {
        secCanvasAnimId = null;
    }
}

function startSecCanvasAnim() {
    if (!secCanvasAnimId && isSecCanvasVisible && isSecTabVisible) {
        secCanvasAnimId = requestAnimationFrame(runSecCanvasLoop);
    }
}

function stopSecCanvasAnim() {
    if (secCanvasAnimId) {
        cancelAnimationFrame(secCanvasAnimId);
        secCanvasAnimId = null;
    }
}

if (canSec && "IntersectionObserver" in window) {
    const secCanvasObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            isSecCanvasVisible = entry.isIntersecting;
            if (isSecCanvasVisible) {
                startSecCanvasAnim();
            } else {
                stopSecCanvasAnim();
            }
        });
    });
    secCanvasObserver.observe(canSec);
}

document.addEventListener("visibilitychange", () => {
    isSecTabVisible = !document.hidden;
    if (isSecTabVisible) {
        startSecCanvasAnim();
    } else {
        stopSecCanvasAnim();
    }
});

startSecCanvasAnim();
