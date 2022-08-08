const journyCanvas = {
    startX: 50,
    startY: 30,
    radius: 6,
    distance: 10,
    gC: function (index) {
        let secondaryCanvas;
        switch (index) {
            case 0:
                secondaryCanvas = document.getElementById("canvas0");
                break;
            case 1:
                secondaryCanvas = document.getElementById("canvas1");
                break;
            case 2:
                secondaryCanvas = document.getElementById("canvas2");
                break;
            case 3:
                secondaryCanvas = document.getElementById("canvas3");
                break;
            default:
                break;
        }
        return secondaryCanvas.getContext("2d");
    },
    chooseCanvas(index) {
        console.log("chooseCanvas function has index: " + index);
        switch (index) {
            case 0:
                journyCanvas.setUpJournyCanvas();
                break;
            case 1:
                journyCanvas.setUpAppCanvas();
                break;
            case 2:
                journyCanvas.setUpWebsiteCanvas();
                break;
            case 3:
                journyCanvas.setUpMiniGamesCanvas();
                break;
            case "0":
                journyCanvas.setUpJournyCanvas();
                break;
            case "1":
                journyCanvas.setUpAppCanvas();
                break;
            case "2":
                journyCanvas.setUpWebsiteCanvas();
                break;
            case "3":
                journyCanvas.setUpMiniGamesCanvas();
                break;
        }
    },
    setUpJournyCanvas: function () {
        journyCanvas.drawCircleLine(0, journyCanvas.startX, journyCanvas.startY, 265);
        journyCanvas.drawCircleLine(0, journyCanvas.startX, 295, 310);
        journyCanvas.drawCircleLine(0, journyCanvas.startX, 605, 345);
        journyCanvas.drawCircleLine(0, journyCanvas.startX, 950, 260);
        journyCanvas.drawCircleLine(0, journyCanvas.startX, 1210, 0);
    },
    setUpAppCanvas: function () {
        journyCanvas.drawCircleLine(1, journyCanvas.startX, journyCanvas.startY, 210);
        journyCanvas.drawCircleLine(1, journyCanvas.startX, 240, 320);
        journyCanvas.drawCircleLine(1, journyCanvas.startX, 560, 805);
        journyCanvas.drawCircleLine(1, journyCanvas.startX, 1365, 210);
        journyCanvas.drawCircleLine(1, journyCanvas.startX, 1575, 750);
        journyCanvas.drawCircleLine(1, journyCanvas.startX, 2325, 0);
    },
    setUpWebsiteCanvas: function () {
        journyCanvas.drawCircleLine(2, journyCanvas.startX, journyCanvas.startY, 880);
        journyCanvas.drawCircleLine(2, journyCanvas.startX, 910, 660);
        journyCanvas.drawCircleLine(2, journyCanvas.startX, 1570, 0);
    },
    setUpMiniGamesCanvas: function () {
        journyCanvas.drawCircleLine(3, journyCanvas.startX, journyCanvas.startY, 1015);
        journyCanvas.drawCircleLine(3, journyCanvas.startX, 1045, 815);
        journyCanvas.drawCircleLine(3, journyCanvas.startX, 1860, 235);
        journyCanvas.drawCircleLine(3, journyCanvas.startX, 2095, 240);
        journyCanvas.drawCircleLine(3, journyCanvas.startX, 2335, 0);
    },
    //function gets called when scrollDownButton is called to push performance
    drawCircleLine: function (index,x, y, length) {
        let ctx = journyCanvas.gC(index);
        ctx.strokeStyle = "#549bcf";
        ctx.fillStyle = "#549bcf";
        ctx.beginPath();
        ctx.arc(x, y + journyCanvas.distance, journyCanvas.radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.stroke();
        if (length != 0) {
            ctx.strokeStyle = "#549bcf";
            ctx.fillStyle = "#549bcf";
            ctx.beginPath();
            ctx.moveTo(x, y + (journyCanvas.distance * 2));
            ctx.lineTo(x, y + length);
            ctx.fill();
            ctx.stroke();
        }
    },
    drawActiveCircle: function (index) {


    }
}
