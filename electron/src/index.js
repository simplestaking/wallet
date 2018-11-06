const { app, BrowserWindow } = require('electron')
const { autoUpdater } = require('electron-updater')
const log = require('electron-log')
var path = require('path')
var url = require('url')

let mainWindow, connectWindow;

// create window after app is ready
function createWindow() {

  // auto update electron app 
  autoUpdater.checkForUpdates();

  // create the connect hidden window
  connectWindow = new BrowserWindow({
    show: false,
    backgroundThrottling: false,
  })

  connectWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'connect', 'connect.html'),
    protocol: 'file:',
    slashes: true,
  }))

  // create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    titleBarStyle: 'hidden',
    frame: false,
    resizable: false
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'dist', 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  //mainWindow.webContents.openDevTools();

  // emitted when the window is closed.
  mainWindow.on('closed', () => {

    connectWindow.close();
    app.quit();

    mainWindow = null;
    connectWindow = null;
  });

}

// send auto update status to 
function sendStatusToWindow(text) {
  log.info(text);
  console.log(text);
  mainWindow.webContents.send('message', text);
}

try {

  // set auto updater logging
  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = 'info';
  log.info('App starting...');


  // this method will be called when Electron has finished
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // on OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // on OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  console.log(e)
  // Catch Error
  throw e;
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (ev, info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (ev, info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (ev, err) => {
  sendStatusToWindow('Error in auto-updater.');
})
autoUpdater.on('download-progress', (ev, progressObj) => {
  sendStatusToWindow('Download progress...');
})
autoUpdater.on('update-downloaded', (ev, info) => {
  sendStatusToWindow('Update downloaded; will install in 5 seconds');

  // Wait 5 seconds, then quit and install
  // In your application, you don't need to wait 5 seconds.
  // You could call autoUpdater.quitAndInstall(); immediately

  setTimeout(function () {
    autoUpdater.quitAndInstall();
  }, 5000)

});
