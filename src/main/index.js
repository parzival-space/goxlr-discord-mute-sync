const { GoxlrUtility } = require('./goxlr-utility');

const goxlrUtility = new GoxlrUtility();

let lastDeafenState = false;
let lastMuteState = false;

goxlrUtility.onMessageReceived((id, data, isPatchMessage) => {
    // since this is the standalone version, we assume only one mixer is connected
    const deviceSerial = Object.keys(goxlrUtility.status["mixers"])[0];
    console.log(`Selected device: ${deviceSerial}`);

    // get faders for chat and mic, they may not be always bound
    const chatFader = Object.values(goxlrUtility.status["mixers"][deviceSerial]["fader_status"])
        .find(fader => fader["channel"] === "Chat");
    const micFader = Object.values(goxlrUtility.status["mixers"][deviceSerial]["fader_status"])
        .find(fader => fader["channel"] === "Mic");
    const coughButton = goxlrUtility.status["mixers"][deviceSerial]["cough_button"];

    // deafen when chat is muted to all or muted to x with all mute type
    const isChatMuted = chatFader && (chatFader["mute_state"] === "MutedToAll"
        || (chatFader["mute_state"] === "MutedToX" && chatFader["mute_type"] === "All")
        || (chatFader["mute_state"] === "MutedToX" && chatFader["mute_type"] === "ToVoiceChat"));

    // mute when mic is muted to all or muted to x with all mute type
    const isMicMuted = micFader && (micFader["mute_state"] === "MutedToAll"
        || (micFader["mute_state"] === "MutedToX" && micFader["mute_type"] === "All")
        || (micFader["mute_state"] === "MutedToX" && micFader["mute_type"] === "ToVoiceChat"))
        || coughButton["state"] === "MutedToAll"
        || (coughButton["state"] === "MutedToX" && coughButton["mute_type"] === "All")
        || (coughButton["state"] === "MutedToX" && coughButton["mute_type"] === "ToVoiceChat"); // always mute when deafened

    console.log(`Chat muted: ${isChatMuted}, Mic muted: ${isMicMuted}`);

    // update deafen button state
    if (lastDeafenState !== isChatMuted) {
        lastDeafenState = isChatMuted;
        document.querySelector(`button[role="switch"][aria-label="Deafen"][aria-checked=${!isChatMuted}]`).click();
    }

    // update mute button state
    if (lastMuteState !== isMicMuted && !isChatMuted) { // only update mute button if chat is not muted
        lastMuteState = isMicMuted;
        document.querySelector(`button[role="switch"][aria-label="Mute"][aria-checked=${!isMicMuted}]`).click();
    }
})