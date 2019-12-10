class MCTSPlayer {
    constructor(timeLimit) {
        this.worker = new Worker(`Scripts/mcts.js`);
        this.timeLimit = timeLimit;
    }

    async getMove(state, callback) {
        try {
            this.worker.onmessage = function (messageEvent) { callback(messageEvent.data[0]) }
            this.worker.onerror = function (error) { console.error(error); };
            this.worker.postMessage([state, this.timeLimit]);
        } catch (error) {
            console.error(error);
        }
    }
}