import { FETCH_NEW, FETCH_TOP_DOWNLOADS, FETCH_TOP_FINISHED, FETCH_LOCAL_SONGS, ADD_BSABER_RATING, SET_SCROLLTOP, SET_LOADING, SET_LOADING_MORE, LOAD_MORE, SET_RESOURCE, DISPLAY_WARNING } from './types'
import { SONG_LIST } from '../views'
import { BEATSAVER, LIBRARY } from '../constants/resources'
import { hashAndWriteToMetadata } from './queueActions'
import { setView } from './viewActions'

const { remote } = window.require('electron')
const fs = remote.require('fs')
const path = remote.require('path')

const resourceUrl = {
    'BEATSAVER_NEW_SONGS': 'https://beatsaver.com/api/maps/latest',
    'BEATSAVER_TOP_DOWNLOADED_SONGS': 'https://beatsaver.com/api/maps/downloads',
    'BEATSAVER_TOP_FINISHED_SONGS': 'https://beatsaver.com/api/maps/plays'
}

export const fetchNew = () => dispatch => {
  setView(SONG_LIST)(dispatch)
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
  setView(SONG_LIST)(dispatch)
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
  setView(SONG_LIST)(dispatch)
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
  setView(SONG_LIST)(dispatch)
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
    payload: LIBRARY.SONGS
  })

  let downloadedSongs = getState().songs.downloadedSongs
  let songs = []
  for(let i = 0; i < downloadedSongs.length; i++) {
    fs.readFile(downloadedSongs[i].file, 'UTF-8', (err, data) => {
      if(err) {
        dispatch({
          type: DISPLAY_WARNING,
          payload: {
            text: `Failed to read ${ downloadedSongs[i].file }: ${ err }`
          }
        })
        return
      }
      let song
      try {
        song = JSON.parse(data)
      } catch(err) {
        dispatch({
          type: DISPLAY_WARNING,
          payload: {
            text: `Failed to parse song: ${ err }`
          }
        })
        return
      }
      song.coverUrl = `file://${ path.join(path.dirname(downloadedSongs[i].file), (song.coverImagePath || song._coverImageFilename)) }`
      song.file = downloadedSongs[i].file
      hashAndWriteToMetadata(downloadedSongs[i].file)(dispatch, getState)
        .then(hash => {
          song.hash = hash
          songs.push(song)
          if(i >= downloadedSongs.length - 1) {
            dispatch({
              type: FETCH_LOCAL_SONGS,
              payload: songs
            })
            dispatch({
              type: SET_LOADING,
              payload: false
            })
          }
        })
    })
  }
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