const size = 400;
const barRadius = size / 50;
const gridSize = (size - 2 * barRadius) / 3;
const rotationSpeed = 0.15;
const moveTime = 300;

var players = [null, null];
var state = null;
var awaitingMove = false;
var rotation = Infinity;
var menuEnabled = true;
var startTime = Date.now();

function setup() {
    createCanvas(size, size, WEBGL);
    //debugMode(600, 50, 0, 300, 0, 600, -300, -300, 0);
    //frameRate(25);
}

function draw() {
    noStroke();
    background(0);
    ambientLight(75);
    directionalLight(255, 255, 255, mouseX - width / 2, mouseY - height / 2, 0);
    checkState();
    drawStars();
    drawFrame();
    drawSymbols();
    drawMenu();
    //orbitControl();
}

function newGame() {
    state = new State();
    awaitingMove = false;
    rotation = 0;
    menuEnabled = false;
}

function checkState() {
    if (state && !state.isGameOver) {
        if (!awaitingMove) {
            awaitingMove = true;
            startTime = Date.now();
            const player = players[state.getPlayerToMove()];
            if (player && player.constructor.name != 'HumanPlayer') {
                player.getMove(state, applyMove);
            }
        }
    } else {
        gameOver();
    }
}

function applyMove(move) {
    let timeLeft = moveTime - (Date.now() - startTime);
    setTimeout(function () {
        try { 
            state.play(move);
        } catch (error) { 
            console.error("Invalid move: " + move); 
        }
        awaitingMove = false;
    }, max(0, timeLeft));
}

function gameOver() {
    rotation = rotation + rotationSpeed;
    if (rotation < 2 * PI) {
        if (state.score == 0.5) {
            rotateZ(rotation);
        } else if (state.score == 0) {
            rotateX(rotation);
        } else if (state.score == 1) {
            rotateY(rotation);
        }
    } else if (!menuEnabled) {
        menuEnabled = true;
    }
}

function mousePressed() {
    if (state && !state.isGameOver) {
        var player = players[state.getPlayerToMove()];
        if (player.constructor.name === 'HumanPlayer') {
            let x = Math.floor(mouseX / (width / 3));
            let y = Math.floor(mouseY / (height / 3));
            let move = y * 3 + x;
            if (x >= 0 && x < 3 && y >= 0 && y < 3 && state.isValid(move)) {
                state.play(move);
                awaitingMove = false;
            }
        }
    } else if (menuEnabled) {
        let x = Math.floor(mouseX / (width / 3));
        let y = Math.floor(mouseY / (height / 3));
        if (x >= 0 && x < 3 && y >= 0 && y < 3) {
            if (x == 0) {
                players[0] = new HumanPlayer();
            } else if (x == 1) {
                players[0] = new RandomPlayer();
            } else if (x == 2) {
                players[0] = new MCTSPlayer(moveTime);
            }
            if (y == 0) {
                players[1] = new HumanPlayer();
            } else if (y == 1) {
                players[1] = new RandomPlayer();
            } else if (y == 2) {
                players[1] = new MCTSPlayer(moveTime);
            }
            newGame();
        }
    }
}