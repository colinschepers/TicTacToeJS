class RandomPlayer {
    constructor() {
        this.worker = new Worker(`Scripts/random.js`);
    }

    async getMove(state, callback) {
        try {
            this.worker.onmessage = function (messageEvent) { callback(messageEvent.data[0]) }
            this.worker.onerror = function (error) { console.error(error); };
            this.worker.postMessage([state]);
        } catch (error) {
            console.error(error);
        }
    }
}