import { LOAD_DETAILS, CLEAR_DETAILS, SET_DETAILS_LOADING, SET_VIEW, DISPLAY_WARNING } from './types'
import { SONG_DETAILS } from '../views'

import AdmZip from 'adm-zip'
const { remote } = window.require('electron')
const fs = remote.require('fs')
const path = remote.require('path')

/**
 * Loads and presents the details page for a song.
 * @param {string} identity The key/hash/file for a song
 */
export const loadDetails = (identity) => (dispatch, getState) => {
  /*
    Key:  !isNaN(identity.replace('-', ''))     fetch from api
    Hash: (/^[a-f0-9]{32}$/).test(identity)     check if local, else from api
    File: else                                  fetch from local
  */
  dispatch({
    type: CLEAR_DETAILS
  })
  dispatch({
    type: SET_DETAILS_LOADING,
    payload: true
  })
  if(identity) {
    fetch('https://beatsaver.com/api/maps/detail/' + identity)
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
        fetch(`http://beatsaver.com/${details.downloadUrl}`)
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
        dispatch({
          type: LOAD_DETAILS,
          payload: details
        })
        dispatch({
          type: SET_DETAILS_LOADING,
          payload: false
        })
      })
      .catch(() => { })
    dispatch({
      type: SET_VIEW,
      payload: SONG_DETAILS
    })
    fetch(`https://bsaber.com/wp-json/bsaber-api/songs/${identity}/ratings`)
      .then(res => res.json())
      .then(bsaberData => {
        dispatch({
          type: LOAD_DETAILS,
          payload: { ratings: bsaberData }
        })
      })
      .catch(() => { dispatch({
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
      }) })
  } else {
    if((/^[a-f0-9]{32}$/).test(identity)) {
      if(getState().songs.downloadedSongs.some(song => song.hash === identity)) {
        let file = getState().songs.downloadedSongs[getState().songs.downloadedSongs.findIndex(song => song.hash === identity)].file
        fs.readFile(file, 'UTF-8', (err, data) => {
          if(err) return
          let song = JSON.parse(data)
          let dirs = file.split('\\')
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
            payload: { song }
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
        fetch(`https://beatsaver.com/api/maps/detail/${identity}`)
          .then(res =>  res.json())
          .then(results => {
            if(results.songs.length === 1) {
              let song = results.songs[0]
              fetch(song.downloadUrl)
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
              fetch(`https://bsaber.com/wp-json/bsaber-api/songs/${identity}/ratings`)
                .then(res => res.json())
                .then(bsaberData => {
                  dispatch({
                    type: LOAD_DETAILS,
                    payload: { ratings: bsaberData }
                  })
                })
                dispatch({
                  type: LOAD_DETAILS,
                  payload: { song }
                })
                dispatch({
                  type: SET_DETAILS_LOADING,
                  payload: false
                })
            }
          })
          dispatch({
            type: SET_VIEW,
            payload: SONG_DETAILS
          })
      }
    } else {
      fs.readFile(identity, 'UTF-8', (err, data) => {
        if(err) return
        let song = JSON.parse(data)
        let dirs = identity.split('\\')
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
          payload: { song }
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
  }
}