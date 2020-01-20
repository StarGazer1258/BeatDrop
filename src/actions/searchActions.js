import { SET_SEARCH_SOURCES, SUBMIT_SEARCH, SET_LOADING } from './types'
import { BEATSAVER_BASE_URL } from '../constants/urls'
import { makeUrl } from '../utilities'

const { remote } = window.require('electron')
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

  dispatch({
    type: SET_LOADING,
    payload: true
  })

  let beatSaverResultsReady = false
  let beatSaverIdResultsReady = false
  let localResultsReady = false

  let localSongs = []
  let beatSaverSongs = []
  let idSong

  let isId = parseInt(keywords.replace('-', ''), 10)

  // Library Search

  let downloadedSongs = getState().songs.downloadedSongs


  for(let i = 0; i < downloadedSongs.length; i++) {
    let data = fs.readFileSync(downloadedSongs[i].file, 'UTF-8')
    let song = JSON.parse(data)
    for (let k = 0; k < keywords.split(' ').length; k++) {
      if(song._songName.toLowerCase().includes(keywords.split(' ')[k].toLowerCase()) || song._songSubName.toLowerCase().includes(keywords.split(' ')[k].toLowerCase()) || song._songAuthorName.toLowerCase().includes(keywords.split(' ')[k].toLowerCase())) {
        song.coverUrl = `file://${ path.join(path.dirname(downloadedSongs[i].file), song._coverImageFilename) }`
        localSongs.push(song)
        break
      }
    }
  }
  localResultsReady = true

  // BeatSaver Search
  fetch(makeUrl(BEATSAVER_BASE_URL, `/api/search/text/all?q=${encodeURIComponent(keywords.replace('/', '\\'))}`))
    .then(res => res.json())
    .then(data => {
      beatSaverSongs = data.docs
      if(localResultsReady & beatSaverIdResultsReady) {
        dispatch({
          type: SUBMIT_SEARCH,
          payload: idSong ? { keywords, library: localSongs, beatSaver: [idSong, ...beatSaverSongs] } : { keywords, library: localSongs, beatSaver: beatSaverSongs }
        })
        dispatch({
          type: SET_LOADING,
          payload: false
        })
        return
      }
      beatSaverResultsReady = true
    })

  // BeatSaver ID Search
  if(isId) {
    fetch(makeUrl(BEATSAVER_BASE_URL, `/api/maps/detail/${keywords}`))
    .then(res => { if(res.status !== 200) { beatSaverIdResultsReady = true; return } return res.json() })
    .then(data => {
      if(!data) { beatSaverIdResultsReady = true; return }
      idSong = data
      if(localResultsReady & beatSaverResultsReady) {
        dispatch({
          type: SUBMIT_SEARCH,
          payload: idSong ? { keywords, library: localSongs, beatSaver: [idSong, ...beatSaverSongs] } : { keywords, library: localSongs, beatSaver: beatSaverSongs }
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