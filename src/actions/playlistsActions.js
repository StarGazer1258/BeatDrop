import { FETCH_LOCAL_PLAYLISTS, LOAD_NEW_PLAYLIST_IMAGE, SET_NEW_PLAYLIST_OPEN, SET_PLAYLIST_PICKER_OPEN, CLEAR_PLAYLIST_DIALOG, LOAD_PLAYLIST_DETAILS, LOAD_PLAYLIST_SONGS, CLEAR_PLAYLIST_DETAILS, SET_PLAYLIST_EDITING, SET_VIEW, SET_LOADING, DISPLAY_WARNING } from './types'
import { PLAYLIST_LIST, PLAYLIST_DETAILS } from '../views'
import { store } from '../store'
import { defaultPlaylistIcon } from '../b64Assets'

const { remote } = window.require('electron')
const fs = remote.require('fs')
const path = remote.require('path')

export const fetchLocalPlaylists = (doSetView) => dispatch => {
  let state = store.getState()
  console.log(typeof doSetView)
  if(typeof doSetView === 'object' || doSetView === undefined) { doSetView = true } else { doSetView = false }
  if(doSetView === true) {
    dispatch({
      type: SET_VIEW,
      payload: PLAYLIST_LIST
    })
    dispatch({
      type: SET_LOADING,
      payload: true
    })
  }
  let playlists = []
  fs.access(path.join(state.settings.installationDirectory, 'Playlists'), (err) => {
    if(err) { 
      alert('Could not find Playlists directory. Please make sure you have your installation directory set correctly and have the proper plugins installed.')
      return
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
        if(files[f].split('.')[files[f].split('.').length-1] === 'json' || files[f].split('.')[files[f].split('.').length-1] === 'bplist') playlistsFound++
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
          let playlist = JSON.parse(data)
          playlist.file = path.join(state.settings.installationDirectory, 'Playlists', files[f])
          pushPlaylist(playlist)
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

export const createNewPlaylist = playlistInfo => dispatch => {
  let state = store.getState()
  try {
    let buff = fs.readFileSync(state.playlists.newCoverImageSource)
    playlistInfo.image = `data:image/${state.playlists.newCoverImageSource.split('.')[state.playlists.newCoverImageSource.split('.').length]};base64,${buff.toString('base64')}`
  } catch(err) {
    playlistInfo.image = defaultPlaylistIcon
  }
  playlistInfo.songs = []
  fs.writeFile(path.join(state.settings.installationDirectory, 'Playlists', `${playlistInfo.playlistTitle.replace(/[\\/:*?"<>|. ]/g, '')}${Date.now()}.bplist`), JSON.stringify(playlistInfo), 'UTF8', () => {
    fetchLocalPlaylists(false)(dispatch)
  })
}

export const deletePlaylist = playlistFile => dispatch => {
  fs.unlink(playlistFile, (err) => {
    if(err) {
      dispatch({
        type: DISPLAY_WARNING,
        payload: {
          color: 'gold',
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
  document.getElementById('new-playlist-title').value = ''
  document.getElementById('new-playlist-author').value = ''
  document.getElementById('new-playlist-description').value = ''
  dispatch({
    type: CLEAR_PLAYLIST_DIALOG
  })
}

export const loadPlaylistDetails = playlistFile => dispatch => {
  dispatch({
    type: SET_VIEW,
    payload: PLAYLIST_DETAILS
  })
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
            text: 'Error reading playlist file! The playlist may be corrupt or use encoding other than UTF8. Try redownloading the playlist and try again.'
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
        payload: {...playlist, songs: [], playlistFile}
      })
      let state = store.getState()
      for(let i = 0; i < playlist.songs.length; i++) {
        if(state.songs.downloadedSongs.songKeys.includes(playlist.songs[i].key)) {
          let file = state.songs.downloadedSongs.songFiles[state.songs.downloadedSongs.songKeys.indexOf(playlist.songs[i].key)]
          fs.readFile(file, 'UTF8', (err, data) => {
            if(err) {
              dispatch({
                type: LOAD_PLAYLIST_SONGS,
                payload: { ...playlist.songs[i], order: i }
              })
              return
            }
            let song = JSON.parse(data)
            let dirs = file.split('\\')
            dirs.pop()
            let dir = dirs.join('\\')
            song.coverUrl = path.join(dir, song.coverImagePath)
            dispatch({
              type: LOAD_PLAYLIST_SONGS,
              payload: { ...song, file, order: i }
            })
          })
        } else {
          fetch('https://beatsaver.com/api/songs/detail/' + playlist.songs[i].key)
            .then(res => res.json())
            .then(details => {
              console.log(details)
              dispatch({
                type: LOAD_PLAYLIST_SONGS,
                payload: { ...details.song, order: i }
              })
            })
            .catch(err => {
              dispatch({
                type: LOAD_PLAYLIST_SONGS,
                payload: { ...playlist.songs[i], order: i }
              })
              console.error(playlist.songs[i])
            })
        }
      }
    })
  })
}

export const savePlaylistDetails = details => dispatch => {
  let file = details.playlistFile
  delete details.playlistFile
  let newSongs = []
  function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
      if(array[i][attr] === value) {
          return i;
      }
    }
    return -1;
  }
  for(let i = 0; i < details.newOrder.length; i++) {
    newSongs.push({key: details.songs[findWithAttr(details.songs, 'key', details.newOrder[i])].key, songName: details.songs[findWithAttr(details.songs, 'key', details.newOrder[i])].songName})
  }
  details.songs = newSongs
  delete details.newOrder
  fs.writeFile(file, JSON.stringify(details), 'UTF8', (err) => {
    if(err)  {
      dispatch({
        type: DISPLAY_WARNING,
        payload: {
          color: 'gold',
          text: 'Error saving playlist file! The playlist may be corrupt or use encoding other than UTF8. Try redownloading the playlist and try again.'
        }
      })
      return
    }
    delete details.songs
    dispatch({
      type: LOAD_PLAYLIST_DETAILS,
      payload: details
    })
    fetchLocalPlaylists(false)(dispatch)
  })
}

export const setPlaylistEditing = isEditing => dispatch => {
  dispatch({
    type: SET_PLAYLIST_EDITING,
    payload: isEditing
  })
}

export const addSongToPlaylist = (song, playlistFile) => dispatch => {
  fs.readFile(playlistFile, 'UTF8', (err, data) => {
    if(err) {
      dispatch({
        type: DISPLAY_WARNING,
        payload: {
          color: 'gold',
          text: 'Error reading playlist file! The playlist may be corrupt or use encoding other than UTF8. Try redownloading the playlist and try again.'
        }
      })
      return
    }
    let playlist = JSON.parse(data)
    playlist.songs.push({
      key: song.key,
      songName: song.name || song.songName
    })
    fs.writeFile(playlistFile, JSON.stringify(playlist), 'UTF8', (err) => {
      if(err)  {
        dispatch({
          type: DISPLAY_WARNING,
          payload: {
            color: 'gold',
            text: 'Error saving playlist file! The playlist may be corrupt or use encoding other than UTF8. Try redownloading the playlist and try again.'
          }
        })
        return
      }
      fetchLocalPlaylists(false)(dispatch)
    })
  })
}