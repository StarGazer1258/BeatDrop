import { FETCH_LOCAL_PLAYLISTS, LOAD_NEW_PLAYLIST_IMAGE, SET_NEW_PLAYLIST_OPEN, SET_PLAYLIST_PICKER_OPEN, CLEAR_PLAYLIST_DIALOG, LOAD_PLAYLIST_DETAILS, LOAD_PLAYLIST_SONGS, CLEAR_PLAYLIST_DETAILS, SET_PLAYLIST_EDITING, SET_LOADING, DISPLAY_WARNING } from './types'
import { PLAYLIST_LIST, PLAYLIST_DETAILS } from '../constants/views'
import { BEATSAVER_BASE_URL } from '../constants/urls'
import { makeUrl } from '../utilities'
import { defaultPlaylistIcon } from '../b64Assets'
import { hashAndWriteToMetadata } from './queueActions'
import { setView } from './viewActions'

const { remote } = window.require('electron')
const fs = remote.require('fs')
const path = remote.require('path')

export const fetchLocalPlaylists = (doSetView) => (dispatch, getState) => {
  let state = getState()
  if(typeof doSetView === 'object' || doSetView === undefined) { doSetView = true } else { doSetView = false }
  if(doSetView === true) {
    setView(PLAYLIST_LIST)(dispatch, getState)
    dispatch({
      type: SET_LOADING,
      payload: true
    })
  }
  let playlists = []
  fs.access(path.join(state.settings.installationDirectory, 'Playlists'), (err) => {
    if(err) {
      fs.mkdirSync(path.join(state.settings.installationDirectory, 'Playlists'))
    }
    fs.readdir(path.join(state.settings.installationDirectory, 'Playlists'), (err, files) => {
      if(err) return
      if (!files.length) {
        dispatch({
          type: FETCH_LOCAL_PLAYLISTS,
          payload: []
        })
        dispatch({
          type: SET_LOADING,
          payload: false
        })
        dispatch({
          type: DISPLAY_WARNING,
          payload: {
            color: 'gold',
            text: 'No playlists found!'
          }
        })
      }
      let playlistsFound = 0
      for(let f in files) {
        if(files[f].split('.')[files[f].split('.').length - 1] === 'json' || files[f].split('.')[files[f].split('.').length - 1] === 'bplist') playlistsFound++
      }
      let pushPlaylist = playlist => {
        playlists.push(playlist)
        if(playlists.length === playlistsFound) {
          dispatch({
            type: FETCH_LOCAL_PLAYLISTS,
            payload: playlists
          })
          dispatch({
            type: SET_LOADING,
            payload: false
          })
        }
      }
      for(let f in files) {
        fs.readFile(path.join(state.settings.installationDirectory, 'Playlists', files[f]), 'UTF8', (err, data) => {
          try {
            let playlist = JSON.parse(data)
            playlist.file = path.join(state.settings.installationDirectory, 'Playlists', files[f])
            pushPlaylist(playlist)
          } catch(e) {
            dispatch({
              type: DISPLAY_WARNING,
              payload: {
                text: `The playlist file ${files[f]} is invalid and cannot be parsed. Please use a tool such as https://codebeautify.org/jsonvalidator to check for errors and try again.`
              }
            })
          }
        })
      }
    })
  })
}

export const loadPlaylistCoverImage = fileLocation => dispatch => {
  dispatch({
    type: LOAD_NEW_PLAYLIST_IMAGE,
    payload: fileLocation
  })
}

export const createNewPlaylist = playlistInfo => (dispatch, getState) => {
  let state = getState()
  try {
    let buff = fs.readFileSync(state.playlists.newCoverImageSource)
    playlistInfo.image = `data:image/${state.playlists.newCoverImageSource.split('.')[state.playlists.newCoverImageSource.split('.').length]};base64,${buff.toString('base64')}`
  } catch(err) {
    playlistInfo.image = defaultPlaylistIcon
  }
  playlistInfo.songs = []
  fs.writeFile(path.join(state.settings.installationDirectory, 'Playlists', `${playlistInfo.playlistTitle.replace(/[\\/:*?"<>|. ]/g, '')}${Date.now()}.bplist`), JSON.stringify(playlistInfo), 'UTF8', () => {
    fetchLocalPlaylists(false)(dispatch, getState)
  })
}

export const deletePlaylist = playlistFile => dispatch => {
  fs.unlink(playlistFile, (err) => {
    if(err) {
      dispatch({
        type: DISPLAY_WARNING,
        payload: {
          text: 'Cannot delete playlist file! Try restarting BeatDrop and try again.'
        }
      })
      return
    }
  })
}

export const setNewPlaylistDialogOpen = open => dispatch => {
  dispatch({
    type: SET_NEW_PLAYLIST_OPEN,
    payload: open
  })
}

export const setPlaylistPickerOpen = open => dispatch => {
  dispatch({
    type: SET_PLAYLIST_PICKER_OPEN,
    payload: open
  })
}

export const clearPlaylistDialog = () => dispatch => {
  try {
    document.getElementById('new-playlist-title').value = ''
    document.getElementById('new-playlist-author').value = ''
    document.getElementById('new-playlist-description').value = ''
  } catch(_){}
  dispatch({
    type: CLEAR_PLAYLIST_DIALOG
  })
}

export const loadPlaylistDetails = playlistFile => (dispatch, getState) => {
  setView(PLAYLIST_DETAILS)(dispatch, getState)
  fs.access(playlistFile, (err) => {
    if(err) {
      dispatch({
        type: DISPLAY_WARNING,
        payload: {
          color: 'gold',
          text: 'Cannot access playlist file! Try redownloading the playlist or restarting BeatDrop and try again.'
        }
      })
      return
    }
    fs.readFile(playlistFile, 'UTF8', (err, data) => {
      if(err) {
        dispatch({
          type: DISPLAY_WARNING,
          payload: {
            color: 'gold',
            text: 'Error reading playlist file! The playlist may be corrupt or use encoding other than UTF-8 (Why UTF-8? The IETF says so! https://tools.ietf.org/html/rfc8259#section-8.1). Try redownloading the playlist and try again.'
          }
        })
        return
      }
      let playlist = JSON.parse(data)
      dispatch({
        type: CLEAR_PLAYLIST_DETAILS
      })
      dispatch({
        type: LOAD_PLAYLIST_DETAILS,
        payload: { ...playlist, songs: [], playlistFile }
      })
      let state = getState()
      for(let i = 0; i < playlist.songs.length; i++) {
        if(playlist.songs[i].hash) {
          if(state.songs.downloadedSongs.some(song => song.hash === playlist.songs[i].hash)) {
            let file = state.songs.downloadedSongs[state.songs.downloadedSongs.findIndex(song => song.hash === playlist.songs[i].hash)].file
            fs.readFile(file, 'UTF8', (err, data) => {
              if(err) {
                dispatch({
                  type: LOAD_PLAYLIST_SONGS,
                  payload: { ...playlist.songs[i], order: i }
                })
                return
              }
              let song = JSON.parse(data)
              song.coverURL = `file://${path.join(path.dirname(file), song.coverImagePath || song._coverImageFilename)}`
              hashAndWriteToMetadata(file)(dispatch, getState)
                .then(hash => {
                  song.hash = hash
                  dispatch({
                    type: LOAD_PLAYLIST_SONGS,
                    payload: { ...song, file, order: i }
                  })
                })
            })
          } else {
            fetch(makeUrl(BEATSAVER_BASE_URL, `/api/maps/by-hash/${playlist.songs[i].hash}`))
            .then(res => res.json())
            .then(song => {
              song.coverURL = `https://beatsaver.com/${song.coverURL}`
              dispatch({
                type: LOAD_PLAYLIST_SONGS,
                payload: { ...song, order: i }
              })
            })
            .catch(err => {
              dispatch({
                type: LOAD_PLAYLIST_SONGS,
                payload: { ...playlist.songs[i], order: i }
              })
            })
          }
        } else {
          fetch(makeUrl(BEATSAVER_BASE_URL, `/api/maps/detail/${playlist.songs[i].key}`))
            .then(res => res.json())
            .then(details => {
              details.coverURL = `${BEATSAVER_BASE_URL}/${details.coverURL}`
              if(state.songs.downloadedSongs.some(song => song.hash === details.hash)) {
                let file = state.songs.downloadedSongs[state.songs.downloadedSongs.findIndex(song => song.hash === details.hash)].file
                fs.readFile(file, 'UTF8', (err, data) => {
                  if(err) {
                    dispatch({
                      type: LOAD_PLAYLIST_SONGS,
                      payload: { ...playlist.songs[i], order: i }
                    })
                    return
                  }
                  let song = JSON.parse(data)
                  song.coverURL = `file://${path.join(path.dirname(file), song.coverImagePath || song._coverImageFilename)}`
                  hashAndWriteToMetadata(file)(dispatch, getState)
                    .then(hash => {
                      song.hash = hash
                      dispatch({
                        type: LOAD_PLAYLIST_SONGS,
                        payload: { ...song, file, order: i }
                      })
                    })
                })
              } else {
                dispatch({
                  type: LOAD_PLAYLIST_SONGS,
                  payload: { ...details, order: i }
                })
              }
            })
            .catch(_ => {
              dispatch({
                type: LOAD_PLAYLIST_SONGS,
                payload: { ...playlist.songs[i], order: i }
              })
            })
        }
      }
    })
  })
}

export const savePlaylistDetails = details => (dispatch, getState) => {
  let file = details.playlistFile
  delete details.playlistFile
  let newSongs = []
  for(let i = 0; i < details.newOrder.length; i++) {
    let identifier = details.newOrder[i].split('.')[0]
    if(details.songs.findIndex((v) => v.hash === identifier) >= 0) {
      newSongs.push({ hash: details.songs[details.songs.findIndex((v) => v.hash === identifier)].hash, songName: details.songs[details.songs.findIndex((v) => v.hash === identifier)].songName })
    } else {
      newSongs.push({ key: details.songs[details.songs.findIndex((v) => v.key === identifier)].key, songName: details.songs[details.songs.findIndex((v) => v.key === identifier)].songName })
    }
  }
  details.songs = newSongs
  delete details.newOrder
  try {
    let state = getState()
    let buff = fs.readFileSync(state.playlists.newCoverImageSource)
    details.image = `data:image/${state.playlists.newCoverImageSource.split('.')[state.playlists.newCoverImageSource.split('.').length]};base64,${buff.toString('base64')}`
  } catch(_){}
  fs.writeFile(file, JSON.stringify(details), 'UTF8', (err) => {
    if(err)  {
      dispatch({
        type: DISPLAY_WARNING,
        payload: {
          color: 'gold',
          text: 'Error saving playlist file! The playlist may be corrupt or use encoding other than UTF8 (Why UTF-8? The IETF says so! https://tools.ietf.org/html/rfc8259#section-8.1). Try redownloading the playlist and try again.'
        }
      })
      return
    }
    delete details.songs
    dispatch({
      type: LOAD_PLAYLIST_DETAILS,
      payload: details
    })
    fetchLocalPlaylists(false)(dispatch, getState)
  })
}

export const setPlaylistEditing = isEditing => dispatch => {
  dispatch({
    type: SET_PLAYLIST_EDITING,
    payload: isEditing
  })
}

export const addSongToPlaylist = (song, playlistFile) => (dispatch, getState) => {
  fs.readFile(playlistFile, 'UTF8', (err, data) => {
    if(err) {
      dispatch({
        type: DISPLAY_WARNING,
        payload: {
          color: 'gold',
          text: 'Error reading playlist file! The playlist may be corrupt or use encoding other than UTF-8 (Why UTF-8? The IETF says so! https://tools.ietf.org/html/rfc8259#section-8.1). Try redownloading the playlist and try again.'
        }
      })
      return
    }
    let playlist = JSON.parse(data)
    if(song.hash) {
      playlist.songs.push({
        hash: song.hash,
        songName: song.name || song._songName
      })
    } else {
      hashAndWriteToMetadata(song.file)(dispatch, getState)
        .then(hash => {
          playlist.songs.push({
            hash,
            songName: song.name || song._songName
          })
        })
    }

    fs.writeFile(playlistFile, JSON.stringify(playlist), 'UTF8', (err) => {
      if(err)  {
        dispatch({
          type: DISPLAY_WARNING,
          payload: {
            color: 'gold',
            text: 'Error saving playlist file! The playlist may be corrupt or use encoding other than UTF-8 (Why UTF-8? The IETF says so! https://tools.ietf.org/html/rfc8259#section-8.1). Try redownloading the playlist and try again.'
          }
        })
        return
      }
      fetchLocalPlaylists(false)(dispatch, getState)
    })
  })
}