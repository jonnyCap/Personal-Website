
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
        setTimeout(function () {
            window.scrollTo(0, 0);
        }, 1);
        sDButton.turnButton(0, -50);

        if (sDButton.disappeared == false) {
            sDButton.disappear();
        }
    },
    scrollDown: function () {
        setTimeout(function () {
            window.scrollTo(0, 900);
        }, 100);
        sDButton.turnButton(180, 50);
        if (sDButton.appeared == false) {
            sDButton.appear();
        }
    },
    turnButton: function (rotation, translation,) {
        let button = document.getElementsByClassName("scrollButton");
        let currentRotation, currentTranslation;
        if (rotation == 0) {
            currentRotation = 180;
        } else {
            currentRotation = 0;
        }
        let rotationInterval = setInterval(function () {
            if (rotation == 180 && currentRotation >= rotation) {
                clearInterval(rotationInterval);
                button[0].style.transform = "rotate(" + rotation + "deg)";
            }else if (rotation == 0 && currentRotation <= rotation) {
                clearInterval(rotationInterval);
                button[0].style.transform = "rotate(" + rotation + "deg)";
            }else {
                button[0].style.transform = "rotate(" + currentRotation + "deg)";
                if (rotation == 180) {
                    currentRotation += 2;
                } else {
                    currentRotation -= 2;
                }
            }
        }, 10);
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
        sDButton.disappeared = true;
        let opacity = 1;
        const elements = document.getElementsByClassName("secondaryContentSection");
        
        let height = elements[0].offsetHeight;
        let interval = setInterval(function () {
            if (opacity <= 0 && height <= 0) {
                clearInterval(interval);
                elements[0].style.display = "none";
                sDButton.disappeared = false;
            }
            elements[0].style.height = height + "px";
            elements[0].style.opacity = opacity;       
            opacity -= 0.01;
            if (height > 0) {
                height -= 20;
            } else {
                height = 0;
                elements[0].style.display = "none";
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
    expansionRadiusUpper: 0,
    expansionRadiusLower: 0,
    arrowExpansionUpper: 0,
    arrowExpansionLower: 0,
    centerX: 100,
    centerY: 100,
    colorUp: "white",
    colorDown: "lightBlue",//"#549bcf"
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
        let arrow1 = new Arrow(165);
        buttonCanvas.downArrows.push(arrow1);

        let arrow2 = new Arrow(185);
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
                if (MediaRes.size800 == false && i < 2) {
                    buttonCanvas.colorUp = "#e6f5ff";
                }else{
                    buttonCanvas.circleFractures[i].draw(0);
                }
            }
            if (MediaRes.size800 == true) {
                for (let i = 0; i < buttonCanvas.downArrows.length; i++) {
                    buttonCanvas.downArrows[i].draw(0);
                }
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
                if (MediaRes.size800 == false) {
                    buttonCanvas.colorUp = "#e6f5ff";
                } else { 
                    buttonCanvas.colorUp = color;
                }
                break;
            case 1:
                buttonCanvas.colorDown = color;
                break;
        }
    },
    expandRadius: function (index) {
        switch (index) {
            case 0:
                if (MediaRes.size800 == true) {
                    buttonCanvas.expansionRadiusUpper = 30;
                } else {
                    buttonCanvas.expansionRadiusUpper = 10;
                }
                break;
            case 1:
                buttonCanvas.expansionRadiusLower = 30;
                break;
        } 
    },
    diminishRadius: function (index) {
        switch (index) {
            case 0:
                buttonCanvas.expansionRadiusUpper = 0;
                break;
            case 1:
                buttonCanvas.expansionRadiusLower = 0;
                break;
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
                buttonCanvas.expandRadius(index);
                buttonCanvas.pushArrowDown();
                break;
            case 1:
                buttonCanvas.diminishRadius(index);
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
        let expansion;
        switch (index) {
            case 0:
                context.strokeStyle = buttonCanvas.colorUp;
                expansion = buttonCanvas.expansionRadiusUpper;
                break;
            case 1:
                context.strokeStyle = buttonCanvas.colorDown;
                expansion = buttonCanvas.expansionRadiusLower;
                break;
        }

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
        let ctx = buttonCanvas.gC(index);
        let expansion;
        switch (index) {
            case 0:
                expansion = buttonCanvas.arrowExpansionUpper;
                ctx.strokeStyle = buttonCanvas.colorUp;
                break;
            case 1:
                expansion = buttonCanvas.arrowExpansionLower;
                ctx.strokeStyle = buttonCanvas.colorDown;
                break;
        }
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.lineTo(buttonCanvas.centerX - 15, this.height + expansion);
        ctx.lineTo(buttonCanvas.centerX, this.height + 10 + expansion);
        ctx.lineTo(buttonCanvas.centerX + 15, this.height + expansion);
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
    buttonCanvas.finalButtonAdaption(1, "white", 0);
});

scrollButton[1].addEventListener("click", sDButton.work);
scrollButton[1].addEventListener("mouseover", function () {
    buttonCanvas.finalButtonAdaption(0, "lightBlue", 1);
});
scrollButton[1].addEventListener("mouseout", function () {
    buttonCanvas.finalButtonAdaption(1, "lightBlue", 1);
});


document.addEventListener('DOMContentLoaded', function () {
    buttonCanvas.createFractures(0);
    buttonCanvas.animate();
});



