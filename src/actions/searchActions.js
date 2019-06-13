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

export const submitSearch = keywords => dispatch => {
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
  let localSongCount = 0
  let walkerEnded = false
  let decrementCounter = () => {
    localSongCount--
    if (walkerEnded && localSongCount === 0) {
      localSongs = localSongs.filter((song, i) => {
        for (let k = 0; k < keywords.split(' ').length; k++) {
          if(song.songName.toLowerCase().includes(keywords.split(' ')[k].toLowerCase()) || song.songSubName.toLowerCase().includes(keywords.split(' ')[k].toLowerCase()) || song.authorName.toLowerCase().includes(keywords.split(' ')[k].toLowerCase())) return true
        }
        return false
      })
      if(beatSaverResultsReady && beatSaverIdResultsReady) {
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
      localResultsReady = true
    }
  }
  fs.access(path.join(state.settings.installationDirectory, 'CustomSongs'), err => {
    if (err) alert('Could not find CustomSongs directory. Please make sure you have your installation directory set correctly and have the proper plugins installed.')
    Walker(path.join(store.getState().settings.installationDirectory, 'CustomSongs'))
      .on('file', file => {
        if (file.substr(file.length - 9) === 'info.json') {
          localSongCount++
          fs.readFile(file, 'UTF-8', (err, data) => {
            if(err) { decrementCounter(); return }
            let song
            try {
              song = JSON.parse(data)
            } catch(err) {
              decrementCounter()
              return
            }
            song.coverUrl = path.join(path.dirname(file), song.coverImagePath)
            song.file = file
            localSongs.push(song)
            decrementCounter()
          })
        }
      })
      .on('end', () => {
        if (localSongCount === 0) {
          localSongs = localSongs.filter((song, i) => {
            for (let k = 0; k < keywords.split(' ').length; k++) {
              if(song.songName.toLowerCase().includes(keywords.split(' ')[k].toLowerCase()) || song.songSubName.toLowerCase().includes(keywords.split(' ')[k].toLowerCase()) || song.authorName.toLowerCase().includes(keywords.split(' ')[k].toLowerCase())) return true
            }
            return false
          })
          if(beatSaverResultsReady && beatSaverIdResultsReady) {
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
          localResultsReady = true
        }
        walkerEnded = true
      })
  })

  //BeatSaver Search
  fetch('https://beatsaver.com/api/search/text/all?q=' + encodeURIComponent(keywords.replace('/', '\\')))
    .then(res => res.json())
    .then(data => {
      console.log(data)
      beatSaverSongs = data.songs
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