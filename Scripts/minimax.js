function getMove(state, timeLimit) {
    let timeout = Date.now() + (timeLimit);
    let move = iterativeDeepening(state, 10, timeout);
    return move;
}

function iterativeDeepening(state, depthLimit, timeout) {
    let bestMove = null;
    for (let d = 1; d < depthLimit; d++) {
        let move = this.__getBestMove(state, d, timeout);
        if (Date.now() < timeout) {
            bestMove = move;
        } else {
            break;
        }
    }
    return bestMove || state.getValidMoves()[0];
}

function getBestMove(state, depthLimit, timeout) {
    let bestScore = -Infinity;
    let bestMove = null;
    for (let move of state.getValidMoves()) {
        var nextState = state.clone();
        nextState.play(move);

        let score = getScore(nextState, 1, depthLimit, state.getPlayerToMove(), -Infinity, Infinity, timeout);

        if (score > bestScore || (score == bestScore && Math.random() < 0.5)) {
            bestScore = score;
            bestMove = move;
        }

        if (Date.now() >= timeout) {
            break;
        }
    }

    return bestMove;
}

function getScore(state, depth, depthLimit, maxPlayerNr, alpha, beta, timeout) {

    if (state.isGameOver || depth > depthLimit || Date.now() >= timeout) {
        return maxPlayerNr == 0 ? state.score : 1 - state.score;
    }

    let bestScore = null;

    if (state.getPlayerToMove() == maxPlayerNr) {
        bestScore = -Infinity;
        for (let move of state.getValidMoves()) {
            let nextState = state.clone();
            nextState.play(move);

            let score = this.__getScore(nextState, depth + 1, depthLimit, maxPlayerNr, alpha, beta);
            bestScore = Math.max(bestScore, score);
            alpha = Math.max(alpha, bestScore);
            if (beta <= alpha) {
                break;
            }
        }
    } else {
        bestScore = Infinity;
        for (let move of state.getValidMoves()) {
            let nextState = state.clone();
            nextState.play(move);

            let score = this.__getScore(nextState, depth + 1, depthLimit, maxPlayerNr, alpha, beta);
            bestScore = Math.min(bestScore, score);
            alpha = Math.min(beta, bestScore);
            if (beta <= alpha) {
                break;
            }
        }
    }

    return bestScore - (depth * 0.001);
}

// Allow for multi threading using webWorkers
onmessage = function (messageEvent) {
    let state = new State();
    state.bitBoards = messageEvent.data[0].bitBoards;
    state.score = messageEvent.data[0].score;
    state.roundNr = messageEvent.data[0].roundNr;
    state.gameOver = messageEvent.data[0].gameOver;

    let timeLimit = messageEvent.data[1];
    let move = getMove(state, timeLimit);

    postMessage([move]);
}