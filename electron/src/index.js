const { app, BrowserWindow, ipcMain } = require('electron')
const Menu = require('electron').Menu
const webFrame = require('electron').webFrame;
const { autoUpdater } = require('electron-updater')
const log = require('electron-log')
var path = require('path')
var url = require('url')

let mainWindow, connectWindow;

// create window after app is ready
function createWindow() {

  // auto update electron app 
  autoUpdater.checkForUpdatesAndNotify();

  console.log('[webFrame]', webFrame )
  // windows
  // set zoom factor to 80% on windows
  // webFrame.setZoomFactor(0.8);

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
    // width: 1024, 
    // height: 768,  
    width: 896,
    height: 640,  
    titleBarStyle: 'hidden',
    resizable: false,
    // windows 
    frame: true,
    // mac
    //frame: false,
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'dist', 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  // mainWindow.webContents.openDevTools();

  // emitted when the window is closed.
  mainWindow.on('closed', () => {

    // connectWindow.close();
    app.quit();

    mainWindow = null;
    connectWindow = null;

  });


  // Create the Application's main menu
  var template = [{
    label: "Application",
    submenu: [
      { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
      { type: "separator" },
      { label: "Quit", accelerator: "Command+Q", click: function () { app.quit(); } }
    ]
  }, {
    label: "Edit",
    submenu: [
      { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
      { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
      { type: "separator" },
      { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
      { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
      { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
      { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
    ]
  }
  ];
  // Windows - copy paste works out of box  
  // Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  // Mac - enable 
  // Menu.setApplicationMenu(Menu.buildFromTemplate(template));

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
    if (mainWindow === null) {
      createWindow();
    }
  });


} catch (e) {
  log.error(e);
  // Catch Error
  throw e;
}

autoUpdater.on('update-available', (info, event) => {
  log.info('update-available');
  mainWindow.webContents.send('message', { type: 'update-available', payload: info });
})

autoUpdater.on('update-not-available', (info, event) => {
  log.info('update-not-available');
  mainWindow.webContents.send('message', { type: 'update-not-available', payload: info });
})

autoUpdater.on('update-downloaded', (info, event) => {
  log.info('update-downloaded');
  mainWindow.webContents.send('message', { type: 'update-downloaded', payload: info });
});

// autoUpdater.on('error', (event, err) => {
//   sendStatusToWindow('error');
// })
// autoUpdater.on('checking-for-update', () => {
//   sendStatusToWindow('checking-for-update');
// })
// autoUpdater.on('download-progress', (event, progress) => {
//   sendStatusToWindow('download-progress');
// })