import { SET_DETAILS_OPEN, LOAD_DETAILS, CLEAR_DETAILS, SET_DETAILS_LOADING, SET_VIEW, DISPLAY_WARNING } from './types'
import { SONG_DETAILS } from '../views'

import AdmZip from 'adm-zip'
const { remote } = window.require('electron')
const fs = remote.require('fs')
const path = remote.require('path')

export const setDetailsOpen = (isOpen) => dispatch => {
  dispatch({
    type: SET_DETAILS_OPEN,
    payload: isOpen
  })
}

export const loadDetails = (key) => dispatch => {
  dispatch({
    type: CLEAR_DETAILS
  })
  dispatch({
    type: LOAD_DETAILS,
    payload: { key }
  })
  dispatch({
    type: SET_DETAILS_LOADING,
    payload: true
  })
  if(parseInt(key.replace('-', ''))) {
    fetch('https://beatsaver.com/api/songs/detail/' + key)
      .then(res => res.json())
      .then((details) => {
        fetch(details.song.downloadUrl)
          .then(res => res.arrayBuffer())
          .then(data => {
            let zip = new AdmZip(new Buffer(data))
            let entries = zip.getEntries()
            for(let i = 0; i < entries.length; i++) {
              if(entries[i].name.split('.')[1] === 'ogg' || entries[i].name.split('.')[1] === 'wav' || entries[i].name.split('.')[1] === 'mp3') {
                dispatch({
                  type: LOAD_DETAILS,
                  payload: { audioSource: URL.createObjectURL(new Blob([entries[i].getData()])) }
                })
              }
            }
          })
      })
    fetch('https://beatsaver.com/api/songs/detail/' + key)
      .then(res => {
        if(res.status === 404){
          dispatch({
            type: DISPLAY_WARNING,
            payload: {
              timeout: 5000,
              color: 'gold',
              text: '404: Song details not found!'
            }
          })
        }
        return res
      })
      .then(res => res.json())
      .then(details => {
        dispatch({
          type: LOAD_DETAILS,
          payload: details
        })
        dispatch({
          type: SET_DETAILS_LOADING,
          payload: false
        })
      })
    dispatch({
      type: SET_VIEW,
      payload: SONG_DETAILS
    })
  } else {
    fs.readFile(key, 'UTF-8', (err, data) => {
      if(err) return
      let song = JSON.parse(data)
      let dirs = key.split('\\')
      dirs.pop()
      let dir = dirs.join('\\')
      song.coverUrl = path.join(dir, song.coverImagePath)
      song.file = path.join(dir, 'info.json')
      dispatch({
        type: LOAD_DETAILS,
        payload: { audioSource: path.join(dir, song.difficultyLevels[0].audioPath) }
      })
      dispatch({
        type: LOAD_DETAILS,
        payload: {song: song}
      })
      dispatch({
        type: SET_DETAILS_LOADING,
        payload: false
      })
    })
    dispatch({
      type: SET_VIEW,
      payload: SONG_DETAILS
    })
  }
  /*
  fetch('https://bsaber.com/wp-json/wp/v2/posts?filter[meta_key]=SongID&filter[meta_value]=' + key.split('-')[0])
  .then(res => res.json())
  .then(bsaberData => {
    if(bsaberData.length > 0) {
      console.log(bsaberData[0].post_ratings_average)
      dispatch({
        type: LOAD_DETAILS,
        payload: { bsaberData: bsaberData[0]}
      })
    }
  })
  */
}