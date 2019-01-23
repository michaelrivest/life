
let stop = document.getElementById('stop');
let start = document.getElementById('start');
let coordDisplay = document.getElementById('coordDisplay')
let gameBoard = document.getElementById("board");
let ctx = gameBoard.getContext("2d");
let gridSizeX;
let gridSizeY;
let cellSize = 4;
let genDelay;
let tTime = 0;
let aveTime = 0;

let bgColor = "rgb(240,240,240)"
let cellColor = "blue";

function createCell() {
    return { alive: false, tonari: [], livingCount: 0 }
}

class Game {
    constructor(sizeX, sizeY, display) {
        this.display = display;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.generation = 0;

        this.board = (new Array(sizeX)).fill(null)
            .map((t, j) => (new Array(sizeY)).fill(null)
                .map((u, i) => createCell()));

        for (let x = 0; x < sizeX; x++) {
            for (let y = 0; y < sizeY; y++) {
                this.board[x][y].tonari = this.getTonari(x, y);
            }
        }
    }

    getTonari(x, y) {
        let tonari = [];
        let b = this.board;
        if (x != 0) {
            tonari.push(b[x - 1][y]);
            if (y != 0) tonari.push(b[x - 1][y - 1]);
            if (y < this.sizeY - 1) tonari.push(b[x - 1][y + 1])
        }

        if (x < this.sizeX - 1) {
            tonari.push(b[x + 1][y]);
            if (y < this.sizeY - 1) tonari.push(b[x + 1][y + 1])
            if (y != 0) tonari.push(b[x + 1][y - 1]);
        }
        if (y != 0) tonari.push(b[x][y - 1]);
        if (y < this.sizeY - 1) tonari.push(b[x][y + 1]);
        return tonari;
    }

    nextGeneration() {
        this.generation++;

        for (let x = 0; x < this.sizeX; x++) {
            for (let y = 0; y < this.sizeY; y++) {
                let living = this.board[x][y].tonari.filter(t => t.alive).length;
                this.board[x][y].livingCount = living;
            }
        }

        for (let x = 0; x < this.sizeX; x++) {
            for (let y = 0; y < this.sizeY; y++) {
                let cell = this.board[x][y];
                if (cell.alive) {
                    if (cell.livingCount != 2 && cell.livingCount != 3) {
                        cell.alive = false;
                        drawCircle(x, y, true);
                    }
                } else {
                    if (cell.livingCount == 3) {
                        cell.alive = true;
                        drawCircle(x, y);
                    }
                }
            }
        }

    }

}

function init(sizeX, sizeY) {
    console.log("Initializing %d x %d Game Board", sizeX, sizeY);

    gridSizeX = sizeX * cellSize;
    gridSizeY = sizeY * cellSize;
    board.height = sizeY * cellSize;
    board.width = sizeX * cellSize;

    drawGrid(sizeX, sizeY);
    let controls = document.getElementById('controls')
    controls.style.width = gridSizeX + 'px';
    console.log(controls.style.width)
    console.log(controls)
    let game = new Game(sizeX, sizeY, ctx);
    return game;
}


function drawGrid(sizeX, sizeY) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, gridSizeX, gridSizeY);
}

function drawCircle(x, y, clear) {
    x = (x * cellSize)
    y = (y * cellSize)
    ctx.moveTo(x, y)
    ctx.beginPath();
    ctx.strokeWidth = cellSize;
    ctx.fillStyle = clear ? bgColor : cellColor;
    ctx.lineWidth = cellSize;
    ctx.rect(x, y, cellSize, cellSize);
    ctx.fill();
}
function drawRect(x, y, size) {
    x = (x * cellSize)
    y = (y * cellSize)
    ctx.moveTo(x, y)
    ctx.beginPath();
    ctx.fillStyle = cellColor;
    ctx.strokeStyle = cellColor;
    ctx.strokeWidth = cellSize;
    ctx.lineWidth = cellSize;
    ctx.fillRect(x, y, size * cellSize, size * cellSize);
}

function main(game) {
    let tDisplay = document.getElementById('timer')
    let tBuf = 20;
    genDelay = setInterval(() => {
        let t = new Date().getTime();
        game.nextGeneration();
        let dt = new Date().getTime() - t;
        tTime += dt;
        aveTime = tTime / game.generation;
        tDisplay.innerText = aveTime.toFixed(2);
        tBuf = dt + 2;
    }, tBuf)
}

let game = init(280, 150);

start.addEventListener('click', (e) => {
    main(game);
})
stop.addEventListener('click', (e) => {
    clearTimeout(genDelay);
})

function drawM(mode) {
    let shapes = document.getElementsByClassName('shapeButton');
    for (let shape of shapes) {
        shape.className = 'shapeButton';
    }
    drawMode = mode;
    let eleId = mode + "Button"
    let ele = document.getElementById(eleId)
    ele.parentElement.className = 'shapeButton selected';

    console.log(drawMode)
}

let drawMode = 'rect';
board.addEventListener('mousemove', (e) => {
    let cellX = Math.floor(e.offsetX / cellSize);
    let cellY = Math.floor(e.offsetY / cellSize);
    coordDisplay.innerText = `( ${cellX}, ${cellY} )`
    if (!e.ctrlKey) {
        return false;
    }

    let s = 6;
    if (drawMode == 'rect') {
        for (let x = cellX; x < cellX + s; x++) {
            for (let y = cellY; y < cellY + s; y++) {
                game.board[x][y].alive = true;
            }
        }
        drawRect(cellX, cellY, s)
    } else if (drawMode == 'point') {
        game.board[cellX][cellY].alive = true;
        drawCircle(cellX, cellY);
    } else if (drawMode == 'circle') {
        let i = 0;
        for (let x = (cellX - 3); x < (cellX + 3); x++) {
            i++;
            for (let y = cellY - i; y < (cellY + i); y++) {
                console.log(x, y);
                drawCircle(x, y);
                game.board[cellX][cellY].alive = true;
            }
        }
    }

})
