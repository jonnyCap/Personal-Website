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
        }
        return secondaryCanvas.getContext("2d");
    },
    chooseCanvas(index) {
        console.log("chooseCanvas function has index: " + index);
        switch (index) {
            case 0:
                journyCanvas.setUpJournyCanvas();
                console.log("journy");
                break;
            case 1:
                journyCanvas.setUpAppCanvas();
                console.log("app");
            case "0":
                journyCanvas.setUpJournyCanvas();
                console.log("journy");
                break;
            case "1":
                journyCanvas.setUpAppCanvas();
                console.log("app");
            default:
                console.log("falscher INdex!!!!!!!!!!!");
                break;
        }
    },
    setUpAppCanvas: function () {
        journyCanvas.drawCircleLine(1, journyCanvas.startX, journyCanvas.startY, 260);
        journyCanvas.drawCircleLine(1, journyCanvas.startX, 290, 285);
        journyCanvas.drawCircleLine(1, journyCanvas.startX, 575, 310);
        journyCanvas.drawCircleLine(1, journyCanvas.startX, 885, 260);
        journyCanvas.drawCircleLine(1, journyCanvas.startX, 1145, 0);
    },
    setUpJournyCanvas: function () {
        journyCanvas.drawCircleLine(0,journyCanvas.startX, journyCanvas.startY, 260);
        journyCanvas.drawCircleLine(0,journyCanvas.startX, 290, 285);
        journyCanvas.drawCircleLine(0,journyCanvas.startX, 575, 310);
        journyCanvas.drawCircleLine(0,journyCanvas.startX, 885, 260);
        journyCanvas.drawCircleLine(0,journyCanvas.startX, 1145, 0);

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
    drawActiveCircle: function () {

    }
}
