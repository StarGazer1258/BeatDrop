import { SET_QUEUE_OPEN, ADD_TO_QUEUE, CLEAR_QUEUE, UPDATE_PROGRESS, SET_VIEW, CHECK_DOWNLOADED_SONGS, SET_DOWNLOADING_COUNT, SET_WAIT_LIST, DISPLAY_WARNING } from './types'
import { store } from '../store';

import { fetchLocalSongs } from './songListActions'

const { remote } = window.require('electron')
const fs = remote.require('fs')
const path = remote.require('path')
const md5 = remote.require('md5')
const AdmZip = remote.require('adm-zip')
const Walker = remote.require('walker')
const request = remote.require('request')
const rimraf = remote.require('rimraf')

export const setQueueOpen = open => dispatch => {
  console.log(open)
  dispatch({
    type: SET_QUEUE_OPEN,
    payload: open
  })
}

export const downloadSong = (key) => dispatch => {
  let state = store.getState()
  if(state.songs.downloadingCount >= 3) {
    console.log(state.songs.waitingToDownload)
    dispatch({
      type: SET_WAIT_LIST,
      payload: [...state.songs.waitingToDownload, key]
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
  fetch('https://beatsaver.com/api/songs/detail/' + key)
  .then(res =>  res.json())
    .then(details => {
      dispatch({
        type: ADD_TO_QUEUE,
        payload: details
      })

      let req = request.get({
        url: details.song.downloadUrl,
        encoding: null
      }, (err, r, data) => {
        try {
          // eslint-disable-next-line
          if(err || r.statusCode !== 200) throw 'Error downloading!'
        } catch(err) {
          state = store.getState()
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
                text: `There was an error downloading the song with key ${key}. There may have been an error with BeatSaver's servers or the song may no longer be available. Please try again and contact the BeatSaver developers if problem persists.`
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
              text: `There was an error unpacking the song "${details.song.songName}." The song's files may be corrupt or use formatting other than UTF8. Please try again and contact the song's uploader, ${details.song.uploader}, if problem persists.`
            }
          })
          return
        }
        infoObject.key = key
        zip.updateFile(infoEntry.entryName, JSON.stringify(infoObject))
        let extractTo = (store.getState().settings.folderStructure === 'idKey' ? details.song.key : details.song.name.replace(/[\\/:*?"<>|.]/g, ''))
        zip.extractAllTo(store.getState().settings.installationDirectory + '\\CustomSongs\\' + extractTo)
        checkDownloadedSongs()(dispatch)
        state = store.getState()
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
            key: details.song.key,
            progress: Math.trunc((chunks / len) * 100)
          }
        })
      })
    })
    .catch(err => {
      state = store.getState()
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
          text: `There was an error downloading the song with key ${key}. There may have been an error with BeatSaver's servers or the song may no longer be available. Please try again and contact the BeatSaver developers if problem persists.`
        }
      })
    })
}

export const deleteSong = (file) => dispatch => {
  dispatch({
    type: SET_VIEW,
    payload: store.getState().view.previousView
  })
  let dirs = file.split('\\')
  let csd = dirs.indexOf('CustomSongs')
  for(let i = 2; i < file.split('\\').length - csd; i++) {
    dirs.pop()
  }
  rimraf(dirs.join('\\'), () => { fetchLocalSongs()(dispatch); checkDownloadedSongs()(dispatch) })
}

export const checkDownloadedSongs = () => dispatch => {
  let state = store.getState()
  let songKeys = []
  let songFiles = []
  let count = 0
  let ended = false
  let decrementCounter = () => {
    count--
    if(ended && count === 0) {
      dispatch({
        type: CHECK_DOWNLOADED_SONGS,
        payload: {songKeys, songFiles}
      })
      return
    }
  }
  fs.access(path.join(state.settings.installationDirectory, 'CustomSongs'), (err) => {
    if(err) {
      alert('Could not find CustomSongs directory. Please make sure you have your installation directory set correctly and have the proper plugins installed.')
      return false
    }
    Walker(path.join(store.getState().settings.installationDirectory, 'CustomSongs'))
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
            if(song.hasOwnProperty('key')) {
              songKeys.push(song.key)
              songFiles.push(file)
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
              fetch('https://beatsaver.com/api/songs/search/hash/' + md5(to_hash))
                .then(res => res.json())
                .then(json => {
                  if(json.songs.length === 1) {
                    song.key = json.songs[0].key
                    fs.writeFile(file, JSON.stringify(song), 'UTF8', (err) => { if(err) return })
                    songKeys.push(json.songs[0].key)
                    songFiles.push(file)
                  }
                  decrementCounter()
                })
                .catch(err => {
                  decrementCounter()
                  return
                })
            }
          })
        }
      })
      .on('end', () => {
        if(count === 0) {
          dispatch({
            type: CHECK_DOWNLOADED_SONGS,
            payload: {songKeys, songFiles}
          })
          return
        }
        ended = true
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