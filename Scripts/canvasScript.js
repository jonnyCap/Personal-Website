//canvas

const c = {
    gC: function () {
        let canvas = document.getElementById("canvas");
        return canvas.getContext("2d");

    },
    getRandomNumber: function (min, max) {
        return Math.random() * (max - min) + min;
    },
    getScaleFactor: function (a, b, c, d) {
        let gK = Math.abs(a - c);
        let aK = Math.abs(b - d);
        let solution = (Math.sqrt((gK * gK) + (aK * aK))) / 1000;
        return solution;
    }
};
const canvas = {
    drawnObjects: [],
    drawnObjectsCounter: 30,
    addedObjects: [],
    removedObjects: [],
    mainX: 700,
    mainY: 400,
    rotationVelocity: 0.02,
    createAll: function () {
       // canvas.relocateMainPoints();
        for (let i = 0; i < 20; i++) {
            let x = c.getRandomNumber(100, 300);
            let y = c.getRandomNumber(100, 500);
            let circle = new circleLine(x, y, x, y);
            canvas.drawnObjects.push(circle);
        }
        for (let i = 0; i < 20; i++) {
            let x = c.getRandomNumber(300, 600);
            let y = c.getRandomNumber(50, 500);
            let circle = new circleLine(x, y, x, y);
            canvas.drawnObjects.push(circle);
        }
        for (let i = 0; i < 20; i++) {
            let x = c.getRandomNumber(600, 800);
            let y = c.getRandomNumber(50, 500);
            let circle = new circleLine(x, y, x, y);
            canvas.drawnObjects.push(circle);
        }
    },
    checkForCloseObjects() {
        let index = 0;
        for (let i = 0; i < canvas.drawnObjects.length; i++) {
            for (let j = index; j < canvas.drawnObjects.length; j++) {
                if (i != j) {
                    if (Math.abs(canvas.drawnObjects[i].currentX - canvas.drawnObjects[j].currentX) < 70 && Math.abs(canvas.drawnObjects[i].currentY - canvas.drawnObjects[j].currentY) < 70) {
                        canvas.drawLine(canvas.drawnObjects[i].currentX, canvas.drawnObjects[i].currentY, canvas.drawnObjects[j].currentX, canvas.drawnObjects[j].currentY);
                    }
                }
            }
            index++;
        }
    },
    animateObjects() {
        canvas.clearCanvas();
        canvas.checkForCloseObjects();
        for (let i = 0; i < canvas.drawnObjects.length; i++) {
            canvas.drawnObjects[i].drawRandom();
        }
        for (let i = 0; i < canvas.addedObjects.length; i++) {
            if (canvas.addedObjects[i].drawToEndPosition()) {
                canvas.drawnObjects.push(canvas.addedObjects[i]);
                canvas.addedObjects.splice(i, 1);
                i--;
            }
        }
        for (let i = 0; i < canvas.removedObjects.length; i++) {
            if (canvas.removedObjects[i].drawToStartPosition()) {
                canvas.removedObjects.splice(i, 1);
                i--;
            }
        }
    },
    refreshPage: function () {
        canvas.clearCanvas();
        canvas.animateObjects();
    },

    createCircleOnClick: function (x, y) {
        if (x > 600) {
            let circle = new circleLine(x, y);
            canvas.drawnObjects.push(circle);
        }
    },

    removeObject: function () {
        canvas.drawnObjects.shift();
    },

    clearCanvas: function () {
        let can = document.getElementById("canvas");
        let ctx = c.gC();
        ctx.clearRect(0, 0, can.width, can.height);
    },

    addAnimatedObject: function (endX, endY) {
        circle = new circleLine(endX, endY, canvas.mainX, canvas.mainY);
        canvas.addedObjects.push(circle);
        canvas.removedObjects.push(canvas.drawnObjects[0]);
        canvas.drawnObjects.shift();
       
    },
    drawLine: function (startX, startY, endX, endY) {
        let ctx = c.gC();
        ctx.lineWidth = 2;
        let opacity = 1 - (c.getScaleFactor(startX, startY, endX, endY) * 10);

        ctx.save();

        ctx.strokeStyle = "#33ccff";
        ctx.globalAlpha = opacity;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);

        ctx.stroke();

        ctx.restore();
    },
};
class circleLine {
    constructor(startX, startY, currentX, currentY) {
        this.startX = startX;
        this.startY = startY;
        this.currentX = currentX;
        this.currentY = currentY;
        this.sinValue = c.getRandomNumber(1, 360);
        this.radians = c.getRandomNumber(1, 100);

    } draw(x, y) {
        let scaleFactor = c.getScaleFactor(x, y, canvas.mainX, canvas.mainY);
        let ctx = c.gC();
        //Line
        ctx.lineWidth = 2;

        let grad = ctx.createRadialGradient(canvas.mainX, canvas.mainY,300, canvas.mainX, canvas.mainY, 200); 
        grad.addColorStop(0, "#80ccff");//außen
        grad.addColorStop(1, "#66c2ff");//innen
        ctx.strokeStyle = grad;
  
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(canvas.mainX, canvas.mainY);

        ctx.stroke();

        //Endcircle
        let grad2 = ctx.createRadialGradient(canvas.mainX, canvas.mainY, 300, canvas.mainX, canvas.mainY, 200);
        grad2.addColorStop(0, "#4da9ff");//außen
        grad2.addColorStop(1, "#0080ff"); //innen

        ctx.strokeStyle = grad2;
        ctx.fillStyle = grad2;
        ctx.beginPath();
        ctx.arc(x, y, 0.01 * (1000 - (scaleFactor * 1000)), 0, Math.PI * 2, false);
        ctx.fill();
        ctx.stroke();
    }
    drawRandom() {
        this.sinValue += 1;
        let movingFactor = 0.005 * Math.sin(0.05 * this.sinValue);
        let finalVektorX = this.startX - canvas.mainX;
        let finalVektorY = this.startY - canvas.mainY;

        this.currentX += finalVektorX * (movingFactor/2);
        this.currentY += finalVektorY * (movingFactor/2);
        this.radians += canvas.rotationVelocity;
        this.currentX += Math.cos(this.radians)
        this.currentY += Math.sin(this.radians)

        //this.currentX = canvas.mainX + Math.cos(this.radians)*400 + movingFactor*10000;
        //this.currentY = canvas.mainY + Math.sin(this.radians)*400 + movingFactor*10000;

        this.draw(this.currentX, this.currentY);
    }
    drawToEndPosition() {
        let finalVektorX = this.startX - canvas.mainX;
        let finalVektorY = this.startY - canvas.mainY;

        let finalLengthVektor = Math.sqrt((finalVektorX * finalVektorX) + (finalVektorY * finalVektorY));
        let currentVektorX = this.currentX - canvas.mainX;
        let currentVektorY = this.currentY - canvas.mainY;
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
        let finalVektorX = this.startX - canvas.mainX;
        let finalVektorY = this.startY - canvas.mainY;
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
window.addEventListener("load", function () {
    setTimeout(canvas.createAll, 100);
});

let can = document.getElementById("canvas");
if (can) {
    can.addEventListener("click", (event) => {
        let bounds = can.getBoundingClientRect();
        let scaleX = can.width / bounds.width;
        let scaleY = can.height / bounds.height;
        let realX = (event.clientX - bounds.left) * scaleX;
        let realY = (event.clientY - bounds.top) * scaleY;
        canvas.addAnimatedObject(realX, realY);
    });
}

let isCanvasVisible = true;
let isTabVisible = !document.hidden;
let canvasAnimId = null;

function runCanvasLoop() {
    if (isCanvasVisible && isTabVisible) {
        canvas.animateObjects();
        canvasAnimId = requestAnimationFrame(runCanvasLoop);
    } else {
        canvasAnimId = null;
    }
}

function startCanvasAnim() {
    if (!canvasAnimId && isCanvasVisible && isTabVisible) {
        canvasAnimId = requestAnimationFrame(runCanvasLoop);
    }
}

function stopCanvasAnim() {
    if (canvasAnimId) {
        cancelAnimationFrame(canvasAnimId);
        canvasAnimId = null;
    }
}

if (can && "IntersectionObserver" in window) {
    const canvasObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            isCanvasVisible = entry.isIntersecting;
            if (isCanvasVisible) {
                startCanvasAnim();
            } else {
                stopCanvasAnim();
            }
        });
    });
    canvasObserver.observe(can);
}

document.addEventListener("visibilitychange", () => {
    isTabVisible = !document.hidden;
    if (isTabVisible) {
        startCanvasAnim();
    } else {
        stopCanvasAnim();
    }
});

startCanvasAnim();



