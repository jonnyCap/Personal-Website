
const sDButton = {
    appeared: false,
    disappeared: false,
    clicked: true,
    cooledDown: true,
    work: function () {
        if (sDButton.cooledDown == true) {
            switch (sDButton.clicked) {
                case true:
                    sDButton.scrollDown();
                    sDButton.clicked = false;
                    sDButton.cooledDown = false;
                    break;
                case false:
                    sDButton.scrollUp();
                    sDButton.clicked = true;
                    sDButton.cooledDown = false;
                    break;
            }
            sDButton.coolDown();
        } else {
            let button = document.getElementsByClassName("scrollButton");
            button[0].style.background = "red";
            setTimeout(function () {
                button[0].style.background = "white";
            }, 1000);
        }
        
    },
    scrollUp: function () {
        window.scrollTo(0, 0);
        if (sDButton.disappeared == false) {
            sDButton.disappear();
        }
    },
    scrollDown: function () {
        window.scrollTo(0, 600);
        sDButton.turnButton();
        if (sDButton.appeared == false) {
            sDButton.appear();
        }
    },
    turnButton: function () {
        let button = document.getElementsByClassName("scrollButton");
        button[0].style.transform = "translate(180 %, 0)";
    },
    appear: function () {
        //set display to block
        const elements = document.getElementsByClassName("secondaryContentSection");
        elements[0].style.display = "block";
        elements[0].style.height = "auto";
        
        //interval
        let opacity = 0;
        sDButton.appeared = true;       
        let interval = setInterval(function () {
            if (opacity >= 1) {
                clearInterval(interval);
                sDButton.appeared = false;
            }
            elements[0].style.opacity = opacity;
            opacity += 0.01;
        }, 10);
        
    },
    disappear: function () {
        //interval first
        console.log("disappearing");
        sDButton.disappeared = true;
        let opacity = 1;
        const elements = document.getElementsByClassName("secondaryContentSection");
        
        let height = elements[0].offsetHeight;
        let interval = setInterval(function () {
            if (opacity <= 0) {
                clearInterval(interval);
                sDButton.disappeared = false;
                
            }
            elements[0].style.height = height + "px";
            elements[0].style.opacity = opacity;       
            opacity -= 0.01;
            if (height > 0) {
                height -= 20;
            } else {
                height = 0;
                elements[0].style.display = "none"
            }
            
        }, 10);
    },
    coolDown: function () {
        setTimeout(function () {
            sDButton.cooledDown = true;
        }, 1000);
    }
};
const buttonCanvas = {
    circleFractures: [],
    downArrows: [],
    upArrows: [],
    centerX: 100,
    centerY: 75,
    colorUp: "#549bcf",
    colorDown: "#549bcf",//"#549bcf"
    gC: function (index) {
        switch (index) {
            case 0:
                let secondaryCanvas = document.getElementById("clickAnimationCanvas");
                return secondaryCanvas.getContext("2d");
                break;
            case 1:
                let secondaryCanvasUp = document.getElementById("clickAnimationCanvasUp");
                return secondaryCanvasUp.getContext("2d");
                break;
        }
    },
    createFractures: function (index) {
        //circles
        let circle0 = new circleFracture(25, 0.4, 60, 1);
        buttonCanvas.circleFractures.push(circle0);

        let circle = new circleFracture(25, 0.2, 160, 2);
        buttonCanvas.circleFractures.push(circle);

        let circle1 = new circleFracture(40, 0.7, 120 , 2);
        buttonCanvas.circleFractures.push(circle1);

        let circle2 = new circleFracture(40, 0.5, 300, 1);
        buttonCanvas.circleFractures.push(circle2);

        let circle3 = new circleFracture(55, 0.4, 190, 2);
        buttonCanvas.circleFractures.push(circle3);

        let circle4 = new circleFracture(55, 0.7, 40, 1);
        buttonCanvas.circleFractures.push(circle4);

        buttonCanvas.createArrow();

    },
    createArrow: function() {
        let arrow1 = new Arrow(140);
        buttonCanvas.downArrows.push(arrow1);

        let arrow2 = new Arrow(160);
        buttonCanvas.downArrows.push(arrow2);
    },
    animate: function () {
        //clear Canvas
        let ctxUp = buttonCanvas.gC(0);
        let ctxDown = buttonCanvas.gC(1);
        //draw Elements
        let interval = setInterval(function () {
            ctxUp.clearRect(0, 0, 200, 250);
            ctxDown.clearRect(0, 0, 200, 250);
            for (let i = 0; i < buttonCanvas.circleFractures.length; i++) {
                buttonCanvas.circleFractures[i].draw(0);
            }
            for (let i = 0; i < buttonCanvas.downArrows.length; i++) {
                buttonCanvas.downArrows[i].draw(0);
            }
            for (let i = 0; i < buttonCanvas.circleFractures.length; i++) {
                buttonCanvas.circleFractures[i].draw(1);
            }
            for (let i = 0; i < buttonCanvas.downArrows.length; i++) {
                buttonCanvas.downArrows[i].draw(1);
            }
        }, 10);
    },
    changeColor(color, index) {
        switch (index) {
            case 0:
                buttonCanvas.colorUp = color;
                break;
            case 1:
                buttonCanvas.colorDown = color;
                break;
        }
    },
    expandRadius: function () {
        for (let i = 0; i < buttonCanvas.circleFractures.length; i++) {
            buttonCanvas.circleFractures[i].radius += 30;
            buttonCanvas.circleFractures[i].speed -= 2 * buttonCanvas.circleFractures[i].speed;
        }
    },
    diminishRadius: function () {
        for (let i = 0; i < buttonCanvas.circleFractures.length; i++) {
            buttonCanvas.circleFractures[i].radius -= 30;
            buttonCanvas.circleFractures[i].speed -= 2 * buttonCanvas.circleFractures[i].speed;
        }
    },
    pushArrowDown: function () {
        for (let i = 0; i < buttonCanvas.downArrows.length; i++) {
            buttonCanvas.downArrows[i].height += 30;
        }
    },
    pushArrowUp: function () {
        for (let i = 0; i < buttonCanvas.downArrows.length; i++) {
            buttonCanvas.downArrows[i].height -= 30;
        }
    },
    finalButtonAdaption(outIN, color, index) {
        switch (outIN) {
            case 0:
                buttonCanvas.expandRadius();
                buttonCanvas.pushArrowDown();
                break;
            case 1:
                buttonCanvas.diminishRadius();
                buttonCanvas.pushArrowUp();
                break;
        }
        buttonCanvas.changeColor(color, index);
    }
}

class circleFracture {
    constructor(radius, length, rotation, speed) {
        this.radius = radius;
        this.length = length;
        this.rotation = rotation;
        this.speed = speed;
    }
    draw(index) {
        let context = buttonCanvas.gC(index);
        //increase Values
        this.rotation += this.speed;
        let rad = this.rotation * Math.PI / 180;
        context.save();
        context.translate(buttonCanvas.centerX, buttonCanvas.centerY);
        context.rotate(rad);
        //draw Element
        switch (index) {
            case 0:
                context.strokeStyle = buttonCanvas.colorUp;
                break;
            case 1:
                context.strokeStyle = buttonCanvas.colorDown;
                break;
        }

        context.beginPath();
        context.arc(0, 0, this.radius, 0, this.length * Math.PI, false);
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
        let ctx = buttonCanvas.gC(index);
        switch (index) {
            case 0:
                ctx.strokeStyle = buttonCanvas.colorUp;
                break;
            case 1:
                ctx.strokeStyle = buttonCanvas.colorDown;
                break;
        }
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.lineTo(buttonCanvas.centerX - 15, this.height);
        ctx.lineTo(buttonCanvas.centerX, this.height + 10);
        ctx.lineTo(buttonCanvas.centerX + 15, this.height);
        ctx.stroke();
    }
}

//buttonListener
const scrollButton = document.getElementsByClassName("scrollButton");

scrollButton[0].addEventListener("click", sDButton.work);
scrollButton[0].addEventListener("mouseover", function () {
    buttonCanvas.finalButtonAdaption(0, "white", 0);
});
scrollButton[0].addEventListener("mouseout", function () {
    buttonCanvas.finalButtonAdaption(1, "#549bcf", 0);
});

scrollButton[1].addEventListener("click", sDButton.work);
scrollButton[1].addEventListener("mouseover", function () {
    buttonCanvas.finalButtonAdaption(0, "lightBlue", 1);
});
scrollButton[1].addEventListener("mouseout", function () {
    buttonCanvas.finalButtonAdaption(1, "#549bcf", 1);
});


document.addEventListener('DOMContentLoaded', function () {
    buttonCanvas.createFractures(0);
    buttonCanvas.createFractures(1);
    buttonCanvas.animate();
});



