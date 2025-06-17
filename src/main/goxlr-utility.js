const { apply_patch } = require("jsonpatch");

module.exports = {
    GoxlrUtility: class {
        #socket;
        #onMessageListeners;

        status = {};

        constructor(host = "ws://127.0.0.1:14564/api/websocket")
        {
            this.#socket = new WebSocket(host);
            this.#onMessageListeners = [];

            this.#socket.addEventListener("open", (event) =>
                this.#initConnection(event));

            this.#socket.addEventListener("close", (event) =>
                this.#log(`Connection to GoXLR Utility closed.`));

            this.#socket.addEventListener("message", (event) =>
                this.#handleMessage(event));
        }

        /**
         * Registers a listener for messages received from the GoXLR Utility.
         * @param listener {function(id: number, data: object, isPatchMessage: boolean): void}
         */
        onMessageReceived(listener) {
            if (typeof listener !== "function") {
                throw new TypeError("Listener must be a function");
            }
            this.#onMessageListeners.push(listener);
        }

        #log(...args)
        {
            console.log(`[GoXLR]`, ...args);
        }

        #initConnection(event)
        {
            this.#log(`Connected to GoXLR Utility`);
            this.#socket.send(JSON.stringify({
                "id": 1,
                "data": "GetStatus"
            }));
        }

        #handleMessage(event)
        {
            try {
                const message = JSON.parse(event.data);

                // test if message is valid
                if (message["id"] === undefined || message["data"] === undefined) {
                    this.#log(`Received invalid message: ${event.data}`);
                    return;
                }

                const isPatchMessage = message["data"]["Patch"] !== undefined;
                const isStatusMessage = message["data"]["Status"] !== undefined;
                const id = message["id"];
                const data = message["data"];

                // notify listeners
                this.#onMessageListeners.forEach((listener) => listener(id, data, isPatchMessage));

                // apply patch to status
                if (isPatchMessage) apply_patch(this.status, message["data"]["Patch"]);

                if (isStatusMessage) this.status = message["data"]["Status"];
            } catch (error) {
                this.#log(`Error handling message: ${error.message}`);
            }
        }
    }
}