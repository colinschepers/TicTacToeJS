const size = 400;
const barRadius = size / 50;
const gridSize = (size - 2 * barRadius) / 3;
const rotationSpeed = 0.15;
const moveTimeInMilliseconds = 250;

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
            getMove();
        }
    } else {
        gameOver();
    }
}

function getMove() {
    awaitingMove = true;

    const player = players[state.getPlayerToMove()];
    const playerName = player.constructor.name;
    if (player && player.constructor.name != 'HumanPlayer') {
        let startTime = Date.now();
        try {
            const scriptName = playerName[0].toUpperCase() +  playerName.slice(1);
            const worker = new Worker(`Scripts/${scriptName}.js`);
            worker.onmessage = function (messageEvent) {
                applyMove(messageEvent.data[0], startTime);
            }
            worker.onerror = function (error) {
                console.error(error);
                applyMove(player.getMove(state), startTime);
            };
            worker.postMessage([state, moveTimeInMilliseconds]);
        } catch (error) {
            console.error(error);
            applyMove(player.getMove(state), startTime);
        }
    }
}

function applyMove(move, startTime) {
    let timeLeft = moveTimeInMilliseconds - (Date.now() - startTime);
    setTimeout(function () {
        state.play(move);
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
                players[0] = new MCTSPlayer(moveTimeInMilliseconds);
            }
            if (y == 0) {
                players[1] = new HumanPlayer();
            } else if (y == 1) {
                players[1] = new RandomPlayer();
            } else if (y == 2) {
                players[1] = new MCTSPlayer(moveTimeInMilliseconds);
            }
            newGame();
        }
    }
}