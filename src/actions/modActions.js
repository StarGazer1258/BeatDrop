import { SET_MOD_LIST, SET_VIEW, SET_RESOURCE, SET_LOADING, LOAD_MOD_DETAILS, INSTALL_MOD, SET_SCANNING_FOR_MODS, SET_INSTALLED_MODS, DISPLAY_WARNING, UNINSTALL_MOD, CLEAR_MODS, ADD_TO_QUEUE, UPDATE_PROGRESS, ADD_DEPENDENT, SET_MOD_ACTIVE, ADD_PENDING_MOD, SET_PATCHING } from './types'
import { MODS_VIEW, MOD_DETAILS } from '../views'

import { BEATMODS, LIBRARY } from '../constants/resources'
import { MODS as EMERGENCY_MODS } from '../constants/emergencyMods'

import modIcon from '../assets/dark/mod.png'

const { remote } = window.require('electron')
const request = remote.require('request')
const fs = remote.require('fs')
const path = remote.require('path')
const crypto = remote.require('crypto')
const AdmZip = remote.require('adm-zip')
const execFile = remote.require('child_process').execFile

export const fetchApprovedMods = () => dispatch => {
  dispatch({
    type: SET_VIEW,
    payload: MODS_VIEW
  })
  dispatch({
    type: SET_RESOURCE,
    payload: BEATMODS.NEW_MODS
  })
  dispatch({
    type: SET_LOADING,
    payload: true
  })
  fetch('https://beatmods.com/api/v1/mod?status=approved')
    .then(res => res.json())
    .then(beatModsResponse => {
      dispatch({
        type: SET_MOD_LIST,
        payload: beatModsResponse
      })
      dispatch({
        type: SET_LOADING,
        payload: false
      })
    })
}

export const fetchEmergencyMods = () => dispatch => {
  dispatch({
    type: SET_VIEW,
    payload: MODS_VIEW
  })
  dispatch({
    type: SET_RESOURCE,
    payload: BEATMODS.NEW_MODS
  })
  dispatch({
    type: SET_LOADING,
    payload: true
  })
  dispatch({
    type: SET_MOD_LIST,
    payload: EMERGENCY_MODS
  })
  dispatch({
    type: SET_LOADING,
    payload: false
  })
}

export const fetchRecommendedMods = () => dispatch => {
  dispatch({
    type: SET_VIEW,
    payload: MODS_VIEW
  })
  dispatch({
    type: SET_RESOURCE,
    payload: BEATMODS.RECOMMENDED_MODS
  })
  dispatch({
    type: SET_LOADING,
    payload: true
  })
  let recommendedMods = ['CameraPlus', 'Custom Sabers', 'Custom Platforms', 'Custom Avatars', 'BeatSaberTweaks', 'PracticePlugin', 'Counters+']
  let mods = []
  for(let i = 0; i < recommendedMods.length; i++) {
    fetch(`https://beatmods.com/api/v1/mod?name=${encodeURIComponent(recommendedMods[i])}`)
      .then(res => res.json())
      .then(beatModsResponse => {
        if(beatModsResponse.length === 0) { recommendedMods.splice(i, 1); return }
        mods.push(beatModsResponse[beatModsResponse.length - 1])
        if(mods.length === recommendedMods.length) {
          dispatch({
            type: SET_MOD_LIST,
            payload: mods
          })
          dispatch({
            type: SET_LOADING,
            payload: false
          })
        }
      })
  }
}

export const fetchModCategories = () => dispatch => {
  dispatch({
    type: SET_VIEW,
    payload: MODS_VIEW
  })
  dispatch({
    type: SET_RESOURCE,
    payload: BEATMODS.MOD_CATEGORY_SELECT
  })
  dispatch({
    type: SET_LOADING,
    payload: true
  })
  dispatch({
    type: SET_LOADING,
    payload: false
  })
}

export const fetchModCategory = category => dispatch => {
  dispatch({
    type: SET_VIEW,
    payload: MODS_VIEW
  })
  dispatch({
    type: SET_RESOURCE,
    payload: BEATMODS.MOD_CATEGORIES
  })
  dispatch({
    type: SET_LOADING,
    payload: true
  })
  fetch(`https://beatmods.com/api/v1/mod?category=${ category }`)
    .then(res => res.json())
    .then(beatModsResponse => {
      dispatch({
        type: SET_MOD_LIST,
        payload: beatModsResponse
      })
      dispatch({
        type: SET_LOADING,
        payload: false
      })
    })
}

export const fetchLocalMods = () => (dispatch, getState) => {
  dispatch({
    type: SET_VIEW,
    payload: MODS_VIEW
  })
  dispatch({
    type: SET_RESOURCE,
    payload: LIBRARY.MODS.ALL
  })
  dispatch({
    type: SET_LOADING,
    payload: true
  })
  fetch(`https://beatmods.com/api/v1/mod?status=approved`)
    .then(res => res.json())
    .then(beatModsResponse => {
      let installedMods = getState().mods.installedMods
      let m = []
      for(let i = 0; i < installedMods.length; i++) {
        if(beatModsResponse.filter(mod => mod.name === installedMods[i].name)[0]) m.push(beatModsResponse.filter(mod => mod.name === installedMods[i].name)[0])
        console.log(installedMods[i].name)
      }
      dispatch({
        type: SET_MOD_LIST,
        payload: m
      })
      dispatch({
        type: SET_LOADING,
        payload: false
      })
      if(m.length === 0) {
        dispatch({
          type: DISPLAY_WARNING,
          payload: {
            color: 'gold',
            text: 'No mods found!'
          }
        })
      }
    })
}

export const fetchActivatedMods = () => (dispatch, getState) => {
  dispatch({
    type: SET_VIEW,
    payload: MODS_VIEW
  })
  dispatch({
    type: SET_RESOURCE,
    payload: LIBRARY.MODS.ACTIVATED
  })
  dispatch({
    type: SET_LOADING,
    payload: true
  })
  fetch(`https://beatmods.com/api/v1/mod?status=approved`)
    .then(res => res.json())
    .then(beatModsResponse => {
      let activatedMods = getState().mods.installedMods.filter(mod => mod.active === true)
      let m = []
      for(let i = 0; i < activatedMods.length; i++) {
        if(beatModsResponse.filter(mod => mod.name === activatedMods[i].name)[0]) m.push(beatModsResponse.filter(mod => mod.name === activatedMods[i].name)[0])
        console.log(activatedMods[i].name)
      }
      dispatch({
        type: SET_MOD_LIST,
        payload: m
      })
      dispatch({
        type: SET_LOADING,
        payload: false
      })
      if(m.length === 0) {
        dispatch({
          type: DISPLAY_WARNING,
          payload: {
            color: 'gold',
            text: 'No mods found!'
          }
        })
      }
    })
}

export const loadModDetails = modId => dispatch => {
  dispatch({
    type: SET_VIEW,
    payload: MOD_DETAILS
  })
  dispatch({
    type: SET_LOADING,
    payload: true
  })
  fetch(`https://beatmods.com/api/v1/mod?status=approved`)
    .then(res => res.json())
    .then(beatModsResponse => {
      dispatch({
        type: LOAD_MOD_DETAILS,
        payload: beatModsResponse.filter((mod) => { return mod._id === modId })[0]
      })
      dispatch({
        type: SET_LOADING,
        payload: false
      })
    })
}

export const installMod = (modName, dependencyOf = '') => (dispatch, getState) => {
  if(isModPendingInstall(modName)(dispatch, getState)) {
    return
  } else {
    if(!isModInstalled(modName)(dispatch, getState)) {
      dispatch({
        type: ADD_PENDING_MOD,
        payload: modName
      })
    }
  }
  if(gamePatchedWith()(dispatch, getState) === 'NONE' && !isModPendingInstall('BSIPA')(dispatch, getState)) patchGame()(dispatch, getState)
  if(isModInstalled(modName)(dispatch, getState)) {
    if(!getState().mods.installedMods.filter(mod => mod.name === modName)[0].dependencyOf.includes(dependencyOf)) {
      dispatch({
        type: ADD_DEPENDENT,
        payload: {
          index: getState().mods.installedMods.findIndex(mod => mod.name === modName),
          dependent: dependencyOf
        }
      })
    }
    return
  }
  fetch(`https://beatmods.com/api/v1/mod?name=${encodeURIComponent(modName)}`)
    .then(res => res.json())
    .then(beatModsResponse => {
      if(beatModsResponse.length === 0) return
      let utc = Date.now()
      let mod = beatModsResponse[beatModsResponse.length - 1]
      let req
      let len = 0
      let chunks = 0
      dispatch({
        type: ADD_TO_QUEUE,
        payload: {
          utc,
          hashMd5: mod._id,
          coverUrl: modIcon,
          songName: mod.name,
          authorName: mod.author.username
        }
      })

      let dependsOn = []
      // Install Dependencies
      console.log(`Installing dependencies for ${ modName }...`)
      for(let i = 0; i < mod.dependencies.length; i++) {
        installMod(mod.dependencies[i].name, modName)(dispatch, getState)
        dependsOn.push(mod.dependencies[i].name)
      }
      console.log(`Dependencies found: ${dependsOn.join(', ')}`)

      // Install Mod
      console.log(`Installing ${ modName }...`)
      if(mod.downloads.some(version => version.type === 'universal')) {
        req = request.get({ url: `https://beatmods.com${mod.downloads.filter(version => version.type === 'universal')[0].url}`, encoding: null }, (err, r, data) => {
          if(err || r.statusCode !== 200) throw err
  
          let zip = new AdmZip(data)
          zip.extractAllTo(getState().settings.installationDirectory)
  
          let entries = zip.getEntries()
          let files = []
          for(let i = 0; i < entries.length; i++) {
            files.push(entries[i].entryName)
          }
          
          if(modName === 'BSIPA') {
            execFile(path.join(getState().settings.installationDirectory, 'IPA.exe'), ['-n'], { cwd: getState().settings.installationDirectory })
            dispatch({
              type: 'DISPLAY_WARNING',
              payload: { text: 'Game successfully patched with BSIPA.', color: 'lightgreen' }
            })
            dispatch({
              type: SET_PATCHING,
              payload: false
            })
          }

          dispatch({
            type: INSTALL_MOD,
            payload: {
              id: mod._id,
              name: mod.name,
              version: beatModsResponse.version,
              files,
              dependencyOf: [ dependencyOf ],
              dependsOn,
              active: true
            }
          })
        })
      } else {
        let installationType = getState().settings.installationType
        if(mod.downloads.some(version => version.type === installationType)) {
          req = request.get({ url: `https://beatmods.com${mod.downloads.filter(version => version.type === installationType)[0].url}`, encoding: null }, (err, r, data) => {
          if(err || r.statusCode !== 200) throw err
  
          let zip = new AdmZip(data)
          zip.extractAllTo(getState().settings.installationDirectory)
  
          let entries = zip.getEntries()
          let files = []
          for(let i = 0; i < entries.length; i++) {
            files.push(entries[i].entryName)
          }
          
          dispatch({
            type: INSTALL_MOD,
            payload: {
              id: mod._id,
              name: mod.name,
              version: mod.version,
              files,
              dependencyOf: [ dependencyOf ],
              dependsOn,
              active: true
            }
          })
        })
        } else {
          dispatch({
            type: DISPLAY_WARNING,
            payload: {
              text: `The mod ${mod.name} does not have a version for ${installationType} installations.`
            }
          })
        }
      }

      req.on('response', (data) => {
        len = data.headers['content-length']
      })

      req.on('data', (chunk) => {
        chunks += chunk.length
        dispatch({
          type: UPDATE_PROGRESS,
          payload: {
            utc,
            hash: mod._id,
            progress: Math.trunc((chunks / len) * 100)
          }
        })
      })
    })
}

export const installEssentialMods = () => (dispatch, getState) => {
  installMod('SongLoader')(dispatch, getState)
  installMod('BeatSaverDownloader')(dispatch, getState)
  installMod('ScoreSaber')(dispatch, getState)
}

export const uninstallMod = modName => (dispatch, getState) => {
  let modIndex = getState().mods.installedMods.findIndex(mod => mod.name === modName)
  if(modIndex > -1) {
    let mod = getState().mods.installedMods[modIndex]
    for(let i = 0; i < mod.files.length; i++) {
      fs.unlink(path.join(getState().settings.installationDirectory, mod.files[i]), () => {})
    }
    dispatch({
      type: UNINSTALL_MOD,
      payload: modIndex
    })
  }
}

export const activateMod = modName => (dispatch, getState) => {
  if(isModInstalled(modName)(dispatch, getState) && !isModActive(modName)(dispatch, getState)) {
    try {
      let mod = getState().mods.installedMods.filter(mod => mod.name === modName)[0]
      let zip = new AdmZip(path.join(getState().settings.installationDirectory, 'DeactivatedPlugins', `${ mod.name }@${ mod.version }.bsmodd`))
      zip.extractAllTo(getState().settings.installationDirectory)
      fs.unlinkSync(path.join(getState().settings.installationDirectory, 'DeactivatedPlugins', `${ mod.name }@${ mod.version }.bsmodd`))
      dispatch({
        type: SET_MOD_ACTIVE,
        payload: {
          index: getState().mods.installedMods.findIndex(mod => mod.name === modName),
          active: true
        }
      })
    } catch {}
  }
}

export const deactivateMod = modName => (dispatch, getState) => {
  if(isModInstalled(modName)(dispatch, getState) && isModActive(modName)(dispatch, getState)) {
    let mod = getState().mods.installedMods.filter(mod => mod.name === modName)[0]
    let zip = new AdmZip()
    for(let i = 0; i < mod.files.length; i++) {
      try {
        if(fs.lstatSync(path.join(getState().settings.installationDirectory, mod.files[i])).isDirectory()) continue
        let dir = mod.files[i]
        let dirs = dir.split('/')
        dirs.pop()
        dir = dirs.join('/')
        zip.addLocalFile(path.join(getState().settings.installationDirectory, mod.files[i]), dir)
        fs.unlinkSync(path.join(getState().settings.installationDirectory, mod.files[i]))
      } catch {}
    }
    zip.writeZip(path.join(getState().settings.installationDirectory, 'DeactivatedPlugins', `${ mod.name }@${ mod.version }.bsmodd`))
    dispatch({
      type: SET_MOD_ACTIVE,
      payload: {
        index: getState().mods.installedMods.findIndex(mod => mod.name === modName),
        active: false
      }
    })
  }
}

export const isModActive = modName => (dispatch, getState) => {
  if(isModInstalled(modName)(dispatch, getState)) {
    return getState().mods.installedMods.filter(mod => mod.name === modName)[0].active
  }
  return false
}

export const checkInstalledMods = () => (dispatch, getState) => {
  setTimeout(() => {
    dispatch({
      type: SET_SCANNING_FOR_MODS,
      payload: true
    })
    let state = { ...getState() }
    let mods = []
    let count = 0
    let pluginsEnded = false
    let managedEnded = false
    let decrementCounter = () => {
      count--
      checkIfDone()
    }
    let checkIfDone = () => {
      if(pluginsEnded && managedEnded && count === 0) {
        for(let m = 0; m < mods.length; m++) {
          mods[m].dependencyOf = []
          for(let d = 0; d < mods[m].dependsOn.length; d++) {
            if(mods.some(mod => mod.name === mods[m].dependsOn[d])) {
              if(mods.filter(mod => mod.name === mods[m].dependsOn[d])[0].dependencyOf === undefined) mods.filter(mod => mod.name === mods[m].dependsOn[d])[0].dependencyOf = []
              mods.filter(mod => mod.name === mods[m].dependsOn[d])[0].dependencyOf.push(mods[m].name)
            }
          }
        }
        dispatch({
          type: SET_INSTALLED_MODS,
          payload: mods
        })
        dispatch({
          type: SET_SCANNING_FOR_MODS,
          payload: false
        })
        return
      }
    }
    fs.access(path.join(state.settings.installationDirectory, 'Plugins'), (err) => {
      if(err) {
        fs.mkdir(path.join(state.settings.installationDirectory, 'Plugins'), () => {})
        dispatch({
          type: DISPLAY_WARNING,
          payload: {
            text: `Could not find Plugins directory. Please make sure you have your installation directory and type set correctly.`
          }
        })
        dispatch({
          type: SET_SCANNING_FOR_MODS,
          payload: false
        })
        return
      }
      dispatch({
        type: CLEAR_MODS
      })
      fs.readdir(path.join(state.settings.installationDirectory, 'Plugins'), (err, files) => {
        if(files.length) {
          for(let i = 0; i < files.length; i++) {
            if(files[i].substr(files[i].length - 4) === '.dll') {
              count++
              fs.readFile(path.join(state.settings.installationDirectory, 'Plugins', files[i]), (err, data) => {
                if(err) { decrementCounter(); return }
                  let md5sum = crypto.createHash('md5')
                  md5sum.update(data)
                  let hash = md5sum.digest('hex')
                  fetch(`https://beatmods.com/api/v1/mod?hash=${hash}`)
                    .then(res => res.json())
                    .then(beatModsResponse => {
                      if(beatModsResponse.length > 0) {
                        if(mods.some(mod => mod.name === beatModsResponse[beatModsResponse.length - 1].name)) { decrementCounter(); return }
                        let files = []
                        if(beatModsResponse[beatModsResponse.length - 1].downloads.some(version => version.type === 'universal')) {
                          for(let i = 0; i < beatModsResponse[beatModsResponse.length - 1].downloads[0].hashMd5.length; i++) {
                            files.push(beatModsResponse[beatModsResponse.length - 1].downloads[beatModsResponse[beatModsResponse.length - 1].downloads.findIndex(version => version.type === 'universal')].hashMd5[i].file)
                          }
                        } else {
                          if(beatModsResponse[beatModsResponse.length - 1].downloads.some(version => version.type === state.settings.installationType)) {
                            for(let i = 0; i < beatModsResponse[beatModsResponse.length - 1].downloads[0].hashMd5.length; i++) {
                              files.push(beatModsResponse[beatModsResponse.length - 1].downloads[beatModsResponse[beatModsResponse.length - 1].downloads.findIndex(version => version.type === state.settings.installationType)].hashMd5[i].file)
                            }
                          } else {
                            return
                          }
                        }
                        let dependsOn = []
                        for(let i = 0; i < beatModsResponse[beatModsResponse.length - 1].dependencies.length; i++) {
                          dependsOn.push(beatModsResponse[beatModsResponse.length - 1].dependencies[i].name)
                        }
                        mods.push({
                          id: beatModsResponse[beatModsResponse.length - 1]._id,
                          name: beatModsResponse[beatModsResponse.length - 1].name,
                          version: beatModsResponse[beatModsResponse.length - 1].version,
                          files,
                          dependsOn,
                          active: true
                        })
                      }
                      decrementCounter()
                      return
                    })
              })
            }
          }
          console.log('Plugins Done')
          pluginsEnded = true
          checkIfDone()
        } else {
          pluginsEnded = true
          checkIfDone()
        }
      })
      fs.readdir(path.join(getState().settings.installationDirectory, 'Beat Saber_Data', 'Managed'), (err, files) => {
        if(files.length) {
          for(let i = 0; i < files.length; i++) {
            if(files[i].substr(files[i].length - 4) === '.dll') {
              count++
              fs.readFile(path.join(getState().settings.installationDirectory, 'Beat Saber_Data', 'Managed', files[i]), (err, data) => {
                if(err) { decrementCounter(); return }
                let md5sum = crypto.createHash('md5')
                md5sum.update(data)
                let hash = md5sum.digest('hex')
                fetch(`https://beatmods.com/api/v1/mod?hash=${hash}`)
                  .then(res => res.json())
                  .then(beatModsResponse => {
                    if(beatModsResponse.length > 0) {
                      if(mods.some(mod => mod.name === beatModsResponse[beatModsResponse.length - 1].name)) { decrementCounter(); return }
                      let files = []
                      if(beatModsResponse[beatModsResponse.length - 1].downloads.some(version => version.type === 'universal')) {
                        for(let i = 0; i < beatModsResponse[beatModsResponse.length - 1].downloads[0].hashMd5.length; i++) {
                          files.push(beatModsResponse[beatModsResponse.length - 1].downloads[beatModsResponse[beatModsResponse.length - 1].downloads.findIndex(version => version.type === 'universal')].hashMd5[i].file)
                        }
                      } else {
                        if(beatModsResponse[beatModsResponse.length - 1].downloads.some(version => version.type === state.settings.installationType)) {
                          for(let i = 0; i < beatModsResponse[beatModsResponse.length - 1].downloads[0].hashMd5.length; i++) {
                            files.push(beatModsResponse[beatModsResponse.length - 1].downloads[beatModsResponse[beatModsResponse.length - 1].downloads.findIndex(version => version.type === state.settings.installationType)].hashMd5[i].file)
                          }
                        } else {
                          return
                        }
                      }
                      let dependsOn = []
                      for(let i = 0; i < beatModsResponse[beatModsResponse.length - 1].dependencies.length; i++) {
                        dependsOn.push(beatModsResponse[beatModsResponse.length - 1].dependencies[i].name)
                      }
                      mods.push({
                        id: beatModsResponse[beatModsResponse.length - 1]._id,
                        name: beatModsResponse[beatModsResponse.length - 1].name,
                        version: beatModsResponse[beatModsResponse.length - 1].version,
                        files,
                        dependsOn,
                        active: true
                      })
                    }
                    decrementCounter()
                    return
                  })
                })
              }
          }
          console.log('Managed Done')
          managedEnded = true
          checkIfDone()
        } else {
          managedEnded = true
          checkIfDone()
        }
      })
    })
  }, 1000)
}

export const patchGame = () => (dispatch, getState) => {
  if(getState().mods.patching) return
  dispatch({
    type: SET_PATCHING,
    payload: true
  })
  let patchedWith = gamePatchedWith()(dispatch, getState)
  if(patchedWith === 'NONE') {
    installMod('BSIPA')(dispatch, getState)
    /*
    fetch('https://api.github.com/repos/nike4613/BeatSaber-IPA-Reloaded/releases/latest')
      .then(res => res.json())
      .then(latestRelease => {
        request.get(latestRelease.assets[latestRelease.assets.findIndex(asset => asset.name === 'Release.zip')].browser_download_url, { encoding: null }, (err, r, data) => {
          AdmZip(data).extractAllTo(getState().settings.installationDirectory)
          execFile(path.join(getState().settings.installationDirectory, 'IPA.exe'), ['-n'], { cwd: getState().settings.installationDirectory })
          dispatch({
            type: 'DISPLAY_WARNING',
            payload: { text: 'Game successfully patched with BSIPA.', color: 'lightgreen' }
          })
        })
      })
      */
  } else {
    if(patchedWith === 'BSIPA') {
      dispatch({
        type: 'DISPLAY_WARNING',
        payload: { text: 'Your game is already patched with BSIPA.', color: 'lightgreen' }
      })
    }
    dispatch({
      type: SET_PATCHING,
      payload: false
    })
  }
}

export const gamePatchedWith = () => (dispatch, getState) => {
  let installationType = 'NONE'
  try {
    fs.accessSync(path.join(getState().settings.installationDirectory, 'IPA.exe'))
    fs.accessSync(path.join(getState().settings.installationDirectory, 'winhttp.dll'))
    installationType = 'BSIPA'
  } catch {
    try {
      fs.accessSync(path.join(getState().settings.installationDirectory, 'IPA.exe'))
      fs.accessSync(path.join(getState().settings.installationDirectory, 'IPA', 'Data', 'Managed', 'IllusionInjector.dll'))
      installationType = 'IPA'
      dispatch({
        type: 'DISPLAY_WARNING',
        payload: { 
          text: `Your game is patched with IPA. It is reccommeded that you upgrade to BSIPA to maintain compatability with future mods.
                  To upgrade, reinstall Beat Saber and download any mod from BeatDrop.`,
          color: 'gold'
        }
      })
    } catch {}
  }
  return installationType
}

export const isModInstalled = modName => (dispatch, getState) => {
  console.log(modName + ' installed: ' + getState().mods.installedMods.some(mod => mod.name === modName))
  console.log('Installed mods: ' + getState().mods.installedMods.join(', '))
  return getState().mods.installedMods.some(mod => mod.name === modName)
}

export const isModPendingInstall = modName => (dispatch, getState) => {
  console.log(modName + ' pending install: ' + getState().mods.pendingInstall.some(mod => mod === modName))
  console.log('Pending mods: ' + getState().mods.pendingInstall)
  return getState().mods.pendingInstall.some(mod => mod === modName)
}