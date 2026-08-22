/**
 * timeline-canvas.js
 * Draws the connected milestone nodes (dots & vertical line) on the About Me timeline canvas.
 */

const journyCanvas = {
    startX: 50,
    startY: 30,
    radius: 6,
    distance: 10,

    gC: function (index = 0) {
        const canvas = document.getElementById("canvas0");
        return canvas instanceof HTMLCanvasElement ? canvas.getContext("2d") : null;
    },

    chooseCanvas: function (index) {
        if (index === 0 || index === "0") {
            journyCanvas.setUpJournyCanvas();
        }
    },

    setUpJournyCanvas: function () {
        const canvas = document.getElementById("canvas0");
        if (!(canvas instanceof HTMLCanvasElement)) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const container = canvas.closest(".alignSecondaryContent") || document.querySelector(".alignSecondaryContent");
        if (!container) return;

        // ONLY query headers belonging to this specific About Me section
        /** @type {NodeListOf<HTMLElement>} */
        const headers = container.querySelectorAll(".secondaryContentTextHeader");
        if (headers.length === 0) return;

        const canvasRect = canvas.getBoundingClientRect();
        const textContainer = container.querySelector(".secondaryContentText");
        let nodeYs = [];

        const firstHeader = headers[0];
        // Check if layout is rendered with non-zero dimensions
        if (canvasRect.height > 50 && firstHeader && firstHeader.offsetHeight > 0) {
            headers.forEach(h => {
                const hRect = h.getBoundingClientRect();
                // Exact center alignment relative to canvas top
                const centerY = (hRect.top - canvasRect.top) + (hRect.height / 2);
                nodeYs.push(centerY);
            });
        } else if (textContainer && firstHeader && firstHeader.offsetTop > 0) {
            headers.forEach(h => {
                nodeYs.push(h.offsetTop + (h.offsetHeight / 2));
            });
        }

        // Fallback to exact pixel positions matching the 3 About Me subheaders
        if (nodeYs.length !== headers.length || nodeYs.length < 3 || nodeYs[0] === nodeYs[1]) {
            nodeYs = [28, 235, 480];
        }

        // Limit strictly to the exact number of headers present in the section (3)
        nodeYs = nodeYs.slice(0, headers.length);

        if (nodeYs.length === 0) return;

        // Draw connecting vertical lines ONLY between the defined milestone dots
        ctx.strokeStyle = "#549bcf";
        ctx.fillStyle = "#549bcf";
        ctx.lineWidth = 2;

        ctx.beginPath();
        for (let i = 0; i < nodeYs.length - 1; i++) {
            ctx.moveTo(journyCanvas.startX, nodeYs[i] + journyCanvas.radius);
            ctx.lineTo(journyCanvas.startX, nodeYs[i + 1] - journyCanvas.radius);
        }
        ctx.stroke();

        // Draw solid circular milestone dots for each header
        nodeYs.forEach(y => {
            ctx.beginPath();
            ctx.arc(journyCanvas.startX, y, journyCanvas.radius, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.stroke();
        });
    },

    drawCircleLine: function (index, x, y, length) {
        journyCanvas.setUpJournyCanvas();
    }
};

const journeyCanvas = journyCanvas;

// Initial setup and responsive listeners
document.addEventListener("DOMContentLoaded", () => {
    journyCanvas.setUpJournyCanvas();
    // Re-verify positions once fonts/styles finish rendering
    setTimeout(() => journyCanvas.setUpJournyCanvas(), 250);
});

window.addEventListener("resize", () => {
    journyCanvas.setUpJournyCanvas();
});
