/**
 * This file is the entrypoint used by Discord.
 * Normally this file only exports the core.asar file, but we use it to load our custom code before Discord starts.
 *
 * We do not write any actual code here, but instead write a placeholder that will be replaced by the build script.
 */

// load injected code once discord is ready
// we can regularly check if the client is ready, by checking if the window title does not contain "update"
const { BrowserWindow, dialog } = require('electron');
const injectInterval = setInterval(() => {
    const window = BrowserWindow.getAllWindows()
        .find(win => !win.title.toLowerCase().includes('update'));
    if (window === undefined) return;

    // discord is ready
    clearInterval(injectInterval);
    console.log(JSON.stringify(window));
    window.webContents.executeJavaScript(`@injectCode`)
        .catch(err => dialog.showErrorBox(
            `Code Execution Error`,
            `An error occurred while running injected code:\n\n${err.message}`
        ));
}, 500)

// load discord's core.asar file
// noinspection JSFileReferences
module.exports = require('./core.asar');/* webpackIgnore: true */