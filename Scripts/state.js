class State {

    constructor() {
        this.bitBoards = [0, 0];
        this.roundNr = 0;
        this.score = 0.5;
        this.isGameOver = false;
    }

    play(move) {
        if (typeof move === 'undefined' || !this.isValid(move)) {
            console.error("Invalid move: " + move);
        }

        let player = this.roundNr++ & 1;
        let board = this.bitBoards[player] |= State.bitMove[move];

        if (this.isLine(board)) {
            this.isGameOver = true;
            this.score = 1 - player;
        } else if (this.roundNr == 9) {
            this.isGameOver = true;
            this.score = 0.5;
        }
    }

    isLine(bitBoard) {
        return (bitBoard & (bitBoard >> 1) & (bitBoard >> 2) & State.lineFilter) != 0;
    }

    isValid(move) {
        return move >= 0 && move < 9 && (this.getMergedBoard() & State.bitMove[move]) == 0;
    }

    getMergedBoard() {
        return (this.bitBoards[0] | this.bitBoards[1]) & 0b111111111;
    }

    getValidMoves() {
        return State.moves[this.getMergedBoard()];
    }

    getPlayerToMove() {
        return this.roundNr & 1;
    }

    get2DBoard() {
        var board = [
            [-1, -1, -1],
            [-1, -1, -1],
            [-1, -1, -1]
        ]
        for (let i = 0; i < 9; i++) {
            if ((this.bitBoards[0] & (1 << i)) > 0) {
                board[i % 3][Math.floor(i / 3)] = 0;
            } else if ((this.bitBoards[1] & (1 << i)) > 0) {
                board[i % 3][Math.floor(i / 3)] = 1;
            }
        }
        return board;
    }

    clone() {
        let state = new State();
        state.copyPosition(this);
        return state;
    }

    copyPosition(state) {
        this.bitBoards[0] = state.bitBoards[0];
        this.bitBoards[1] = state.bitBoards[1];
        this.score = state.score;
        this.roundNr = state.roundNr;
        this.gameOver = state.gameOver;
    }
}

State.bitMove = [
    0b000001000000001000000001,
    0b000000000001000000000010,
    0b001000001000000000000100,
    0b000000000000010000001000,
    0b010010000010000000010000,
    0b000000010000000000100000,
    0b100000000000100001000000,
    0b000000000100000010000000,
    0b000100100000000100000000
];

State.lineFilter = 0b001001001001001001001001;

State.moves = [];
for (var i = 0; i < 0b1000000000; i++) {
    let movesForPosition = [];
    for (var x = 0; x < 9; x++) {
        if ((i & (1 << x)) == 0) {
            movesForPosition.push(x);
        }
    }
    State.moves.push(movesForPosition);
}