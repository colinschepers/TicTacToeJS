const size = 400;
const barRadius = size / 50;
const gridSize = (size - 2 * barRadius) / 3;
const rotationSpeed = 0.15;
const aiSpeedInMilliseconds = 150;

var players = [null, null];
var state = null;
var awaitingMove = false;
var rotation = Infinity;
var menuEnabled = true;

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
    drawStars();
    checkState();
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
            move();
        }
    } else {
        gameOver();
    }
}

function move() {
    awaitingMove = true;

    var roundNr = state.roundNr;
    var playerToMove = players[state.getPlayerToMove()];

    if (playerToMove && playerToMove.constructor.name !== 'HumanPlayer') {
        playerToMove
            .getMove(state)
            .catch(e => {
                console.error(e);
            })
            .then((move) => {
                if (roundNr == state.roundNr) {
                    state.play(move);
                }
                awaitingMove = false;
            });
    }
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

function mouseReleased() {
    if (state && !state.isGameOver) {
        var playerToMove = players[state.getPlayerToMove()];
        if (playerToMove.constructor.name === 'HumanPlayer') {
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
                players[0] = new HumanPlayer()
            } else if (x == 1) {
                players[0] = new RandomPlayer(aiSpeedInMilliseconds)
            } else if (x == 2) {
                players[0] = new MiniMaxPlayer(aiSpeedInMilliseconds)
            }
            if (y == 0) {
                players[1] = new HumanPlayer()
            } else if (y == 1) {
                players[1] = new RandomPlayer(aiSpeedInMilliseconds)
            } else if (y == 2) {
                players[1] = new MiniMaxPlayer(aiSpeedInMilliseconds)
            }
            newGame();
        }
    }
}