import { FETCH_NEW, FETCH_TOP_DOWNLOADS, FETCH_TOP_FINISHED, FETCH_LOCAL_SONGS, SET_SCROLLTOP, SET_LOADING, SET_LOADING_MORE, LOAD_MORE, SET_SOURCE, SET_RESOURCE, SET_VIEW, REFRESH, DISPLAY_WARNING, SET_SELECTING, SELECT_ITEM,  DESELECT_ITEM, SELECT_ALL, DESELECT_ALL } from './types'
import { SONG_LIST } from '../views'

const { remote } = window.require('electron')
const Walker = remote.require('walker')
const fs = remote.require('fs')
const path = remote.require('path')

const resourceUrl = {
  beastsaber: {

  },
  beatsaver: {
    new: 'https://beatsaver.com/api/songs/new',
    topDownloads: 'https://beatsaver.com/api/songs/top',
    topFinished: 'https://beatsaver.com/api/songs/plays'
  },
  local: {

  }
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
    type: SET_SOURCE,
    payload: 'beatsaver'
  })
  dispatch({
    type: SET_RESOURCE,
    payload: 'new'
  })
  fetch('https://beatsaver.com/api/songs/new')
    .then(res => res.json())
    .then(data =>  {
      dispatch({
        type: FETCH_NEW,
        payload:  data
      })
      dispatch({
        type: SET_LOADING,
        payload: false
      })
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
    type: SET_SOURCE,
    payload: 'beatsaver'
  })
  dispatch({
    type: SET_RESOURCE,
    payload: 'topDownloads'
  })
  fetch('https://beatsaver.com/api/songs/top')
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
      for(let i=0; i<data.songs.length; i++) {
        fetch('https://bsaber.com/wp-json/wp/v2/posts?filter[meta_key]=SongID&filter[meta_value]=' + data.songs[i].key.split('-')[0])
        .then(res => res.json())
        .then(bsaberData => {
          if(bsaberData.length > 0) {
            console.log(bsaberData[0].post_ratings_average)
          }
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
    type: SET_SOURCE,
    payload: 'beatsaver'
  })
  dispatch({
    type: SET_RESOURCE,
    payload: 'topFinished'
  })
  fetch('https://beatsaver.com/api/songs/plays')
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
    type: SET_SOURCE,
    payload: 'local'
  })
  dispatch({
    type: SET_RESOURCE,
    payload: 'songs'
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
      alert('Could not find CustomSongs directory. Please make sure you have your installation directory set correctly and have the proper plugins installed.')
      return
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
        if(file.substr(file.length-9) === 'info.json') {
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
  fetch(resourceUrl[state.source.source][state.source.resource] + '/' + state.songs.songs.length)
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: LOAD_MORE,
        payload: data
      })
      dispatch({
        type: SET_LOADING_MORE,
        payload: false
      })
    })
}

export const refresh = () => (dispatch, getState) => {
  switch(getState().source.source + getState().source.resource) {
    case 'localsongs':
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

export const setScrollTop = scrollTop => dispatch => {
  dispatch({
    type: SET_SCROLLTOP,
    payload: scrollTop
  })
}

export const setSelecting = selecting => dispatch => {
  dispatch({
    type: SET_SELECTING,
    payload: selecting
  })
}

export const selectItem = item => dispatch => {
  dispatch({
    type: SELECT_ITEM,
    payload: item
  })
}

export const deselectItem = item => dispatch => {
  dispatch({
    type: DESELECT_ITEM,
    payload: item
  })
}

export const selectAll = () => dispatch => {
  dispatch({
    type: SELECT_ALL
  })
}

export const deselectAll = () => dispatch => {
  dispatch({
    type: DESELECT_ALL
  })
}