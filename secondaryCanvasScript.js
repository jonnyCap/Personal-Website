//secondaryCanvas

const c = {
    gC: function () {
        let secondaryCanvas = document.getElementById("secondaryCanvas");
        return secondaryCanvas.getContext("2d");

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
    drawnObjectsCounter: 30,
    addedObjects: [],
    removedObjects: [],
    mainX: 1100,
    mainY: 475,
    rotationVelocity: 0.02,
    createAll: function () {
        // secondaryCanvas.relocateMainPoints();
        for (let i = 0; i < 20; i++) {
            let x = c.getRandomNumber(100, 500);
            let y = c.getRandomNumber(100, 800);
            let circle = new circleLine(x, y, x, y);
            secondaryCanvas.drawnObjects.push(circle);
        }
        for (let i = 0; i < 8; i++) {
            let x = c.getRandomNumber(500,1000);
            let y = c.getRandomNumber(100, 400);
            let circle = new circleLine(x, y, x, y);
            secondaryCanvas.drawnObjects.push(circle);
        }
        for (let i = 0; i < 8; i++) {
            let x = c.getRandomNumber(500, 1000);
            let y = c.getRandomNumber(500, 800);
            let circle = new circleLine(x, y, x, y);
            secondaryCanvas.drawnObjects.push(circle);
        }
        for (let i = 0; i < 9; i++) {
            let x = c.getRandomNumber(1000, 1300);
            let y = c.getRandomNumber(100, 400);
            let circle = new circleLine(x, y, x, y);
            secondaryCanvas.drawnObjects.push(circle);
        }
        for (let i = 0; i < 6; i++) {
            let x = c.getRandomNumber(1000, 1300);
            let y = c.getRandomNumber(600, 800);
            let circle = new circleLine(x, y, x, y);
            secondaryCanvas.drawnObjects.push(circle);
        }
    },
    checkForCloseObjects() {
        let index = 0;
        for (let i = 0; i < secondaryCanvas.drawnObjects.length; i++) {
            for (let j = index; j < secondaryCanvas.drawnObjects.length; j++) {
                if (i != j) {
                   if (Math.abs(secondaryCanvas.drawnObjects[i].currentX - secondaryCanvas.drawnObjects[j].currentX) < 70 && Math.abs(secondaryCanvas.drawnObjects[i].currentY - secondaryCanvas.drawnObjects[j].currentY) < 70) {
                        secondaryCanvas.drawLine(secondaryCanvas.drawnObjects[i].currentX, secondaryCanvas.drawnObjects[i].currentY, secondaryCanvas.drawnObjects[j].currentX, secondaryCanvas.drawnObjects[j].currentY);
                    }
                }
            }
            index++;
        }
    },
    animateObjects() {
        secondaryCanvas.clearsecondaryCanvas();
        secondaryCanvas.checkForCloseObjects();
        for (let i = 0; i < secondaryCanvas.drawnObjects.length; i++) {
            secondaryCanvas.drawnObjects[i].drawRandom();
        }
        for (let i = 0; i < secondaryCanvas.addedObjects.length; i++) {
            if (secondaryCanvas.addedObjects[i].drawToEndPosition()) {
                secondaryCanvas.drawnObjects.push(secondaryCanvas.addedObjects[0]);
                secondaryCanvas.addedObjects.splice(i, 1);
            }
        }
        for (let i = 0; i < secondaryCanvas.removedObjects.length; i++) {
            if (secondaryCanvas.removedObjects[i].drawToStartPosition()) {
                secondaryCanvas.removedObjects.splice(i, 1);
            }
        }
    },
    refreshPage: function () {
        secondaryCanvas.clearsecondaryCanvas();
        secondaryCanvas.animateObjects();
    },

    createCircleOnClick: function (x, y) {
        if (x > 600) {
            let circle = new circleLine(x, y);
            secondaryCanvas.drawnObjects.push(circle);
        }
    },

    removeObject: function () {
        secondaryCanvas.drawnObjects.shift();
    },

    clearsecondaryCanvas: function () {
        let can = document.getElementById("secondaryCanvas");
        let ctx = c.gC();
        ctx.clearRect(0, 0, can.width, can.height);
    },

    addAnimatedObject: function (endX, endY) {
        circle = new circleLine(endX, endY, secondaryCanvas.mainX, secondaryCanvas.mainY);
        secondaryCanvas.addedObjects.push(circle);
        secondaryCanvas.removedObjects.push(secondaryCanvas.drawnObjects[0]);
        secondaryCanvas.drawnObjects.shift();

    },
    drawLine: function (startX, startY, endX, endY) {
        let ctx = c.gC();
        ctx.lineWidth = 2;
        let opacity = 1 - (c.getScaleFactor(startX, startY, endX, endY) * 10);

        ctx.save();

        ctx.strokeStyle = "#d7e8f4";
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
        let scaleFactor = c.getScaleFactor(x, y, secondaryCanvas.mainX, secondaryCanvas.mainY);
        let ctx = c.gC();
        //Line
        ctx.lineWidth = 2;

        let grad = ctx.createRadialGradient(secondaryCanvas.mainX, secondaryCanvas.mainY, 200, secondaryCanvas.mainX, secondaryCanvas.mainY, 100);
        grad.addColorStop(0, "#98c6e6");//außen
        grad.addColorStop(1, "#98c6e6");//innen
        ctx.strokeStyle = grad;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(secondaryCanvas.mainX, secondaryCanvas.mainY);

        ctx.stroke();

        //Endcircle
        let grad2 = ctx.createRadialGradient(secondaryCanvas.mainX, secondaryCanvas.mainY, 600, secondaryCanvas.mainX, secondaryCanvas.mainY, 400);
        grad2.addColorStop(0, "#d6e8f5");//außen #4da9ff
        grad2.addColorStop(1, "#eaf4fa"); //innen #0080ff

        ctx.strokeStyle = grad2;
        ctx.fillStyle = grad2;
        ctx.beginPath();
        ctx.arc(x, y, (3 - (scaleFactor * 2))* 6, 0, Math.PI * 2, false);
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
        this.currentX += Math.cos(this.radians)
        this.currentY += Math.sin(this.radians)

        //this.currentX = secondaryCanvas.mainX + Math.cos(this.radians)*400 + movingFactor*10000;
        //this.currentY = secondaryCanvas.mainY + Math.sin(this.radians)*400 + movingFactor*10000;

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
window.onload = setTimeout(secondaryCanvas.createAll, 100);

let can = document.getElementById("secondaryCanvas");
can.addEventListener("click", (event) => {
    console.log("clicked");
    let x = event.clientX;
    let y = event.clientY;
    const section = document.getElementsByTagName("section");
    let bounds = section[1].getBoundingClientRect();
    let realX = x - bounds.left;
    let realY = y - bounds.top;
    secondaryCanvas.addAnimatedObject(realX, realY);
});

setInterval(secondaryCanvas.animateObjects, 20);




