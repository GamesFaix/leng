import * as Electron from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer';

let mainWindow : Electron.BrowserWindow | null;

const installExtensions = async () => {
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS];
  installExtension(
        extensions,
        {loadExtensionOptions: {allowFileAccess: true}, forceDownload: forceDownload}
      )
      .catch(console.log);
}

function createWindow() {
  mainWindow = new Electron.BrowserWindow({
    width: 1000,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  mainWindow.loadFile("index.html");

  mainWindow.on("closed", () => (mainWindow = null));
}

Electron.app.on("ready", async () => {
  createWindow();

  // Install extensions
  await installExtensions();

  // Auto-open dev tools
  mainWindow?.webContents.on("did-frame-finish-load", () => {
    mainWindow?.webContents.once("devtools-opened", () => {
      mainWindow?.focus();
    });
    mainWindow?.webContents.openDevTools({
      mode: 'undocked'
    });
  });
});

Electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    Electron.app.quit();
  }
});

Electron.app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});