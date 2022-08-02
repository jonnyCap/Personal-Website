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
            default:
                console.log("falscher INdex!!!!!!!!!!!");
                break;
        }
    },
    setUpJournyCanvas: function () {
        journyCanvas.drawCircleLine(0, journyCanvas.startX, journyCanvas.startY, 260);
        journyCanvas.drawCircleLine(0, journyCanvas.startX, 290, 285);
        journyCanvas.drawCircleLine(0, journyCanvas.startX, 575, 310);
        journyCanvas.drawCircleLine(0, journyCanvas.startX, 885, 260);
        journyCanvas.drawCircleLine(0, journyCanvas.startX, 1145, 0);
    },
    setUpAppCanvas: function () {
        journyCanvas.drawCircleLine(1, journyCanvas.startX, journyCanvas.startY, 260);
        journyCanvas.drawCircleLine(1, journyCanvas.startX, 290, 285);
        journyCanvas.drawCircleLine(1, journyCanvas.startX, 575, 310);
        journyCanvas.drawCircleLine(1, journyCanvas.startX, 885, 260);
        journyCanvas.drawCircleLine(1, journyCanvas.startX, 1145, 0);
    },
    setUpWebsiteCanvas: function () {
        journyCanvas.drawCircleLine(2, journyCanvas.startX, journyCanvas.startY, 260);
        journyCanvas.drawCircleLine(2, journyCanvas.startX, 290, 285);
        journyCanvas.drawCircleLine(2, journyCanvas.startX, 575, 310);
        journyCanvas.drawCircleLine(2, journyCanvas.startX, 885, 260);
        journyCanvas.drawCircleLine(2, journyCanvas.startX, 1145, 0);
    },
    setUpMiniGamesCanvas: function () {
        journyCanvas.drawCircleLine(3, journyCanvas.startX, journyCanvas.startY, 260);
        journyCanvas.drawCircleLine(3, journyCanvas.startX, 290, 285);
        journyCanvas.drawCircleLine(3, journyCanvas.startX, 575, 310);
        journyCanvas.drawCircleLine(3, journyCanvas.startX, 885, 260);
        journyCanvas.drawCircleLine(3, journyCanvas.startX, 1145, 0);
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
