const { GoxlrUtility } = require('./goxlr-utility');

const goxlrUtility = new GoxlrUtility();

goxlrUtility.onMessageReceived((id, data, isPatchMessage) => {
    // todo mute the user if required condition is met
})