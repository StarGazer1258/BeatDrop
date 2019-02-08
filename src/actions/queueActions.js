import { SET_QUEUE_OPEN, ADD_TO_QUEUE, CLEAR_QUEUE, UPDATE_PROGRESS, SET_VIEW, SET_DOWNLOADED_SONGS, SET_DOWNLOADING_COUNT, SET_WAIT_LIST, DISPLAY_WARNING, SET_SCANNING_FOR_SONGS } from './types'
import { SONG_LIST } from '../views'

const { remote } = window.require('electron')
const fs = remote.require('fs')
const path = remote.require('path')
const md5 = remote.require('md5')
const AdmZip = remote.require('adm-zip')
const Walker = remote.require('walker')
const request = remote.require('request')
const rimraf = remote.require('rimraf')

export const setQueueOpen = open => dispatch => {
  dispatch({
    type: SET_QUEUE_OPEN,
    payload: open
  })
}

/**
 * Downloads a song.
 * @param {string} identity The hash/key of the song to download
 */
export const downloadSong = (identity) => (dispatch, getState) => {
 let hash = identity
  if(!(/^[a-f0-9]{32}$/).test(identity)) {
    fetch(`https://beatsaver.com/api/songs/detail/${identity}`)
      .then(res => res.json())
      .then(song => {
        hash = song.song.hashMd5
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
        fetch(`https://beatsaver.com/api/songs/search/hash/${hash}`)
          .then(res =>  res.json())
          .then(results => {
            let utc = Date.now()
            if(results.songs.length === 1) {
              dispatch({
                type: ADD_TO_QUEUE,
                payload: {...results.songs[0], utc}
              })
              let req = request.get({
                url: results.songs[0].downloadUrl,
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
                      downloadSong(toDownload)(dispatch)
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
                  if(zipEntries[i].entryName.substr(zipEntries[i].entryName.length-9, 9) === 'info.json') {
                    infoEntry  = zipEntries[i]
                  }
                }
                try {
                  infoObject = JSON.parse(infoEntry.getData().toString('UTF8'))
                } catch(err) {
                  dispatch({
                    type: DISPLAY_WARNING,
                    payload: {
                      text: `There was an error unpacking the song "${results.songs[0].songName}." The song's files may be corrupt or use formatting other than UTF8. Please try again and contact the song's uploader, ${results.songs[0].uploader}, if problem persists.`
                    }
                  })
                  return
                }
                infoObject.key = results.songs[0].key
                infoObject.hash = hash
                zip.updateFile(infoEntry.entryName, JSON.stringify(infoObject))
                let extractTo = (getState().settings.folderStructure === 'idKey' ? results.songs[0].key : results.songs[0].name.replace(/[\\/:*?"<>|.]/g, ''))
                zip.extractAllTo(path.join(getState().settings.installationDirectory, 'CustomSongs', extractTo))
                dispatch({
                  type: SET_DOWNLOADED_SONGS,
                  payload: [...getState().songs.downloadedSongs, {hash, file: path.join(getState().settings.installationDirectory, 'CustomSongs', extractTo, infoEntry.entryName)}]
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
                    hash: results.songs[0].hashMd5,
                    progress: Math.trunc((chunks / len) * 100)
                  }
                })
              })
            } else {
              dispatch({
                type: DISPLAY_WARNING,
                payload: {
                  text: `There was an error downloading the song with hash ${hash}. The song requested is no longer be available for download.`
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
    fetch(`https://beatsaver.com/api/songs/search/hash/${hash}`)
      .then(res =>  res.json())
      .then(results => {
        let utc = Date.now()
        if(results.songs.length === 1) {
          dispatch({
            type: ADD_TO_QUEUE,
            payload: {...results.songs[0], utc}
          })
          let req = request.get({
            url: results.songs[0].downloadUrl,
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
            let infoEntry, infoObject
            for(let i = 0; i < zipEntries.length; i++) {
              if(zipEntries[i].entryName.substr(zipEntries[i].entryName.length-9, 9) === 'info.json') {
                infoEntry  = zipEntries[i]
              }
            }
            try {
              infoObject = JSON.parse(infoEntry.getData().toString('UTF8'))
            } catch(err) {
              dispatch({
                type: DISPLAY_WARNING,
                payload: {
                  text: `There was an error unpacking the song "${results.songs[0].songName}." The song's files may be corrupt or use formatting other than UTF8. Please try again and contact the song's uploader, ${results.songs[0].uploader}, if problem persists.`
                }
              })
              return
            }
            infoObject.key = results.songs[0].key
            infoObject.hash = hash
            zip.updateFile(infoEntry.entryName, JSON.stringify(infoObject))
            let extractTo = (getState().settings.folderStructure === 'idKey' ? results.songs[0].key : results.songs[0].name.replace(/[\\/:*?"<>|.]/g, ''))
            zip.extractAllTo(path.join(getState().settings.installationDirectory, 'CustomSongs', extractTo))
            dispatch({
              type: SET_DOWNLOADED_SONGS,
              payload: [...getState().songs.downloadedSongs, {hash, file: path.join(getState().settings.installationDirectory, 'CustomSongs', extractTo, infoEntry.entryName)}]
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
                hash: results.songs[0].hashMd5,
                progress: Math.trunc((chunks / len) * 100)
              }
            })
          })
        } else {
          dispatch({
            type: DISPLAY_WARNING,
            payload: {
              text: `There was an error downloading the song with hash ${hash}. The song requested is no longer be available for download.`
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
  dispatch({
    type: SET_VIEW,
    payload: getState().view.previousView
  })
  let dirs = file.split('\\')
  let csd = dirs.indexOf('CustomSongs')
  for(let i = 2; i < file.split('\\').length - csd; i++) {
    dirs.pop()
  }
  let downloadedSongs = [ ...getState().songs.downloadedSongs ]
  downloadedSongs.splice(downloadedSongs.findIndex(song => song.file === file), 1)
  rimraf(dirs.join('\\'), (err) => {
    if(err) {
      dispatch({
        type: DISPLAY_WARNING,
        payload: {
          text: `There was an error deleting the song located at ${dirs.join('\\')}. BeatDrop may have insufficient permissions or the file may be in use by another program. Please try closing any programs that may be using this song and try again.`
        }
      })
      return
    }
    dispatch({
      type: SET_VIEW,
      payload: SONG_LIST
    })
    dispatch({
      type: SET_DOWNLOADED_SONGS,
      payload: downloadedSongs
    })
  })
}

export const checkDownloadedSongs = () => (dispatch, getState) => {
  setTimeout(() => {
  dispatch({
    type: SET_SCANNING_FOR_SONGS,
    payload: true
  })
  let state = { ...getState() }
  let songs = []
  let count = 0
  let ended = false
  let decrementCounter = () => {
    count--
    if(ended && count === 0) {
      dispatch({
        type: SET_DOWNLOADED_SONGS,
        payload: songs
      })
      dispatch({
        type: SET_SCANNING_FOR_SONGS,
        payload: false
      })
      return
    }
  }
  fs.access(path.join(state.settings.installationDirectory, 'CustomSongs'), (err) => {
    if(err) {
      dispatch({
        type: DISPLAY_WARNING,
        payload: {
          text: `Could not find CustomSongs directory. Please make sure you have your installation directory set correctly and have the proper plugins installed.`
        }
      })
      dispatch({
        type: SET_SCANNING_FOR_SONGS,
        payload: false
      })
      return
    }
    Walker(path.join(getState().settings.installationDirectory, 'CustomSongs'))
      .on('file', (file) => {
        if(file.substr(file.length-9) === 'info.json') {
          count++
          fs.readFile(file, 'UTF-8', (err, data) => {
            if(err) { decrementCounter(); return }
            let dirs = file.split('\\')
            dirs.pop()
            let dir = dirs.join('\\')
            let song
            try {
              song = JSON.parse(data)
            } catch(err) {
              decrementCounter()
              return
            }
            if(song.hasOwnProperty('hash')) {
              songs.push({hash: song.hash, file})
              decrementCounter()
            } else {
              let to_hash = ''
              for(let i = 0; i < song.difficultyLevels.length; i++) {
                try {
                  to_hash += fs.readFileSync(path.join(dir, song.difficultyLevels[i].jsonPath), 'UTF8')
                } catch(err) {
                  decrementCounter()
                  return
                }
              }
              let hash = md5(to_hash)
              song.hash = hash
              fs.writeFile(file, JSON.stringify(song), 'UTF8', (err) => { if(err) return })
              songs.push({hash, file})
              decrementCounter()
            }
          })
        }
      })
      .on('end', () => {
        if(count === 0) {
          dispatch({
            type: SET_DOWNLOADED_SONGS,
            payload: songs
          })
          dispatch({
            type: SET_SCANNING_FOR_SONGS,
            payload: false
          })
          return
        }
        ended = true
      })
  })
  }, 1000)
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