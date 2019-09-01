import { LOAD_DETAILS, CLEAR_DETAILS, SET_DETAILS_LOADING, DISPLAY_WARNING } from './types'
import { SONG_DETAILS } from '../constants/views'

import AdmZip from 'adm-zip'
import { hashAndWriteToMetadata } from './queueActions'
import { setView } from './viewActions'
const { remote } = window.require('electron')
const fs = remote.require('fs')
const path = remote.require('path')

/**
 * Loads and presents the details page for a song from a file.
 * @param {string} file The path to the song
 */
export const loadDetailsFromFile = file => (dispatch, getState) => {
  dispatch({
    type: CLEAR_DETAILS
  })
  dispatch({
    type: SET_DETAILS_LOADING,
    payload: true
  })
  setView(SONG_DETAILS)(dispatch)
  fs.readFile(file, 'UTF-8', (err, data) => {
    if(err) return
    let details = JSON.parse(data)
    let dir = path.dirname(file)
    details.coverURL = `file://${ path.join(dir, (details.coverImagePath || details._coverImageFilename)) }`
    details.file = path.join(dir, 'info.dat')
    hashAndWriteToMetadata(path.join(dir, 'info.dat'))(dispatch)
      .then(hash => {
        details.hash = hash
        dispatch({
          type: LOAD_DETAILS,
          payload: details
        })
        dispatch({
          type: LOAD_DETAILS,
          payload: { audioSource: `file://${ path.join(dir, details._songFilename) }` }
        })
        dispatch({
          type: SET_DETAILS_LOADING,
          payload: false
        })
      })
  })
}

/**
 * Loads and presents the details page for a song from a key.
 * @param {string} key The key of the song
 */
export const loadDetailsFromKey = key => dispatch => {
  dispatch({
    type: CLEAR_DETAILS
  })
  dispatch({
    type: SET_DETAILS_LOADING,
    payload: true
  })
  setView(SONG_DETAILS)(dispatch)
  if((/^[a-f0-9]+$/).test(key)) {
    fetch(`https://beatsaver.com/api/maps/detail/${key}`)
      .then(res => {
        if(res.status === 404){
          dispatch({
            type: DISPLAY_WARNING,
            payload: {
              text: '404: Song details not found!'
            }
          })
        }
        return res
      })
      .then(res => res.json())
      .then(details => {
        fetch(`http://beatsaver.com${details.downloadURL}`)
          .then(res => res.arrayBuffer())
          .then(data => {
            let zip = new AdmZip(new Buffer(data))
            let entries = zip.getEntries()
            for(let i = 0; i < entries.length; i++) {
              if(entries[i].name.split('.')[1] === 'ogg' || entries[i].name.split('.')[1] === 'wav' || entries[i].name.split('.')[1] === 'mp3' || entries[i].name.split('.')[1] === 'egg') {
                dispatch({
                  type: LOAD_DETAILS,
                  payload: { audioSource: URL.createObjectURL(new Blob([entries[i].getData()])) }
                })
              }
            }
          })
        dispatch({
          type: LOAD_DETAILS,
          payload: details
        })
        dispatch({
          type: SET_DETAILS_LOADING,
          payload: false
        })
      })
      .catch(err => {
        dispatch({
          type: DISPLAY_WARNING,
          payload: {
            text: `Error downloading song: ${err}. For help, please file a bug report with this error message.`
          }
        })
      })
      fetch(`https://bsaber.com/wp-json/bsaber-api/songs/${key}/ratings`)
        .then(res => res.json())
        .then(bsaberData => {
          dispatch({
            type: LOAD_DETAILS,
            payload: { ratings: bsaberData }
          })
        })
        .catch(() => {
          dispatch({
            type: LOAD_DETAILS,
            payload: {
              ratings: {
                overall_rating: 0,
                average_ratings: {
                  fun_factor: 0,
                  rythm: 0,
                  flow: 0,
                  pattern_quality: 0,
                  readability: 0,
                  level_quality: 0
                }
              }
            }
          })
        })
  } else {
    dispatch({
      type: DISPLAY_WARNING,
      payload: {
        text: `Error loading details from key: "${key}" is not a valid key. If you are seeing this, please file  a bug report.`
      }
    })
  }
}