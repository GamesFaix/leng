const { app, BrowserWindow } = require('electron');

function createWindow () {
    // Create the browser window.
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });  // and load the index.html of the app.

    win.loadFile('index.html');
    win.webContents.openDevTools();
}

app.on('ready', createWindow);