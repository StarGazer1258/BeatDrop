const electron = require('electron')
const { app, ipcMain, BrowserWindow } = electron

const path = require('path')
const isDev = require('electron-is-dev')

const { autoUpdater } = require("electron-updater")

const appIcon = path.join(__dirname, '/assets/appicons/ico/icon.ico')

const Sentry = require('@sentry/electron')
Sentry.init({dsn: '***REMOVED***'})

let mainWindow = null

let launchEvents = {
  songs: {
    details: [],
    download: []
  },
  playlists: {
    details: [],
    download: []
  }
}

ipcMain.on('launch-events', (_, event, message) => {
  switch(event) {
    case 'check-launch-events':
      mainWindow.webContents.send('launch-events', 'launch-events', launchEvents)
      launchEvents = {
        songs: {
          details: [],
          download: [],
          delete: []
        },
        playlists: {
          details: [],
          download: [],
          delete: []
        }
      }
      return
    default:
      return
  }
})

const gotTheLock = app.requestSingleInstanceLock()

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('beatdrop', process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient('beatdrop')
}

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, argv, workingDirectory) => {
    if(!isDev) handleArgs(argv, true)
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  app.on('ready', () => {
    autoUpdater.autoDownload = false
    autoUpdater.autoInstallOnAppQuit = false

    ipcMain.on('electron-updater', (_, event, message) => {
      switch(event) {
        case 'download-update':
          autoUpdater.downloadUpdate()
          return
        case 'check-for-updates':
          try {
            autoUpdater.checkForUpdates()
          } catch(_) {
            main.webContents.send('electron-updater', 'error')
          }
          return
        case 'set-update-channel':
          autoUpdater.channel = message
          autoUpdater.allowPrerelease = (message !== 'latest')
          autoUpdater.allowDowngrade =  (message === 'latest')
          return
        default:
          return
      }
    })

    let loading = new BrowserWindow({width: 400, height: 400, show: false, frame: false, resizable: false, webPreferences: {webSecurity: false}})
    
    if(!isDev) handleArgs(process.argv)
    loading.once('show', () => {
      let main = createWindow()
      autoUpdater.on('checking-for-update', () => {
        main.webContents.send('electron-updater', 'checking-for-update')
      })
      autoUpdater.on('update-available', info => {
        main.webContents.send('electron-updater', 'update-available', info)
      })
      autoUpdater.on('update-not-available', () => {
        main.webContents.send('electron-updater', 'update-not-available')
      })
      autoUpdater.on('error', () => {
        main.webContents.send('electron-updater', 'error')
      })
      autoUpdater.on('download-progress', (progress) => {
        main.webContents.send('electron-updater', 'download-progress', progress.percent)
      })
      autoUpdater.on('update-downloaded', () => {
        autoUpdater.quitAndInstall()
      })
      main.once('ready-to-show', () => {
        main.show()
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
}

function handleArgs(argv, sendImmediately) {
  if(argv.length < 2) return
  let args = argv[1].split(/beatdrop:\/\/|beatdrop:%5C%5C|beatdrop:\/|beatdrop:%5C|beatdrop:/i)[1].split(/\/|%5C/)
  switch(args[0].toLowerCase()) {
    case 'songs':
      if(args.length < 3) return
      switch(args[1].toLowerCase()) {
        case 'download':
          launchEvents.songs.download.push(args[2])
          break
        case 'details':
          launchEvents.songs.details.push(args[2])
          break
        default:
          break
      }
      break
    case 'playlists':
      // Planned for future...
      return
    default:
      break
  }
  if(sendImmediately) {
    mainWindow.webContents.send('launch-events', 'launch-events', launchEvents)
    launchEvents = {
      songs: {
        details: [],
        download: [],
        delete: []
      },
      playlists: {
        details: [],
        download: [],
        delete: []
      }
    }
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 985, 
    height: 575, 
    minWidth: 985, 
    minHeight: 575,
    resizable: true, 
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, '../build/sentry.js'),
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