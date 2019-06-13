import { FETCH_NEW, FETCH_TOP_DOWNLOADS, FETCH_TOP_FINISHED, FETCH_LOCAL_SONGS, ADD_BSABER_RATING, SET_SCROLLTOP, SET_LOADING, SET_LOADING_MORE, LOAD_MORE, SET_RESOURCE, SET_VIEW, DISPLAY_WARNING } from './types'
import { SONG_LIST } from '../views'
import { BEATSAVER, LIBRARY } from '../constants/resources'
import {installEssentialMods, isModInstalled} from './modActions'

const { remote } = window.require('electron')
const Walker = remote.require('walker')
const fs = remote.require('fs')
const path = remote.require('path')

const resourceUrl = {
    'BEATSAVER_NEW_SONGS': 'https://beatsaver.com/api/maps/latest',
    'BEATSAVER_TOP_DOWNLOADED_SONGS': 'https://beatsaver.com/api/maps/downloads',
    'BEATSAVER_TOP_FINISHED_SONGS': 'https://beatsaver.com/api/maps/plays'
}

export const fetchNew = () => dispatch => {
  dispatch({
    type: SET_VIEW,
    payload: SONG_LIST
  })
  dispatch({
    type: SET_LOADING,
    payload: true
  })
  dispatch({
    type: SET_SCROLLTOP,
    payload: 0
  })
  dispatch({
    type: SET_RESOURCE,
    payload: BEATSAVER.NEW_SONGS
  })
  fetch('https://beatsaver.com/api/maps/latest')
    .then(res => res.json())
    .then(data =>  {
      console.log(data)
      dispatch({
        type: FETCH_NEW,
        payload:  data
      })
      dispatch({
        type: SET_LOADING,
        payload: false
      })
      console.log(data);
      for(let i = 0; i < data.docs.length; i++) {
        fetch(`https://bsaber.com/wp-json/bsaber-api/songs/${data.docs[i].key}/ratings`)
        .then(res => res.json())
        .then(bsaberData => {
          dispatch({
            type: ADD_BSABER_RATING,
            payload: { i, bsaberData }
          })
        })
        .catch((err) => {
          dispatch({
            type: ADD_BSABER_RATING,
            payload: { i, bsaberData: { overall_rating: 'Error' } }
          })
        })
      }
    })
}

export const fetchTopDownloads = () => dispatch => {
  dispatch({
    type: SET_VIEW,
    payload: SONG_LIST
  })
  dispatch({
    type: SET_SCROLLTOP,
    payload: 0
  })
  dispatch({
    type: SET_LOADING,
    payload: true
  })
  dispatch({
    type: SET_RESOURCE,
    payload: BEATSAVER.TOP_DOWNLOADED_SONGS
  })
  fetch('https://beatsaver.com/api/maps/downloads')
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: FETCH_TOP_DOWNLOADS,
        payload: data
      })
      dispatch({
        type: SET_LOADING,
        payload: false
      })
      for(let i = 0; i < data.songs.length; i++) {
        fetch(`https://bsaber.com/wp-json/bsaber-api/songs/${data.docs[i].key}/ratings`)
        .then(res => res.json())
        .then(bsaberData => {
          dispatch({
            type: ADD_BSABER_RATING,
            payload: { i, bsaberData }
          })
        })
        .catch((err) => {
          dispatch({
            type: ADD_BSABER_RATING,
            payload: { i, bsaberData: { overall_rating: 'Error' } }
          })
        })
      }
    })
}

export const fetchTopFinished = () => dispatch => {
  dispatch({
    type: SET_VIEW,
    payload: SONG_LIST
  })
  dispatch({
    type: SET_SCROLLTOP,
    payload: 0
  })
  dispatch({
    type: SET_LOADING,
    payload: true
  })
  dispatch({
    type: SET_RESOURCE,
    payload: BEATSAVER.TOP_FINISHED_SONGS
  })
  fetch('https://beatsaver.com/api/maps/plays')
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: FETCH_TOP_FINISHED,
        payload: data
      })
      dispatch({
        type: SET_LOADING,
        payload: false
      })
      for(let i = 0; i < data.docs.length; i++) {
        fetch(`https://bsaber.com/wp-json/bsaber-api/songs/${data.docs[i].key}/ratings`)
        .then(res => res.json())
        .then(bsaberData => {
          dispatch({
            type: ADD_BSABER_RATING,
            payload: { i, bsaberData }
          })
        })
        .catch((err) => {
          dispatch({
            type: ADD_BSABER_RATING,
            payload: { i, bsaberData: { overall_rating: 'Error' } }
          })
        })
      }
    })
}

export const fetchLocalSongs = () => (dispatch, getState) => {
  dispatch({
    type: SET_VIEW,
    payload: SONG_LIST
  })
  dispatch({
    type: SET_SCROLLTOP,
    payload: 0
  })
  let state = getState()
  dispatch({
    type: SET_LOADING,
    payload: true
  })
  dispatch({
    type: SET_RESOURCE,
    payload: LIBRARY.SONGS
  })
  let songs = []
  let count = 0
  let ended = false
  let decrementCounter = () => {
    count--
    if(ended && count === 0) {
      dispatch({
        type: FETCH_LOCAL_SONGS,
        payload: songs
      })
      dispatch({
        type: SET_LOADING,
        payload: false
      })
      return
    }
  }
  fs.access(path.join(state.settings.installationDirectory, 'CustomSongs'), (err) => {
    if(err) {
      installEssentialMods()(dispatch, getState)
      fs.mkdirSync(path.join(state.settings.installationDirectory, 'CustomSongs'))
    }
    fs.readdir(path.join(state.settings.installationDirectory, 'CustomSongs'), (err, files) => {
      if (err) return
      if (!files.length) {
        dispatch({
          type: FETCH_LOCAL_SONGS,
          payload: []
        })
        dispatch({
          type: SET_LOADING,
          payload: false
        })
        dispatch({
          type: DISPLAY_WARNING,
          payload: {
            timeout: 5000,
            color: 'gold',
            text: 'No songs found!'
          }
        })
      }
    })
    Walker(path.join(getState().settings.installationDirectory, 'CustomSongs'))
      .on('file', (file) => {
        let dirs = file.split('\\')
        dirs.pop()
        let dir = dirs.join('\\')
        if(file.substr(file.length - 9) === 'info.json') {
          if(!isModInstalled('SongCore')(dispatch, getState)) installEssentialMods()(dispatch, getState)
          count++
          fs.readFile(file, 'UTF-8', (err, data) => {
            if(err) { decrementCounter(); return }
            let song
            try {
              song = JSON.parse(data)
            } catch(err) {
              decrementCounter()
              return
            }
            song.coverUrl = path.join(dir, song.coverImagePath)
            song.file = path.join(dir, 'info.json')
            songs.push(song)
            decrementCounter()
          })
        }
      })
      .on('end', () => {
        if(count === 0) {
          dispatch({
            type: FETCH_LOCAL_SONGS,
            payload: songs
          })
          dispatch({
            type: SET_LOADING,
            payload: false
          })
          return
        }
        ended = true
      })
  })
}

export const loadMore = () => (dispatch, getState) => {
  dispatch({
    type: SET_LOADING_MORE,
    payload: true
  })
  let state = getState()
  fetch(resourceUrl[state.resource] + '/' + state.songs.songs.length)
    .then(res => {
      return res.json()
    })
    .then(data => {
      dispatch({
        type: LOAD_MORE,
        payload: data
      })
      dispatch({
        type: SET_LOADING_MORE,
        payload: false
      })
      console.log(data)
      for(let i = state.songs.songs.length; i < state.songs.songs.length + data.docs.length; i++) {
        fetch(`https://bsaber.com/wp-json/bsaber-api/songs/${data.docs[i - state.songs.songs.length].key}/ratings`)
        .then(res => res.json())
        .then(bsaberData => {
          dispatch({
            type: ADD_BSABER_RATING,
            payload: { i, bsaberData }
          })
        })
        .catch((err) => {
          dispatch({
            type: ADD_BSABER_RATING,
            payload: { i, bsaberData: { overall_rating: 'Error' } }
          })
        })
      }
    })
    .catch((err) => {
      dispatch({
        type: DISPLAY_WARNING,
        payload: {
          text: 'There was error loading more songs. Check your connection to the internet and try again.'
        }
      })
    })
}

/*
export const refresh = () => (dispatch, getState) => {
  switch(getState().resource) {
    case LIBRARY.SONGS:
      fetchLocalSongs()
      return
    default:
      dispatch({
        type: SET_LOADING,
        payload: true
      })
      let state = getState()
      fetch(resourceUrl[state.source.source][state.source.resource] + '/0')
        .then(res => res.json())
        .then(data => {
          dispatch({
            type: REFRESH,
            payload: data
          })
          dispatch({
            type: SET_LOADING,
            payload: false
          })
        })
  }
}
*/

export const setScrollTop = scrollTop => dispatch => {
  dispatch({
    type: SET_SCROLLTOP,
    payload: scrollTop
  })
}