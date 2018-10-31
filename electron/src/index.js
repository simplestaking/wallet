import { app, BrowserWindow } from 'electron';

// autoupdater
import { autoUpdater } from "electron-updater"
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let connectWindow;

const createWindow = () => {
  
  // This will immediately download an update, then install when the app quits
  autoUpdater.checkForUpdatesAndNotify();

  // Create the connect hidden window.
  connectWindow = new BrowserWindow({
    show: false,
    backgroundThrottling: false,
  })
  connectWindow.loadFile(__dirname + '/connect/connect.html')

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    titleBarStyle: 'hidden',
    frame: false,
    resizable: false,
    icon: __dirname + '/dist/assets/icon/electron.png',
    webPreferences: {
      webSecurity: false,
      nodeIntegration: false,
      allowRunningInsecureContent: true,
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/dist/index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

autoUpdater.on('checking-for-update', () => {
  console.log('[checking-for-update]')
})
autoUpdater.on('update-available', (info) => {
  console.log('[update-available]',info)
})
autoUpdater.on('update-not-available', (info) => {
  console.log('[update-not-available]',info)
})
autoUpdater.on('error', (err) => {
  console.error('[error]',info)
})
autoUpdater.on('download-progress', (progressObj) => {
  console.log('[download-progress]',info)
})
autoUpdater.on('update-downloaded', (info) => {
  console.log('[update-downloaded]',info)
  autoUpdater.quitAndInstall();  
})