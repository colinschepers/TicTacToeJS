importScripts("state.js");

function getMove(state) {
    let moves = state.getValidMoves();
    let randomNr = Math.floor((Math.random() * moves.length));
    return moves[randomNr];
}

// Allow for multi threading using webWorkers
onmessage = function (messageEvent) {
    let state = new State();
    state.bitBoards = messageEvent.data[0].bitBoards;
    state.score = messageEvent.data[0].score;
    state.roundNr = messageEvent.data[0].roundNr;
    state.gameOver = messageEvent.data[0].gameOver;
    let move = getMove(state);
    postMessage([move]);
}