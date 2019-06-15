import { SET_SEARCH_SOURCES, SUBMIT_SEARCH, SET_LOADING } from './types'
import { store } from '../store'

const { remote } = window.require('electron')
const Walker = remote.require('walker')
const fs = remote.require('fs')
const path = remote.require('path')

export const setSearchSources = sources => dispatch => {
  dispatch({
    type: SET_SEARCH_SOURCES,
    payload: sources
  })
}

export const submitSearch = keywords => (dispatch, getState) => {
  if(!keywords) return

  let state = store.getState()

  dispatch({
    type: SET_LOADING,
    payload: true
  })

  let beatSaverResultsReady = false
  let beatSaverIdResultsReady = false
  let localResultsReady = false

  let localSongs = []
  let beatSaverSongs = []
  let idSong = {}

  let isId = parseInt(keywords.replace('-', ''), 10)

  //Library Search

  let downloadedSongs = getState().songs.downloadedSongs


  downloadedSongs.map(dSong => {
    let data = fs.readFileSync(dSong.file, 'UTF-8')
    let song = JSON.parse(data)
    for (let k = 0; k < keywords.split(' ').length; k++) {
      if(song._songName.toLowerCase().includes(keywords.split(' ')[k].toLowerCase()) || song._songSubName.toLowerCase().includes(keywords.split(' ')[k].toLowerCase()) || song._songAuthorName.toLowerCase().includes(keywords.split(' ')[k].toLowerCase())) {
        song.coverUrl = `file://${ path.join(path.dirname(dSong.file), song._coverImageFilename) }`
        localSongs.push(song)
        return
      }
    }
  })
  localResultsReady = true

  //BeatSaver Search
  fetch('https://beatsaver.com/api/search/text/all?q=' + encodeURIComponent(keywords.replace('/', '\\')))
    .then(res => res.json())
    .then(data => {
      beatSaverSongs = data.docs
      if(localResultsReady & beatSaverIdResultsReady) {
        dispatch({
          type: SUBMIT_SEARCH,
          payload: isId ? { keywords, library: localSongs, beatSaver: [...beatSaverSongs, idSong] } : { keywords, library: localSongs, beatSaver: beatSaverSongs, beatSaverId: idSong }
        })
        dispatch({
          type: SET_LOADING,
          payload: false
        })
        return
      }
      beatSaverResultsReady = true
    })
  
  //BeatSaver ID Search
  if(isId) {
    fetch('https://beatsaver.com/api/maps/detail/' + keywords)
    .then(res => res.json())
    .then(data => {
      idSong = data.song
      if(localResultsReady & beatSaverResultsReady) {
        dispatch({
          type: SUBMIT_SEARCH,
          payload: { keywords, library: localSongs, beatSaver: [...beatSaverSongs, idSong] }
        })
        dispatch({
          type: SET_LOADING,
          payload: false
        })
        return
      }
      beatSaverIdResultsReady = true
    }).catch((_) => { isId = false; beatSaverIdResultsReady = true })
  } else {
    beatSaverIdResultsReady = true
  }
}