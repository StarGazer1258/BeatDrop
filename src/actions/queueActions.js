import { ADD_TO_QUEUE, CLEAR_QUEUE, UPDATE_PROGRESS, SET_DOWNLOADED_SONGS, SET_DOWNLOADING_COUNT, SET_WAIT_LIST, DISPLAY_WARNING, SET_SCANNING_FOR_SONGS, SET_DISCOVERED_FILES, SET_PROCESSED_FILES } from './types'
import { SONG_LIST } from '../constants/views'
import { BEATSAVER_BASE_URL } from '../constants/urls'
import { makeUrl } from '../utilities'
import { isModInstalled, installEssentialMods } from './modActions'
import { setView } from './viewActions'

const { remote } = window.require('electron')
const fs = remote.require('fs')
const path = remote.require('path')
const crypto = remote.require('crypto')
const AdmZip = remote.require('adm-zip')
const request = remote.require('request')
const rimraf = remote.require('rimraf')

/**
 * Downloads a song.
 * @param {string} identity The hash/key of the song to download
 */
export const downloadSong = (identity) => (dispatch, getState) => {
  if(!isModInstalled('SongLoader')(dispatch, getState)) installEssentialMods()(dispatch, getState)
  let hash = identity
  if(identity) {
    fetch(makeUrl(BEATSAVER_BASE_URL, `/api/maps/by-hash/${hash}`))
      .then(res => res.json())
      .then(song => {
        hash = song.hash
        let state = { ...getState() }
        if(state.songs.downloadingCount >= 3) {
          dispatch({
            type: SET_WAIT_LIST,
            payload: [...state.songs.waitingToDownload, identity]
          })
          return
        }
        dispatch({
          type: SET_DOWNLOADING_COUNT,
          payload: ++state.songs.downloadingCount
        })
        document.getElementById('queue-button').classList.add('notify')
        setTimeout(() => {
          document.getElementById('queue-button').classList.remove('notify')
        }, 1000)
        fetch(makeUrl(BEATSAVER_BASE_URL, `/api/maps/by-hash/${hash}`))
          .then(res =>  res.json())
          .then(song => {
            let utc = Date.now()
            if(song) {
              dispatch({
                type: ADD_TO_QUEUE,
                payload: {
                  utc,
                  hash: song.hash,
                  image: `${BEATSAVER_BASE_URL}${ song.coverURL }`,
                  title: song.metadata.songName,
                  author: song.metadata.songAuthorName
                }
              })
              let req = request.get({
                url: `${BEATSAVER_BASE_URL}${song.downloadURL}`,
                encoding: null
              }, (err, r, data) => {
                try {
                  // eslint-disable-next-line
                  if(err || r.statusCode !== 200) throw 'Error downloading!'
                } catch(err) {
                  state = { ...getState() }
                    dispatch({
                      type: SET_DOWNLOADING_COUNT,
                      payload: --state.songs.downloadingCount
                    })
                    if(state.songs.waitingToDownload.length > 0) {
                      let toDownload = state.songs.waitingToDownload.pop()
                      dispatch({
                        type: SET_WAIT_LIST,
                        payload: state.songs.waitingToDownload
                      })
                      downloadSong(toDownload)(dispatch, getState)
                    }
                    dispatch({
                      type: DISPLAY_WARNING,
                      payload: {
                        text: `There was an error downloading the song with hash ${hash}. There may have been an error with BeatSaver's servers or the song may no longer be available. Please try again and contact the BeatSaver developers if problem persists.`
                      }
                    })
                    return
                }
                let zip = new AdmZip(data)
                let zipEntries = zip.getEntries()
                let infoEntry
                for(let i = 0; i < zipEntries.length; i++) {
                  if(zipEntries[i].entryName.split(path.sep).pop() === 'info.dat') {
                    infoEntry  = zipEntries[i]
                  }
                }
                let extractTo
                switch(getState().settings.folderStructure) {
                  case 'keySongNameArtistName':
                    extractTo = `${ song.key } (${ song.metadata.songName.replace(/[\\/:*?"<>|.]/g, '') } - ${ song.metadata.songAuthorName.replace(/[\\/:*?"<>|.]/g, '') })`
                    break
                  case 'key':
                    extractTo = song.key
                    break
                  case 'songName':
                    extractTo = song.name.replace(/[\\/:*?"<>|.]/g, '')
                    break
                  default:
                    extractTo = `${ song.key } (${ song.name.replace(/[\\/:*?"<>|.]/g, '') } - ${ song.songAuthorName.replace(/[\\/:*?"<>|.]/g, '') })`
                    break
                }
                zip.extractAllTo(path.join(getState().settings.installationDirectory, 'Beat Saber_Data', 'CustomLevels', extractTo))
                let metadataFile = path.join(getState().settings.installationDirectory, 'Beat Saber_Data', 'CustomLevels', extractTo, 'metadata.dat')
                fs.access(metadataFile, accessErr => {
                  if(accessErr) {
                    fs.writeFile(metadataFile, JSON.stringify({ key: song.key, hash: song.hash, downloadTime: utc }), err => {
                      if(err) {
                        dispatch({
                          type: DISPLAY_WARNING,
                          payload: {
                            text: `Failed to write metadata file for ${ song.name }. Go to settings and press "Scan for Songs" to try again.`
                          }
                        })
                      }
                    })
                    return
                  }
                  fs.readFile(metadataFile, 'UTF-8', (err, metadata) => {
                    if(err) {
                      dispatch({
                        type: DISPLAY_WARNING,
                        payload: {
                          text: `Failed to read metadata file for ${ song.name }. Go to settings and press "Scan for Songs" to try again.`
                        }
                      })
                    }
                    fs.writeFile(metadataFile, JSON.stringify({ ...JSON.parse(metadata), key: song.key, hash: song.hash, downloadTime: utc }), err => {
                      if(err) {
                        dispatch({
                          type: DISPLAY_WARNING,
                          payload: {
                            text: `Failed to write metadata file for ${ song.name }. Go to settings and press "Scan for Songs" to try again.`
                          }
                        })
                      }
                    })
                  })
                })
                dispatch({
                  type: SET_DOWNLOADED_SONGS,
                  payload: [...getState().songs.downloadedSongs, { hash, file: path.join(getState().settings.installationDirectory, 'Beat Saber_Data', 'CustomLevels', extractTo, infoEntry.entryName) }]
                })
                state = { ...getState() }
                dispatch({
                  type: SET_DOWNLOADING_COUNT,
                  payload: --state.songs.downloadingCount
                })
                if(state.songs.waitingToDownload.length > 0) {
                  let toDownload = state.songs.waitingToDownload.pop()
                  dispatch({
                    type: SET_WAIT_LIST,
                    payload: state.songs.waitingToDownload
                  })
                  downloadSong(toDownload)(dispatch, getState)
                }
              })

              let len = 0
              let chunks = 0

              req.on('response', (data) => {
                len = data.headers['content-length']
              })

              req.on('data', (chunk) => {
                chunks += chunk.length
                dispatch({
                  type: UPDATE_PROGRESS,
                  payload: {
                    utc,
                    hash: song.hash,
                    progress: Math.trunc((chunks / len) * 100)
                  }
                })
              })
            } else {
              dispatch({
                type: DISPLAY_WARNING,
                payload: {
                  text: `There was an error downloading the song with hash ${hash}. The song requested is no longer available for download.`
                }
              })
            }
          })
          .catch(err => {
            state = { ...getState() }
            dispatch({
              type: SET_DOWNLOADING_COUNT,
              payload: --state.songs.downloadingCount
            })
            if(state.songs.waitingToDownload.length > 0) {
              let toDownload = state.songs.waitingToDownload.pop()
              dispatch({
                type: SET_WAIT_LIST,
                payload: state.songs.waitingToDownload
              })
              downloadSong(toDownload)(dispatch)
            }
            dispatch({
              type: DISPLAY_WARNING,
              payload: {
                text: `There was an error downloading the song with hash ${hash}. There may have been an error with BeatSaver's servers or the song may no longer be available. Please try again and contact the BeatSaver developers if problem persists.`
              }
            })
          })
      })
      .catch(err => {
        dispatch({
          type: DISPLAY_WARNING,
          payload: {
            text: `There was an error downloading the song with key ${identity}. There may have been an error with BeatSaver's servers or the song may no longer be available. Please try again and contact the BeatSaver developers if problem persists.`
          }
        })
        return
      })
  } else {
    let state = { ...getState() }
    if(state.songs.downloadingCount >= 3) {
      dispatch({
        type: SET_WAIT_LIST,
        payload: [...state.songs.waitingToDownload, identity]
      })
      return
    }
    dispatch({
      type: SET_DOWNLOADING_COUNT,
      payload: ++state.songs.downloadingCount
    })
    document.getElementById('queue-button').classList.add('notify')
    setTimeout(() => {
      document.getElementById('queue-button').classList.remove('notify')
    }, 1000)
    fetch(makeUrl(BEATSAVER_BASE_URL, `/api/maps/by-hash/${hash}`))
      .then(res =>  res.json())
      .then(song => {
        let utc = Date.now()
        dispatch({
          type: ADD_TO_QUEUE,
          payload: {
            utc,
            hash: song.hash,
            image: `${BEATSAVER_BASE_URL}${ song.coverURL }`,
            title: song.metadata.songName,
            author: song.metadata.songAuthorName
          }
        })
        let req = request.get({
          url: `${BEATSAVER_BASE_URL}/${ song.downloadURL }`,
          encoding: null
        }, (err, r, data) => {
          try {
            // eslint-disable-next-line
            if(err || r ? r.statusCode !== 200 : false) throw 'Error downloading!'
          } catch(err) {
            state = { ...getState() }
              dispatch({
                type: SET_DOWNLOADING_COUNT,
                payload: --state.songs.downloadingCount
              })
              if(state.songs.waitingToDownload.length > 0) {
                let toDownload = state.songs.waitingToDownload.pop()
                dispatch({
                  type: SET_WAIT_LIST,
                  payload: state.songs.waitingToDownload
                })
                downloadSong(toDownload)(dispatch, getState)
              }
              dispatch({
                type: DISPLAY_WARNING,
                payload: {
                  text: `There was an error downloading the song with hash ${hash}. There may have been an error with BeatSaver's servers or the song may no longer be available. Please try again and contact the BeatSaver developers if problem persists.`
                }
              })
              return
          }
          let zip = new AdmZip(data)
          let zipEntries = zip.getEntries()
          let infoEntry, infoObject
          for(let i = 0; i < zipEntries.length; i++) {
            if(zipEntries[i].entryName.substr(zipEntries[i].entryName.length - 9, 9) === 'info.json' || zipEntries[i].entryName.substr(zipEntries[i].entryName.length - 8, 9) === 'info.dat') {
              infoEntry = zipEntries[i]
            }
          }
          try {
            infoObject = JSON.parse(infoEntry.getData().toString('UTF8'))
          } catch(err) {
            dispatch({
              type: DISPLAY_WARNING,
              payload: {
                text: `There was an error unpacking the song "${song.songName}." The song's files may be corrupt or use formatting other than UTF-8 (Why UTF-8? The IETF says so! https://tools.ietf.org/html/rfc8259#section-8.1). Please try again and contact the song's uploader, ${song.uploader.username}, if problem persists.`
              }
            })
            return
          }
          infoObject.key = song.key
          infoObject.hash = hash
          zip.updateFile(infoEntry.entryName, JSON.stringify(infoObject))
          let extractTo
          switch(getState().settings.folderStructure) {
            case 'keySongNameArtistName':
              extractTo = `${ song.key } (${ song.metadata.songName.replace(/[\\/:*?"<>|.]/g, '') } - ${ song.metadata.songAuthorName })`
              break
            case 'key':
              extractTo = song.key
              break
            case 'songName':
              extractTo = song.name.replace(/[\\/:*?"<>|.]/g, '')
              break
            default:
              extractTo = `${ song.key } (${ song.name.replace(/[\\/:*?"<>|.]/g, '') } - ${ song.songAuthorName })`
              break
          }
          zip.extractAllTo(path.join(getState().settings.installationDirectory, 'Beat Saber_Data', 'CustomLevels', extractTo))
          dispatch({
            type: SET_DOWNLOADED_SONGS,
            payload: [...getState().songs.downloadedSongs, { hash, file: path.join(getState().settings.installationDirectory, 'Beat Saber_Data', 'CustomLevels', extractTo, infoEntry.entryName) }]
          })
          state = { ...getState() }
          dispatch({
            type: SET_DOWNLOADING_COUNT,
            payload: --state.songs.downloadingCount
          })
          if(state.songs.waitingToDownload.length > 0) {
            let toDownload = state.songs.waitingToDownload.pop()
            dispatch({
              type: SET_WAIT_LIST,
              payload: state.songs.waitingToDownload
            })
            downloadSong(toDownload)(dispatch, getState)
          }
        })

        let len = 0
        let chunks = 0

        req.on('response', (data) => {
          len = data.headers['content-length']
        })

        req.on('data', (chunk) => {
          chunks += chunk.length
          dispatch({
            type: UPDATE_PROGRESS,
            payload: {
              utc,
              hash: song.hash,
              progress: Math.trunc((chunks / len) * 100)
            }
          })
        })
      })
      .catch(err => {
        state = { ...getState() }
        dispatch({
          type: SET_DOWNLOADING_COUNT,
          payload: --state.songs.downloadingCount
        })
        if(state.songs.waitingToDownload.length > 0) {
          let toDownload = state.songs.waitingToDownload.pop()
          dispatch({
            type: SET_WAIT_LIST,
            payload: state.songs.waitingToDownload
          })
          downloadSong(toDownload)(dispatch, getState)
        }
        dispatch({
          type: DISPLAY_WARNING,
          payload: {
            text: `There was an error downloading the song with hash ${hash}. There may have been an error with BeatSaver's servers or the song may no longer be available. Please try again and contact the BeatSaver developers if problem persists.`
          }
        })
      })
  }
}

/**
 * Deletes a song.
 * @param {string} identity The hash/filePath if the song to delete
 */
export const deleteSong = (identity) => (dispatch, getState) => {
  let file = identity
  if(getState().songs.downloadedSongs.some(song => song.hash === identity)) {
    file = getState().songs.downloadedSongs[getState().songs.downloadedSongs.findIndex(song => song.hash === identity)].file
  }
  setView(getState().view.previousView)(dispatch, getState)
  let dirs = file.split(path.sep)
  let cld = dirs.indexOf('CustomLevels')
  for(let i = 2; i < file.split(path.sep).length - cld; i++) {
    dirs.pop()
  }
  let downloadedSongs = [ ...getState().songs.downloadedSongs ]
  downloadedSongs.splice(downloadedSongs.findIndex(song => song.file === file), 1)
  rimraf(dirs.join(path.sep), (err) => {
    if(err) {
      dispatch({
        type: DISPLAY_WARNING,
        payload: {
          text: `There was an error deleting the song located at ${dirs.join(path.sep)}. BeatDrop may have insufficient permissions or the file may be in use by another program. Please try closing any programs that may be using this song and try again.`
        }
      })
      return
    }
    setView(SONG_LIST)(dispatch, getState)
    dispatch({
      type: SET_DOWNLOADED_SONGS,
      payload: downloadedSongs
    })
  })
}

export const hashAndWriteToMetadata = (infoFile) => dispatch => {
  return new Promise((resolve, reject) => {
    let metadataFile = path.join(path.dirname(infoFile), 'metadata.dat')
    fs.readFile(infoFile, { encoding: 'UTF-8' }, (infoReadErr, infoData) => {                             // Read the info.dat file
      if(infoReadErr) {
        dispatch({
          type: DISPLAY_WARNING,
          payload: {
            text: `Failed to read info file ${ infoFile }. Go to settings and press "Scan for Songs" to try again.`
          }
        })
        reject(infoReadErr)
      }
      let song = JSON.parse(infoData),
          dataToHash = '',
          fileToHash,
          hash
      fs.readFile(metadataFile, 'UTF-8', (readMetadataErr, metadataData) => {
        if(readMetadataErr || !JSON.parse(metadataData).hasOwnProperty('hash')) {
          try {
            dataToHash += infoData
            for(let set = 0; set < song._difficultyBeatmapSets.length; set++) {
              for (let map = 0; map < song._difficultyBeatmapSets[set]._difficultyBeatmaps.length; map++) {
                fileToHash = path.join(path.dirname(infoFile), song._difficultyBeatmapSets[set]._difficultyBeatmaps[map]._beatmapFilename)
                dataToHash += fs.readFileSync(fileToHash, 'UTF8')
              }
            }
            hash = crypto.createHash('sha1')                                                  // Calculate song hash
              .update(dataToHash)
              .digest('hex')
          } catch(hashingErr) {
            dispatch({
              type: DISPLAY_WARNING,
              payload: {
                text: `Failed to calculate hash: ${ fileToHash } could not be accessed.`
              }
            })
            reject(hashingErr)
          }
          fs.writeFile(metadataFile, JSON.stringify({ ...(readMetadataErr ? {} : JSON.parse(metadataData)), hash: (readMetadataErr ? hash : JSON.parse(metadataData).hash), scannedTime: Date.now() }), writeErr => {   // Save metadata.dat file
            if(writeErr) {
              dispatch({
                type: DISPLAY_WARNING,
                payload: {
                  text: `Failed to write metadata file for ${ song.name }. Go to settings and press "Scan for Songs" to try again.`
                }
              })
              reject(writeErr)
            }
          })
        } else {
          hash = JSON.parse(metadataData).hash
        }
        resolve(hash)
      })
    })
  })
}

export const checkDownloadedSongs = () => (dispatch, getState) => {
  let discoveredFiles = 0, processedFiles = 0
  dispatch({
    type: SET_DISCOVERED_FILES,
    payload: discoveredFiles
  })
  dispatch({
    type: SET_PROCESSED_FILES,
    payload: processedFiles
  })
  function walk(pathName, cb) {
    let songs = []
    fs.readdir(pathName, (err, files) => {
      if(err) return cb(err)
      let pending = files.length
      dispatch({
        type: SET_DISCOVERED_FILES,
        payload: discoveredFiles += pending
      })
      if(!pending) return cb(null, songs)
      for(let i = 0; i < files.length; i++) {
        const file = path.join(pathName, files[i])
        fs.stat(file, (err, stat) => { // eslint-disable-line no-loop-func
          if(err) return cb(err)
          if(stat && stat.isDirectory()) {
            walk(file, (_, s) => {
              songs = songs.concat(s)
              dispatch({
                type: SET_PROCESSED_FILES,
                payload: ++processedFiles
              })
              if(!--pending) cb(null, songs)
            })
          } else {
            switch(files[i].toLowerCase()) {
              case 'info.dat':                                                                   // In case of an info file
                hashAndWriteToMetadata(file)(dispatch, getState)
                  .then(hash => {
                    songs.push({ hash, file })
                    dispatch({
                      type: SET_PROCESSED_FILES,
                      payload: ++processedFiles
                    })
                    if(!--pending) cb(null, songs)
                  }, _ => {
                    dispatch({
                      type: SET_PROCESSED_FILES,
                      payload: ++processedFiles
                    })
                    if(!--pending) cb(null, songs)
                  })
                break
              default:
                dispatch({
                  type: SET_PROCESSED_FILES,
                  payload: ++processedFiles
                })
                if(!--pending) cb(null, songs)
                break
            }
          }
        })
      }
    })
  }
  dispatch({
    type: SET_SCANNING_FOR_SONGS,
    payload: true
  })
  walk(path.join(getState().settings.installationDirectory, 'Beat Saber_Data', 'CustomLevels'), (err, songs) => {
    if (err) {
      dispatch({
        type: DISPLAY_WARNING,
        payload: {
          text: `Could not find CustomLevels folder. Please make sure you have your installation directory and type are set correctly.`
        }
      })
      fs.mkdir(path.join(getState().settings.installationDirectory, 'Beat Saber_Data', 'CustomLevels'), () => {
        dispatch({
          type: DISPLAY_WARNING,
          payload: {
            text: `Attempted to create CustomLevels folder and failed, likely due to permissions.`
          }
        })
      })
    }
    dispatch({
      type: SET_DOWNLOADED_SONGS,
      payload: songs
    })

    dispatch({
      type: SET_SCANNING_FOR_SONGS,
      payload: false
    })
  })
}

export const clearQueue = () => dispatch => {
  dispatch({
    type: CLEAR_QUEUE
  })
}

export const resetDownloads = () => dispatch => {
  dispatch({
    type: SET_DOWNLOADING_COUNT,
    payload: 0
  })
  dispatch({
    type: SET_WAIT_LIST,
    payload: []
  })
}
