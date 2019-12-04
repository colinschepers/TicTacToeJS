class RandomPlayer {
    constructor(runningTimeInMilliseconds) {
        this.runningTimeInMilliseconds = runningTimeInMilliseconds || 200;
    }

    async getMove(state) {
        let timeout = Date.now() + (this.runningTimeInMilliseconds);
        let moves = state.getValidMoves();
        let randomNr = Math.floor((Math.random() * moves.length));
        let move = moves[randomNr];
        await sleep(timeout - Date.now());
        return move;
    }

    opponentMoved(move) {
        // do nothing
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}