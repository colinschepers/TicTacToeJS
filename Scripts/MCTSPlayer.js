const UCT_C = Math.sqrt(2);

// Allow for multi threading using webWorkers
onmessage = function (messageEvent) {
    importScripts("State.js");
    let state = new State();
    state.bitBoards = messageEvent.data[0].bitBoards;
    state.score = messageEvent.data[0].score;
    state.roundNr = messageEvent.data[0].roundNr;
    state.gameOver = messageEvent.data[0].gameOver;
    let runningTimeInMilliseconds = messageEvent.data[1];
    let mctsPlayer = new MCTSPlayer(runningTimeInMilliseconds);
    let move = mctsPlayer.getMove(state);
    postMessage([move]);
}

class MCTSNode {
    constructor(parent, move, state) {
        this.depth = parent ? parent.depth + 1 : 0;
        this.parent = parent;
        this.children = [];
        this.move = move;
        this.score = 0;
        this.visits = 0;
        this.playerToMove = state.getPlayerToMove();
        this.isTerminal = state.isGameOver;
        this.untriedMoves = state.isGameOver ? [] : state.getValidMoves();
    }
}

class MCTSPlayer {
    constructor(runningTimeInMilliseconds) {
        this.runningTimeInMilliseconds = runningTimeInMilliseconds || 1000;
    }

    getMove(initialState) {
        let timeout = Date.now() + this.runningTimeInMilliseconds;
        let root = new MCTSNode(null, null, initialState);

        while (Date.now() < timeout) {
            //console.log('Iteration: ' + root.visits)

            let state = initialState.clone();
            let node = this.__selection(root, state);
            node = this.__expand(node, state);
            this.__rollout(state);
            this.__backtrack(node, state);
        }

        //console.log('Iterations: ' + root.visits);
        //console.log(root);

        let bestMove = this.__getRandomMove(initialState);
        let bestScore = -Infinity;

        for (let child of root.children) {
            if (child.score > bestScore) {
                bestScore = child.score;
                bestMove = child.move;
            }
        }

        return bestMove;
    }

    __selection(node, state) {

        let selectedMoves = [];

        while (node.untriedMoves.length == 0 && !node.isTerminal) {

            let bestChild = null;
            let bestScore = -Infinity;

            for (let child of node.children) {
                let uctScore = Math.sqrt(2.0 * Math.log(node.visits) / child.visits);
                let score = child.score + UCT_C * uctScore;

                if (score > bestScore) {
                    bestScore = score;
                    bestChild = child;
                }
            }

            selectedMoves.push(bestChild.move);

            node = bestChild;
            state.play(node.move);
        }

        // console.log('Selection: ' + selectedMoves.join(' '));

        return node;
    }

    __expand(node, state) {
        if (node.untriedMoves.length > 0 && !state.isGameOver) {
            let move = node.untriedMoves.pop();
            state.play(move);

            let newChild = new MCTSNode(node, move, state);
            node.children.push(newChild);
            //console.log('Expanded move: ' + newChild.move + ' | untriedMoves: ' + newChild.untriedMoves);

            return newChild;
        }
        return node;
    }

    __rollout(state) {
        while (!state.isGameOver) {
            let randomMove = this.__getRandomMove(state);
            state.play(randomMove);
        }

        //console.log('Rolled out to score: ' + state.score)
    }

    __backtrack(node, state) {
        while (node.parent) {
            node.visits++;
            let previousPlayerNr = node.parent.playerToMove;
            let score = previousPlayerNr == 0 ? state.score : 1 - state.score;
            node.score += (score - node.score) / node.visits;
            node = node.parent;
        }
        node.visits++;
    }

    __getRandomMove(state) {
        let moves = state.getValidMoves();
        let r = Math.floor(this.__getRandomInt(0, moves.length));
        return moves[r];
    }

    __getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    opponentMoved(move) {
        // TODO: reuse the tree built from previous moves ...
    }
}