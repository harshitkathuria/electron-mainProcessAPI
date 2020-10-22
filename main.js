// Modules
const { app, BrowserWindow, session, webContents, dialog, globalShortcut } = require('electron')
const windowStateKeeper = require('electron-window-state')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, secondaryWindow

// Create a new BrowserWindow when `app` is ready
function createWindow () {

  // To open the mainWindow in the same location and same dimensions as it was closed earlier
  let winState = windowStateKeeper({
    defaultWidth: 1000, defaultHeight: 800
  })


  mainWindow = new BrowserWindow({
    width: winState.width, height: winState.height,
    // the x and y co-oordinates of the mainWindow
    x: winState.x, y: winState.y,
    webPreferences: { nodeIntegration: true },
    // show: false,
    // backgroundColor: '#fff',
    // frame: false,
  })

  // let ses = mainWindow.webContents.session;
  // const getCookies = async() => {
  //   let cookies = await ses.cookies.get({ name: 'myCookie3' });
  //   console.log(cookies);
  // }

  // let cookie = { url: 'https://myappdomain.com', name: 'myCookie3', value: 'electron3', expirationDate: 1601577416 };

  // // Setting cookie
  // ses.cookies.set(cookie).then(() => {
  //   console.log('cookie set')
  //   getCookies();
  // })

  // GETTING COOKIE
  // console.log(ses.cookies.get({}))
  
  // secondaryWindow = new BrowserWindow({
  //   width: 600, height: 300,
  //   webPreferences: { nodeIntegration: true },
  //   parent: mainWindow,
  //   // resizable: false,
  //   modal: true
  // })

  // // Same sessions for all renderer process by default
  // let ses1 = mainWindow.webContents.session;
  // let ses2 = secondaryWindow.webContents.session;
  // let ses = session.defaultSession;

  // console.log(Object.is(ses1, ses))

  // Applying for mainWindow
  winState.manage(mainWindow);
    
  // Loading url into the new BrowserWindow
  // mainWindow.loadURL('https://www.github.com')

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('index.html')
  // secondaryWindow.loadFile('index.html')

  // Open DevTools
  // mainWindow.webContents.openDevTools();
  // secondaryWindow.webContents.openDevTools();

  // Show main window once the ready-to-show event has been fired
  // mainWindow.once('ready-to-show', mainWindow.show)

  //DOWNLOAD EVENT
  let ses = session.defaultSession;
  ses.on('will-download', (e, downloadItem, webContents) => {
    const filename = downloadItem.getFilename()
    const fileSize = downloadItem.getTotalBytes()
    // Automatically save to desktop
    downloadItem.setSavePath(app.getPath('desktop') + `/${filename}`)

    downloadItem.on('updated', (e, state) => {
      let received = downloadItem.getReceivedBytes()
      if(state === 'progressing' && received) {
        let progress = Math.round((received / fileSize) * 100)
        webContents.executeJavaScript(`window.progress.value = ${progress}`)
        console.log(progress);
      }
    })
  })

  //DIALOG
  mainWindow.webContents.on('did-finish-load', () => {
    // Open Dialog
    // dialog.showOpenDialog(mainWindow, {
    //   buttonLabel: 'Select',
    //   defaultPath: app.getPath('home'),
    //   // cannot be both openDirectory and openFile
    //   properties: ['multiSelections', 'createDirectory', 'openDirectory', 'openFile']
    // }).then(result => console.log(result.filePaths))

    // Save Dialog
    // dialog.showSaveDialog({}).then(res => console.log(res.filePath))

    // Message Dialog
    // const answer = ['Yes', 'No', 'Maybe']
    // dialog.showMessageBox(mainWindow, {
    //   title: 'Message In Here',
    //   message: 'Please select an option',
    //   detail: 'This is msg detail',
    //   buttons: answer
    // }).then(res => console.log(answer[res.response]))
  })

  // GLOBAL SHORTCUT
  // register an accelerator
  globalShortcut.register('CommandOrControl+M', () => {
    console.log('Key M is pressed with a combination')
    // unregister
    globalShortcut.unregister('CommandOrControl+M')
  })

  let wc = mainWindow.webContents;
  // When content is loaded
  wc.on('did-finish-load', () => {
    console.log('Content fully loaded')
    // getCookies();
  })
  // When the structure of DOM is ready
  wc.on('dom-ready', () => {
    console.log('DOM Ready')
  })

  // //When a new-window is opened
  // wc.on('new-window', (e, url, frameName) => {
  //   e.preventDefault();
  //   console.log(e, url);
  //   console.log(`FrameName: ${frameName}`);
  // })

  // wc.on('before-input-event', (e, input) => {
  //   console.log(input.key, input.type)
  // })

  // wc.on('media-started-playing', () => {
  //   console.log('Media Played');
  // })
  // wc.on('media-paused', () => {
  //   console.log('Media Paused');
  // })

  // RIGHT CLICK
  // wc.on('context-menu', (e, params) => {
  //   // console.log(`Clicked At: ${params.x}, ${params.y}`)
  //   // console.log(`Selected text ${params.selectionText}`)
  //   let text = params.selectionText;
  //   wc.executeJavaScript(`alert('${text}')`)  //alert with the selected content
  // })

  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null
  })
  // secondaryWindow.on('closed', () => {
  //   secondaryWindow = null;
  // })
}

// Electron `app` is ready
app.on('ready', () => {
  createWindow();
})

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})