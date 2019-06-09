import { FETCH_LOCAL_PLAYLISTS, LOAD_NEW_PLAYLIST_IMAGE, SET_NEW_PLAYLIST_OPEN, SET_PLAYLIST_PICKER_OPEN, CLEAR_PLAYLIST_DIALOG, LOAD_PLAYLIST_DETAILS, LOAD_PLAYLIST_SONGS, CLEAR_PLAYLIST_DETAILS, SET_PLAYLIST_EDITING, SET_VIEW, SET_LOADING, DISPLAY_WARNING } from './types'
import { PLAYLIST_LIST, PLAYLIST_DETAILS } from '../views'
import { defaultPlaylistIcon } from '../b64Assets'

const { remote } = window.require('electron')
const fs = remote.require('fs')
const path = remote.require('path')
const md5 = remote.require('md5')

export const fetchLocalPlaylists = (doSetView) => (dispatch, getState) => {
  let state = getState()
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
            text: 'No playlists found!',
            timeout: 2500
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
          text: 'Cannot delete playlist file! Try restarting BeatDrop and try again.',
          timeout: 2500
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
          text: 'Cannot access playlist file! Try redownloading the playlist or restarting BeatDrop and try again.',
          timeout: 3000
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
            fetch(`https://beatsaver.com/api/songs/search/hash/${playlist.songs[i].hash}`)
            .then(res => res.json())
            .then(results => {
              if(results.songs.length === 1) {
                dispatch({
                  type: LOAD_PLAYLIST_SONGS,
                  payload: { ...results.songs[0], order: i }
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
        } else {
          fetch(`https://beatsaver.com/api/songs/detail/${playlist.songs[i].key}`)
            .then(res => res.json())
            .then(details => {
              if(state.songs.downloadedSongs.some(song => song.hash === details.song.hashMd5)) {
                let file = state.songs.downloadedSongs[state.songs.downloadedSongs.findIndex(song => song.hash === details.song.hashMd5)].file
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
                dispatch({
                  type: LOAD_PLAYLIST_SONGS,
                  payload: { ...details.song, order: i }
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
    if(song.hash || song.hashMd5) {
      if(song.key) {
        playlist.songs.push({
          hash: song.hash || song.hashMd5,
          key: song.key,
          songName: song.name || song.songName
        })
      } else {
        playlist.songs.push({
          hash: song.hash || song.hashMd5,
          songName: song.name || song.songName
        })
      }
    } else {
      if(song.file) {
        let file = song.file
        delete song.file
        let dirs = file.split('\\')
        dirs.pop()
        let dir = dirs.join('\\')
        let to_hash = ''
        for(let i = 0; i < song.difficultyLevels.length; i++) {
          try {
            to_hash += fs.readFileSync(path.join(dir, song.difficultyLevels[i].jsonPath), 'UTF8')
          } catch(err) {
            dispatch({
              type: DISPLAY_WARNING,
              action: { text: 'Error reading difficulty level information, the song\'s files may be corrupt. Try redownloading the song and try again.', timeout: 4000 }
            })
            return
          }
        }
        let hash = md5(to_hash)
        song.hash = hash
        fs.writeFile(file, JSON.stringify(song), 'UTF8', (err) => { if(err) return })
        if(song.key) {
          playlist.songs.push({
            hash: hash,
            key: song.key,
            songName: song.name || song.songName
          })
        } else {
          playlist.songs.push({
            hash: hash,
            songName: song.name || song.songName
          })
        }
      }
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