const electron = require('electron')
const { app, BrowserWindow, Menu, MenuItem, Tray } = electron

let mainWindow, tray

const mainMenu = Menu.buildFromTemplate([
  {
    label: 'Electron',
    submenu: [
      {
        label: 'Greet',
        click: () => { console.log('hello') }
      },
      {
        label: 'About',
        submenu: [
          {
            label: 'Application',
            enabled: false
          },
          {
            label: 'Developer'
          }
        ]
      }
    ]
  },
  {
    role: 'editMenu'
  },
  {
    label: 'Advanced',    
    submenu: [
      {
        label: 'New Line',
        accelerator: 'Ctrl+N'
      }
    ]
  }
])

// Right click
const contextMenu = Menu.buildFromTemplate([
  {
    label: 'Item 1',
  },
  {
    label: 'Item2'
  },
  {
    role: 'editMenu'
  }
])

const trayContextMenu = Menu.buildFromTemplate([
  {
    label: 'Item 1'
  },
  {
    role: 'fileMenu'
  }
])

function createTray() {
  tray = new Tray('trayTemplate@2x.png')
  tray.setToolTip('Tray Details')

  tray.on('click', e => {
    // mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    mainWindow.isMinimized() ? mainWindow.restore() : mainWindow.minimize()
  })
  tray.setContextMenu(trayContextMenu)

}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800, height: 1200
  })

  mainWindow.loadFile('index.html')

  createTray()
  Menu.setApplicationMenu(mainMenu)

  // On-right click
  mainWindow.webContents.on('context-menu', () => {
    contextMenu.popup();
  })

  // powerMonitore should be used once the app is ready
  electron.powerMonitor.on('suspend', () => {
    console.log('Saving Data');
  })

  mainWindow.on('closed', () => {
    mainWindow = null
    tray = null
  })
}

app.on('ready', () => {
  createWindow()
})

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})