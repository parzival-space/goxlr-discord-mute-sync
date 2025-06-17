/**
 * This file is the entrypoint used by Discord.
 * Normally this file only exports the core.asar file, but we use it to load our custom code before Discord starts.
 *
 * We do not write any actual code here, but instead write a placeholder that will be replaced by the build script.
 */

const MAGENTA = '\x1b[35;49m';
const RESET = '\x1b[39;49m';

// load injected code once discord is ready
// we can regularly check if the client is ready, by checking if the window title does not contain "update"
const { BrowserWindow, dialog } = require('electron');
const injectInterval = setInterval(() => {
    const window = BrowserWindow.getAllWindows()
        .find(win => !win.title.toLowerCase().includes('update'));
    if (window === undefined) return;

    // discord is ready
    clearInterval(injectInterval);
    window.webContents.executeJavaScript(`@injectCode`)
        // print some fancy message in rainbow colors
        .then(result => console.log(
            `${MAGENTA}Code Injection Successful!${RESET}`))
        .catch(err => dialog.showErrorBox(
            `Code Injection Error`,
            `An error occurred while injecting code into Discord:\n\n${err.message}`));
}, 500)

// load discord's core.asar file
// noinspection JSFileReferences
module.exports = require('./core.asar');/* webpackIgnore: true */