const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const isDev = require('electron-is-dev')

const { autoUpdater } = require("electron-updater")

const appIcon = path.join(__dirname, '/assets/appicons/ico/icon.ico')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 985, 
    height: 575, 
    minWidth: 985, 
    minHeight: 575,
    resizable: true, 
    frame: false,
    webPreferences: {
      webSecurity: false
    },
    title: 'BeatDrop',
    icon: appIcon,
    show: false
  })
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`)
  mainWindow.on('closed', () => mainWindow = null)
  return mainWindow
}

app.on('ready', () => {
  let loading = new BrowserWindow({width: 400, height: 400, show: false, frame: false, resizable: false, webPreferences: {webSecurity: false}})

  loading.once('show', () => {
    let main = createWindow()
    main.once('ready-to-show', () => {
      main.show()
      electron.ipcMain.on('electron-updater', (_, event, message) => {
        switch(event) {
          case 'download-update':
            autoUpdater.downloadUpdate()
            return
          case 'check-for-updates':
            autoUpdater.checkForUpdates()
            return
          default:
            return
        }
      })
      autoUpdater.on('checking-for-update', () => {
        main.webContents.send('electron-updater', 'checking-for-update')
      })
      autoUpdater.on('update-available', info => {
        main.webContents.send('electron-updater', 'update-available', info)
      })
      autoUpdater.on('update-not-available', () => {
        main.webContents.send('electron-updater', 'update-not-available')
      })
      autoUpdater.on('download-progress', (progress) => {
        main.webContents.send('electron-updater', 'download-progress', progress.percent)
      })
      autoUpdater.on('update-downloaded', () => {
        autoUpdater.quitAndInstall()
      })
      autoUpdater.autoDownload = false
      autoUpdater.autoInstallOnAppQuit = false
      autoUpdater.checkForUpdates()
      loading.hide()
      loading.close()
    })
  })
  loading.loadURL(`file://${path.join(__dirname, '../build/loading.html')}`)
  loading.show()

  if(isDev) {
    const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer')
    installExtension(REACT_DEVELOPER_TOOLS).then((name) => {
        console.log(`Added Extension:  ${name}`)
    })
    .catch((err) => {
        console.log('An error occurred: ', err)
    })
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})