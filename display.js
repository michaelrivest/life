let gameBoard = document.getElementById("board");
let ctx = gameBoard.getContext("2d");
let gridSize;
let cellSize = 100;

let bgColor = "rgb(50,220,50)"
let p1Color = "white";
let p2Color = "black";

class Cell {
		constructor(game, x, y) {
			this.x = x;
			this.y = y;
			this.game = game;

			this.empty = true;
			this.player = null;

			this.p1Movable = false;
			this.p2Movable = false
		
		}
}

class Game {
		constructor(size, display) {
			this.display = display;
			this.size = size;
			this.board = (new Array(size)).fill(null)
						.map((t, j) => (new Array(size)).fill(null)
								.map((u, i) =>  new Cell(this, j, i)));
			
			console.log(this.board);
		this.board[size / 2][size / 2].player = 1;
		this.board[size / 2 - 1][size / 2].player = 2;
		this.board[size / 2][size / 2 - 1].player = 2;
		this.board[size / 2 - 1][size / 2 - 1].player = 1;
	}
	
}

function init(size) {
	
		console.log("Initializing %d x %d Game Board", size, size);
		
		gridSize = cellSize * size;
		board.height = gridSize;
		board.width = gridSize;

		drawGrid(size);
		let game = new Game(size, ctx);
}


function drawGrid(size) {
		ctx.fillStyle = bgColor; 
		ctx.fillRect(0, 0, gridSize, gridSize);

		for (let i = 0; i <= size; i++) {
			ctx.moveTo(i * cellSize, 0);
			ctx.lineTo(i * cellSize, gridSize);
			ctx.stroke();

			ctx.moveTo(0, i * cellSize);
			ctx.lineTo(gridSize, i * cellSize);
			ctx.stroke();
		}
}

function drawCircle = (x, y, player) {
		console.log(ctx);

		x = (x * cellSize) + (cellSize / 2)
		y = (y * cellSize) + (cellSize / 2)
		ctx.moveTo(x, y)

		ctx.beginPath();
		
		ctx.fillStyle = player == 1 ? p1Color : player == 2 ? p2Color : bgColor; 
		ctx.arc(x, y, cellSize / 2.5, 0, Math.PI * 2, true);
		if (player == 1) ctx.stroke()
		ctx.fill();
}


