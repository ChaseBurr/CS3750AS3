"use strict";

// Create connection
var connection = new signalR.HubConnectionBuilder().withUrl("/gameHub").build();

// Start connection
connection.start().then(function () {
    console.log("connected");
});

// Variables
let canvas, ctx, cellSize;
let cellDensity = 20;
let canvasSize = 800;
let cells = [];

window.addEventListener('load', function () {
    canvas = document.getElementById('board');
    canvas.width = canvas.height = canvasSize;
    canvas.addEventListener('mousedown', function (e) {
        canvasClick(canvas, e);
    });

    ctx = canvas.getContext('2d');

    cellSize = Math.floor(canvas.width / cellDensity);
    drawGrid();

    // control events
    document.getElementById('timeIntervalSlider').addEventListener('change', (e) => connection.invoke('AutoGenerationInterval', parseInt(e.target.value)));
    document.getElementById('pausePlayButton').addEventListener('click', (e) => connection.invoke('AutoGenerationToggle'));
    document.getElementById('iterateButton').addEventListener('mousedown', () => connection.invoke('NextGeneration'));
});

/* Client Display Start */
function drawGrid() {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Vertical lines
    for (let x = 0; x <= canvasSize; x += cellSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasSize);
    }

    // Draw Horizontal lines
    for (let x = 0; x <= canvasSize; x += cellSize) {
        ctx.moveTo(0, x);
        ctx.lineTo(canvasSize, x);
    }

    // Set color and display lines
    ctx.strokeStyle = "black";
    ctx.stroke();

    // Draws tiles
    for (let i = 0; i < cells.length; i++) cells[i].draw(ctx);
}

class cell {
    constructor(x, y, red, green, blue) {
        var _this = this;
        (function () {
            _this.x = x || null;
            _this.y = y || null;
            _this.red = red || 0;
            _this.green = green || 0;
            _this.blue = blue || 0;
        })();

        this.draw = function (ctx) {
            if (typeof _this.x == 'undefined' || typeof _this.y == 'undefined') {
                console.log('Error of the undefined...');
                return;
            }
            let cellBorder = 4;
            ctx.beginPath();
            ctx.fillStyle = "rgb(" + _this.red + ', ' + _this.green + ', ' + _this.blue + ")";
            ctx.fillRect((_this.x * cellSize) + cellBorder, (_this.y * cellSize) + cellBorder, cellSize - (cellBorder * 2), cellSize - (cellBorder * 2));
        };
    }
}
/* Client Display End */


/* Server Interactions Start */
connection.on("UpdateCells", (cellsFromServer) => {
    // empty and fill cell array
    cells = [];
    cellsFromServer.forEach(element => cells.push(new cell(element.x, element.y, element.red, element.green, element.blue)));
    console.log("updating board");
    drawGrid();
});
connection.on("ChangeIntervalSlider", (interval) => document.getElementById("timeIntervalSlider").value = interval);
connection.on("ChangePlayStopButton", (playStop) => document.getElementById("pausePlayButton").value = (playStop ? "Stop" : "Play"));

function canvasClick(canvas, event) {
    // get click position within canvas element
    let rect = canvas.getBoundingClientRect();
    let x = Math.floor((event.clientX - rect.left) / cellSize);
    let y = Math.floor((event.clientY - rect.top) / cellSize);

    // Sends updated tile server side
    connection.invoke("SendNewCells", x, y);
}
/* Server Interections End */