import { SET_VIEW, SET_SONG_VIEW } from './types'

export const setView = view => dispatch => {
  dispatch({
    type: SET_VIEW,
    payload: view
  })
}

export const setSongView = view => dispatch => {
  dispatch({
    type: SET_SONG_VIEW,
    payload: view
  })
}